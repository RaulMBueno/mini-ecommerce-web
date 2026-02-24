import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TOKEN_STORAGE_KEY = 'miniecommerce_token';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      window.history.replaceState({}, document.title, '/oauth2/redirect');
      navigate('/admin', { replace: true });
    }
  }, [token, navigate]);

  const apiBase =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? 'http://localhost:8080'
      : 'https://mini-ecommerce-production-c2d9.up.railway.app');
  const googleLoginUrl = `${apiBase}/oauth2/authorization/google`;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg max-w-md text-center">
          <h1 className="text-xl font-bold mb-3">
            Token não encontrado
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Não foi possível concluir o login. Faça login novamente para continuar.
          </p>
          <a
            href={googleLoginUrl}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
          >
            Entrar com Google
          </a>
          <div className="mt-4">
            <Link to="/" className="text-xs text-gray-500 hover:underline">
              Voltar para a home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg text-center">
        <h1 className="text-xl font-bold mb-2">Processando login…</h1>
        <p className="text-sm text-gray-600">Você será redirecionado em instantes.</p>
      </div>
    </div>
  );
}
