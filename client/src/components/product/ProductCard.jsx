import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton.jsx';
import PriceTag from './PriceTag.jsx';
import ProductImage from './ProductImage.jsx';

const ProductCard = ({ product }) => (
  <article className="product-card">
    <Link to={`/products/${product._id}`} className="product-card__link">
      <ProductImage src={product.images[0]} title={product.title} />
      {product.discountPercent > 0 && (
        <span className="discount-tag">٪{product.discountPercent.toLocaleString('fa-IR')}</span>
      )}
    </Link>

    <div className="product-card__body">
      <h3 className="product-card__title">
        <Link to={`/products/${product._id}`}>{product.title}</Link>
      </h3>

      <div className="product-card__footer">
        <PriceTag price={product.price} finalPrice={product.finalPrice} />
        <AddToCartButton product={product} block />
      </div>
    </div>
  </article>
);

export default ProductCard;
