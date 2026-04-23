import api from "./api";

// Busca todos os pedidos
export const listarPedidos = async () => {
    const response = await api.get('/pedidos/');
    return response.data;
};

// Busca um pedido pelo ID
export const buscarPedido = async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
};

// Cria um novo pedido
export const criarPedido = async (pedido) => {
    const response = await api.post('/pedidos/', pedido);
    return response.data;
};

export const atualizarPedido = async (id, dados) => {
    const response = await api.patch(`/pedidos/${id}`, dados);
    return response.data;
};

// Remove um pedido
export const deletarPedido = async (id) => {
    await api.delete(`/pedidos/${id}`);
};