import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Image as ImageIcon, Tag } from 'lucide-react';
import api from '../api';

export default function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
  });
  const [loading, setLoading] = useState(false);

  // Carregar marcas
  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get('/brands');
      setBrands(res.data || []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      alert('Erro ao carregar marcas. Verifique se você está logado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Informe o nome da marca.');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
      };

      await api.post('/brands', payload);
      alert('Marca cadastrada com sucesso!');

      setFormData({ name: '', logoUrl: '' });
      loadBrands();
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao salvar marca. Verifique se já não existe uma marca com esse nome.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta marca?')) return;

    try {
      await api.delete(`/brands/${id}`);
      alert('Marca removida com sucesso!');
      loadBrands();
    } catch (error) {
      console.error('Erro ao deletar marca:', error);
      alert('Erro ao deletar marca. Verifique se a marca não está vinculada a produtos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Gerenciar Marcas
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Cadastre marcas e associe URLs de logo para usar na home.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border-l-4 border-pink-600">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag size={18} className="text-pink-600" />
            Nova Marca
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da marca
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Ex.: Bruna Tavares"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ImageIcon size={16} />
                URL da logo (opcional)
              </label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="https://...logo.png"
              />
              <p className="text-xs text-gray-400 mt-1">
                Recomendo usar uma imagem quadrada (ex.: 200x200px) em PNG ou WEBP.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar Marca
            </button>
          </form>
        </div>

        {/* Lista de marcas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Marcas cadastradas
            </h2>
            {loading && (
              <span className="text-xs text-gray-400">Carregando...</span>
            )}
          </div>

          {brands.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Nenhuma marca cadastrada ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 font-semibold">
                          {brand.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {brand.name}
                      </p>
                      {brand.logoUrl && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {brand.logoUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                    title="Excluir marca"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
