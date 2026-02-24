const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://mini-ecommerce-production-c2d9.up.railway.app';
};

export default getApiBaseUrl;
