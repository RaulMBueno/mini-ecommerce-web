import React from 'react';
import PageMeta from '../components/PageMeta';
import getApiBaseUrl from '../utils/getApiBaseUrl';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${getApiBaseUrl()}/oauth2/authorization/google`;
  };

  return (
    <>
      <PageMeta
        title="Login Administrativo | ReMakeup Store"
        description="Login administrativo via Google para a ReMakeup Store."
        noIndex
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-pink-600 mb-3">
            Login Administrativo
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Acesso restrito para administração da loja.
          </p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-pink-600 text-white py-2.5 rounded-full hover:bg-pink-700 transition font-bold"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </>
  );
}
