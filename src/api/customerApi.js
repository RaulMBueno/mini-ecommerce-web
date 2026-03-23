import axios from 'axios';
import { CUSTOMER_TOKEN_KEY } from '../constants/authStorage';
import getApiBaseUrl from '../utils/getApiBaseUrl';

/**
 * Cliente HTTP com JWT de cliente (Google / ROLE_CLIENT).
 * Use para /me e futuras rotas autenticadas do visitante.
 */
const customerApi = axios.create({
  baseURL: getApiBaseUrl(),
});

customerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customerApi;
