import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders.js';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import { formatNumber, formatPrice, toEnglishDigits } from '../utils/format.js';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: user.name, phone: '', city: '', address: '', postalCode: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const order = await createOrder({
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        shippingAddress: {
          ...form,
          phone: toEnglishDigits(form.phone),
          postalCode: toEnglishDigits(form.postalCode),
        },
      });

      navigate(`/orders/${order._id}`, { replace: true });
      clearCart();
    } catch (submitError) {
      setError(submitError.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: '1.25rem' }}>ثبت سفارش</h1>

      <div className="cart-layout">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>آدرس تحویل</h2>

          <div className="form-grid">
            <Field label="نام و نام خانوادگی گیرنده">
              <input className="input" required value={form.fullName} onChange={updateField('fullName')} />
            </Field>
            <Field label="شماره موبایل" hint="مثال: 09123456789">
              <input className="input" required type="tel" inputMode="numeric" value={form.phone} onChange={updateField('phone')} />
            </Field>
            <Field label="شهر">
              <input className="input" required value={form.city} onChange={updateField('city')} />
            </Field>
            <Field label="کد پستی (۱۰ رقم)">
              <input className="input" required inputMode="numeric" value={form.postalCode} onChange={updateField('postalCode')} />
            </Field>
            <Field label="آدرس کامل" className="full">
              <textarea className="textarea" required value={form.address} onChange={updateField('address')} />
            </Field>
          </div>

          {error && <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '1.25rem' }}>
            {submitting ? 'در حال ثبت…' : 'ثبت سفارش'}
          </button>
        </form>

        <aside className="panel">
          <h2>سفارش شما</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.productId}>
              <span>
                {item.title} × {formatNumber(item.quantity)}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>هزینه ارسال</span>
            <span>{shippingPrice === 0 ? 'رایگان' : formatPrice(shippingPrice)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="field__hint" style={{ marginTop: '0.75rem' }}>
            قیمت نهایی هنگام ثبت، دوباره از روی قیمت فروشگاه محاسبه می‌شود.
          </p>
        </aside>
      </div>
    </>
  );
};

export default CheckoutPage;
