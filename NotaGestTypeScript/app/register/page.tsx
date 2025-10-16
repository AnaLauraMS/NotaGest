// app/register/page.tsx (Implementação do Formulário)

'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// Importação do serviço (AJUSTE O CAMINHO SE NECESSÁRIO)
import { registerUser } from '../../utils/authService'; 
import axios from 'axios'; 

type MessageType = 'success' | 'error';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: MessageType } | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToast = (msg: string, type: MessageType) => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      showToast('As senhas não correspondem.', 'error');
      return;
    }

    // 💡 Adicionando a validação do aceite dos termos (presente no seu HTML)
    const aceitouTermos = (document.getElementById('aceite-contrato') as HTMLInputElement)?.checked;
    if (!aceitouTermos) {
        showToast('Você deve aceitar os termos para se cadastrar.', 'error');
        return;
    }

    setIsLoading(true);

    try {
      // 🚨 NOVO CÓDIGO: Chama o serviço (Porta 5001)
      const successMessage = await registerUser({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });

      showToast(successMessage, 'success'); // Mensagem do servidor
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });

      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err: any) {
      // Pega o erro lançado pelo authService
      console.error("Erro de Integração:", err);
      showToast(err.message, 'error'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Faixa superior azul */}
      <div className="w-full h-[20vh] bg-sky-900" />

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

      {/* Card do cadastro */}
      <main className="font-['Plus_Jakarta_Sans'] w-full max-w-sm mx-auto bg-[#FAFAFC] p-6 rounded-lg shadow-md -mt-18 z-10 relative">
        <section className="flex flex-col gap-3">
          <div>
            <h1 className="text-center text-gray-700 text-2xl font-semibold mt-4 mb-2">Cadastre-se</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset className="border-0 p-0 m-0 flex flex-col gap-4">
              <input
                name="nome"
                id="nome"
                className="w-full p-3 border border-gray-300 rounded text-base"
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded text-base"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="senha"
                id="senha"
                className="w-full p-3 border border-gray-300 rounded text-base"
                type="password"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <input
                name="confirmarSenha"
                id="confirmarSenha"
                className="w-full p-3 border border-gray-300 rounded text-base"
                type="password"
                placeholder="Confirme a Senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
              />
            </fieldset>

            <div className="flex items-center gap-2">
              <input
                id="aceite-contrato"
                className="w-5 h-5"
                type="checkbox"
                required
              />
              <label htmlFor="aceite-contrato" className="text-sm text-gray-600">
                Aceito os termos
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#fde047] hover:bg-yellow-400 transition transform hover:scale-105 text-black py-2 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <button
            onClick={handleGoHome}
            className="bg-gray-300 hover:bg-gray-400 transition transform hover:scale-105 text-black py-2 rounded cursor-pointer"
          >
            Voltar para a Home
          </button>
        </section>
      </main>

      {/* Faixa inferior azul */}
      <div className="w-full h-10 bg-sky-900" />
    </div>
  );
};

export default Register;