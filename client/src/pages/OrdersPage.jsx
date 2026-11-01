import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api/orders.js';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Loader from '../components/ui/Loader.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { formatDate, formatNumber, formatPrice } from '../utils/format.js';

const OrdersPage = () => {
  const { data: orders, loading, error, reload } = useFetch(fetchMyOrders, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  if (orders.length === 0) {
    return <EmptyState title="هنوز سفارشی ثبت نکرده‌اید" actionLabel="دیدن محصولات" actionTo="/shop" />;
  }

  return (
    <>
      <h1 style={{ marginBottom: '1.25rem' }}>سفارش‌های من</h1>

      <section className="panel">
        {orders.map((order) => (
          <div className="order-row" key={order._id}>
            <div>
              <Link to={`/orders/${order._id}`}>
                <strong>سفارش {order._id.slice(-6)}</strong>
              </Link>
              <p className="stock-note">
                {formatDate(order.createdAt)} · {formatNumber(order.items.length)} قلم کالا
              </p>
            </div>
            <StatusBadge status={order.status} />
            <strong>{formatPrice(order.totalPrice)}</strong>
          </div>
        ))}
      </section>
    </>
  );
};

export default OrdersPage;
