import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrder,
  payOrder,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createOrderSchema,
  orderIdSchema,
  updateOrderStatusSchema,
} from '../validators/order.validators.js';

const router = Router();

router.use(protect);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/mine', getMyOrders);
router.get('/', restrictTo('admin'), getAllOrders);
router.get('/:id', validate(orderIdSchema), getOrder);
router.patch('/:id/pay', validate(orderIdSchema), payOrder);
router.patch('/:id/status', restrictTo('admin'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
