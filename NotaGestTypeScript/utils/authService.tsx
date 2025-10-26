// utils/authService.ts

// URL base para o Microsserviço de Identidade (Auth Service)
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

// Interface para os dados necessários no registro
interface RegisterData {
    nome: string;
    email: string;
    senha: string;
}

// Interface para a resposta esperada da rota de login
interface LoginResponse {
    error: string;
    token: string;
    message: string;
}

/**
 * @function registerUser
 * @description Envia credenciais para o serviço de autenticação para criar uma nova conta.
 * @returns {Promise<string>} Mensagem de sucesso.
 * @throws {Error} Mensagem de erro em caso de falha.
 */
export async function registerUser({ nome, email, senha }: RegisterData): Promise<string> {
    // Verifica a configuração antes de fazer a chamada
    if (!AUTH_URL) throw new Error("URL do serviço de autenticação não configurada.");

    // Faz a chamada de API (POST) para a rota de registro
    const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    // Lida com códigos de resposta HTTP que indicam erro (4xx ou 5xx)
    if (!response.ok) {
        // Lança o erro para ser capturado no componente de UI
        const errorMessage = data.error || data.message || "Erro desconhecido ao cadastrar.";
        throw new Error(errorMessage);
    }
    
    // Retorna a mensagem de sucesso
    return data.message;
}

/**
 * @function loginUser
 * @description Envia credenciais para o serviço de autenticação para obter um token JWT.
 * @returns {Promise<LoginResponse>} Objeto contendo o token de sessão.
 * @throws {Error} Mensagem de erro em caso de credenciais inválidas ou falha na API.
 */
export async function loginUser(email: string, senha: string): Promise<LoginResponse> {
    // Verifica a configuração
    if (!AUTH_URL) throw new Error("URL do serviço de autenticação não configurada.");

    // Faz a chamada de API (POST) para a rota de login
    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data: LoginResponse = await response.json();

    // Lida com falhas de login ou de servidor
    if (!response.ok) {
        throw new Error(data.error || data.message || "Erro desconhecido no login.");
    }
    
    // Retorna o token e a mensagem de sucesso
    return data;
}

/**
 * @function decodeJwt
 * @description Decodifica o payload de um JWT localmente (sem verificar a assinatura).
 * Útil para extrair o ID do usuário e o email do token no frontend.
 * @param {string} token - O JWT completo.
 * @returns {{ id: string, email: string }} Objeto com o ID e o email do usuário.
 */
export function decodeJwt(token: string): { id: string, email: string } {
    try {
        // Separa o token nas três partes (header.payload.signature)
        const base64Url = token.split('.')[1];
        // Converte a string base64url para base64 padrão
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decodifica a base64 e o JSON
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT", e);
        // Retorna um objeto vazio em caso de falha
        return { id: '', email: '' };
    }
}