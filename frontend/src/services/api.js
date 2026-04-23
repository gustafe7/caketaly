import axios from 'axios';

// Instância do axios apontando para o backend FastAPI
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export default api;