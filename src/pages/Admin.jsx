import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Trash2, Edit, XCircle } from 'lucide-react'; // Adicionei Edit e XCircle

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null); // NOVO: Guarda o ID de quem estamos editando

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imgUrl: '',
    affiliateUrl: '',
    type: 'PHYSICAL'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data.content || response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  // --- AÇÃO DE CLICAR NO LÁPIS ---
  const handleEdit = (product) => {
    // 1. Preenche o formulário com os dados do produto clicado
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
      affiliateUrl: product.affiliateUrl || '', // Garante que não seja null
      type: product.type
    });
    // 2. Marca que estamos editando este ID
    setEditingId(product.id);
    
    // 3. Rola a tela para o topo para ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- AÇÃO DE CANCELAR EDIÇÃO ---
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', imgUrl: '', affiliateUrl: '', type: 'PHYSICAL' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      const token = localStorage.getItem('miniecommerce_token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.delete(`http://localhost:8080/products/${id}`, config);
      alert("Produto removido!");
      loadProducts();
    } catch (error) {
      alert("Erro ao deletar. Verifique se está logado.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // --- O CORAÇÃO DA LÓGICA (CRIAR OU ATUALIZAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('miniecommerce_token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const payload = { ...formData, price: parseFloat(formData.price) };

      if (editingId) {
        // --- MODO EDIÇÃO (PUT) ---
        await axios.put(`http://localhost:8080/products/${editingId}`, payload, config);
        alert('Produto atualizado com sucesso!');
      } else {
        // --- MODO CRIAÇÃO (POST) ---
        await axios.post('http://localhost:8080/products', payload, config);
        alert('Produto cadastrado com sucesso!');
      }
      
      // Limpa tudo e recarrega
      cancelEdit();
      loadProducts();

    } catch (error) {
      console.error("Erro:", error);
      alert('Erro ao salvar. Verifique o console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        </div>

        {/* --- FORMULÁRIO --- */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 ${editingId ? 'border-yellow-500' : 'border-pink-600'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? '✏️ Editando Produto' : '✨ Cadastrar Novo Produto'}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                <XCircle size={16} /> Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-24" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white">
                  <option value="PHYSICAL">Físico</option>
                  <option value="AFFILIATE">Afiliado</option>
                  <option value="DIGITAL">Digital</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
              <input type="text" name="imgUrl" value={formData.imgUrl} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>

            {formData.type === 'AFFILIATE' && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <label className="block text-sm font-bold text-pink-700 mb-1">Link de Afiliado</label>
                <input type="text" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-pink-600 hover:bg-pink-700'}`}
            >
              <Save size={20} />
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </form>
        </div>

        {/* --- TABELA --- */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Gerenciar Produtos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3">Imagem</th>
                  <th className="py-3">Nome</th>
                  <th className="py-3">Preço</th>
                  <th className="py-3">Tipo</th>
                  <th className="py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3"><img src={product.imgUrl || "https://via.placeholder.com/50"} className="w-12 h-12 object-cover rounded" alt="mini" /></td>
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3">R$ {product.price?.toFixed(2)}</td>
                    <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.type === 'AFFILIATE' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {product.type}
                        </span>
                    </td>
                    <td className="py-3 text-right flex justify-end gap-2">
                      {/* BOTÃO EDITAR (NOVO) */}
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      {/* BOTÃO DELETAR */}
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="text-center text-gray-400 mt-4">Nenhum produto cadastrado.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}