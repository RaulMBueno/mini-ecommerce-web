import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import PageMeta from '../components/PageMeta';
import { ShoppingCart, ExternalLink, ArrowLeft, Loader } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar produto:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [id]);

  const metaTitle = product
    ? `${product.name} | ReMakeup Store`
    : 'Produto | ReMakeup Store';
  const metaDescription = product?.description
    ? product.description
    : 'Detalhes do produto na ReMakeup Store.';
  const isAffiliate = product?.type === 'AFFILIATE';
  const affiliateUrl = product?.affiliateUrl;
  const descriptionText = product?.description || '';
  const isLongDescription = descriptionText.trim().length > 240;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-pink-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Produto não encontrado.
      </div>
    );
  }

  return (
    <>
      <PageMeta title={metaTitle} description={metaDescription} />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Links superiores */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-pink-600 text-sm font-semibold hover:text-pink-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página principal
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition"
          >
            Ver mais ofertas
          </Link>
        </div>

        {/* Banner estático com identidade */}
        <div className="mb-8">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-md bg-white">
            <img
              src="/hero-banner.jpg"
              alt="ReMakeup Store"
              className="w-full h-36 sm:h-44 md:h-56 object-cover object-[50%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2 sm:top-4 sm:left-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-pink-600 text-white font-extrabold flex items-center justify-center shadow-sm">
                R
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                ReMakeup.
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-6">
              <div className="max-w-md">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                  Realce sua beleza única
                </h2>
                <p className="text-[11px] sm:text-sm text-gray-700">
                  Achadinhos da Re — Maquiagem &amp; Beleza oficiais para comprar
                  direto nas lojas parceiras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row md:items-stretch">
          {/* Lado Esquerdo: Imagem */}
          <div className="md:w-1/2 bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-start items-start">
            {isAffiliate && affiliateUrl ? (
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
                title="Ir para o site parceiro"
              >
                <img
                  src={
                    product.imgUrl ||
                    'https://via.placeholder.com/600x600?text=Sem+Imagem'
                  }
                  alt={product.name}
                  className="max-h-[260px] sm:max-h-[320px] md:max-h-[420px] w-full object-contain rounded-xl bg-white shadow-sm p-3 sm:p-4"
                />
              </a>
            ) : (
              <img
                src={
                  product.imgUrl ||
                  'https://via.placeholder.com/600x600?text=Sem+Imagem'
                }
                alt={product.name}
                className="max-h-[260px] sm:max-h-[320px] md:max-h-[420px] w-full object-contain rounded-xl bg-white shadow-sm p-3 sm:p-4"
              />
            )}
          </div>

          {/* Lado Direito: Informações */}
          <div className="md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold tracking-wide uppercase w-fit mb-4">
              {product.type === 'AFFILIATE' ? 'Parceiro' : 'Exclusivo'}
            </span>

            {isAffiliate && affiliateUrl ? (
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ir para o site parceiro"
                className="hover:text-pink-600 transition"
              >
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
              </a>
            ) : (
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
            )}

            <div className="mb-6">
              <p
                className={`text-gray-600 text-lg leading-relaxed whitespace-pre-line ${
                  !isDescriptionExpanded && isLongDescription
                    ? 'line-clamp-6 max-h-[10.5rem] overflow-hidden'
                    : ''
                }`}
              >
                {descriptionText}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() =>
                    setIsDescriptionExpanded((prev) => !prev)
                  }
                  className="mt-2 text-sm font-semibold text-pink-600 hover:text-pink-700 underline"
                  aria-expanded={isDescriptionExpanded}
                >
                  {isDescriptionExpanded ? 'Ver menos' : 'Ver mais'}
                </button>
              )}
            </div>

            {/* CTA principal */}
            <div className="mt-2">
              {isAffiliate ? (
                <a
                  href={affiliateUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!affiliateUrl}
                  className={`w-full bg-pink-600 text-white font-bold text-lg sm:text-xl py-4 sm:py-5 rounded-2xl transition flex items-center justify-center gap-3 shadow-xl ring-2 ring-pink-200 hover:shadow-pink-500/40 ${
                    affiliateUrl
                      ? 'hover:bg-pink-700'
                      : 'opacity-60 pointer-events-none'
                  }`}
                >
                  Ver preço no parceiro
                  <ExternalLink className="h-6 w-6" />
                </a>
              ) : affiliateUrl ? (
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-pink-600 text-white font-bold text-lg sm:text-xl py-4 sm:py-5 rounded-2xl hover:bg-pink-700 transition flex items-center justify-center gap-3 shadow-xl ring-2 ring-pink-200 hover:shadow-pink-500/40"
                >
                  Ver Oferta na Loja
                  <ExternalLink className="h-6 w-6" />
                </a>
              ) : (
                <button className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg">
                  Adicionar ao Carrinho
                  <ShoppingCart className="h-6 w-6" />
                </button>
              )}
              {isAffiliate && !affiliateUrl && (
                <p className="text-xs text-gray-400 mt-2">Link indisponível</p>
              )}
            </div>

            {!isAffiliate && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <span className="text-3xl font-bold text-pink-600">
                  R$ {product.price?.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
