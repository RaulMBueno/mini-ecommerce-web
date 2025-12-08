import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  ArrowLeft,
  Save,
  Trash2,
  Edit,
  XCircle,
  Star,
  Tag,
  Sparkles,
} from 'lucide-react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imgUrl: '',
    affiliateUrl: '',
    type: 'PHYSICAL',
    categoryId: '',
    brand: '',
    isFeatured: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.content || response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  };

  const handleEdit = (product) => {
    const firstCatId =
      product.categories && product.categories.length > 0
        ? product.categories[0].id
        : '';

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
      affiliateUrl: product.affiliateUrl || '',
      type: product.type || 'PHYSICAL',
      categoryId: firstCatId,
      brand: product.brand || '',
      isFeatured: product.isFeatured || false,
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imgUrl: '',
      affiliateUrl: '',
      type: 'PHYSICAL',
      categoryId: '',
      brand: '',
      isFeatured: false,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Produto removido!');
      loadProducts();
    } catch (error) {
      alert('Erro ao deletar. Verifique se está logado.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        categories: formData.categoryId
          ? [{ id: parseInt(formData.categoryId, 10) }]
          : [],
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        alert('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        alert('Produto cadastrado com sucesso!');
      }

      cancelEdit();
      loadProducts();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar. Verifique se você fez login novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Painel Administrativo
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/categories"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Tag size={16} /> Gerenciar Categorias
            </Link>

            <Link
              to="/admin/brands"
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles size={16} /> Gerenciar Marcas
            </Link>
          </div>
        </div>

        {/* Formulário */}
        <div
          className={`bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 ${
            editingId ? 'border-yellow-500' : 'border-pink-600'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? '✏️ Editando Produto' : '✨ Cadastrar Novo Produto'}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <XCircle size={16} /> Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-24"
              />
            </div>

            {/* Preço / Tipo / Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                >
                  <option value="PHYSICAL">Físico</option>
                  <option value="AFFILIATE">Afiliado</option>
                  <option value="DIGITAL">Digital</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
              >
                <option value="">Selecione...</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Para adicionar uma nova marca, use o botão &quot;Gerenciar
                Marcas&quot; acima.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer accent-pink-600"
              />
              <label
                htmlFor="isFeatured"
                className="text-gray-700 font-bold cursor-pointer select-none flex items-center gap-2"
              >
                <Star
                  size={18}
                  className="text-yellow-500 fill-yellow-500"
                />
                Destacar este produto no Carrossel da Home
              </label>
            </div>

            {formData.type === 'AFFILIATE' && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <label className="block text-sm font-bold text-pink-700 mb-1">
                  Link de Afiliado
                </label>
                <input
                  type="text"
                  name="affiliateUrl"
                  value={formData.affiliateUrl}
                  onChange={handleChange}
                  className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 ${
                editingId
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              <Save size={20} />
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </form>
        </div>

        {/* Tabela de produtos */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Gerenciar Produtos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3">Img</th>
                  <th className="py-3">Nome</th>
                  <th className="py-3">Preço</th>
                  <th className="py-3">Destaque?</th>
                  <th className="py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3">
                      <img
                        src={
                          product.imgUrl || 'https://via.placeholder.com/50'
                        }
                        className="w-12 h-12 object-cover rounded"
                        alt="mini"
                      />
                    </td>
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3">
                      R$ {product.price?.toFixed(2)}
                    </td>
                    <td className="py-3">
                      {product.isFeatured && (
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                      )}
                    </td>
                    <td className="py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center text-gray-400 mt-4">
                Nenhum produto cadastrado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
