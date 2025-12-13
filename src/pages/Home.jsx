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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 12; // produtos por página na vitrine

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
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get('/products', {
          params: {
            page: 0,
            size: 1000,
            sort: 'id,asc',
          },
        }),
        api.get('/categories'),
        api.get('/brands'),
      ]);

      const productsData = productsRes.data.content || productsRes.data;

      setAllProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesRes.data || categoriesRes.data);
      setBrands(brandsRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Só controla a categoria selecionada. O filtro em si é feito no useEffect abaixo.
  const filterBy = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const handleBrandClick = (brandName) => {
    setSelectedBrand((prev) =>
      normalizeText(prev) === normalizeText(brandName) ? 'all' : brandName
    );
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
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

  // Paginação em memória (front-end)
  const totalPages =
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  const startIndex = currentPage * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
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
        </div>
      </nav>

      {/* MENU LATERAL MOBILE (categorias + marcas + login) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Fundo escuro para fechar ao clicar */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer lateral */}
          <div className="relative h-full w-4/5 max-w-xs bg-white shadow-xl flex flex-col">
            {/* Cabeçalho do menu */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <span className="font-semibold text-gray-800">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-pink-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Seção Login / Logout */}
              <div className="px-4 py-3 border-b space-y-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>

                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 font-medium text-sm mt-2"
                    >
                      <User size={18} />
                      <span>Painel administrativo</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>

              {/* Seção Categorias */}
              <div className="px-4 py-4 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Filter size={16} className="text-pink-600" />
                  Categorias
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      filterBy('all');
                      setSelectedBrand('all');
                      setIsMenuOpen(false);
                    }}
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
                      onClick={() => {
                        filterBy(cat.id);
                        setSelectedBrand('all');
                        setIsMenuOpen(false);
                      }}
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

              {/* Seção Marcas */}
              <div className="px-4 py-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Marcas
                </h3>
                <div className="flex flex-wrap gap-3">
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
                        onClick={() => {
                          handleBrandClick(brand.name);
                          setIsMenuOpen(false);
                        }}
                        className={`flex flex-col items-center ${
                          isActive ? 'text-pink-600' : 'text-gray-600'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-full border bg-white flex items-center justify-center text-[10px] font-semibold uppercase shadow-sm overflow-hidden ${
                            isActive ? 'border-pink-500' : 'border-gray-200'
                          }`}
                        >
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="px-1 text-[10px] text-center">
                              {shortLabel}
                            </span>
                          )}
                        </div>
                        <span className="mt-1 text-[10px] font-medium truncate max-w-[70px]">
                          {brand.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

          {/* FAIXA DE MARCAS (logo-style) */}
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
                      className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center text-xs font-semibold uppercase shadow-sm hover:shadow-md transition-all overflow-hidden ${
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
                paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}

          {/* Paginação (se quiser usar depois)
              Exemplo simples:

          {filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                className="px-3 py-1 text-xs rounded border disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-gray-500">
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                disabled={currentPage + 1 >= totalPages}
                onClick={() =>
                  setCurrentPage((p) =>
                    p + 1 < totalPages ? p + 1 : p
                  )
                }
                className="px-3 py-1 text-xs rounded border disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
