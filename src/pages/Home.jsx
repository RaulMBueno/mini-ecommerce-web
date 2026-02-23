import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import PageMeta from '../components/PageMeta';

// Map com siglas personalizadas (opcional)
const BRAND_SHORT_LABELS = {
  'bruna tavares': 'BT',
  'pri lessa': 'PL',
  'melu': 'Melu',
  'ruby rose': 'RR',
  'bitarra': 'Bitarra',
  'makiê': 'Makiê',
  'makie': 'Makiê',
  'boca rosa': 'BR',
  'vizzela': 'Vizzela',
};

// Normaliza texto para busca e comparação (sem acento, minúsculo)
const normalizeText = (text) =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Gera sigla padrão caso não tenha no mapa acima
const getShortLabel = (name) => {
  if (!name) return '';

  const norm = normalizeText(name);
  if (BRAND_SHORT_LABELS[norm]) return BRAND_SHORT_LABELS[norm];

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 3).toUpperCase();
  }
  // Primeira letra do primeiro + primeira letra do último
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Monta URL completa da logo (se vier relativa, tipo "/uploads/...")
const resolveLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }
  const base = api.defaults.baseURL || '';
  return `${base}${logoUrl}`;
};

export default function Home() {
  const { id: categoryIdParam } = useParams();
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 12; // quantos produtos por página

  useEffect(() => {
    fetchData();
    checkLogin();
  }, []);

  useEffect(() => {
    if (!categoryIdParam) {
      setSelectedCategory('all');
      return;
    }

    const parsedId = Number(categoryIdParam);
    if (Number.isNaN(parsedId)) {
      setSelectedCategory('all');
      return;
    }

    setSelectedCategory(parsedId);
    setCurrentPage(0);
  }, [categoryIdParam]);

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
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get('/products', {
          params: {
            page: 0,
            size: 1000, // pega bastante coisa pra paginar no front
            sort: 'id,asc',
          },
        }),
        api.get('/categories'),
        api.get('/brands'),
      ]);

      const productsData = productsRes.data.content || productsRes.data;

      setAllProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Só controla a categoria selecionada. O filtro em si é feito no useEffect abaixo.
  const scrollToMain = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchTerm('');
    setCurrentPage(0);
    navigate('/');
    scrollToMain();
  };

  const filterBy = (categoryId) => {
    if (categoryId === 'all') {
      resetFilters();
      return;
    }

    navigate(`/categoria/${categoryId}`);
    setSelectedCategory(categoryId);
    setCurrentPage(0);
    scrollToMain();
  };

  const handleBrandClick = (brandName) => {
    setSelectedBrand((prev) =>
      normalizeText(prev) === normalizeText(brandName) ? 'all' : brandName
    );
    setCurrentPage(0);
    scrollToMain();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    scrollToMain();
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      window.history.pushState({ menuOpen: true }, '', window.location.pathname);
      document.body.style.overflow = 'hidden';
    } else {
      if (window.history.state?.menuOpen) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

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

    // Filtro por busca (nome, descrição, marca, categorias)
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
    setCurrentPage(0);
  }, [allProducts, selectedCategory, selectedBrand, searchTerm]);

  const featuredProducts = allProducts.filter((p) => p.isFeatured === true);

  const isDefaultView =
    selectedCategory === 'all' && selectedBrand === 'all';

  // Paginação em memória (front-end)
  const totalPages =
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  const startIndex = currentPage * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const goPrev = () => {
    if (canGoPrev) {
      setCurrentPage((prev) => prev - 1);
      scrollToMain();
    }
  };

  const goNext = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
      scrollToMain();
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'ReMakeup Store',
        url: 'https://remakeup.com.br',
        description:
          'Loja de maquiagem e beleza com produtos selecionados, ofertas e afiliados. Entrega rápida e vitrine completa.',
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Organization',
        name: 'ReMakeup Store',
        url: 'https://remakeup.com.br',
        logo: 'https://remakeup.com.br/hero-banner.jpg',
      },
      {
        '@type': 'WebPage',
        name: 'ReMakeup Store – Vitrine de Maquiagem e Beleza',
        url: 'https://remakeup.com.br/',
        inLanguage: 'pt-BR',
      },
    ],
  };

  return (
    <>
      <PageMeta
        title="ReMakeup Store – Maquiagens, Beleza e Afiliados"
        description="Loja de maquiagem e beleza com produtos selecionados, ofertas e afiliados. Entrega rápida e vitrine completa."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-600 hover:text-pink-600"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* Busca mobile abaixo do logo */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>
      </nav>

      {/* DRAWER MOBILE (categorias + marcas + login) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Painel */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl p-4 flex flex-col gap-4 overflow-y-auto">
            {/* Header drawer */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="font-bold text-gray-800">ReMakeup</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-pink-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Busca mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Login / Logout + Painel */}
            <div className="space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Painel administrativo
                    </span>
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs text-pink-600 underline"
                    >
                      Abrir
                    </Link>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-full text-sm"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-full text-sm"
                >
                  <LogIn size={16} />
                  <span>Entrar</span>
                </Link>
              )}
            </div>

            {/* Categorias */}
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-1">
                <Filter size={14} className="text-pink-600" />
                Categorias
              </h3>
              <div className="space-y-1">
                <button
                  onClick={resetFilters}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Todos os produtos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => filterBy(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedCategory === cat.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Marcas */}
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                Comprar por marca
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const isActive =
                    normalizeText(selectedBrand) ===
                    normalizeText(brand.name);
                  const logoUrl = resolveLogoUrl(brand.logoUrl);
                  const shortLabel = getShortLabel(brand.name);

                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleBrandClick(brand.name)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-full border text-[11px] ${
                        isActive
                          ? 'border-pink-500 text-pink-600 bg-pink-50'
                          : 'border-gray-200 text-gray-700 bg-white'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center text-[9px]">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          shortLabel
                        )}
                      </div>
                      <span className="truncate max-w-[90px]">
                        {brand.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div
        ref={mainContentRef}
        className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8"
      >
        {/* SIDEBAR (desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Filter size={20} className="text-pink-600" /> Categorias
            </h3>
            <div className="space-y-2">
              <button
                onClick={resetFilters}
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
          {/* Carrossel compacto no mobile */}
          {isDefaultView && !searchTerm.trim() && featuredProducts.length > 0 && (
            <div className="md:hidden">
              <FeaturedCarousel products={featuredProducts} compact />
            </div>
          )}

          {/* Categorias compactas no mobile */}
          <div className="md:hidden mb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFilters}
                className={`px-3 py-2 rounded-full border text-[11px] ${
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
                  className={`px-3 py-2 rounded-full border text-[11px] ${
                    selectedCategory === cat.id
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {!isDefaultView && (
            <div className="mb-3 md:mb-6 transition-all duration-300">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                {selectedBrand !== 'all'
                  ? `Marca: ${selectedBrand}`
                  : selectedCategory === 'all'
                  ? 'Vitrine Completa'
                  : `Categoria: ${
                      categories.find((c) => c.id === selectedCategory)?.name ||
                      'Produtos'
                    }`}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {filteredProducts.length} produtos encontrados
              </p>
            </div>
          )}
          {/* CARROSSEL DESTAQUES */}
          {isDefaultView && !searchTerm.trim() && featuredProducts.length > 0 && (
            <div className="mb-6 md:mb-8 hidden md:block" id="destaques">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-pink-600 rounded-full" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Destaques da Semana
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHighlightsOpen((prev) => !prev)}
                  className="md:hidden text-xs font-semibold text-pink-600 hover:text-pink-700"
                >
                  {isHighlightsOpen ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <div className={`${isHighlightsOpen ? 'block' : 'hidden'} md:block`}>
                <FeaturedCarousel products={featuredProducts} />
              </div>
            </div>
          )}

          {/* FAIXA DE MARCAS */}
          <div className="mb-4 md:mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Comprar por marca
                </span>
              </div>
              {selectedBrand !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('all');
                    setCurrentPage(0);
                    scrollToMain();
                  }}
                  className="text-xs text-pink-600 hover:underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {brands.map((brand) => {
                const isActive =
                  normalizeText(selectedBrand) ===
                  normalizeText(brand.name);

                const logoUrl = resolveLogoUrl(brand.logoUrl);
                const shortLabel = getShortLabel(brand.name);

                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleBrandClick(brand.name)}
                    className={`flex flex-col items-center flex-shrink-0 ${
                      isActive ? 'text-pink-600' : 'text-gray-600'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border bg-white flex items-center justify-center text-[10px] font-semibold uppercase shadow-sm hover:shadow-md transition-all overflow-hidden ${
                        isActive
                          ? 'border-pink-500 ring-2 ring-pink-200'
                          : 'border-gray-200'
                      }`}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brand.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="px-1 text-[11px] text-center">
                          {shortLabel}
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-[10px] font-medium truncate max-w-[64px]">
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título da vitrine */}
          {isDefaultView && (
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
          )}

          {/* LISTA DE PRODUTOS + PAGINAÇÃO */}
          {loading ? (
            <div className="flex justify-center items-center h-48 md:h-64 bg-white rounded-2xl shadow-sm">
              <Loader className="h-8 w-8 md:h-10 md:w-10 text-pink-600 animate-spin" />
            </div>
          ) : (
            <>
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
                      Tente selecionar outra categoria, marca ou buscar por
                      outro termo.
                    </p>
                  </div>
                ) : (
                  paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>

              {/* Controles de página */}
              {filteredProducts.length > PRODUCTS_PER_PAGE && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={goPrev}
                    disabled={!canGoPrev}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      canGoPrev
                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Anterior
                  </button>
                  <span className="text-xs md:text-sm text-gray-500">
                    Página <strong>{currentPage + 1}</strong> de{' '}
                    <strong>{totalPages}</strong>
                  </span>
                  <button
                    onClick={goNext}
                    disabled={!canGoNext}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      canGoNext
                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}

          {/* CARROSSEL DESTAQUES (mobile permanece no topo) */}
        </div>
      </div>
      </div>
    </>
  );
}
