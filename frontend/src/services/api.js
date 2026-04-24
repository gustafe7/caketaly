import axios from 'axios';

// Instância do axios apontando para o backend FastAPI
const api = axios.create({
  baseURL: 'https://caketaly-production.up.railway.app',
});

export default api;