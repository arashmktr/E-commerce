import { Category } from '../models/Category.js';

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = await Category.create(req.valid.body);
  res.status(201).json(category);
};
