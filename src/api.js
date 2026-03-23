import axios from 'axios';
import { ADMIN_TOKEN_KEY } from './constants/authStorage';

// Se estiver rodando com `npm run dev` (Vite), fala com o backend local.
// Se for build de produção (Vercel), fala com o backend do Railway.
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://mini-ecommerce-production-c2d9.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// JWT do painel admin (produtos, categorias, etc.)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
