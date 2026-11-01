import { request } from './client.js';

export const registerUser = (payload) => request('/auth/register', { method: 'POST', body: payload });

export const loginUser = (payload) => request('/auth/login', { method: 'POST', body: payload });

export const refreshSession = () => request('/auth/refresh', { method: 'POST' });

export const logoutUser = () => request('/auth/logout', { method: 'POST' });
