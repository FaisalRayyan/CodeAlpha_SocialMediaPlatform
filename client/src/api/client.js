import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('socialsphere_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const mediaUrl = (path) => (!path ? '' : path.startsWith('http') ? path : `${MEDIA_URL}${path}`);
export default api;
