import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

// Resolve logoUrl vindo do backend (suporta URL absoluta ou caminho relativo)
const resolveLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;

  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }

  const base = api.defaults.baseURL || '';
  return `${base}${logoUrl}`;
};

export default function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null); // só pra mostrar feedback na linha certa

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const res = await api.get('/brands');
      setBrands(res.data || []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      alert('Erro ao carregar marcas. Verifique se o backend está rodando.');
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Informe o nome da marca');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        // continua permitindo URL externa manual, se quiser
        logoUrl: logoUrlInput.trim() || undefined,
      };

      await api.post('/brands', payload);
      alert('Marca cadastrada com sucesso!');

      setName('');
      setLogoUrlInput('');
      await loadBrands();
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
      alert('Erro ao salvar marca. Verifique se você está logado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta marca?')) return;
    try {
      await api.delete(`/brands/${id}`);
      alert('Marca removida com sucesso!');
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Erro ao deletar marca:', error);
      alert('Erro ao deletar. Verifique se há produtos usando essa marca.');
    }
  };

  // Enviado automaticamente quando o usuário escolhe um arquivo
  const handleUploadLogo = async (brandId, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem (PNG, JPG, etc.)');
      return;
    }

    try {
      setUploadingId(brandId);

      const formData = new FormData();
      formData.append('file', file);

      // NÃO define headers Content-Type aqui; o axios/fetch cuida disso
      const res = await api.post(`/brands/${brandId}/logo`, formData);

      // backend retorna BrandDTO com logoUrl do Cloudinary
      const updatedBrand = res.data;

      setBrands((prev) =>
        prev.map((b) => (b.id === brandId ? updatedBrand : b))
      );

      alert('Logo enviada/atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar logo:', error);
      alert('Erro ao enviar logo. Verifique se você está logado.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-4">
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
                Cadastre novas marcas e envie/atualize a logo de cada uma.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de nova marca */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon size={18} className="text-pink-600" />
            Nova Marca
          </h2>

          <form
            onSubmit={handleCreateBrand}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da marca
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Bruna Tavares..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da logo (opcional)
              </label>
              <input
                type="text"
                value={logoUrlInput}
                onChange={(e) => setLogoUrlInput(e.target.value)}
                placeholder="https://... (se quiser usar link externo)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-xs"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Se preferir, cadastre a marca sem URL e envie a imagem pelo
                upload na lista abaixo.
              </p>
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition shadow-md disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? 'Salvando...' : 'Adicionar Marca'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de marcas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Marcas cadastradas
          </h2>

          {brands.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nenhuma marca cadastrada ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 border-b text-sm">
                    <th className="py-2 pr-2">Logo</th>
                    <th className="py-2 pr-2">Nome</th>
                    <th className="py-2 pr-2">URL salva</th>
                    <th className="py-2 pr-2">Upload de nova logo</th>
                    <th className="py-2 pr-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => {
                    const logoUrl = resolveLogoUrl(brand.logoUrl);
                    const isUploading = uploadingId === brand.id;

                    return (
                      <tr
                        key={brand.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-3 pr-2">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={brand.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-xs">
                              sem
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-2 font-medium text-gray-800">
                          {brand.name}
                        </td>
                        <td className="py-3 pr-2 text-xs text-gray-500 max-w-xs truncate">
                          {brand.logoUrl || (
                            <span className="italic text-gray-400">
                              (nenhuma)
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-2">
                          <label className="inline-flex items-center gap-2 text-xs text-pink-600 cursor-pointer">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload size={14} />
                            )}
                            <span>
                              {isUploading
                                ? 'Enviando...'
                                : 'Enviar / Trocar logo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadLogo(brand.id, file);
                                  // limpa o input pra permitir enviar o mesmo arquivo de novo se quiser
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <button
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
