import { Link, useNavigate } from 'react-router-dom';
import ProductImage from '../components/product/ProductImage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import QuantityInput from '../components/ui/QuantityInput.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import { FREE_SHIPPING_FROM } from '../utils/constants.js';
import { formatPrice } from '../utils/format.js';

const CartPage = () => {
  const { items, itemsPrice, shippingPrice, totalPrice, setQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="سبد خرید شما خالی است"
        text="محصولی که می‌پسندید را به سبد اضافه کنید."
        actionLabel="دیدن محصولات"
        actionTo="/shop"
      />
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_FROM - itemsPrice;

  // کاربر وارد نشده باشد، بعد از ورود مستقیم به صفحه پرداخت برمی‌گردد.
  const goToCheckout = () => navigate(user ? '/checkout' : '/login', { state: { from: { pathname: '/checkout' } } });

  return (
    <>
      <h1 style={{ marginBottom: '1.25rem' }}>سبد خرید</h1>

      <div className="cart-layout">
        <section className="panel">
          {items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <ProductImage src={item.image} title={item.title} />

              <div>
                <h3>
                  <Link to={`/products/${item.productId}`}>{item.title}</Link>
                </h3>
                <p>{formatPrice(item.price)}</p>
              </div>

              <div className="cart-item__controls">
                <QuantityInput value={item.quantity} max={item.stock} onChange={(quantity) => setQuantity(item.productId, quantity)} />
                <button type="button" className="link-button" onClick={() => removeItem(item.productId)}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </section>

        <aside className="panel">
          <h2>خلاصه سفارش</h2>

          {remainingForFreeShipping > 0 && (
            <p className="free-shipping-note">
              با {formatPrice(remainingForFreeShipping)} خرید بیشتر، ارسال رایگان می‌شود.
            </p>
          )}

          <div className="summary-row">
            <span>جمع کالاها</span>
            <span>{formatPrice(itemsPrice)}</span>
          </div>
          <div className="summary-row">
            <span>هزینه ارسال</span>
            <span>{shippingPrice === 0 ? 'رایگان' : formatPrice(shippingPrice)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button type="button" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} onClick={goToCheckout}>
            ادامه و ثبت سفارش
          </button>
        </aside>
      </div>
    </>
  );
};

export default CartPage;
