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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row md:items-start">
          {/* Lado Esquerdo: Imagem */}
          <div className="md:w-1/2 bg-gray-100 p-8 flex justify-center items-start">
            <img
              src={
                product.imgUrl ||
                'https://via.placeholder.com/600x600?text=Sem+Imagem'
              }
              alt={product.name}
              className="max-h-[500px] w-full object-contain rounded-lg hover:scale-105 transition duration-500"
            />
          </div>

          {/* Lado Direito: Informações */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold tracking-wide uppercase w-fit mb-4">
              {product.type === 'AFFILIATE' ? 'Parceiro' : 'Exclusivo'}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="mb-8">
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

            <div className="border-t border-gray-200 pt-8 mt-auto">
              {!isAffiliate && (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-pink-600">
                      R$ {product.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Botão de Ação */}
              {isAffiliate ? (
                <a
                  href={affiliateUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!affiliateUrl}
                  className={`w-full bg-pink-600 text-white font-bold text-lg sm:text-xl py-4 sm:py-5 rounded-xl transition flex items-center justify-center gap-3 shadow-xl hover:shadow-pink-500/40 ${
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
                  className="w-full bg-pink-600 text-white font-bold text-lg sm:text-xl py-4 sm:py-5 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-3 shadow-xl hover:shadow-pink-500/40"
                >
                  Ver Oferta na Loja
                  <ExternalLink className="h-6 w-6" />
                </a>
              ) : (
                <button className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg">
                  Adicionar ao Carrinho
                  <ShoppingCart className="h-6 w-6" />
                </button>
              )}
              {isAffiliate && !affiliateUrl && (
                <p className="text-xs text-gray-400 mt-2">Link indisponível</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
