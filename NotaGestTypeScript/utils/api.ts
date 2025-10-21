// lib/api.ts

import axios from 'axios';

// 1. Cria uma instância do Axios com a URL base do seu backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
});

// 2. Interceptor: Uma função que é executada ANTES de cada requisição
// Isso é perfeito para adicionar o token de autenticação dinamicamente
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    
    // Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Retorna a configuração para a requisição continuar
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default api;