import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Tag } from 'lucide-react';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const token = localStorage.getItem('miniecommerce_token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      await axios.post('http://localhost:8080/categories', { name: newCategoryName }, config);
      
      alert('Categoria criada!');
      setNewCategoryName('');
      loadCategories(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao criar categoria. Você está logado?');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza? Isso pode afetar produtos que usam essa categoria.")) return;

    try {
      const token = localStorage.getItem('miniecommerce_token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:8080/categories/${id}`, config);
      loadCategories();
    } catch (error) {
      alert("Erro ao excluir. Talvez existam produtos vinculados a esta categoria.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Categorias</h1>
        </div>

        {/* --- CADASTRO --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Plus size={20} className="text-pink-600"/> Nova Categoria
          </h2>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Perfumes"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
            <button 
              type="submit" 
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* --- LISTAGEM --- */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Categorias Existentes</h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-pink-200 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full text-pink-500 shadow-sm">
                    <Tag size={16} />
                  </div>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                </div>
                
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Excluir Categoria"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            {categories.length === 0 && <p className="text-center text-gray-400">Nenhuma categoria encontrada.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}