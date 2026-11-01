import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductSchema,
  idParamSchema,
  listProductsSchema,
  updateProductSchema,
} from '../validators/product.validators.js';

const router = Router();
const adminOnly = [protect, restrictTo('admin')];

router.get('/', validate(listProductsSchema), getProducts);
router.get('/:id', validate(idParamSchema), getProduct);

router.post('/', ...adminOnly, validate(createProductSchema), createProduct);
router.put('/:id', ...adminOnly, validate(updateProductSchema), updateProduct);
router.delete('/:id', ...adminOnly, validate(idParamSchema), deleteProduct);

export default router;
