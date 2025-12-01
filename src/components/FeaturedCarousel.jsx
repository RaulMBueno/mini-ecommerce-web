import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function FeaturedCarousel({ products }) {
  const [current, setCurrent] = useState(0);

  if (!products || products.length === 0) return null;

  const nextSlide = () => {
    setCurrent(current === products.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? products.length - 1 : current - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current, products.length]);

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-12 overflow-hidden rounded-2xl shadow-2xl bg-white h-[300px] md:h-[400px]">
      
      <div className="w-full h-full relative">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row
              ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* LADO ESQUERDO: TEXTO */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-gradient-to-r from-pink-50 to-white z-20">
              
              <span className="text-pink-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2">
                Destaque do Dia 🔥
              </span>
              
              {/* TÍTULO: Limita a 2 linhas e ajusta o tamanho */}
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2 md:mb-4 leading-tight line-clamp-2" title={product.name}>
                {product.name}
              </h2>
              
              {/* DESCRIÇÃO: Esconde no celular (hidden), mostra no PC (md:block) limitado a 2 linhas */}
              <p className="hidden md:block text-gray-500 text-sm md:text-base mb-6 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center gap-4 mt-auto md:mt-0">
                {product.affiliateUrl ? (
                  <a 
                    href={product.affiliateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 md:px-8 md:py-3 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-700 transition flex items-center gap-2 shadow-lg text-sm md:text-base"
                  >
                    Ver Oferta <ExternalLink size={16}/>
                  </a>
                ) : (
                  <Link 
                    to={`/product/${product.id}`}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition shadow-lg text-sm md:text-base"
                  >
                    Comprar Agora
                  </Link>
                )}
                
                <span className="text-xl md:text-2xl font-bold text-pink-600">
                  R$ {product.price?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* LADO DIREITO: IMAGEM */}
            <div className="w-full md:w-1/2 h-full relative">
                <img 
                  src={product.imgUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                />
                {/* Degradê suave para mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden"></div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÕES DE NAVEGAÇÃO */}
      <button onClick={prevSlide} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white text-gray-800 shadow-lg transition backdrop-blur-sm">
        <ChevronLeft size={20} />
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white text-gray-800 shadow-lg transition backdrop-blur-sm">
        <ChevronRight size={20} />
      </button>

      {/* BOLINHAS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === current ? 'bg-pink-600 w-6 md:w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}