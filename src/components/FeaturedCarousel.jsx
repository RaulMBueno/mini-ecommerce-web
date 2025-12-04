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
    <div className="relative w-full max-w-7xl mx-auto mb-12 overflow-hidden rounded-2xl shadow-2xl bg-white h-[260px] md:h-[400px]">
      <div className="w-full h-full relative">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row
              ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* DESKTOP: LADO ESQUERDO COM TEXTO */}
            <div className="hidden md:flex md:w-1/2 p-10 flex-col justify-center bg-gradient-to-r from-pink-50 to-white z-20">
              <span className="text-pink-600 font-bold tracking-widest uppercase text-sm mb-2">
                Destaque do Dia 🔥
              </span>

              {/* Nome SEMPRE visível, limitado a 2 linhas */}
              <h2
                className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight"
                title={product.name}
              >
                {product.name}
              </h2>

              {/* Descrição: limitada em altura para não “engolir” o layout */}
              <p
                className="text-gray-500 text-base mb-6 max-h-16 overflow-hidden"
                title={product.description}
              >
                {product.description}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                {product.affiliateUrl ? (
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-700 transition flex items-center gap-2 shadow-lg text-base"
                  >
                    Ver Oferta <ExternalLink size={18} />
                  </a>
                ) : (
                  <Link
                    to={`/product/${product.id}`}
                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition shadow-lg text-base"
                  >
                    Comprar Agora
                  </Link>
                )}

                <span className="text-2xl font-bold text-pink-600">
                  R$ {product.price?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* IMAGEM (DESKTOP + MOBILE) */}
            {/* No MOBILE: só a imagem clicável levando para os detalhes */}
            <Link
              to={`/product/${product.id}`}
              className="w-full md:w-1/2 h-full relative block"
            >
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Badge no topo para mobile */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink-600/90 text-[11px] font-bold text-white md:hidden">
                Destaque do dia
              </div>

              {/* Nome + preço sobre a imagem no MOBILE */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden">
                <div className="text-sm font-semibold text-white truncate">
                  {product.name}
                </div>
                <div className="text-xs text-pink-100 font-bold">
                  R$ {product.price?.toFixed(2)}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* BOTÕES DE NAVEGAÇÃO */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white text-gray-800 shadow-lg transition backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-30 p-2 rounded-full bg-white/50 hover:bg-white text-gray-800 shadow-lg transition backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* BOLINHAS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              idx === current
                ? 'bg-pink-600 w-6 md:w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
