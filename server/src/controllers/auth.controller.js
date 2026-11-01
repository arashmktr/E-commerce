import { User } from '../models/User.js';
import {
  clearRefreshCookie,
  readRefreshCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const sendSession = (res, user, statusCode = 200) => {
  setRefreshCookie(res, signRefreshToken(user));
  res.status(statusCode).json({
    user: toPublicUser(user),
    accessToken: signAccessToken(user),
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.valid.body;

  const emailTaken = await User.exists({ email });
  if (emailTaken) throw new ApiError(409, 'با این ایمیل قبلاً ثبت‌نام شده است');

  const user = await User.create({ name, email, password: await hashPassword(password) });
  sendSession(res, user, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.valid.body;

  const user = await User.findOne({ email }).select('+password');
  const passwordMatches = user && (await verifyPassword(password, user.password));

  // پیام عمداً کلی است تا مشخص نشود کدام‌یک اشتباه بوده.
  if (!passwordMatches) throw new ApiError(401, 'ایمیل یا رمز عبور درست نیست');

  sendSession(res, user);
};

export const refresh = async (req, res) => {
  const token = readRefreshCookie(req);
  if (!token) throw new ApiError(401, 'نشست پیدا نشد');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearRefreshCookie(res);
    throw new ApiError(401, 'نشست منقضی شده است');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'کاربر پیدا نشد');

  sendSession(res, user);
};

export const logout = (_req, res) => {
  clearRefreshCookie(res);
  res.json({ message: 'از حساب خود خارج شدید' });
};

export const getMe = (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};
