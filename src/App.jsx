import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import CategoriesAdmin from './pages/CategoriesAdmin';
import BrandsAdmin from './pages/BrandsAdmin';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:id" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/categories" element={<CategoriesAdmin />} />
        <Route path="/admin/brands" element={<BrandsAdmin />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  );
}
