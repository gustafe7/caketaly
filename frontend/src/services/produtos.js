import api from './api';

// Busca todos os produtos com fotos, sabores, tamanhos e pacotes
export const listarProdutos = async () => {
  const response = await api.get('/produtos/');
  return response.data;
};

// Busca as opções do Monte seu Bolo (massas, recheios, coberturas, extras)
export const listarBoloOpcoes = async () => {
  const response = await api.get('/produtos/bolo-opcoes');
  return response.data;
};
