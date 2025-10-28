import React, { useState } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Image from 'next/image';
import Logo from '../../assets/Logo.png'; // Importe do logo da empresa

const Header: React.FC = () => {
  // Estado para controlar a visibilidade do menu em dispositivos móveis
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para alternar o estado do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c4a6e] font-[Plus Jakarta Sans, sans-serif] h-16 flex items-center justify-between px-6 md:px-12 lg:px-20 shadow-md">
      {/* Logo da empresa */}
      <div className="flex items-center">
        <Image 
          src={Logo} 
          alt="Logo da Empresa" 
          // Ajustes nas classes: max-w-full garante que a imagem não extrapole o div pai.
          // w-auto e h-10 (ou outro valor fixo) define um tamanho base que se ajusta.
          className="w-auto h-10 lg:h-12" 
          width={180} // Valores para otimização do Next.js
          height={100} // Valores para otimização do Next.js
          priority 
        />
      </div>

      {/* Botão Hamburguer para Telas Pequenas */}
      <button 
        onClick={toggleMenu} 
        className="text-white md:hidden focus:outline-none"
        aria-label="Abrir Menu"
      >
        {/* Ícone de menu (Hamburguer) ou de fechar (X) */}
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        )}
      </button>

      {/* Navegação principal - Exibida em desktop (md:flex) e condicionalmente em mobile */}
      <nav className={`absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-[#0c4a6e] md:bg-transparent transition-all duration-300 ease-in-out ${isMenuOpen ? 'flex' : 'hidden md:flex'} justify-center`}>
        <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white p-4 md:p-0 w-full md:w-auto">
          
          {/* Links de navegação (ocultos em mobile por padrão) */}
          {[
            { to: 'home', label: 'Home' },
            { to: 'tips', label: 'Dicas' },
            { to: 'how-it-work-section', label: 'Como Funciona' },
            { to: 'about-us-section', label: 'Sobre Nós' },
            { to: 'faq-section', label: 'FAQ' },
          ].map((item) => (
            <li key={item.to} className="cursor-pointer text-center w-full md:w-auto hover:text-[#fde047] transition duration-300">
              <ScrollLink 
                to={item.to} 
                smooth={true} 
                duration={500} 
                onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar em um link
                className="block py-2 md:py-0" // Adiciona padding para facilitar o clique no mobile
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}

          {/* Botões de Ação */}
          <li className="cursor-pointer mt-2 md:mt-0 w-full md:w-auto">
            <Link 
              href="/login" 
              className="block text-center bg-[#fde047] text-black py-2 px-3 rounded-md transition duration-300 hover:opacity-80 mx-4 md:mx-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </li>

          <li>
            <Link 
              href="/register" 
              className="block text-center bg-[#25aff0] text-black py-2 px-3 rounded-md transition duration-300 hover:opacity-80 mt-2 md:mt-0 mb-4 md:mb-0 mx-4 md:mx-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastre-se
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;