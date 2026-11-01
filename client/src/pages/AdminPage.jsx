import { useState } from 'react';
import AdminOrders from '../features/admin/AdminOrders.jsx';
import AdminProducts from '../features/admin/AdminProducts.jsx';

const TABS = [
  { id: 'products', label: 'محصولات' },
  { id: 'orders', label: 'سفارش‌ها' },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <>
      <h1>پنل مدیریت</h1>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'products' ? <AdminProducts /> : <AdminOrders />}
    </>
  );
};

export default AdminPage;
