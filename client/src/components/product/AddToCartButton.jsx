import { useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart.js';

const FEEDBACK_MS = 1500;

const AddToCartButton = ({ product, quantity = 1, block = false }) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return undefined;
    const timer = setTimeout(() => setJustAdded(false), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleClick = () => {
    addItem(product, quantity);
    setJustAdded(true);
  };

  const isSoldOut = product.stock === 0;
  const label = isSoldOut ? 'ناموجود' : justAdded ? 'به سبد اضافه شد' : 'افزودن به سبد';

  return (
    <button
      type="button"
      className={`btn btn-primary ${block ? 'btn-block' : ''}`}
      disabled={isSoldOut}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default AddToCartButton;
