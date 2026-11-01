import { FREE_SHIPPING_FROM, SITE_NAME } from '../../utils/constants.js';
import { formatPrice } from '../../utils/format.js';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <p>
        {SITE_NAME} · ارسال رایگان برای خرید بالای {formatPrice(FREE_SHIPPING_FROM)}
      </p>
    </div>
  </footer>
);

export default Footer;
