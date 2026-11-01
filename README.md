# فروشگاه اینترنتی نیلو

فروشگاه کامل با **React.js** (فرانت‌اند) و **Express + MongoDB + JWT** (بک‌اند).

## پیش‌نیاز
- Node.js نسخه 20 یا بالاتر
- MongoDB روی سیستم خودتان (پورت پیش‌فرض 27017)

## اجرا
```bash
npm run install:all          # نصب وابستگی‌های هر سه پوشه
cp server/.env.example server/.env
npm run seed                 # ساخت دسته‌بندی‌ها، محصولات و کاربرهای نمونه
npm run dev                  # بک‌اند روی 5000 و فرانت‌اند روی 5173
```
سپس `http://localhost:5173` را باز کنید.

حساب‌های نمونه بعد از `npm run seed`:

| نقش | ایمیل | رمز |
|---|---|---|
| ادمین | admin@example.com | Admin12345 |
| کاربر | user@example.com | User12345 |

## ساختار
```
server/src
  config/        env و اتصال به MongoDB
  models/        User, Category, Product, Order
  controllers/   منطق هر endpoint
  services/      توکن JWT و ساخت سفارش
  routes/        مسیرهای /api/v1
  middlewares/   احراز هویت، نقش، اعتبارسنجی، خطا
  validators/    اسکیمای zod
  seed/          داده اولیه

client/src
  api/           ارتباط با سرور (fetch)
  features/      auth و cart (Context)، admin
  components/    layout, ui, product
  pages/         صفحه‌ها
  routes/        مسیرها و ProtectedRoute
  hooks/         useFetch, useAuth, useCart
  utils/ styles/
```

## احراز هویت
- Access token (۱۵ دقیقه) در حافظه‌ی مرورگر نگه داشته می‌شود.
- Refresh token (۷ روز) در کوکی `httpOnly` است و با باز شدن سایت، نشست را بازیابی می‌کند.

## تصویر محصولات
تصویر محصولات نمونه در `client/public/products/` است (فایل‌های SVG) و `npm run seed` آن‌ها را به محصولات وصل می‌کند.
برای عکس واقعی، فایل را (مثلاً `lamp.jpg`) در همین پوشه بگذارید و در پنل مدیریت، آدرس تصویر محصول را روی `/products/lamp.jpg` بگذارید.
آدرس کامل (`https://...`) هم پذیرفته می‌شود.

## نکته‌ها
- پرداخت شبیه‌سازی‌شده است (`payOrder` در `order.controller.js`). برای درگاه واقعی باید همان‌جا وصل شود.
- اگر MongoDB شما رمز دارد یا روی پورت دیگری است، `MONGO_URI` را در `server/.env` عوض کنید.
- قبل از انتشار، `JWT_ACCESS_SECRET` و `JWT_REFRESH_SECRET` را با مقدار تصادفی و طولانی عوض کنید.

## آپلود در گیت‌هاب
```bash
git init
git add .
git commit -m "feat: initial e-commerce app"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```
`.gitignore` پوشه‌های `node_modules` و فایل `.env` را نادیده می‌گیرد.
