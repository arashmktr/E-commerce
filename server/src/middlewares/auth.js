import { User } from '../models/User.js';
import { verifyAccessToken } from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
};

export const protect = async (req, _res, next) => {
  const token = getBearerToken(req);
  if (!token) throw new ApiError(401, 'برای ادامه باید وارد حساب خود شوید');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, 'نشست شما منقضی شده است');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'کاربر پیدا نشد');

  req.user = user;
  next();
};

export const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'شما اجازه دسترسی به این بخش را ندارید');
  }
  next();
};
