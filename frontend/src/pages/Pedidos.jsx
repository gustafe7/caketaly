import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarPedidos, atualizarPedido, deletarPedido } from '../services/pedidos';

const statusLabel = {
  pendente: 'Pendente',
  em_producao: 'Em produção',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

const statusColor = {
  pendente: 'bg-yellow-100 text-yellow-800',
  em_producao: 'bg-blue-100 text-blue-800',
  pronto: 'bg-green-100 text-green-800',
  entregue: 'bg-gray-100 text-gray-800',
};

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      setCarregando(true);
      const dados = await listarPedidos();
      setPedidos(dados);
    } catch (err) {
      setErro('Erro ao carregar pedidos');
    } finally {
      setCarregando(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await atualizarPedido(id, { status: novoStatus });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    } catch (err) {
      setErro('Erro ao atualizar status');
    }
  };

  const handleDeletar = async (id) => {
    if (!confirm('Deseja deletar este pedido?')) return;
    try {
      await deletarPedido(id);
      setPedidos(pedidos.filter(p => p.id !== id));
    } catch (err) {
      setErro('Erro ao deletar pedido');
    }
  };

  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Carregando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🎂 Caketaly</h1>
          <button
            onClick={() => navigate('/novo')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Novo Pedido
          </button>
        </div>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        {pedidos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Nenhum pedido encontrado.</p>
            <p className="text-sm mt-1">Clique em "Novo Pedido" para começar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{pedido.cliente_nome}</p>
                    <p className="text-sm text-gray-500">{pedido.cliente_telefone}</p>
                    <p className="text-sm text-gray-700 mt-1">{pedido.descricao}</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      R$ {Number(pedido.valor).toFixed(2)} · Entrega: {new Date(pedido.data_entrega).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Badge de status */}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[pedido.status]}`}>
                      {statusLabel[pedido.status]}
                    </span>
                    {/* Select para mudar status */}
                    <select
                      value={pedido.status}
                      onChange={e => handleStatusChange(pedido.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_producao">Em produção</option>
                      <option value="pronto">Pronto</option>
                      <option value="entregue">Entregue</option>
                    </select>
                    <button
                      onClick={() => handleDeletar(pedido.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}