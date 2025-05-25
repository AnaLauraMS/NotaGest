"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer/Footer';

type Credentials = {
  email: string;
  senha: string;
};

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    senha: '',
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Credenciais do usuário:', credentials);
    if (credentials.email && credentials.senha) {
      router.push('/uploads');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

   return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Faixa superior azul */}
      <div className="w-full h-[30vh] bg-sky-900" />

      {/* Card do login */}
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
                className="text-black bg-[#fde047] px-4 py-2 rounded transition duration-300 border-none mb-4 hover:bg-yellow-500 hover:scale-105 cursor-pointer"
              >
                Login
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="text-black px-4 py-2 rounded transition duration-300 border-none bg-gray-300 mb-2 hover:bg-gray-400 hover:scale-105 cursor-pointer" 
              >
                Voltar para a Home
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Faixa azul no rodapé */}
      <div className="w-full h-20 bg-sky-900 mt-10" />
    </div>
  );
};

export default Login;