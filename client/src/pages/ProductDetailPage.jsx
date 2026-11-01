import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products.js';
import AddToCartButton from '../components/product/AddToCartButton.jsx';
import PriceTag from '../components/product/PriceTag.jsx';
import ProductImage from '../components/product/ProductImage.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Loader from '../components/ui/Loader.jsx';
import QuantityInput from '../components/ui/QuantityInput.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { formatNumber } from '../utils/format.js';

const LOW_STOCK_LIMIT = 5;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, loading, error, reload } = useFetch(() => fetchProduct(id), [id]);
  const [quantity, setQuantity] = useState(1);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const isSoldOut = product.stock === 0;
  const isLowStock = !isSoldOut && product.stock <= LOW_STOCK_LIMIT;

  return (
    <>
      <nav className="breadcrumb" aria-label="مسیر صفحه">
        <Link to="/shop">فروشگاه</Link>
        {product.category && (
          <>
            {' / '}
            <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
      </nav>

      <div className="detail">
        <div className="detail__media">
          <ProductImage src={product.images[0]} title={product.title} />
        </div>

        <div className="detail__info">
          <h1>{product.title}</h1>

          <div className="detail__price">
            <PriceTag price={product.price} finalPrice={product.finalPrice} />
          </div>

          {isSoldOut && <p className="stock-note">این محصول فعلاً ناموجود است.</p>}
          {isLowStock && (
            <p className="stock-note stock-note--low">فقط {formatNumber(product.stock)} عدد در انبار مانده است.</p>
          )}

          {!isSoldOut && (
            <div className="detail__buy">
              <QuantityInput value={quantity} max={product.stock} onChange={setQuantity} />
              <AddToCartButton product={product} quantity={quantity} />
            </div>
          )}

          <p>{product.description}</p>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
