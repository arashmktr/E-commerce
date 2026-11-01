export const SITE_NAME = 'نیلو';

// باید با مقدارهای سمت سرور (server/src/utils/pricing.js) یکی باشد.
export const SHIPPING_FEE = 50_000;
export const FREE_SHIPPING_FROM = 2_000_000;

export const getShippingPrice = (itemsPrice) =>
  itemsPrice === 0 || itemsPrice >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

export const ORDER_STATUS = {
  pending: { label: 'در انتظار پرداخت', tone: 'warn' },
  paid: { label: 'پرداخت‌شده', tone: 'info' },
  shipped: { label: 'ارسال‌شده', tone: 'info' },
  delivered: { label: 'تحویل داده شد', tone: 'ok' },
  cancelled: { label: 'لغو شده', tone: 'danger' },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
];
