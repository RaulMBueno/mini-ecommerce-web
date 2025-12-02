import axios from 'axios';

const api = axios.create({
  // LÓGICA INTELIGENTE:
  // Se existir a variável da Vercel, usa ela. Se não, usa localhost.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

export default api;