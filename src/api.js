import axios from 'axios';

const api = axios.create({
  // Define a URL base (Railway ou Localhost)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

// --- INTERCEPTOR (O SEGREDO) ---
// Antes de cada requisição sair, esse código roda.
api.interceptors.request.use((config) => {
  // 1. Tenta pegar o token do navegador
  const token = localStorage.getItem('miniecommerce_token');
  
  // 2. Se tiver token, coloca no cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;