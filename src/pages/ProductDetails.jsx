import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import PageMeta from '../components/PageMeta';
import { ShoppingCart, ExternalLink, ArrowLeft, Loader } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const metaTitle = product
    ? `${product.name} | ReMakeup Store`
    : 'Produto | ReMakeup Store';
  const metaDescription = product?.description
    ? product.description
    : 'Detalhes do produto na ReMakeup Store.';
  const isAffiliate = product?.type === 'AFFILIATE';
  const affiliateUrl = product?.affiliateUrl;

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
        {/* Botão Voltar */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-8 transition"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar para Loja
        </Link>

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

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

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
                  className={`w-full bg-pink-600 text-white font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg hover:shadow-pink-500/30 ${
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
                  className="w-full bg-pink-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-pink-500/30"
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
