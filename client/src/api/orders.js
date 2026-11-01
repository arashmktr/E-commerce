import { request } from './client.js';

export const createOrder = (payload) => request('/orders', { method: 'POST', body: payload });

export const fetchMyOrders = () => request('/orders/mine');

export const fetchOrder = (id) => request(`/orders/${id}`);

export const payOrder = (id) => request(`/orders/${id}/pay`, { method: 'PATCH' });

export const fetchAllOrders = () => request('/orders');

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
