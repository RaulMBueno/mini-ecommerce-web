import axios from 'axios';

// ⚠️ Troque a URL abaixo pela URL REAL do seu backend no Railway
// (ex: https://mini-ecommerce-production-xxxxx.up.railway.app)
const API_BASE_URL = 'https://mini-ecommerce-production-c2d9.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Anexa o token JWT em todas as requisições, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('miniecommerce_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
