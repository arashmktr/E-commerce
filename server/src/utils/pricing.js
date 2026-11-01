// قیمت‌ها به تومان و عدد صحیح هستند.
export const SHIPPING_FEE = 50_000;
export const FREE_SHIPPING_FROM = 2_000_000;

export const getFinalPrice = ({ price, discountPercent = 0 }) =>
  Math.round((price * (100 - discountPercent)) / 100);

export const getShippingPrice = (itemsPrice) =>
  itemsPrice >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
