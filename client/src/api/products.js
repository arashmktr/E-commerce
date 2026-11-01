import { request } from './client.js';

const toQueryString = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });

  const text = query.toString();
  return text ? `?${text}` : '';
};

export const fetchProducts = (params = {}) => request(`/products${toQueryString(params)}`);

export const fetchProduct = (id) => request(`/products/${id}`);

export const fetchCategories = () => request('/categories');

export const createProduct = (payload) => request('/products', { method: 'POST', body: payload });

export const updateProduct = (id, payload) =>
  request(`/products/${id}`, { method: 'PUT', body: payload });

export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
