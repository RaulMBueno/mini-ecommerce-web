import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ExternalLink } from 'lucide-react';

export default function ProductCard({ product }) {
  const primaryCategory =
    product.categories && product.categories.length > 0
      ? product.categories[0].name
      : 'Geral';

  const isAffiliate = !!product.affiliateUrl;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100 group">
      {/* IMAGEM */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link to={`/product/${product.id}`}>
          <img
            className="w-full h-40 sm:h-48 md:h-56 object-cover cursor-pointer group-hover:scale-110 transition duration-700"
            src={
              product.imgUrl
                ? product.imgUrl
                : 'https://via.placeholder.com/300x200?text=Sem+Imagem'
            }
            alt={product.name}
            title="Clique para ver detalhes"
          />
        </Link>

        {isAffiliate && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-purple-700 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
            Parceiro
          </span>
        )}
      </div>

      {/* CONTEÚDO */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Categoria */}
        <div className="mb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {primaryCategory}
          </span>
        </div>

        {/* Nome do produto */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 leading-tight group-hover:text-pink-600 transition line-clamp-2">
          {product.name}
        </h3>

        {/* Descrição curta (limitada) */}
        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Aviso de afiliado */}
        {isAffiliate && (
          <p className="text-[10px] text-gray-400 italic mb-3 flex items-center gap-1 bg-gray-50 p-1.5 rounded w-fit">
            ⚠️ Preço sujeito a alteração
          </p>
        )}

        {/* Rodapé: preço + botão */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 gap-2">
          <span className="text-lg sm:text-xl font-bold text-pink-600">
            R$ {product.price?.toFixed(2)}
          </span>

          {isAffiliate ? (
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 bg-pink-50 text-pink-600 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl hover:bg-pink-600 hover:text-white transition font-bold text-[11px] sm:text-sm"
            >
              Ver Oferta <ExternalLink size={14} />
            </a>
          ) : (
            <button className="p-2.5 sm:p-3 bg-gray-900 rounded-xl hover:bg-black text-white transition shadow-lg hover:shadow-gray-900/30">
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
