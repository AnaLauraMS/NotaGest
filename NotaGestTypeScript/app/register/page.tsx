'use client'; 
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '', 
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não correspondem.'); 
      setSuccessMessage('');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
        setError('');
        setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
        setTimeout(() => {
          router.push('/');
        }, 2000); // aguarda 2 segundos antes de redirecionar
      } else {
        setError(data.error || 'Erro ao criar usuário');
        setSuccessMessage('');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
      setSuccessMessage('');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Faixa superior azul */}
      <div className="w-full h-[20vh] bg-sky-900" />

      {/* Card do cadastro */}
      <main className="font-['Plus_Jakarta_Sans'] w-full max-w-sm mx-auto bg-[#FAFAFC] p-6 rounded-lg shadow-md -mt-18 z-10 relative">
        <section className="flex flex-col gap-3">
          <div>
            <h1 className="text-center text-gray-700 text-2xl font-semibold mt-4 mb-2">Cadastre-se</h1>
          </div>

          {/* Mensagem de sucesso */}
          {successMessage && (
            <div className="text-green-700 bg-green-100 border border-green-400 p-3 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="text-red-700 bg-red-100 border border-red-400 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

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
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[ !@#$%^&*_=+-]).{6,12}$"
                title="A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos."
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
              className="bg-[#fde047] hover:bg-yellow-400 transition transform hover:scale-105 text-black py-2 rounded cursor-pointer"
            >
              Cadastrar
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
