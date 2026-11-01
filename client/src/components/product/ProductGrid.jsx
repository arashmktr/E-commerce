import EmptyState from '../ui/EmptyState.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import Loader from '../ui/Loader.jsx';
import ProductCard from './ProductCard.jsx';

const ProductGrid = ({ products, loading, error, onRetry, emptyText = 'محصولی پیدا نشد.' }) => {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (products.length === 0) return <EmptyState title={emptyText} text="فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید." />;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
