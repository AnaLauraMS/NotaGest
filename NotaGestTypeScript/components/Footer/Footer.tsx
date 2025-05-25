import React from 'react';
import Image from 'next/image';
import Logo from '../../assets/Logo.png';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#0c4a6e] text-white px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Seção 1: Logo e texto institucional */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <Image
            src={Logo}
            alt="Logo Farj-Br"
            width={150}
            height={80}
            className="mb-4"
            priority
            sizes="(max-width: 768px) 100px, 150px"
          />
          <p className="text-sm max-w-xs leading-relaxed">
            Simplifique sua gestão documental, proteja o meio ambiente e organize seu futuro. Juntos, rumo a um amanhã mais sustentável.
          </p>
        </div>

        {/* Seção 2: Redes sociais */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Conecte-se</h3>
          <div className="flex space-x-5">
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-2xl hover:text-[#e1306c] transition-colors duration-300" />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebook className="text-2xl hover:text-[#1877f2] transition-colors duration-300" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter className="text-2xl hover:text-[#1da1f2] transition-colors duration-300" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin className="text-2xl hover:text-[#0077b5] transition-colors duration-300" />
            </a>
            <a href="mailto:contato@farjbr.com" aria-label="Email">
              <MdEmail className="text-2xl hover:text-[#d44638] transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Seção 3: Missão */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <h3 className="text-lg font-semibold mb-2">Nossa missão</h3>
          <p className="text-sm max-w-xs leading-relaxed">
            Promover a sustentabilidade por meio da digitalização de documentos e incentivar práticas conscientes na construção civil e no dia a dia.
          </p>
        </div>
      </div>

      {/* Direitos autorais */}
      <div className="mt-10 text-center">
        <p className="text-sm">© 2024 Farj-Br</p>
        <p className="text-xs mt-1">Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
