import mongoose from 'mongoose';
import { getFinalPrice } from '../utils/pricing.js';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 90, default: 0 },
    images: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.finalPrice = getFinalPrice(ret);
        delete ret.__v;
        return ret;
      },
    },
  },
);

productSchema.index({ category: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
