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
  ExternalLink,
  Filter,
  ChevronRight,
  User,
} from 'lucide-react';
import api from '../api';
import FeaturedCarousel from '../components/FeaturedCarousel';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    checkLogin();
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem('miniecommerce_token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('miniecommerce_token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
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

  const filterBy = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredProducts(allProducts);
    } else {
      const result = allProducts.filter((product) =>
        product.categories.some((cat) => cat.id === categoryId),
      );
      setFilteredProducts(result);
    }
  };

  const featuredProducts = allProducts.filter((p) => p.isFeatured === true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                ReMakeup<span className="text-pink-600">.</span>
              </span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="O que você procura?"
                  className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-200 w-72 transition-all outline-none"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-pink-500 transition-colors" />
              </div>

              {isLoggedIn && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-pink-600 font-medium transition flex items-center gap-1"
                >
                  <User size={18} /> Painel
                </Link>
              )}

              <button className="relative p-2 text-gray-600 hover:text-pink-600 transition">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </button>

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

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-pink-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-r from-pink-50 to-white py-12 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <span className="inline-block px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
              Novos Achadinhos
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Realce sua <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Beleza Única
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Curadoria exclusiva das melhores maquiagens, skincare e cursos
              profissionais selecionados especialmente para você.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
            <img
              src="/hero-banner.jpg"
              alt="Hero"
              className="relative rounded-2xl shadow-2xl w-full h-72 object-cover transform rotate-2 hover:rotate-0 transition duration-700 ease-in-out"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000';
              }}
            />
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
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
              <p className="text-purple-800 font-bold text-sm mb-2">Quer aprender?</p>
              <p className="text-gray-600 text-xs mb-3">
                Confira nossos cursos de automaquiagem.
              </p>
              <button
                onClick={() => {
                  const cursoCat = categories.find((c) => c.name.includes('Curso'));
                  if (cursoCat) filterBy(cursoCat.id);
                }}
                className="text-xs font-bold text-pink-600 hover:underline"
              >
                Ver Cursos &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <div className="flex-1">
          {/* Filtros mobile */}
          <div className="md:hidden flex overflow-x-auto gap-3 pb-4 mb-6 scrollbar-hide">
            <button
              onClick={() => filterBy('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full border ${
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
                className={`whitespace-nowrap px-4 py-2 rounded-full border ${
                  selectedCategory === cat.id
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Destaques */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-pink-600 rounded-full" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Destaques da Semana
                </h2>
              </div>
              <FeaturedCarousel products={featuredProducts} />
            </div>
          )}

          {/* Título da vitrine */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === 'all'
                ? 'Vitrine Completa'
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  'Produtos'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} produtos encontrados
            </span>
          </div>

          {/* Lista de produtos */}
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm">
              <Loader className="h-10 w-10 text-pink-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Search size={24} />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Nenhum produto encontrado.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Tente selecionar outra categoria.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100 group"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <Link to={`/product/${product.id}`}>
                        <img
                          className="w-full h-40 sm:h-48 lg:h-56 object-cover cursor-pointer group-hover:scale-110 transition duration-700"
                          src={
                            product.imgUrl
                              ? product.imgUrl
                              : 'https://via.placeholder.com/300x200?text=Sem+Imagem'
                          }
                          alt={product.name}
                          title="Clique para ver detalhes"
                        />
                      </Link>
                      {product.type === 'AFFILIATE' && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          Parceiro
                        </span>
                      )}
                    </div>

                    <div className="p-4 md:p-5 flex flex-col flex-grow">
                      <div className="mb-1 md:mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {product.categories && product.categories.length > 0
                            ? product.categories[0].name
                            : 'Geral'}
                        </span>
                      </div>

                      {/* Nome mais compacto no mobile */}
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2 leading-tight group-hover:text-pink-600 transition">
                        {product.name}
                      </h3>

                      {/* Descrição: some no mobile, aparece a partir de sm */}
                      <p className="hidden sm:block text-gray-500 text-sm mb-3 md:mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {product.affiliateUrl && (
                        <p className="text-[10px] text-gray-400 italic mb-3 flex items-center gap-1 bg-gray-50 p-1.5 rounded w-fit">
                          ⚠️ Preço sujeito a alteração
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-gray-50">
                        <span className="text-lg md:text-2xl font-bold text-pink-600">
                          R$ {product.price?.toFixed(2)}
                        </span>

                        {product.affiliateUrl ? (
                          <a
                            href={product.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-pink-600 hover:text-white transition font-bold text-xs md:text-sm"
                          >
                            Ver Oferta <ExternalLink size={16} />
                          </a>
                        ) : (
                          <button className="p-2.5 md:p-3 bg-gray-900 rounded-xl hover:bg-black text-white transition shadow-lg hover:shadow-gray-900/30">
                            <ShoppingCart size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
