import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarPedido } from '../services/pedidos';

export default function NovoPedido() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState({
    cliente_nome: '',
    cliente_telefone: '',
    descricao: '',
    valor: '',
    data_entrega: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCarregando(true);
      await criarPedido({
        ...form,
        valor: parseFloat(form.valor),
        data_entrega: new Date(form.data_entrega).toISOString(),
      });
      navigate('/');
    } catch (err) {
      setErro('Erro ao criar pedido');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome do cliente</label>
              <input
                name="cliente_nome"
                value={form.cliente_nome}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input
                name="cliente_telefone"
                value={form.cliente_telefone}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descrição do pedido</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Data de entrega</label>
              <input
                name="data_entrega"
                type="datetime-local"
                value={form.data_entrega}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <button
              type="submit"
              disabled={carregando}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-2 rounded-lg text-sm font-medium transition mt-2"
            >
              {carregando ? 'Salvando...' : 'Criar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}