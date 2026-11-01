import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `مسیر ${req.originalUrl} پیدا نشد`));
};

const DUPLICATE_KEY_CODE = 11000;

const normalizeError = (error) => {
  if (error instanceof ApiError) return error;
  if (error.type === 'entity.parse.failed') return new ApiError(400, 'ساختار JSON درست نیست');
  if (error.name === 'CastError') return new ApiError(400, 'شناسه نامعتبر است');
  if (error.name === 'ValidationError') return new ApiError(400, error.message);
  if (error.code === DUPLICATE_KEY_CODE) return new ApiError(409, 'این مقدار قبلاً ثبت شده است');
  return null;
};

export const errorHandler = (error, _req, res, _next) => {
  const known = normalizeError(error);

  if (known) {
    return res.status(known.statusCode).json({ message: known.message });
  }

  console.error(error);
  res.status(500).json({
    message: 'مشکلی در سرور پیش آمد',
    ...(isProduction ? {} : { detail: error.message }),
  });
};
