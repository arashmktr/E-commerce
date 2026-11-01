import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder, payOrder } from '../api/orders.js';
import ProductImage from '../components/product/ProductImage.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Loader from '../components/ui/Loader.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { formatDate, formatNumber, formatPrice } from '../utils/format.js';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useFetch(() => fetchOrder(id), [id]);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const handlePay = async () => {
    setPaying(true);
    setPayError('');
    try {
      await payOrder(order._id);
      reload();
    } catch (paymentError) {
      setPayError(paymentError.message);
    } finally {
      setPaying(false);
    }
  };

  const { shippingAddress } = order;

  return (
    <>
      <div className="order-page-head">
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>سفارش {order._id.slice(-6)}</h1>
          <p className="stock-note">ثبت‌شده در {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="cart-layout">
        <section className="panel">
          <h2>کالاها</h2>
          {order.items.map((item) => (
            <div className="cart-item" key={item.product}>
              <ProductImage src={item.image} title={item.title} />
              <div>
                <h3>
                  <Link to={`/products/${item.product}`}>{item.title}</Link>
                </h3>
                <p>{formatPrice(item.price)}</p>
              </div>
              <span>× {formatNumber(item.quantity)}</span>
            </div>
          ))}
        </section>

        <aside className="panel">
          <h2>خلاصه</h2>
          <div className="summary-row">
            <span>جمع کالاها</span>
            <span>{formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="summary-row">
            <span>هزینه ارسال</span>
            <span>{order.shippingPrice === 0 ? 'رایگان' : formatPrice(order.shippingPrice)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>مبلغ کل</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>

          <h3 style={{ marginTop: '1.25rem' }}>تحویل به</h3>
          <p>
            {shippingAddress.fullName} · {shippingAddress.phone}
            <br />
            {shippingAddress.city}، {shippingAddress.address}
            <br />
            کد پستی {shippingAddress.postalCode}
          </p>

          {order.status === 'pending' && (
            <>
              {payError && <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{payError}</p>}
              <button type="button" className="btn btn-primary btn-block" disabled={paying} onClick={handlePay} style={{ marginTop: '1rem' }}>
                {paying ? 'در حال پرداخت…' : `پرداخت ${formatPrice(order.totalPrice)}`}
              </button>
              <p className="field__hint" style={{ marginTop: '0.5rem' }}>
                پرداخت در این نسخه آزمایشی است و مبلغی کسر نمی‌شود.
              </p>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default OrderDetailPage;
