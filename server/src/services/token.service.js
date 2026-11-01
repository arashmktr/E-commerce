import jwt from 'jsonwebtoken';
import { env, isProduction } from '../config/env.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const signAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.accessSecret, { expiresIn: env.accessExpiresIn });

export const signRefreshToken = (user) =>
  jwt.sign({ id: user.id }, env.refreshSecret, { expiresIn: env.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, env.accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, env.refreshSecret);

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/api/v1/auth',
};

export const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, { ...refreshCookieOptions, maxAge: SEVEN_DAYS_MS });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
};

export const readRefreshCookie = (req) => req.cookies?.[REFRESH_COOKIE_NAME];
