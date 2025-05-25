'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '/assets/Logo.png';
import ArquivoNaoEncontrado from '/assets/arquivo_nao_encontrado.jpg';
import AddFileModal from '../../components/AddFileModal/AddFileModal';
import AddPropertyModal from '../../components/AddPropertyModal/AddPropertyModal';
import { IoTrashBinSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const UploadsPage = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false); // Modal de adicionar imóvel
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(15);
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

    const addFile = (fileData: { title: string; observation: string }) => {
        const newFileData = {
            ...fileData,
            date: new Date().toLocaleString(),
        };
        setFiles([...files, newFileData]);
        setModalOpen(false);
    };

    const deleteFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    const handleLogoff = () => {
        console.log("Usuário deslogado");
        router.push('/');
    };

    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Gerar PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Relatório de Arquivos", 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [["Título", "Valor", "Data da Compra", "Imóvel", "Categoria", "Subcategoria"]],
            body: files.map(file => [
                file.title,
                `R$ ${file.value?.toFixed(2)}`,
                file.purchaseDate,
                file.property,
                file.category,
                file.subcategory
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [8, 47, 73],
                textColor: [255, 255, 255],
            },
        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);

        // Remove iframe anterior se existir
        const oldIframe = document.getElementById("printFrame");
        if (oldIframe) oldIframe.remove();

        // Cria um iframe invisível
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        iframe.id = "printFrame";

        document.body.appendChild(iframe);

        // Quando o iframe carregar o PDF, imprime
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            }, 500); // pequeno delay para garantir o carregamento
        };

        iframe.src = blobURL;
    };

    return (
        <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans', sans-serif]">
            {/* Header */}
            <header className="bg-sky-900 shadow-lg p-6 flex justify-between items-center rounded-br-4xl">
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

            {/* Corpo */}
            <div className="flex">
                {/* Menu lateral */}
                <aside className="w-60 bg-[#0c4a6e] min-h-screen p-4 shadow-2xl">
                    <nav className="flex flex-col space-y-2">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition"
                        >
                            Adicionar Arquivo
                        </button>
                        <button
                            onClick={() => setPropertyModalOpen(true)} // Abre o modal de adicionar imóvel
                            className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition"
                        >
                            Adicionar Imóvel
                        </button>

                        <button
                            onClick={generatePDF}
                            className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition"
                        >
                            Gerar Relatório
                        </button>
                        <button
                            onClick={() =>
                                window.open(
                                    "https://wa.me/5519999999999?text=Olá! Preciso de ajuda com o sistema.",
                                    "_blank"
                                )
                            }
                            className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition"
                        >
                            Ajuda
                        </button>
                    </nav>
                </aside>

                {/* Conteúdo principal */}
                <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl text-center font-semibold text-sky-900 mb-6">Meus Arquivos</h1>

                        {/* Modais */}
                        {isModalOpen && (
                            <AddFileModal
                                onAddFile={addFile}
                                onClose={() => setModalOpen(false)}
                            />
                        )}
                        {isPropertyModalOpen && (
                            <AddPropertyModal
                                onClose={() => setPropertyModalOpen(false)} // Fechar o modal de adicionar imóvel
                                onAddProperty={() => {
                                    // Ação de adicionar imóvel pode ser vazia se não for necessária
                                    console.log("Imóvel adicionado!");
                                }}
                            />
                        )}


                        {/* Conteúdo */}
                        {files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white p-6">
                                <Image
                                    src={ArquivoNaoEncontrado}
                                    alt="Nenhum arquivo encontrado"
                                    width={160}
                                    height={160}
                                    className="mb-6 opacity-80 h-60 w-60"
                                />
                                <h2 className="text-lg font-semibold text-gray-700 mb-5">Nenhum arquivo encontrado</h2>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    Parece que você ainda não adicionou nenhum arquivo. Clique no botão Asicionar Arquivo para enviar seu primeiro documento.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 bg-[#f3f6f8] shadow-md rounded-lg p-4 overflow-x-auto">
                                <table className="w-full text-left border-collapse text-zinc-800">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2">Título</th>
                                            <th className="border-b p-2">Valor</th>
                                            <th className="border-b p-2">Data da Compra</th>
                                            <th className="border-b p-2">Imóvel</th>
                                            <th className="border-b p-2">Categoria</th>
                                            <th className="border-b p-2">Subcategoria</th>
                                            <th className="border-b p-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFiles.map((file, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border-b p-2">{file.title}</td>
                                                <td className="border-b p-2">R$ {file.value?.toFixed(2)}</td>
                                                <td className="border-b p-2">{file.purchaseDate}</td>
                                                <td className="border-b p-2">{file.property}</td>
                                                <td className="border-b p-2">{file.category}</td>
                                                <td className="border-b p-2">{file.subcategory}</td>
                                                <td className="border-b p-2">
                                                    <button
                                                        onClick={() => deleteFile(index)}
                                                        className="text-red-600 hover:text-red-800 ml-3"
                                                    >
                                                        <IoTrashBinSharp size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Paginação */}
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2 text-gray-700">
                                        Página {currentPage}
                                    </span>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage * filesPerPage >= files.length}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UploadsPage;
