import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTA DA LOJA (PÚBLICA) */}
        <Route path="/" element={<Home />} />

        {/* ROTA DO ADMIN (PRIVADA - FUTURAMENTE) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}