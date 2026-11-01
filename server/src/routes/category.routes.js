import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createCategorySchema } from '../validators/product.validators.js';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, restrictTo('admin'), validate(createCategorySchema), createCategory);

export default router;
