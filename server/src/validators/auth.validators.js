import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('ایمیل معتبر نیست');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'نام باید حداقل ۲ حرف باشد').max(60, 'نام خیلی طولانی است'),
    email,
    password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد').max(72),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, 'رمز عبور را وارد کنید'),
  }),
});
