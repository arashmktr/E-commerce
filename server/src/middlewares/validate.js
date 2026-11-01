import { ApiError } from '../utils/ApiError.js';

// داده‌های تمیز‌شده در req.valid قرار می‌گیرند (body, query, params).
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join('، ');
    throw new ApiError(400, message);
  }

  req.valid = result.data;
  next();
};
