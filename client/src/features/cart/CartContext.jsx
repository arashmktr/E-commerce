import { createContext, useEffect, useMemo, useReducer } from 'react';
import { getShippingPrice } from '../../utils/constants.js';
import { cartReducer } from './cartReducer.js';

export const CartContext = createContext(null);

const STORAGE_KEY = 'cart:v1';

const loadSavedCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, [], loadSavedCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const actions = useMemo(
    () => ({
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QUANTITY', productId, quantity }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }),
    [],
  );

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = getShippingPrice(itemsPrice);

    return {
      items,
      totalItems,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
      ...actions,
    };
  }, [items, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
