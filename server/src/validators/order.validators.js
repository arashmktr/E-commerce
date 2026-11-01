import { z } from 'zod';
import { ORDER_STATUSES } from '../models/Order.js';
import { objectId } from './product.validators.js';

const shippingAddress = z.object({
  fullName: z.string().trim().min(3, 'نام گیرنده را وارد کنید'),
  phone: z.string().trim().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
  city: z.string().trim().min(2, 'شهر را وارد کنید'),
  address: z.string().trim().min(10, 'آدرس کامل را وارد کنید'),
  postalCode: z.string().trim().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: objectId,
          quantity: z.coerce.number().int().min(1).max(20),
        }),
      )
      .min(1, 'سبد خرید خالی است'),
    shippingAddress,
  }),
});

export const orderIdSchema = z.object({ params: z.object({ id: objectId }) });

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(ORDER_STATUSES, { message: 'وضعیت نامعتبر است' }) }),
});
