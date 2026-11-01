import { formatNumber } from '../../utils/format.js';

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      <button type="button" className="btn btn-outline btn-small" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        قبلی
      </button>
      <span>
        صفحه {formatNumber(page)} از {formatNumber(pages)}
      </span>
      <button type="button" className="btn btn-outline btn-small" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        بعدی
      </button>
    </nav>
  );
};

export default Pagination;
