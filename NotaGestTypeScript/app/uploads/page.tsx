'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '/assets/Logo.png';
import ArquivoNaoEncontrado from '/assets/arquivo_nao_encontrado.jpg';
import AddFileModal from '../../components/AddFileModal/AddFileModal';
import AddPropertyModal from '../../components/AddPropertyModal/AddPropertyModal';
import { NewPropertyPayload } from '../../components/AddPropertyModal/AddPropertyModal';
import PropertyManagerModal from '../../components/PropertyManagerModal/PropertyManagerModal';
import { IoTrashBinSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';
import api from '../../utils/api';

type Property = {
    _id: string;
    nome: string;
    user: string;
};

type NewFilePayload = {
    title: string;
    value: number;
    purchaseDate: string;
    property: string;
    category: string;
    subcategory: string;
    observation?: string;
};

// (Opcional, mas recomendado) Crie um tipo para o arquivo que vem da API
type Arquivo = {
    _id: string;
    title: string;
    value: number;
    purchaseDate: string;
    property: string;
    category: string;
    subcategory: string;
    observation?: string;
};

const UploadsPage = () => {
    const [files, setFiles] = useState<Arquivo[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(15);
    const menuRef = useRef(null);
    const router = useRouter();
    const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) { // Só atualiza se encontrar algo
            setUserEmail(storedEmail);
        }
        const fetchData = async () => {
            try {
                const filesPromise = api.get('/uploads');
                const propertiesPromise = api.get('/imoveis');
                const [filesResponse, propertiesResponse] = await Promise.all([
                    filesPromise,
                    propertiesPromise
                ]);
                setFiles(filesResponse.data);
                setProperties(propertiesResponse.data);
            } catch (error) {
                console.error("Falha ao buscar dados:", error);
                if (axios.isAxiosError(error)) {
                    alert(`Erro: ${error.response?.data?.message || 'Falha ao carregar dados.'}`);
                    // Considerar deslogar se o erro for 401 aqui também
                    if (error.response?.status === 401) {
                        handleLogoff(); // Chama a função de logoff se a busca falhar por autenticação
                    }
                }
            }
        };
        fetchData();
    }, []);

    const addFile = async (fileData: NewFilePayload) => {
        try {
            const response = await api.post('/uploads', fileData);
            setFiles([response.data, ...files]);
            setModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar arquivo:", error);
            if (axios.isAxiosError(error)) {
                alert(`Erro: ${error.response?.data?.message || 'Não foi possível adicionar o arquivo.'}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const deleteFile = async (fileId: string) => {
        try {
            // Asks for confirmation before deleting
            if (!window.confirm("Tem certeza que deseja excluir este arquivo?")) {
                return; // Stop if the user clicks "Cancel"
            }

            await api.delete(`/uploads/${fileId}`);

            // Remove the file from the state to update the UI instantly
            setFiles(files.filter(file => file._id !== fileId));
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            if (axios.isAxiosError(error)) {
                alert(`Erro: ${error.response?.data?.message || 'Não foi possível deletar o arquivo.'}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    // Dentro do componente UploadsPage

    const handleAddProperty = async (propertyData: NewPropertyPayload) => { // Aceita o objeto completo
        console.log("➡️ Dados do imóvel a serem enviados:", propertyData);
        try {
            const response = await api.post('/imoveis', propertyData);
            const newProperty = response.data;

            // Atualiza o estado local (garanta que o tipo 'Property' aqui inclua todos os campos, se necessário)
            setProperties(prevProperties => [newProperty, ...prevProperties]);

            setPropertyModalOpen(false); // Fecha o modal no sucesso
            alert('Imóvel adicionado com sucesso!');

        } catch (error) {
            console.error("Erro ao adicionar imóvel:", error);
            if (axios.isAxiosError(error) && error.response) {
                const backendMessage = error.response.data.message || 'Erro desconhecido do backend.';
                const errorDetails = error.response.data.errorDetails;
                alert(`Erro ${error.response.status}: ${backendMessage}\n${errorDetails ? `Detalhes: ${errorDetails}` : ''}`);
            } else {
                alert('Ocorreu um erro inesperado ao conectar com o servidor.');
            }
        }
    };

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir este imóvel? Todos os arquivos associados a ele precisarão ser reassociados.")) {
                return;
            }

            // Chama a API de delete do backend
            await api.delete(`/imoveis/${propertyId}`);

            // Remove o imóvel do estado local
            setProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));

            alert('Imóvel excluído com sucesso!');

            // (Opcional: Você pode querer fechar o modal ou não após a exclusão)
            // setIsPropertyMenuOpen(false); 

        } catch (error) {
            console.error("Erro ao deletar imóvel:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Erro: ${error.response.data.message || 'Não foi possível excluir o imóvel.'}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const handleLogoff = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
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
                        <span className="text-white ml-2">{userEmail}</span>
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
                            onClick={() => setIsPropertyMenuOpen(true)}
                            className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition"
                        >
                            Gerenciar Imóveis
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
                                properties={properties}
                            />
                        )}
                        {isPropertyModalOpen && (
                            <AddPropertyModal
                                onClose={() => setPropertyModalOpen(false)}
                                onAddProperty={handleAddProperty}
                            />
                        )}

                        {isPropertyMenuOpen && (
                            <PropertyManagerModal
                                properties={properties}
                                onClose={() => setIsPropertyMenuOpen(false)}
                                onDeleteProperty={handleDeleteProperty}
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
                                            <tr key={file._id} className="hover:bg-gray-100">
                                                <td className="border-b p-2">{file.title}</td>
                                                <td className="border-b p-2">R$ {file.value?.toFixed(2)}</td>
                                                <td className="border-b p-2">{file.purchaseDate}</td>
                                                <td className="border-b p-2">{file.property}</td>
                                                <td className="border-b p-2">{file.category}</td>
                                                <td className="border-b p-2">{file.subcategory}</td>
                                                <td className="border-b p-2">
                                                    <button
                                                        onClick={() => deleteFile(file._id)} // Passar o file._id
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
