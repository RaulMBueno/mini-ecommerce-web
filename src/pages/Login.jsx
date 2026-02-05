import React, { useState } from 'react';
import api from '../api'; // <--- Usamos o nosso cliente inteligente
import PageMeta from '../components/PageMeta';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // CORREÇÃO AQUI: Usamos 'api.post' e removemos o localhost
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      // Se deu certo, pega o Token
      const token = response.data.token;
      
      // Guarda o Token no navegador
      localStorage.setItem('miniecommerce_token', token);

      alert("Login realizado com sucesso!");
      navigate('/admin');

    } catch (error) {
      alert("Erro no login! Verifique email e senha.");
      console.error(error);
    }
  };

  return (
    <>
      <PageMeta
        title="Login | ReMakeup Store"
        description="Acesso ao painel administrativo da ReMakeup Store."
        noIndex
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">Acesso Restrito</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>

          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition font-bold">
            ENTRAR
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
