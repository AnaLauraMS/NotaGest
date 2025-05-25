import React from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Image from 'next/image';
import Logo from '../../assets/Logo.png'; // Importe do logo da empresa

const Header: React.FC = () => {
  return (
    <header className=" bg-[#0c4a6e] font-[Plus Jakarta Sans, sans-serif] h-16 flex items-center justify-between px-6 py-4 md:px-20">
      {/* Logo da empresa */}
      <Image 
        src={Logo} 
        alt="Logo da Empresa" 
        className="max-w-[10%] ml-[10%]" 
        width={180} 
        height={100} 
      />

      {/* Navegação principal */}
      <nav>
        <ul className="flex items-center gap-8 text-white p-4 rounded-lg transition duration-300">
          
          {/* Link para a seção Home da página */}
          <li className="cursor-pointer">
            <ScrollLink to="home" smooth={true} duration={500}>
              Home
            </ScrollLink>
          </li>

          {/* Link para a seção Dicas */}
          <li className="cursor-pointer">
            <ScrollLink to="tips" smooth={true} duration={500}>
              Dicas
            </ScrollLink>
          </li>

          {/* Link para a seção Como Funciona */}
          <li className="cursor-pointer">
            <ScrollLink to="how-it-work-section" smooth={true} duration={500}>
              Como Funciona
            </ScrollLink>
          </li>

          {/* Link para a seção Sobre Nós */}
          <li className="cursor-pointer">
            <ScrollLink to="about-us-section" smooth={true} duration={500}>
              Sobre Nós
            </ScrollLink>
          </li>

          {/* Link para a seção FAQ */}
          <li className="cursor-pointer">
            <ScrollLink to="faq-section" smooth={true} duration={500}>
              FAQ
            </ScrollLink>
          </li>

          {/* Botão de login (link para a rota /login) */}
          <li className="cursor-pointer">
            <Link href="/login" className="bg-[#fde047] text-black py-2 px-3 rounded-md transition duration-300 hover:opacity-80">
              Login
            </Link>
          </li>

          {/* Botão de cadastro (link para a rota /register) */}
          <li>
            <Link href="/register" className="bg-[#25aff0] text-black py-2 px-3 rounded-md transition duration-300 hover:opacity-80">
              Cadastre-se
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
