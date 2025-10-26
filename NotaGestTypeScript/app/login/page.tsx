'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginUser, decodeJwt } from '../../utils/authService';

type Credentials = {
  email: string;
  senha: string;
};

type MessageType = 'success' | 'error';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    senha: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: MessageType } | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const showToast = (msg: string, type: MessageType) => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, message } = await loginUser(credentials.email, credentials.senha);

      localStorage.setItem('authToken', token);
      const { id, email } = decodeJwt(token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userEmail', email);
      showToast(message, 'success');

      setTimeout(() => {
        router.push('/uploads');
      }, 500);
    } catch (err: any) {
      console.error("Erro de Login:", err);
      const errorMessage = err.message || 'Erro ao conectar com o servidor.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Faixa superior azul */}
      <div className="w-full h-[30vh] bg-sky-900" />

      {/* Toast de mensagem */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg transition-all duration-300 z-50 ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toastMessage.msg}
        </div>
      )}

      {/* Card de login */}
      <main className="font-['Plus_Jakarta_Sans',sans-serif] w-full max-w-sm mx-auto bg-[#FAFAFC] p-6 rounded-t-lg -mt-16 relative shadow-lg z-10">
        <section>
          <div className="text-center">
            <h1 className="my-5 text-gray-600 text-2xl font-semibold">Login</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                name="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-sky-600"
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <input
                name="senha"
                id="senha"
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-sky-600"
                type="password"
                placeholder="Senha"
                value={credentials.senha}
                onChange={handleChange}
                required
              />
            </div>

            <a
              href="/forgot-password"
              className="block text-right underline text-sm mt-1 hover:text-gray-700"
            >
              Esqueceu a senha?
            </a>

            <div className="flex flex-col mt-6">
              <button
                type="submit"
                className="text-black bg-[#fde047] px-4 py-2 rounded transition duration-300 border-none mb-3 hover:bg-yellow-500 hover:scale-105 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Login'}
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="text-black px-4 py-2 rounded transition duration-300 border-none bg-gray-300 mb-3 hover:bg-gray-400 hover:scale-105 cursor-pointer"
              >
                Voltar para a Home
              </button>

              {/* Novo botão de cadastro */}
              <button
                type="button"
                onClick={handleGoRegister}
                className="text-white px-4 py-2 rounded transition duration-300 border-none bg-sky-700 hover:bg-sky-800 hover:scale-105 cursor-pointer"
              >
                Criar conta
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Faixa azul inferior */}
      <div className="w-full h-20 bg-sky-900 mt-10" />
    </div>
  );
};

export default Login;
