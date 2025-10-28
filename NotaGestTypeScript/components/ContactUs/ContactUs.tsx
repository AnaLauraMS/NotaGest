"use client";
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
    <div className="flex flex-col justify-center items-center w-full bg-[#0c4a6e] font-[Plus Jakarta Sans] py-16 px-4" id="contact-us-section">
      <h2 className="text-4xl text-white mb-10 font-bold">Fale Conosco</h2>
      
      {/* Container principal do formulário com largura máxima para desktop */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xl">
        
        {/* Campo de nome */}
        <div className="mb-5 w-full">
          <label htmlFor="name" className="sr-only">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder='Nome'
            value={formData.name}
            onChange={handleChange}
            required
            // w-full para ser responsivo, com padding e bordas arredondadas
            className="bg-white w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669] transition duration-200"
          />
        </div>
        
        {/* Campo de email */}
        <div className="mb-5 w-full">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669] transition duration-200"
          />
        </div>
        
        {/* Campo de telefone */}
        <div className="mb-5 w-full">
          <label htmlFor="phone" className="sr-only">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder='Telefone'
            value={formData.phone}
            onChange={handleChange}
            required
            className="bg-white w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669] transition duration-200"
          />
        </div>
        
        {/* Campo de mensagem */}
        <div className="mb-8 w-full">
          <label htmlFor="message" className="sr-only">Mensagem</label>
          <textarea
            id="message"
            name="message"
            placeholder='Mensagem'
            value={formData.message}
            onChange={handleChange}
            required
            rows={5} // Aumenta a altura para melhor usabilidade
            className="bg-white w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669] transition duration-200 resize-none"
          />
        </div>

        {/* Botão de envio do formulário (w-full para ser responsivo) */}
        <button 
          type="submit" 
          className="w-full p-3 bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 hover:bg-[#06a774] shadow-md">
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
};

export default ContactUs;