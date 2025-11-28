import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, Search, Menu, X, Loader, ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // O EFEITO MÁGICO (Busca os dados assim que a tela abre)
  useEffect(() => {
    console.log("Tentando buscar produtos no Java..."); // Espião 1

    axios.get('http://localhost:8080/products')
      .then(response => {
        console.log("SUCESSO! O Java respondeu:", response.data); // Espião 2
        
        // O Java manda os dados dentro de "content" quando usa paginação, 
        // ou direto no "data" se for lista simples. Tentamos os dois.
        setProducts(response.data.content || response.data); 
        setLoading(false);
      })
      .catch(error => {
        console.error("ERRO! O Java não respondeu:", error); // Espião de Erro
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-pink-600">ReMakeup Store</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <div className="relative">
                <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 w-64" />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <a href="#" className="text-gray-600 hover:text-pink-600 font-medium">Início</a>
              
              <button className="relative p-2 text-gray-600 hover:text-pink-600">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">0</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            </div>
            
             {/* Mobile Menu Button */}
             <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-pink-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Realce sua <span className="text-pink-600">Beleza Única</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Encontre as melhores maquiagens e produtos exclusivos escolhidos para você.
            </p>
          </div>
          <div className="md:w-1/2 relative group">
            <img src="/hero-banner.jpg" alt="Hero" className="rounded-2xl shadow-xl w-full h-64 object-cover transition-opacity duration-500 ease-in-out"
              style={{ opacity: 0.9 }}
              onMouseOver={(e) => e.currentTarget.style.opacity = 1} 
              onMouseOut={(e) => e.currentTarget.style.opacity = 0.9} />
          </div>
        </div>
      </div>

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-pink-600 pl-4">Nossos Produtos</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-10 w-10 text-pink-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">Nenhum produto cadastrado no sistema.</p>
                <p className="text-sm text-gray-400">Use o Insomnia para cadastrar novos itens.</p>
              </div>
            ) : (
products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative">
                    {/* Imagem Padrão */}
                    <img 
                      className="w-full h-48 object-cover" 
                      src={product.imgUrl ? product.imgUrl : "https://via.placeholder.com/300x200?text=Sem+Imagem"}
                      alt={product.name}
                    />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 h-10 overflow-hidden">{product.description}</p>
                    
                    {/* Área do Preço e Botão (Joga para o fundo do card com mt-auto) */}
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <span className="text-xl font-bold text-pink-600">R$ {product.price?.toFixed(2)}</span>
                      
                      {/* LÓGICA DO BOTÃO: Se tem link, mostra 'Ver Oferta', senão mostra Carrinho */}
                      {product.affiliateUrl ? (
                        <a 
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-full hover:bg-pink-100 transition border border-pink-200 text-sm font-bold"
                        >
                          Ver Oferta
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <button className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 text-pink-600 transition">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}