import { useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../api/orders.js';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { ORDER_STATUS } from '../../utils/constants.js';
import { formatDate, formatPrice } from '../../utils/format.js';

const AdminOrders = () => {
  const { data: orders, loading, error, reload } = useFetch(fetchAllOrders, []);
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (order, status) => {
    setActionError('');
    try {
      await updateOrderStatus(order._id, status);
      reload();
    } catch (changeError) {
      setActionError(changeError.message);
    }
  };

  if (loading && !orders) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <>
      {actionError && <p className="form-error" role="alert" style={{ marginBottom: '1rem' }}>{actionError}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>شماره</th>
              <th>مشتری</th>
              <th>تاریخ</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.user?.name ?? '—'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatPrice(order.totalPrice)}</td>
                <td>
                  <select
                    className="select"
                    aria-label="وضعیت سفارش"
                    value={order.status}
                    disabled={order.status === 'cancelled'}
                    onChange={(event) => handleStatusChange(order, event.target.value)}
                  >
                    {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOrders;
