import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importante: O mensageiro que fala com o Java
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

export default function Admin() {
  // 1. O ESTADO (Onde guardamos os dados do formulário)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imgUrl: '',
    affiliateUrl: '',
    type: 'PHYSICAL' // Valor padrão
  });

  // 2. FUNÇÃO QUE ATUALIZA O ESTADO QUANDO VOCÊ DIGITA
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 3. FUNÇÃO QUE ENVIA PARA O JAVA (SUBMIT)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    try {
      // Converte preço para número (o Java espera BigDecimal/Double)
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      // Envia para o Backend
      await axios.post('http://localhost:8080/products', payload);
      
      alert('Produto cadastrado com sucesso!');
      
      // Limpa o formulário
      setFormData({
        name: '',
        description: '',
        price: '',
        imgUrl: '',
        affiliateUrl: '',
        type: 'PHYSICAL'
      });

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert('Erro ao cadastrar produto. Verifique se o Backend está ligado.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Novo Produto</h1>
          </div>
        </div>

        {/* O Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo: Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Ex: Batom Vermelho Matte"
                required
              />
            </div>

            {/* Campo: Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none h-24"
                placeholder="Detalhes do produto..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Campo: Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Campo: Tipo (Select) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Produto</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
                >
                  <option value="PHYSICAL">Físico (Estoque Próprio)</option>
                  <option value="AFFILIATE">Afiliado (Link Externo)</option>
                  <option value="DIGITAL">Digital (Curso/Ebook)</option>
                </select>
              </div>
            </div>

            {/* Campo: URL da Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
              <input 
                type="text" 
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>

            {/* Campo: Link de Afiliado (Lógica Condicional Visual) */}
            {formData.type === 'AFFILIATE' && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 animate-fade-in">
                <label className="block text-sm font-bold text-pink-700 mb-1">Link de Afiliado (Shopee/Amazon)</label>
                <input 
                  type="text" 
                  name="affiliateUrl"
                  value={formData.affiliateUrl}
                  onChange={handleChange}
                  className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="https://shopee.com.br/..."
                />
              </div>
            )}

            {/* Botão Salvar */}
            <button 
              type="submit" 
              className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Cadastrar Produto
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}