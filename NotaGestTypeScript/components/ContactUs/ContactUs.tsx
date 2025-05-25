import React, { useState } from 'react';

const ContactUs = () => {
  // Estado inicial do formulário com os campos nome, email, telefone e mensagem
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // handleChange é chamada sempre que um campo do formulário muda.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // name é o nome do campo e value é o valor do campo.
    // Atualiza o estado do formData com base no campo alterado
    setFormData({ ...formData, [name]: value }); 
    // [name]: value: A chave entre colchetes ([name]) permite que você use o valor da variável name como a chave do objeto. 
    // Isso significa que a propriedade correspondente a name no objeto será atualizada para o novo value.
  };

  // handleSubmit é chamada ao enviar o formulário.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita o recarregamento da página ao enviar
    // Aqui adicionar a lógica para enviar os dados para a API ou para o backend.
    console.log('Dados enviados:', formData); // Simula envio imprimindo os dados no console
    // Limpa o formulário após o envio
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // onChange chama handleChange para atualizar o estado sempre que o usuário digita.
  return (
    <div className="flex flex-col justify-center items-center mx-auto w-full bg-[#0c4a6e] font-jakarta py-10 px-4">
      <h2 className="text-4xl text-white mb-15 font-bold">Fale Conosco</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-5">
          {/* Campo de nome */}
          <label htmlFor="name" className="hidden">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder='Nome'
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white w-72 sm:w-[28rem] p-2 border border-gray-300 rounded-md font-jakarta"
          />
        </div>
        <div className="mb-5">
          {/* Campo de email */}
          <label htmlFor="email" className="hidden">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white w-72 sm:w-[28rem] p-2 border border-gray-300 rounded-md font-jakarta"
          />
        </div>
        <div className="mb-5">
          {/* Campo de telefone */}
          <label htmlFor="phone" className="hidden">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder='Telefone'
            value={formData.phone}
            onChange={handleChange}
            required
            className="bg-white w-72 sm:w-[28rem] p-2 border border-gray-300 rounded-md font-jakarta"
          />
        </div>
        <div className="mb-5">
          {/* Campo de mensagem */}
          <label htmlFor="message" className="hidden">Mensagem</label>
          <textarea
            id="message"
            name="message"
            placeholder='Mensagem'
            value={formData.message}
            onChange={handleChange}
            required
            className="bg-white w-72 sm:w-[28rem] p-2 border border-gray-300 rounded-md font-jakarta"
          />
        </div>

        {/* Botão de envio do formulário */}
        <button 
          type="submit" 
          className="w-80 p-2 bg-[#059669] text-white rounded-md transition-all hover:bg-[#06a774]">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
