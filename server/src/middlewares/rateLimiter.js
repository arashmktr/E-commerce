import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'تعداد تلاش‌ها زیاد بود. چند دقیقه بعد دوباره امتحان کنید.' },
});
