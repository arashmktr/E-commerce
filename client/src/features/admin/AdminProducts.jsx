import { useState } from 'react';
import { deleteProduct, fetchCategories, fetchProducts } from '../../api/products.js';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { formatNumber, formatPrice } from '../../utils/format.js';
import ProductForm from './ProductForm.jsx';

const AdminProducts = () => {
  const products = useFetch(() => fetchProducts({ limit: 100 }), []);
  const categories = useFetch(fetchCategories, []);

  // null = فرم بسته، 'new' = محصول جدید، در غیر این صورت خود محصول در حال ویرایش
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleSaved = () => {
    setEditing(null);
    products.reload();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`«${product.title}» حذف شود؟`)) return;

    setActionError('');
    try {
      await deleteProduct(product._id);
      products.reload();
    } catch (error) {
      setActionError(error.message);
    }
  };

  if (products.loading && !products.data) return <Loader />;
  if (products.error) return <ErrorMessage message={products.error} onRetry={products.reload} />;

  return (
    <>
      {editing ? (
        <ProductForm
          product={editing === 'new' ? null : editing}
          categories={categories.data ?? []}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button type="button" className="btn btn-primary" onClick={() => setEditing('new')} style={{ marginBottom: '1rem' }}>
          افزودن محصول
        </button>
      )}

      {actionError && <p className="form-error" role="alert" style={{ marginBottom: '1rem' }}>{actionError}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.data.items.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{formatPrice(product.finalPrice)}</td>
                <td>{formatNumber(product.stock)}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="btn btn-outline btn-small" onClick={() => setEditing(product)}>
                      ویرایش
                    </button>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => handleDelete(product)}>
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminProducts;
