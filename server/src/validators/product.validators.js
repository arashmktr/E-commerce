import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'شناسه نامعتبر است');

export const idParamSchema = z.object({ params: z.object({ id: objectId }) });

export const listProductsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    featured: z.enum(['true']).optional(),
    sort: z.enum(['newest', 'price-asc', 'price-desc']).default('newest'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
  }),
});

// هم آدرس کامل (https://...) و هم مسیر داخل سایت (/products/x.svg) پذیرفته می‌شود.
const imagePath = z
  .string()
  .trim()
  .refine((value) => /^https?:\/\//.test(value) || value.startsWith('/'), 'آدرس تصویر معتبر نیست');

const productFields = {
  title: z.string().trim().min(2, 'عنوان محصول را وارد کنید').max(120),
  description: z.string().trim().min(10, 'توضیحات باید حداقل ۱۰ حرف باشد'),
  price: z.coerce.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  discountPercent: z.coerce.number().min(0).max(90, 'تخفیف حداکثر ۹۰ درصد است').default(0),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(imagePath).max(6).default([]),
  category: objectId,
  isFeatured: z.boolean().default(false),
};

export const createProductSchema = z.object({ body: z.object(productFields) });

export const updateProductSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object(productFields).partial(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'نام دسته‌بندی را وارد کنید'),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, 'نامک فقط شامل حروف انگلیسی، عدد و خط تیره باشد'),
  }),
});
