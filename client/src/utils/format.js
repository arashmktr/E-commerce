export const formatNumber = (value) => Number(value).toLocaleString('fa-IR');

export const formatPrice = (value) => `${formatNumber(value)} تومان`;

export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// کاربر ممکن است عدد را با کیبورد فارسی بنویسد؛ سرور فقط ارقام انگلیسی می‌پذیرد.
export const toEnglishDigits = (text) =>
  text
    .replace(/[۰-۹]/g, (digit) => PERSIAN_DIGITS.indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => ARABIC_DIGITS.indexOf(digit));

// برای رنگ ثابت تصویر جایگزین هر محصول
export const titleToHue = (title = '') =>
  [...title].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 360, 7);
