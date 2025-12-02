import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

// --- INTERCEPTOR COM LOGS DE DEPURAÇÃO ---
api.interceptors.request.use((config) => {
  
  // 1. Tenta ler o token
  const token = localStorage.getItem('miniecommerce_token');
  
  console.log("--- DEBUG API.JS ---");
  console.log("URL Chamada:", config.url);
  
  if (token) {
    // 2. Se achou, anexa e avisa
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token anexado no header:", `Bearer ${token.substring(0, 10)}...`);
  } else {
    // 3. Se não achou, grita erro
    console.warn("❌ NENHUM TOKEN ENCONTRADO no localStorage!");
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;