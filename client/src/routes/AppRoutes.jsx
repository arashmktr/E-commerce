import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import AdminPage from '../pages/AdminPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import OrderDetailPage from '../pages/OrderDetailPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ShopPage from '../pages/ShopPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="shop" element={<ShopPage />} />
      <Route path="products/:id" element={<ProductDetailPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
