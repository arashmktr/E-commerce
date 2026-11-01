import { formatPrice } from '../../utils/format.js';

const PriceTag = ({ price, finalPrice }) => (
  <div className="price">
    <span className="price__now">{formatPrice(finalPrice)}</span>
    {finalPrice < price && <span className="price__old">{formatPrice(price)}</span>}
  </div>
);

export default PriceTag;
