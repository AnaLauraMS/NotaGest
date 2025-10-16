// utils/authService.ts

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

interface RegisterData {
    nome: string;
    email: string;
    senha: string;
}

interface LoginResponse {
    error: string;
    token: string;
    message: string;
}

/**
 * Chama o Microsserviço de Identidade (5001) para registrar um novo usuário.
 * Retorna a mensagem de sucesso ou lança um erro.
 */
export async function registerUser({ nome, email, senha }: RegisterData): Promise<string> {
    if (!AUTH_URL) throw new Error("URL do serviço de autenticação não configurada.");

    // Faz a chamada de API usando fetch
    const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
        // Lança o erro para ser capturado no componente de UI
        const errorMessage = data.error || data.message || "Erro desconhecido ao cadastrar.";
        throw new Error(errorMessage);
    }
    
    return data.message;
}

/**
 * Chama o Microsserviço de Identidade (5001) para fazer login.
 * Retorna o token e a mensagem, ou lança um erro.
 */
export async function loginUser(email: string, senha: string): Promise<LoginResponse> {
    if (!AUTH_URL) throw new Error("URL do serviço de autenticação não configurada.");

    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || "Erro desconhecido no login.");
    }
    
    return data;
}

// Auxiliar para decodificar o ID do token (Útil para salvar o ID do usuário logado)
export function decodeJwt(token: string): { id: string, email: string } {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT", e);
        return { id: '', email: '' };
    }
}