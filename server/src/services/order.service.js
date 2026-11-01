import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { getFinalPrice, getShippingPrice } from '../utils/pricing.js';

export const restoreStock = (items) =>
  Promise.all(
    items.map((item) =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }),
    ),
  );

// موجودی را یکی‌یکی کم می‌کنیم. اگر یکی کافی نبود، قبلی‌ها را برمی‌گردانیم.
const reserveStock = async (items) => {
  const reserved = [];

  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    );

    if (result.modifiedCount === 0) {
      await restoreStock(reserved);
      throw new ApiError(409, `موجودی «${item.title}» کافی نیست`);
    }

    reserved.push(item);
  }
};

const buildOrderItems = async (requestedItems) => {
  const ids = requestedItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const productsById = new Map(products.map((product) => [product.id, product]));

  return requestedItems.map(({ productId, quantity }) => {
    const product = productsById.get(productId);

    if (!product) {
      throw new ApiError(404, 'یکی از محصولات سبد خرید دیگر وجود ندارد');
    }
    if (product.stock < quantity) {
      throw new ApiError(409, `موجودی «${product.title}» کافی نیست`);
    }

    // قیمت همیشه از دیتابیس خوانده می‌شود، نه از درخواست کاربر.
    return {
      product: product._id,
      title: product.title,
      image: product.images[0] || '',
      price: getFinalPrice(product),
      quantity,
    };
  });
};

export const createOrder = async ({ userId, items, shippingAddress }) => {
  const orderItems = await buildOrderItems(items);
  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = getShippingPrice(itemsPrice);

  await reserveStock(orderItems);

  try {
    return await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
    });
  } catch (error) {
    await restoreStock(orderItems);
    throw error;
  }
};
