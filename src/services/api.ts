import axios from 'axios';
import { baseUrl } from './baseURL';

const api = axios.create({
    baseURL:baseUrl,
});

// Intercepta todas as requisições e insere o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studyrat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
