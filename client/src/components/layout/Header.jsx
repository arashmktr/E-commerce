import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { SITE_NAME } from '../../utils/constants.js';
import { formatNumber } from '../../utils/format.js';

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="logo">
          {SITE_NAME}
        </Link>

        <nav className="main-nav" aria-label="منوی اصلی">
          <NavLink to="/shop">فروشگاه</NavLink>
          {user && <NavLink to="/orders">سفارش‌های من</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">مدیریت</NavLink>}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-link">
            سبد خرید
            {totalItems > 0 && <span className="cart-link__count">{formatNumber(totalItems)}</span>}
          </Link>

          {user ? (
            <>
              <span>{user.name}</span>
              <button type="button" className="btn btn-outline btn-small" onClick={handleLogout}>
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-small">
                ورود
              </Link>
              <Link to="/register" className="btn btn-primary btn-small">
                ثبت‌نام
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
