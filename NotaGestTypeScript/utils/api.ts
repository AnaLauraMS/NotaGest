// lib/api.ts

import axios from 'axios';

// Cria uma instância do Axios configurada com a URL base do backend
const api = axios.create({
    // Usa a variável de ambiente para definir o endereço do servidor
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
});

/**
 * Interceptor de Requisição.
 * Adiciona o token JWT (se existir no armazenamento local) a cada requisição enviada.
 * Isso garante que todas as chamadas para rotas protegidas sejam autenticadas automaticamente.
 */
api.interceptors.request.use(
    (config) => {
        // Tenta obter o token de autenticação do armazenamento do navegador
        const token = localStorage.getItem('authToken');
        
        // Se o token for encontrado, ele é injetado no cabeçalho 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Permite que a requisição prossiga com a configuração atualizada
        return config; 
    },
    (error) => {
        // Trata ou repassa erros que ocorrerem antes do envio da requisição
        return Promise.reject(error);
    }
);

// Exporta a instância da API para ser usada em toda a aplicação frontend
export default api;