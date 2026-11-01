import { Order } from '../models/Order.js';
import { createOrder as createOrderService, restoreStock } from '../services/order.service.js';
import { ApiError } from '../utils/ApiError.js';

const findOrderOrFail = async (id) => {
  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'سفارش پیدا نشد');
  return order;
};

const assertCanView = (order, user) => {
  const isOwner = order.user.id === user.id;
  if (!isOwner && user.role !== 'admin') {
    throw new ApiError(403, 'این سفارش متعلق به شما نیست');
  }
};

export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.valid.body;
  const order = await createOrderService({ userId: req.user.id, items, shippingAddress });
  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(200);
  res.json(orders);
};

export const getOrder = async (req, res) => {
  const order = await findOrderOrFail(req.valid.params.id);
  assertCanView(order, req.user);
  res.json(order);
};

// پرداخت فعلاً شبیه‌سازی شده است.
// برای درگاه واقعی، این تابع باید بعد از تأیید پرداخت از سمت درگاه صدا زده شود.
export const payOrder = async (req, res) => {
  const order = await findOrderOrFail(req.valid.params.id);
  assertCanView(order, req.user);

  if (order.status !== 'pending') {
    throw new ApiError(400, 'این سفارش در وضعیت پرداخت نیست');
  }

  order.status = 'paid';
  order.paidAt = new Date();
  await order.save();
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { params, body } = req.valid;
  const order = await findOrderOrFail(params.id);

  if (order.status === 'cancelled') {
    throw new ApiError(400, 'سفارش لغوشده قابل تغییر نیست');
  }
  if (body.status === 'cancelled') {
    await restoreStock(order.items);
  }

  order.status = body.status;
  await order.save();
  res.json(order);
};
