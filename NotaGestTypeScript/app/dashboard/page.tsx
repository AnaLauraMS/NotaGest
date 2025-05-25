'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '/assets/Logo.png';
import GastosChart from '../../components/Graphics/Graphics';
import Table from '../../components/Table/Table';
import { IoTrashBinSharp } from 'react-icons/io5';
import Link from 'next/link';

const DashboardPage = () => {
  const [showMenu, setShowMenu] = useState(false); // Controle do menu dropdown
  const menuRef = useRef(null);
  const router = useRouter();

  const user = {
    name: "Nome do Usuário",
    profileImage: "/path/to/default/profile/image.jpg"
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogoff = () => {
    console.log("Usuário deslogado");
    router.push('/');
  };

  const navigateToUploads = () => {
    router.push('/uploads'); // Redireciona para a página de uploads
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Plus_Jakarta_Sans', sans-serif]">
      {/* Header */}
      <header className="bg-sky-900 shadow-md p-6 flex justify-between items-center">
        <Image src={Logo} alt="Logo da Empresa" width={200} height={100} />
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} className="flex items-center">
            <MdAccountCircle className="text-white text-3xl" />
            <span className="text-white ml-2">{user.name}</span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <button
                onClick={handleLogoff}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Corpo com menu lateral e conteúdo */}
      <div className="flex">
        {/* Menu lateral */}
        <aside className="w-60 bg-gray-200 min-h-screen p-4">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={navigateToUploads} // Adiciona a navegação para /uploads
              className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition"
            >
              Adicionar Arquivo
            </button>
            <button className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
              Adicionar Imóvel
            </button>
            <Link href="/dashboard" className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
              Dashboard
            </Link>
            <button className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
              Gerar Relatório
            </button>
            <button className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
              Ajuda
            </button>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="mt-25 ml-8 ">
          {/* Gráficos e Tabela */}
          <div className="flex flex-row justify-center gap-6 align-center">
            {/* Gráfico */}
            <div className="align-center w-1/2 bg-white shadow-md rounded-lg p-4">                                
              <GastosChart />
            </div>

            {/* Tabela */}
            <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
              <Table data={[{ property: 'Casa Jardim América', noteCount: 5 }, { property: 'Obra Centro', noteCount: 3 }, { property: 'Sítio São João', noteCount: 7 }]} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
