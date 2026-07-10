import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  if (!rawUrl) return '/api/v1';
  // If Render passes just the host (e.g. saas-backend.onrender.com), prepend https://
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  return `${url}/api/v1`;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
