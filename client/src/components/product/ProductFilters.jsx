import { useEffect, useState } from 'react';

const ProductFilters = ({ categories, values, onChange }) => {
  const [draft, setDraft] = useState({
    search: values.search,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
  });

  // وقتی آدرس صفحه عوض می‌شود (مثلاً با دکمه‌ی حذف فیلترها) فرم هم هماهنگ شود.
  useEffect(() => {
    setDraft({ search: values.search, minPrice: values.minPrice, maxPrice: values.maxPrice });
  }, [values.search, values.minPrice, values.maxPrice]);

  const updateDraft = (field) => (event) => setDraft({ ...draft, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange(draft);
  };

  const clearAll = () => onChange({ search: '', category: '', minPrice: '', maxPrice: '' });

  const hasFilters = values.search || values.category || values.minPrice || values.maxPrice;

  return (
    <aside className="panel filters">
      <form className="filters" onSubmit={handleSubmit}>
        <label className="field">
          <span>جست‌وجو</span>
          <input className="input" type="search" value={draft.search} onChange={updateDraft('search')} placeholder="نام محصول" />
        </label>

        <div className="field">
          <span>بازه قیمت (تومان)</span>
          <div className="price-range">
            <input className="input" type="number" min="0" inputMode="numeric" placeholder="از" aria-label="حداقل قیمت" value={draft.minPrice} onChange={updateDraft('minPrice')} />
            <input className="input" type="number" min="0" inputMode="numeric" placeholder="تا" aria-label="حداکثر قیمت" value={draft.maxPrice} onChange={updateDraft('maxPrice')} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          اعمال فیلتر
        </button>
      </form>

      <div className="field">
        <span>دسته‌بندی</span>
        <div className="filters__categories">
          <button type="button" aria-pressed={!values.category} onClick={() => onChange({ category: '' })}>
            همه محصولات
          </button>
          {categories.map((category) => (
            <button key={category._id} type="button" aria-pressed={values.category === category.slug} onClick={() => onChange({ category: category.slug })}>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button type="button" className="link-button" onClick={clearAll}>
          حذف همه فیلترها
        </button>
      )}
    </aside>
  );
};

export default ProductFilters;
