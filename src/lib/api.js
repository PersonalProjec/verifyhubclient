import axios from 'axios';
import { notify } from './toast';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export function setToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function initAuth() {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  // Prefer admin token if present on admin pages; otherwise user
  if (adminToken) setToken(adminToken);
  else if (userToken) setToken(userToken);
  else setToken(null);
}

// Global error handler (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // if the request handler already showed a toast, skip
    const msg =
      err?.response?.data?.error || err?.message || 'Something went wrong';
    notify.error(msg);
    return Promise.reject(err);
  }
);
