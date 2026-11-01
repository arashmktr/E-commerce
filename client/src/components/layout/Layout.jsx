import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

const Layout = () => {
  const { pathname } = useLocation();

  // با رفتن به صفحه‌ی جدید، به بالای صفحه برگرد.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="container site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
