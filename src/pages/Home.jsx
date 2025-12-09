import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  LogIn,
  LogOut,
  Search,
  Menu,
  X,
  Loader,
  Filter,
  ChevronRight,
  User,
} from 'lucide-react';

import api from '../api';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ProductCard from '../components/ProductCard';

// Marcas em destaque (pode ajustar nomes e "siglas" depois)
const FEATURED_BRANDS = [
  { name: 'Bruna Tavares', shortLabel: 'BT' },
  { name: 'Pri Lessa', shortLabel: 'PL' },
  { name: 'Melu', shortLabel: 'Melu' },
  { name: 'Ruby Rose', shortLabel: 'RR' },
  { name: 'Bitarra', shortLabel: 'Bitarra' },
  { name: 'Makiê', shortLabel: 'Makiê' },
  { name: 'Boca Rosa', shortLabel: 'BR' },
  { name: 'Vizzela', shortLabel: 'Vizzela' },
];

// Normaliza texto para busca e comparação (sem acento, minúsculo)
const normalizeText = (text) =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    checkLogin();
  }, []);

  // Verifica token no localStorage
  const checkLogin = () => {
    const token = localStorage.getItem('miniecommerce_token');
    setIsLoggedIn(!!token);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('miniecommerce_token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products', {
          params: {
            page: 0,
            size: 1000, // pega até 1000 produtos (evita sumir depois de 20)
            sort: 'id,desc', // mais novos primeiro
          },
        }),
        api.get('/categories'),
      ]);

      const productsData = productsRes.data.content || productsRes.data;

      setAllProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Só controla a categoria selecionada. O filtro em si é feito no useEffect abaixo.
  const filterBy = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBrandClick = (brandName) => {
    setSelectedBrand((prev) =>
      normalizeText(prev) === normalizeText(brandName) ? 'all' : brandName
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Combina filtros: categoria + marca + busca
  useEffect(() => {
    let result = [...allProducts];

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      result = result.filter((product) =>
        product.categories?.some((cat) => cat.id === selectedCategory)
      );
    }

    // Filtro por marca
    if (selectedBrand !== 'all') {
      const selectedBrandNorm = normalizeText(selectedBrand);
      result = result.filter((product) => {
        const brandNorm = normalizeText(product.brand);
        return brandNorm === selectedBrandNorm;
      });
    }

    // Filtro por busca (nome, descrição, marca)
    if (searchTerm.trim() !== '') {
      const queryNorm = normalizeText(searchTerm);

      result = result.filter((product) => {
        const nameNorm = normalizeText(product.name);
        const descNorm = normalizeText(product.description);
        const brandNorm = normalizeText(product.brand);
        const catsNorm = (product.categories || [])
          .map((c) => normalizeText(c.name))
          .join(' ');

        return (
          nameNorm.includes(queryNorm) ||
          descNorm.includes(queryNorm) ||
          brandNorm.includes(queryNorm) ||
          catsNorm.includes(queryNorm)
        );
      });
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategory, selectedBrand, searchTerm]);

  const featuredProducts = allProducts.filter((p) => p.isFeatured === true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                ReMakeup<span className="text-pink-600">.</span>
              </span>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex space-x-8 items-center">
              {/* Busca */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="O que você procura?"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-200 w-72 transition-all outline-none"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-pink-500 transition-colors" />
              </div>

              {/* Link Painel Admin só se logado */}
              {isLoggedIn && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-pink-600 font-medium transition flex items-center gap-1"
                >
                  <User size={18} /> Painel
                </Link>
              )}

              {/* Carrinho (placeholder) */}
              <button className="relative p-2 text-gray-600 hover:text-pink-600 transition">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </button>

              {/* Botão Login / Logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-200 transition font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>

            {/* Botão Mobile Menu */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-pink-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MENU MOBILE (login + link admin) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-3">
              {/* Login / Logout mobile */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
              )}

              {/* Link painel admin (se logado) */}
              {isLoggedIn && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Painel administrativo</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
        {/* SIDEBAR (desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Filter size={20} className="text-pink-600" /> Categorias
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => filterBy('all')}
                className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between group ${
                  selectedCategory === 'all'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <span className="font-medium">Todos os Produtos</span>
                {selectedCategory === 'all' && <ChevronRight size={16} />}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => filterBy(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between group ${
                    selectedCategory === cat.id
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <span className="font-medium">{cat.name}</span>
                  {selectedCategory === cat.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl text-center">
              <p className="text-purple-800 font-bold text-sm mb-2">
                Quer aprender?
              </p>
              <p className="text-gray-600 text-xs mb-3">
                Confira nossos cursos de automaquiagem.
              </p>
              <button
                onClick={() => {
                  const cursoCat = categories.find((c) =>
                    c.name.includes('Curso')
                  );
                  if (cursoCat) filterBy(cursoCat.id);
                }}
                className="text-xs font-bold text-pink-600 hover:underline"
              >
                Ver Cursos &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1">
          {/* Categorias em chips (mobile) */}
          <div className="md:hidden flex overflow-x-auto gap-3 pb-4 mb-4 scrollbar-hide">
            <button
              onClick={() => filterBy('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs ${
                selectedCategory === 'all'
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'bg-white text-gray-600'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => filterBy(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* CARROSSEL DESTAQUES (com hero dentro) */}
          {featuredProducts.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-8 w-1 bg-pink-600 rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Destaques da Semana
                </h2>
              </div>
              <FeaturedCarousel products={featuredProducts} />
            </div>
          )}

          {/* FAIXA DE MARCAS (logo-style simples com texto) */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Comprar por marca
                </span>
              </div>
              {selectedBrand !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className="text-xs text-pink-600 hover:underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center md:justify-start">
              {FEATURED_BRANDS.map((brand) => {
                const isActive =
                  normalizeText(selectedBrand) === normalizeText(brand.name);
                return (
                  <button
                    key={brand.name}
                    type="button"
                    onClick={() => handleBrandClick(brand.name)}
                    className={`flex flex-col items-center flex-shrink-0 ${
                      isActive ? 'text-pink-600' : 'text-gray-600'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center text-xs font-semibold uppercase shadow-sm hover:shadow-md transition-all ${
                        isActive
                          ? 'border-pink-500 ring-2 ring-pink-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="px-1 text-[11px] text-center">
                        {brand.shortLabel}
                      </span>
                    </div>
                    <span className="mt-1 text-[11px] font-medium truncate max-w-[70px]">
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título da vitrine */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {selectedBrand !== 'all'
                ? `Marca: ${selectedBrand}`
                : selectedCategory === 'all'
                ? 'Vitrine Completa'
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  'Produtos'}
            </h2>
            <span className="text-xs md:text-sm text-gray-500">
              {filteredProducts.length} produtos encontrados
            </span>
          </div>

          {/* LISTA DE PRODUTOS */}
          {loading ? (
            <div className="flex justify-center items-center h-48 md:h-64 bg-white rounded-2xl shadow-sm">
              <Loader className="h-8 w-8 md:h-10 md:w-10 text-pink-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Search size={24} />
                  </div>
                  <p className="text-gray-500 text-base md:text-lg font-medium">
                    Nenhum produto encontrado.
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Tente selecionar outra categoria, marca ou buscar por outro
                    termo.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
