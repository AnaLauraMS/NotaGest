'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
// Importe o useSearchParams para ler a URL
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '/assets/Logo.png';
import ArquivoNaoEncontrado from '/assets/arquivo_nao_encontrado.jpg';
import AddFileModal from '../../components/AddFileModal/AddFileModal';
import AddPropertyModal, { NewPropertyPayload } from '../../components/AddPropertyModal/AddPropertyModal';
import PropertyManagerModal from '../../components/PropertyManagerModal/PropertyManagerModal';
import { IoTrashBinSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';
import api from '../../utils/api';

// --- (Sua tipagem e a função decodeJwt permanecem iguais) ---
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

type Arquivo = {
    _id: string;
    title: string;
    value: number;
    purchaseDate: string;
    property: string;
    category: string;
    subcategory: string;
    observation?: string;
    filePath?: string;
};

function decodeJwt(token: string): { id: string, email: string, [key: string]: any } {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT", e);
        return { id: '', email: '' };
    }
}
// --- FIM DA SEÇÃO ---


const UploadsPage = () => {
    // --- (Seus estados permanecem os mesmos) ---
    const [files, setFiles] = useState<Arquivo[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(15);
    const menuRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [selectedPropertyName, setSelectedPropertyName] = useState<string | null>(null);
    // --- FIM ESTADOS ---

    // --- (Suas funções auxiliares handleLogoff e fetchData permanecem as mesmas) ---
    const handleLogoff = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        router.push('/');
    }, [router]);

    const fetchData = useCallback(async () => {
        const filesEndpoint = selectedPropertyName
            ? `/api/uploads?propertyId=${selectedPropertyName}`
            : '/api/uploads';
        try {
            const filesPromise = api.get(filesEndpoint);
            const propertiesPromise = api.get('/api/imoveis');
            const [filesResponse, propertiesResponse] = await Promise.all([
                filesPromise,
                propertiesPromise
            ]);
            setFiles(filesResponse.data);
            setProperties(propertiesResponse.data);
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            if (axios.isAxiosError(error)) {
                // O log "Falha ao buscar dados: K" vem daqui. 
                // O "K" é prov. de (error.message) ou (error.response.data.message)
                alert(`Erro: ${error.response?.data?.message || error.message || 'Falha ao carregar dados.'}`);
                if (error.response?.status === 401) {
                    handleLogoff();
                }
            }
        }
    }, [selectedPropertyName, handleLogoff]);
    // --- FIM FUNÇÕES AUXILIARES ---


    // --- [MUDANÇA PRINCIPAL AQUI] ---
    // Substitua TODOS os seus blocos useEffect por este ÚNICO bloco.
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        let effectiveToken = localStorage.getItem('authToken');
        let effectiveEmail = localStorage.getItem('userEmail');

        if (tokenFromUrl) {
            // CASO 1: Token encontrado na URL (novo login)
            console.log("Token da URL encontrado, processando...");
            try {
                // Salva tudo no localStorage
                localStorage.setItem('authToken', tokenFromUrl);
                const { id, email } = decodeJwt(tokenFromUrl);
                localStorage.setItem('userId', id);
                localStorage.setItem('userEmail', email);

                // Define as variáveis para este render
                effectiveToken = tokenFromUrl;
                effectiveEmail = email;

                // Limpa a URL (remove o token)
                router.replace('/uploads', { scroll: false });
            } catch (e) {
                console.error("Token da URL é inválido", e);
                handleLogoff(); // Desloga se o token for ruim
                return; // Para a execução
            }
        }

        // AGORA, verificamos se temos um token (seja da URL ou do storage)
        if (effectiveToken) {
            // CASO 2: Temos um token. Configure a UI e busque os dados.
            setUserEmail(effectiveEmail);
            fetchData(); // SÓ CHAMAMOS O FETCHDATA AQUI
        } else {
            // CASO 3: Sem token na URL e sem token no storage.
            console.log("Nenhum token encontrado, redirecionando para logoff.");
            handleLogoff();
        }

    }, [searchParams, router, handleLogoff, fetchData]); // Dependências
    // --- [FIM DA MUDANÇA PRINCIPAL] ---


    // --- (O restante do seu arquivo: addFile, deleteFile, generatePDF, e todo o JSX) ---
    // --- (Permanece exatamente o mesmo) ---

    const addFile = async (fileData: NewFilePayload, file: File | null) => {
        let uploadedFilePath: string | undefined = undefined;

        if (file) {
            console.log("Tentando fazer upload do arquivo:", file.name);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const uploadResponse = await api.post('/api/uploadfile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedFilePath = uploadResponse.data.filePath;
                console.log("Arquivo enviado, caminho:", uploadedFilePath);
            } catch (uploadError) {
                console.error("Erro no UPLOAD do arquivo:", uploadError);
                if (axios.isAxiosError(uploadError) && uploadError.response) {
                    alert(`Erro ao enviar arquivo: ${uploadError.response.data.message || 'Falha no upload.'}`);
                } else {
                    alert('Erro inesperado ao enviar arquivo.');
                }
                return;
            }
        }

        try {
            const response = await api.post('/api/uploads', {
                ...fileData,
                filePath: uploadedFilePath
            });
            setFiles(prevFiles => [response.data, ...prevFiles]);
            setModalOpen(false);
            alert('Nota fiscal adicionada com sucesso!');
        } catch (metadataError) {
            console.error("Erro ao salvar METADADOS:", metadataError);
            if (axios.isAxiosError(metadataError) && metadataError.response) {
                alert(`Erro ao salvar dados: ${metadataError.response.data.message || 'Falha ao salvar.'}`);
            } else {
                alert('Erro inesperado ao salvar dados.');
            }
        }
    };

    const handleViewFile = async (filePath: string | undefined) => {
        if (!filePath) {
            alert("Este registro não possui arquivo anexado.");
            return;
        }

        const fileServerUrl = `/uploads/${filePath}`;
        try {
            const response = await api.get(fileServerUrl, {
                responseType: 'blob',
            });
            const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = URL.createObjectURL(fileBlob);
            window.open(blobUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error("Erro ao visualizar/baixar arquivo:", error);
            if (axios.isAxiosError(error) && error.response) {
                try {
                    const errorBlob = error.response.data as Blob;
                    const errorText = await errorBlob.text();
                    const errorJson = JSON.parse(errorText);
                    alert(`Erro ${error.response.status}: ${errorJson.message || 'Não foi possível buscar o arquivo.'}`);
                } catch {
                    alert(`Erro ${error.response.status}: Falha ao buscar o arquivo.`);
                }
            } else {
                alert('Ocorreu um erro inesperado ao buscar o arquivo.');
            }
        }
    };

    const deleteFile = async (fileId: string) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir este arquivo?")) return;
            await api.delete(`/api/uploads/${fileId}`);
            setFiles(files.filter(file => file._id !== fileId));
            alert('Arquivo removido com sucesso!');
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            if (axios.isAxiosError(error)) {
                alert(`Erro: ${error.response?.data?.message || 'Não foi possível deletar o arquivo.'}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const handleAddProperty = async (propertyData: NewPropertyPayload) => {
        try {
            const response = await api.post('/api/imoveis', propertyData);
            const newProperty = response.data;
            setProperties(prev => [newProperty, ...prev]);
            setPropertyModalOpen(false);
            alert('Imóvel adicionado com sucesso!');
        } catch (error) {
            console.error("Erro ao adicionar imóvel:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Erro ${error.response.status}: ${error.response.data.message}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
            await api.delete(`/api/imoveis/${propertyId}`);
            setProperties(prev => prev.filter(p => p._id !== propertyId));
            alert('Imóvel excluído com sucesso!');
        } catch (error) {
            console.error("Erro ao deletar imóvel:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Erro: ${error.response.data.message}`);
            } else {
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
                new Date(file.purchaseDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                file.property,
                file.category,
                file.subcategory
            ]),
        });

        const blob = doc.output("blob");
        const blobURL = URL.createObjectURL(blob);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = blobURL;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            iframe.contentWindow?.print();
        };
    };

    return (
        <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans', sans-serif]">
            <header className="bg-sky-900 shadow-lg p-6 flex justify-between items-center rounded-br-4xl">
                <Link href="http://localhost:3000/">
                    <Image
                        src={Logo}
                        alt="Logo da Empresa"
                        width={200}
                        height={100}
                        className="cursor-pointer hover:opacity-90 transition"
                    />
                </Link>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center">
                        <MdAccountCircle className="text-white text-3xl" />
                        <span className="text-white ml-2 cursor-pointer">{userEmail}</span>
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

            <div className="flex">
                <aside className="w-60 bg-[#0c4a6e] min-h-screen p-4 shadow-2xl">
                    <nav className="flex flex-col space-y-2">
                        <button onClick={() => setModalOpen(true)} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Adicionar Arquivo</button>
                        <button onClick={() => setPropertyModalOpen(true)} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Adicionar Imóvel</button>
                        <button onClick={generatePDF} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Gerar Relatório</button>
                        <button onClick={() => setIsPropertyMenuOpen(true)} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Gerenciar Imóveis</button>
                        <button onClick={() => window.open("https://wa.me/5519999999999?text=Olá! Preciso de ajuda com o sistema.", "_blank")} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Ajuda</button>
                    </nav>
                </aside>

                <main className="flex-1 p-6 flex flex-col gap-6">

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                        <label htmlFor="property-filter" className="text-sky-900 font-bold text-lg whitespace-nowrap">Filtrar Arquivos por Imóvel:</label>
                        <select
                            id="property-filter"
                            value={selectedPropertyName || ''}
                            onChange={(e) => setSelectedPropertyName(e.target.value || null)}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm w-full sm:w-60"
                        >
                            <option value="">Todos os Imóveis</option>
                            {properties.map(p => (
                                <option key={p._id} value={p.nome}>{p.nome}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setSelectedPropertyName(null)}
                            className="text-sm text-gray-500 hover:text-red-600 underline transition"
                        >
                            Limpar Filtro
                        </button>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl text-center font-semibold text-sky-900 mb-6">
                            Meus Arquivos {selectedPropertyName ? `(Filtrado por: ${selectedPropertyName})` : ''}
                        </h1>

                        {isModalOpen && <AddFileModal onAddFile={addFile} onClose={() => setModalOpen(false)} properties={properties} />}
                        {isPropertyModalOpen && <AddPropertyModal onClose={() => setPropertyModalOpen(false)} onAddProperty={handleAddProperty} />}
                        {isPropertyMenuOpen && <PropertyManagerModal properties={properties} onClose={() => setIsPropertyMenuOpen(false)} onDeleteProperty={handleDeleteProperty} />}

                        {files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white p-6">
                                <Image src={ArquivoNaoEncontrado} alt="Nenhum arquivo encontrado" width={160} height={160} className="mb-6 opacity-80 h-60 w-60" />
                                <h2 className="text-lg font-semibold text-gray-700 mb-5">Nenhum arquivo encontrado</h2>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    {selectedPropertyName
                                        ? `Não há arquivos registrados para o imóvel "${selectedPropertyName}".`
                                        : 'Parece que você ainda não adicionou nenhum arquivo. Clique no botão Adicionar Arquivo para enviar seu primeiro documento.'
                                    }
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
                                        {currentFiles.map((file) => (
                                            <tr key={file._id} className="hover:bg-gray-100">
                                                <td className="border-b p-2">{file.title}</td>
                                                <td className="border-b p-2">R$ {file.value?.toFixed(2)}</td>
                                                <td className="border-b p-2">
                                                    {new Date(file.purchaseDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                </td>
                                                <td className="border-b p-2">{file.property}</td>
                                                <td className="border-b p-2">{file.category}</td>
                                                <td className="border-b p-2">{file.subcategory}</td>
                                                <td className="border-b p-2 flex items-center gap-3">
                                                    {file.filePath && (
                                                        <button onClick={() => handleViewFile(file.filePath)} className="text-blue-600 hover:text-blue-800" title="Visualizar Arquivo">
                                                            👁️
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteFile(file._id)} className="text-red-600 hover:text-red-800" title="Excluir Registro">
                                                        <IoTrashBinSharp size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-4">
                                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400">
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2 text-gray-700">Página {currentPage}</span>
                                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * filesPerPage >= files.length} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400">
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