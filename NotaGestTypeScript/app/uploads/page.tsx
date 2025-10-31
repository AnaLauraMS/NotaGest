'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdAccountCircle, MdKeyboardArrowRight } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
// Importe o useSearchParams para ler a URL
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '/assets/Logo.png';
import ArquivoNaoEncontrado from '/assets/arquivo_nao_encontrado.jpg';
import AddFileModal from '../../components/AddFileModal/AddFileModal';
import AddPropertyModal, { NewPropertyPayload } from '../../components/AddPropertyModal/AddPropertyModal';
import PropertyManagerModal from '../../components/PropertyManagerModal/PropertyManagerModal';
import { IoTrashBinSharp, IoEyeSharp } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';
import api from '../../utils/api';

// --- TIPAGEM ---
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
// --- FIM TIPAGEM ---

// --- [NOVO BLOCO 1/2] ---
/**
 * @function decodeJwt
 * @description Decodifica o payload de um JWT localmente (sem verificar a assinatura).
 * Útil para extrair o ID do usuário e o email do token no frontend.
 * @param {string} token - O JWT completo.
 * @returns {{ id: string, email: string }} Objeto com o ID e o email do usuário.
 */
function decodeJwt(token: string): { id: string, email: string, [key: string]: any } {
    try {
        // Separa o token nas três partes (header.payload.signature)
        const base64Url = token.split('.')[1];
        // Converte a string base64url para base64 padrão
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decodifica a base64 e o JSON
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT", e);
        // Retorna um objeto vazio em caso de falha
        return { id: '', email: '' };
    }
}
// --- [FIM DO NOVO BLOCO 1/2] ---


const UploadsPage = () => {
    // --- ESTADOS DE DADOS E UI ---
    const [files, setFiles] = useState<Arquivo[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(15);
    const menuRef = useRef(null);
    const router = useRouter();
    // Adicione o hook useSearchParams para ler a URL
    const searchParams = useSearchParams();
    const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    
    // NOVO ESTADO: Armazena o nome do imóvel selecionado para filtrar
    const [selectedPropertyName, setSelectedPropertyName] = useState<string | null>(null);
    
    // Estado para o submenu de relatórios
    const [showReportMenu, setShowReportMenu] = useState(false); 
    // --- FIM ESTADOS ---

    // --- FUNÇÕES AUXILIARES ---
    const handleLogoff = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        // Redireciona para a home (ou /login se existir neste app)
        router.push('/');
    }, [router]); // Adiciona 'router' como dependência

    /**
     * @function fetchData
     * @description Busca arquivos e imóveis na API, aplicando o filtro de imóvel.
     */
    const fetchData = useCallback(async () => {
        // 1. Define o endpoint de arquivos, adicionando o filtro se um imóvel estiver selecionado
        const filesEndpoint = selectedPropertyName 
            ? `/api/uploads?propertyId=${selectedPropertyName}` // Backend usará isso para filtrar
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
                alert(`Erro: ${error.response?.data?.message || 'Falha ao carregar dados.'}`);
                if (error.response?.status === 401) {
                    handleLogoff();
                }
            }
        }
    }, [selectedPropertyName]); // Depende do filtro

    // --- EFEITOS (LIFECYCLE) ---

    // --- [NOVO BLOCO 2/2] ---
    // Este useEffect é responsável por capturar e limpar o token da URL
    useEffect(() => {
        // 1. Procura pelo token na URL
        const tokenFromUrl = searchParams.get('token');

        if (tokenFromUrl) {
            console.log("Token encontrado na URL, processando...");
            try {
                // 2. Salva o token no localStorage
                localStorage.setItem('authToken', tokenFromUrl);

                // 3. Decodifica e salva os dados do usuário
                const { id, email } = decodeJwt(tokenFromUrl);
                localStorage.setItem('userId', id);
                localStorage.setItem('userEmail', email);

                // 4. Atualiza o estado da UI (para o header)
                setUserEmail(email);

                // 5. Limpa a URL (remove o token da barra de endereço)
                // Isso atualiza a URL sem recarregar a página
                router.replace('/uploads', { scroll: false });

                // 6. O token está salvo. O useEffect abaixo será 
                // acionado e chamará o fetchData()

            } catch (error) {
                console.error("Falha ao processar o token da URL:", error);
                handleLogoff(); // Token inválido, desloga
            }
        }
    }, [searchParams, router, handleLogoff]); // Roda SÓ quando a URL é processada
    // --- [FIM DO NOVO BLOCO 2/2] ---

    // Este é o seu useEffect original. Ele agora rodará DEPOIS
    // que o useEffect acima salvar o token.
    useEffect(() => {
        // Lógica de segurança: só busca dados se houver um token
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
            // Se não houver token (nem na URL nem no storage), desloga.
            const tokenFromUrl = searchParams.get('token'); // Verifica de novo
            if (!tokenFromUrl) {
                console.log("Nenhum token, redirecionando para logoff.");
                handleLogoff();
            }
            return; // Não busca dados se não houver token
        }

        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
        fetchData();
        // O useEffect agora reexecuta a busca sempre que o filtro de imóvel muda
    }, [fetchData]); // Depende do fetchData (que depende de selectedPropertyName)

    // --- HANDLERS DE AÇÃO ---

    /**
     * @function addFile
     * @description Lida com o upload do arquivo e o registro dos metadados.
     */
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
            
            // Cria um URL temporário para o Blob e abre em nova aba
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
    
    /**
     * @function handleDeleteProperty
     * @description Exclui o imóvel e todas as notas fiscais vinculadas a ele (exclusão em cascata).
     */
    const handleDeleteProperty = async (propertyId: string) => {
        // 1. Encontrar o nome do imóvel para usar na mensagem de confirmação
        const property = properties.find(p => p._id === propertyId);
        const propertyName = property ? property.nome : "este imóvel (ID não encontrado)";

        const confirmationMessage = `ATENÇÃO: Você tem certeza que deseja excluir o imóvel "${propertyName}"? Ao confirmar, TODAS as notas fiscais e arquivos anexados vinculados a ele serão permanentemente excluídos. Essa ação é IRREVERSÍVEL.`;

        try {
            // 2. Confirmação com aviso detalhado
            if (!window.confirm(confirmationMessage)) {
                return;
            }
            
            // 3. Excluir os arquivos (Notas Fiscais) associados ao imóvel primeiro.
            await api.delete(`/api/uploads/by-property/${propertyName}`);
            
            // 4. Excluir o registro do imóvel
            await api.delete(`/api/imoveis/${propertyId}`);
            
            // 5. Atualizar o estado do frontend: remove o imóvel e os arquivos vinculados
            setProperties(prev => prev.filter(p => p._id !== propertyId));
            setFiles(prev => prev.filter(file => file.property !== propertyName));
            
            alert(`Imóvel "${propertyName}" e todos os seus arquivos foram excluídos com sucesso!`);
        } catch (error) {
            console.error("Erro ao deletar imóvel e arquivos:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Erro: ${error.response.data.message}`);
            } else {
                alert('Ocorreu um erro inesperado ao tentar excluir o imóvel e seus arquivos.');
            }
        }
    };
    
    // --- LÓGICA DE PAGINAÇÃO E PDF ---
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Relatório de Arquivos", 14, 15);
        
        // Mapeia todos os arquivos (sem paginação) para o PDF
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
        
        // Gera o Blob do PDF e abre a janela de impressão
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
    // --- FIM LÓGICA DE PAGINAÇÃO E PDF ---

    // --- RENDERIZAÇÃO ---
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
                        
                        {/* NOVO MENU DE RELATÓRIOS */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowReportMenu(!showReportMenu)} 
                                className="w-full flex justify-between items-center text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer"
                            >
                                Gerar Relatório
                                <MdKeyboardArrowRight size={20} className={`transform transition-transform duration-200 ${showReportMenu ? 'rotate-90' : 'rotate-0'}`} />
                            </button>
                            {showReportMenu && (
                                <div className="pl-4 bg-sky-800/50">
                                    <button onClick={generatePDF} className="block w-full text-left py-2 text-white hover:font-semibold transition">
                                        Imprimir Todos
                                    </button>
                                    <button onClick={generateGroupedPDF} className="block w-full text-left py-2 text-white hover:font-semibold transition">
                                        Por Categoria/Sub
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* FIM NOVO MENU */}
                        
                        <button onClick={() => setIsPropertyMenuOpen(true)} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Gerenciar Imóveis</button>
                        <button onClick={() => window.open("https://wa.me/5519999999999?text=Olá! Preciso de ajuda com o sistema.", "_blank")} className="text-left py-2 border-b border-gray-400 text-white hover:font-semibold transition cursor-pointer">Ajuda</button>
                    </nav>
                </aside>

                <main className="flex-1 p-6 flex flex-col gap-6"> {/* Mudança aqui para flex-col para melhor organização do filtro */}
                    
                    {/* NOVO BLOCO: Filtro por Imóvel */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                        <label htmlFor="property-filter" className="text-sky-900 font-bold text-lg whitespace-nowrap">Filtrar Arquivos por Imóvel:</label>
                        <select
                            id="property-filter"
                            // O valor é o nome do imóvel ou uma string vazia para "Todos"
                            value={selectedPropertyName || ''} 
                            // Ao mudar, define o nome do imóvel (ou null se for "Todos")
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
                    {/* FIM BLOCO DE FILTRO */}

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
                                        {/* REMOVIDO WHITESPACE DO THEAD */}
                                        <tr>
                                            <th className="border-b p-2">Título</th>
                                            <th className="border-b p-2">Valor</th>
                                            <th className="border-b p-2">Data da Compra</th>
                                            <th className="border-b p-2">Imóvel</th>
                                            <th className="border-b p-2">Categoria</th>
                                            <th className="border-b p-2">Subcategoria</th>
                                            <th className="border-b p-2">Descrição</th>
                                            <th className="border-b p-2 text-center">Ações</th>
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
                                                <td className="border-b p-2 text-sm max-w-[150px] truncate" title={file.observation}>
                                                    {file.observation || '-'}
                                                </td>
                                                
                                                <td className="border-b p-2"> {/* Removemos o flex do TD principal */}
                                                    <div className="flex items-center justify-center gap-3 h-full"> {/* Adicionamos uma DIV wrapper para o flex e altura total */}
                                                        {file.filePath && (
                                                            <button 
                                                                onClick={() => handleViewFile(file.filePath)} 
                                                                className="text-blue-600 hover:text-blue-800" 
                                                                title="Visualizar Arquivo"
                                                            >
                                                                <IoEyeSharp size={20} />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => deleteFile(file._id)} 
                                                            className="text-red-600 hover:text-red-800" 
                                                            title="Excluir Registro"
                                                        >
                                                            <IoTrashBinSharp size={20} />
                                                        </button>
                                                    </div>
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