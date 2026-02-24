import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function FeaturedCarousel({ products, compact = false }) {
  const [current, setCurrent] = useState(0);

  if (!products || products.length === 0) return null;

  // 1 (hero) + produtos
  const totalSlides = products.length + 1;

  // autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 8000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goTo = (index) => setCurrent(index);

  const containerClass = compact
    ? 'relative w-full max-w-7xl mx-auto mb-4 overflow-hidden rounded-xl shadow-lg bg-white h-[160px] md:h-[420px]'
    : 'relative w-full max-w-7xl mx-auto mb-6 md:mb-12 overflow-hidden rounded-2xl shadow-2xl bg-white h-[180px] md:h-[420px]';

  return (
    <div className={containerClass}>
      <div className="w-full h-full relative">
        {/* =========================================================
           SLIDE 0 — HERO REMAKEUP (desktop + mobile)
        ========================================================== */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            current === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="w-full h-full relative">
            <img
              src="/hero-banner.jpg"
              alt="ReMakeup Store"
              className="w-full h-full object-cover"
            />

            {/* overlay geral */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/70 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-start justify-start px-4 md:px-10 pt-5 md:pt-10 gap-3">
              {/* TEXTO PRINCIPAL */}
              <div className="w-full md:w-1/2 text-left z-20">
                <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 md:mb-3">
                  Realce sua{' '}
                  <span className="text-pink-600">
                    beleza única
                  </span>
                </h2>

                <p className="hidden md:block text-sm md:text-base text-gray-600 max-w-md mb-4 md:mb-6">
                  ReMakeup: O que há de melhor em beleza.
                  <br />
                  Encontre uma seleção exclusiva de maquiagens, produtos de
                  skincare e batons. Tudo o que você precisa para valorizar o
                  seu estilo.
                </p>
                <p className="md:hidden text-[12px] text-gray-600 max-w-xs mb-3">
                  Achadinhos da Re – Maquiagem &amp; Beleza
                  <br />
                  Links oficiais para comprar direto nas lojas parceiras.
                </p>

                {/* CTA removido para visual mais clean */}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
           SLIDES DE PRODUTOS (1..N)
        ========================================================== */}
        {products.map((product, index) => {
          const slideIndex = index + 1; // 0 é o hero
          const isAffiliate = product?.type === 'AFFILIATE';
          const affiliateUrl = product?.affiliateUrl;

          return (
            <div
              key={product.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row ${
                current === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* TEXTO — DESKTOP */}
              <div className="hidden md:flex md:w-1/2 p-10 flex-col justify-center bg-gradient-to-r from-pink-50 to-white z-20">
                <span className="text-pink-600 font-bold tracking-widest uppercase text-sm mb-2">
                  Destaque do Dia 🔥
                </span>

                <h2
                  className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight"
                  title={product.name}
                >
                  {product.name}
                </h2>

                {/* descrição limitada */}
                <p
                  className="text-gray-500 text-base mb-6 max-h-16 overflow-hidden"
                  title={product.description}
                >
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  {isAffiliate ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={affiliateUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!affiliateUrl}
                        className={`px-8 py-3 bg-pink-600 text-white font-bold rounded-full transition flex items-center gap-2 shadow-lg text-base ${
                          affiliateUrl
                            ? 'hover:bg-pink-700'
                            : 'opacity-60 pointer-events-none'
                        }`}
                      >
                        Ver preço no parceiro <ExternalLink size={18} />
                      </a>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm text-gray-600 hover:text-pink-600 underline"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  ) : (
                    <>
                      <Link
                        to={`/product/${product.id}`}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition shadow-lg text-base"
                      >
                        Comprar Agora
                      </Link>
                      <span className="text-2xl font-bold text-pink-600">
                        R$ {product.price?.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* IMAGEM + OVERLAY — MOBILE (e lado direito no desktop) */}
              {isAffiliate ? (
                <a
                  href={affiliateUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!affiliateUrl}
                  className="w-full md:w-1/2 h-full relative block"
                >
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* badge no mobile */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink-600/90 text-[11px] font-bold text-white md:hidden">
                    Destaque do dia
                  </div>

                  {/* nome + CTA sobre a imagem no mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden">
                    <div className="text-sm font-semibold text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-pink-100 font-bold">
                      Ver preço no parceiro
                    </div>
                  </div>
                </a>
              ) : (
                <Link
                  to={`/product/${product.id}`}
                  className="w-full md:w-1/2 h-full relative block"
                >
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* badge no mobile */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink-600/90 text-[11px] font-bold text-white md:hidden">
                    Destaque do dia
                  </div>

                  {/* nome + preço sobre a imagem no mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden">
                    <div className="text-sm font-semibold text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-pink-100 font-bold">
                      R$ {product.price?.toFixed(2)}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
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

      {/* BOLINHAS (HERO + PRODUTOS) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
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
