import axios from 'axios';

const defaultApiUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL ?? API_URL.replace(/\/api\/?$/, '');

const api = axios.create({ baseURL: API_URL, timeout: 20_000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('socialsphere_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('socialsphere_token')) {
      localStorage.removeItem('socialsphere_token');
      window.dispatchEvent(new Event('socialsphere:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const mediaUrl = (path) => (!path ? '' : path.startsWith('http') ? path : `${MEDIA_URL}${path}`);
export const errorMessage = (error, fallback = 'Something went wrong.') => error?.response?.data?.message || error?.message || fallback;
export default api;
