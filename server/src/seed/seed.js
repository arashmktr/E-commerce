import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

const categoriesData = [
  { name: 'لوازم دیجیتال', slug: 'digital' },
  { name: 'پوشاک', slug: 'clothing' },
  { name: 'خانه و آشپزخانه', slug: 'home' },
  { name: 'کتاب و لوازم تحریر', slug: 'books' },
  { name: 'ورزش و سفر', slug: 'sport' },
];

// قیمت‌ها به تومان
const productsData = [
  { slug: 'digital', image: 'headphones', title: 'هدفون بی‌سیم نویزکنسلینگ', price: 3_200_000, discountPercent: 15, stock: 14, isFeatured: true, description: 'هدفون بی‌سیم با حذف نویز فعال، تا ۳۰ ساعت شارژدهی و میکروفون مناسب تماس.' },
  { slug: 'digital', image: 'powerbank', title: 'پاور بانک ۲۰۰۰۰ میلی‌آمپر', price: 1_150_000, discountPercent: 0, stock: 40, isFeatured: false, description: 'پاور بانک با دو خروجی USB و یک خروجی Type-C با شارژ سریع.' },
  { slug: 'digital', image: 'smartwatch', title: 'ساعت هوشمند ورزشی', price: 2_450_000, discountPercent: 10, stock: 9, isFeatured: true, description: 'ساعت هوشمند با ضربان‌سنج، ردیاب خواب و مقاومت در برابر آب.' },
  { slug: 'clothing', image: 'hoodie', title: 'هودی نخی دو‌لایه', price: 890_000, discountPercent: 20, stock: 25, isFeatured: true, description: 'هودی نخی با پارچه دو‌لایه و دوخت مقاوم، مناسب پاییز و زمستان.' },
  { slug: 'clothing', image: 'sneaker', title: 'کفش کتانی روزمره', price: 1_680_000, discountPercent: 0, stock: 18, isFeatured: false, description: 'کفش سبک و راحت با کفی طبی برای پیاده‌روی طولانی.' },
  { slug: 'clothing', image: 'backpack', title: 'کوله‌پشتی ضدآب ۳۰ لیتری', price: 760_000, discountPercent: 5, stock: 30, isFeatured: false, description: 'کوله‌پشتی ضدآب با جای لپ‌تاپ و بند‌های ارگونومیک.' },
  { slug: 'home', image: 'espresso', title: 'قهوه‌ساز اسپرسو خانگی', price: 4_900_000, discountPercent: 12, stock: 6, isFeatured: true, description: 'اسپرسوساز ۱۵ بار فشار با بخارساز شیر برای کاپوچینو و لاته.' },
  { slug: 'home', image: 'cookware', title: 'ست قابلمه گرانیتی ۷ پارچه', price: 3_750_000, discountPercent: 0, stock: 11, isFeatured: false, description: 'ست قابلمه با پوشش گرانیت نچسب، مناسب انواع اجاق.' },
  { slug: 'home', image: 'lamp', title: 'چراغ مطالعه رومیزی LED', price: 540_000, discountPercent: 0, stock: 35, isFeatured: false, description: 'چراغ با سه دمای رنگی، نور قابل تنظیم و پایه تاشو.' },
  { slug: 'books', image: 'notebook', title: 'دفتر یادداشت ۲۰۰ برگ', price: 120_000, discountPercent: 0, stock: 80, isFeatured: false, description: 'دفتر خط‌دار با جلد سخت و کاغذ ۸۰ گرمی بدون نشت جوهر.' },
  { slug: 'sport', image: 'kettlebell', title: 'کتل‌بل ۸ کیلوگرمی', price: 980_000, discountPercent: 8, stock: 15, isFeatured: false, description: 'کتل‌بل چدنی با روکش وینیل و دسته ضدلغزش.' },
  { slug: 'sport', image: 'sleepingbag', title: 'کیسه خواب سفری', price: 2_100_000, discountPercent: 0, stock: 0, isFeatured: false, description: 'کیسه خواب سبک مناسب دمای ۵ تا ۱۵ درجه، همراه کیف حمل.' },
];

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  await User.create([
    { name: 'مدیر فروشگاه', email: 'admin@example.com', password: await hashPassword('Admin12345'), role: 'admin' },
    { name: 'کاربر نمونه', email: 'user@example.com', password: await hashPassword('User12345'), role: 'user' },
  ]);

  const categories = await Category.insertMany(categoriesData);
  const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category._id]));

  await Product.insertMany(
    productsData.map(({ slug, image, ...product }) => ({
      ...product,
      images: [`/products/${image}.svg`],
      category: categoryIdBySlug.get(slug),
    })),
  );

  console.log('داده‌های اولیه ساخته شد.');
  console.log('ادمین: admin@example.com / Admin12345');
  console.log('کاربر: user@example.com / User12345');
};

seed()
  .catch((error) => {
    console.error('Seed ناموفق بود:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
