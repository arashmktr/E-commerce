import { useContext } from 'react';
import { CartContext } from '../features/cart/CartContext.jsx';

export const useCart = () => useContext(CartContext);
