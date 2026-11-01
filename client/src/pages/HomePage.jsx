import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/products.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useFetch } from '../hooks/useFetch.js';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const categories = useFetch(fetchCategories, []);
  const featured = useFetch(() => fetchProducts({ featured: 'true', limit: 4 }), []);
  const newest = useFetch(() => fetchProducts({ limit: 8 }), []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <h1>چه چیزی لازم دارید؟</h1>
          <p>نام محصول را بنویسید یا از یکی از دسته‌بندی‌ها شروع کنید.</p>

          <form className="hero__search" onSubmit={handleSearch}>
            <input
              className="input"
              type="search"
              placeholder="مثلاً هدفون"
              aria-label="جست‌وجوی محصول"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="submit" className="btn">
              جست‌وجو
            </button>
          </form>

          <div className="chip-row">
            {categories.data?.map((category) => (
              <Link key={category._id} to={`/shop?category=${category.slug}`} className="chip">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>پیشنهادهای ویژه</h2>
        </div>
        <ProductGrid
          products={featured.data?.items ?? []}
          loading={featured.loading}
          error={featured.error}
          onRetry={featured.reload}
          emptyText="هنوز پیشنهاد ویژه‌ای ثبت نشده است."
        />
      </section>

      <section className="section">
        <div className="section__head">
          <h2>تازه‌ترین محصولات</h2>
          <Link to="/shop">دیدن همه محصولات</Link>
        </div>
        <ProductGrid
          products={newest.data?.items ?? []}
          loading={newest.loading}
          error={newest.error}
          onRetry={newest.reload}
        />
      </section>
    </>
  );
};

export default HomePage;
