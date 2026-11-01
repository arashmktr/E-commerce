import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
};

const emptyPage = (page) => ({ items: [], page, pages: 0, total: 0 });

const ensureCategoryExists = async (categoryId) => {
  if (!categoryId) return;
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) throw new ApiError(400, 'دسته‌بندی انتخاب‌شده وجود ندارد');
};

const buildPriceFilter = ({ minPrice, maxPrice }) => {
  const priceFilter = {};
  if (minPrice !== undefined) priceFilter.$gte = minPrice;
  if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
  return priceFilter;
};

export const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, featured, sort, page, limit } = req.valid.query;
  const filter = {};

  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  if (featured) filter.isFeatured = true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = buildPriceFilter({ minPrice, maxPrice });
  }

  if (category) {
    const foundCategory = await Category.findOne({ slug: category });
    if (!foundCategory) return res.json(emptyPage(page));
    filter.category = foundCategory._id;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(SORT_OPTIONS[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ items, page, pages: Math.ceil(total / limit), total });
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.valid.params.id).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'محصول پیدا نشد');
  res.json(product);
};

export const createProduct = async (req, res) => {
  await ensureCategoryExists(req.valid.body.category);
  const product = await Product.create(req.valid.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { params, body } = req.valid;
  await ensureCategoryExists(body.category);

  const product = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'محصول پیدا نشد');

  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.valid.params.id);
  if (!product) throw new ApiError(404, 'محصول پیدا نشد');
  res.json({ message: 'محصول حذف شد' });
};
