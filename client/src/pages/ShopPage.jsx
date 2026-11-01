import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/products.js';
import Pagination from '../components/ui/Pagination.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { SORT_OPTIONS } from '../utils/constants.js';
import { formatNumber } from '../utils/format.js';

const PAGE_SIZE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
    page: Number(searchParams.get('page')) || 1,
  };

  const categories = useFetch(fetchCategories, []);
  const products = useFetch(
    () => fetchProducts({ ...filters, limit: PAGE_SIZE }),
    [searchParams.toString()],
  );

  // هر تغییر فیلتر، صفحه را به اول برمی‌گرداند؛ مگر خود صفحه عوض شود.
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!('page' in changes)) next.delete('page');

    setSearchParams(next);
  };

  return (
    <div className="shop-layout">
      <ProductFilters categories={categories.data ?? []} values={filters} onChange={updateParams} />

      <section>
        <div className="toolbar">
          <p>{products.data ? `${formatNumber(products.data.total)} محصول` : ''}</p>
          <select
            className="select"
            aria-label="مرتب‌سازی"
            value={filters.sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <ProductGrid
          products={products.data?.items ?? []}
          loading={products.loading}
          error={products.error}
          onRetry={products.reload}
        />

        {products.data && (
          <Pagination
            page={products.data.page}
            pages={products.data.pages}
            onChange={(page) => updateParams({ page: String(page) })}
          />
        )}
      </section>
    </div>
  );
};

export default ShopPage;
