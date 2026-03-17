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
        {/* Cabeçalho com identidade */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-pink-600 text-white font-extrabold flex items-center justify-center shadow-sm">
            R
          </div>
          <span className="text-2xl font-extrabold text-gray-900">
            ReMakeup.
          </span>
        </div>

        {/* Banner estático */}
        <div className="mb-6">
          <div className="w-full overflow-hidden rounded-2xl shadow-md bg-white">
            <img
              src="/hero-banner.jpg"
              alt="ReMakeup Store"
              className="w-full h-32 sm:h-40 md:h-48 object-cover"
            />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para a página principal
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 border border-pink-200 px-4 py-2 rounded-lg hover:bg-pink-50 transition text-sm font-semibold shadow-sm"
          >
            Ver mais ofertas
          </Link>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row md:items-stretch">
          {/* Lado Esquerdo: Imagem */}
          <div className="md:w-1/2 bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-center items-center">
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
                  className="max-h-[320px] sm:max-h-[380px] md:max-h-[500px] w-full object-contain rounded-xl hover:scale-105 transition duration-500"
                />
              </a>
            ) : (
              <img
                src={
                  product.imgUrl ||
                  'https://via.placeholder.com/600x600?text=Sem+Imagem'
                }
                alt={product.name}
                className="max-h-[320px] sm:max-h-[380px] md:max-h-[500px] w-full object-contain rounded-xl hover:scale-105 transition duration-500"
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
            <div className="mt-4">
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
