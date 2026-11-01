import { useState } from 'react';
import { createProduct, updateProduct } from '../../api/products.js';
import Field from '../../components/ui/Field.jsx';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discountPercent: '0',
  stock: '0',
  imageUrl: '',
  category: '',
  isFeatured: false,
};

const toFormValues = (product) =>
  product
    ? {
        title: product.title,
        description: product.description,
        price: String(product.price),
        discountPercent: String(product.discountPercent),
        stock: String(product.stock),
        imageUrl: product.images[0] ?? '',
        category: product.category?._id ?? '',
        isFeatured: product.isFeatured,
      }
    : emptyForm;

const ProductForm = ({ product, categories, onSaved, onCancel }) => {
  const [form, setForm] = useState(() => toFormValues(product));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      discountPercent: Number(form.discountPercent),
      stock: Number(form.stock),
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      category: form.category,
      isFeatured: form.isFeatured,
    };

    try {
      if (product) await updateProduct(product._id, payload);
      else await createProduct(payload);
      onSaved();
    } catch (saveError) {
      setError(saveError.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
      <h2>{product ? 'ویرایش محصول' : 'محصول جدید'}</h2>

      <div className="form-grid">
        <Field label="عنوان" className="full">
          <input className="input" required value={form.title} onChange={updateField('title')} />
        </Field>
        <Field label="توضیحات" className="full">
          <textarea className="textarea" required value={form.description} onChange={updateField('description')} />
        </Field>
        <Field label="قیمت (تومان)">
          <input className="input" type="number" min="0" required value={form.price} onChange={updateField('price')} />
        </Field>
        <Field label="تخفیف (درصد)">
          <input className="input" type="number" min="0" max="90" value={form.discountPercent} onChange={updateField('discountPercent')} />
        </Field>
        <Field label="موجودی">
          <input className="input" type="number" min="0" value={form.stock} onChange={updateField('stock')} />
        </Field>
        <Field label="دسته‌بندی">
          <select className="select" required value={form.category} onChange={updateField('category')}>
            <option value="">انتخاب کنید</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="آدرس تصویر" hint="آدرس کامل (https://...) یا مسیر داخل سایت مثل /products/lamp.svg. اختیاری." className="full">
          <input className="input" dir="ltr" placeholder="/products/lamp.svg" value={form.imageUrl} onChange={updateField('imageUrl')} />
        </Field>
        <label className="checkbox full">
          <input type="checkbox" checked={form.isFeatured} onChange={updateField('isFeatured')} />
          نمایش در پیشنهادهای ویژه صفحه اصلی
        </label>
      </div>

      {error && <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>}

      <div className="row-actions" style={{ marginTop: '1.25rem' }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'در حال ذخیره…' : 'ذخیره'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          انصراف
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
