"use client";
import React, { useEffect, useState } from 'react';

// SVG simples para substituir aspas (quote mark)
const QuoteIcon: React.FC<{ colorClass: string }> = ({ colorClass }) => (
    <svg 
        className={`w-8 h-8 ${colorClass}`} 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 10H4v4h2v2h2v-2h2v-4H8V8H6v2zm10 0h-2v4h2v2h2v-2h2v-4h-2V8h-2v2z"/>
    </svg>
);

// Dados dos depoimentos (agora com classes de cores para o SVG)
const commentsData = [
    {
        name: "Juliano Souza, Engenheiro Civil",
        comment: "Com o sistema, consegui organizar toda a documentação da obra de forma prática e rápida. Agora, encontrar comprovantes e notas fiscais é muito mais simples. Foi uma ótima escolha!",
        imagePlaceholderText: "JS", // Inicial do nome
        bgColor: "bg-[#f0f0f0]",
        textColor: "text-gray-800",
        quoteColorClass: "text-[#0c4a6e]", // Escura
        hrColorClass: "border-gray-300",
    },
    {
        name: "Roberto Lima, Arquiteto",
        comment: "Nunca foi tão fácil gerenciar os documentos das construções que administro. O sistema não só economizou tempo, mas também eliminou o risco de perder arquivos importantes.",
        imagePlaceholderText: "RL",
        bgColor: "bg-[#059669]",
        textColor: "text-white",
        quoteColorClass: "text-white", // Clara
        hrColorClass: "border-white/50",
    },
    {
        name: "Mariana Alves, Proprietária de Imóveis",
        comment: "Eu costumava perder horas tentando localizar recibos e comprovantes. Esse sistema mudou tudo! Agora, tenho todos os documentos organizados e prontos para a declaração de imposto de renda.",
        imagePlaceholderText: "MA",
        bgColor: "bg-[#059669]",
        textColor: "text-white",
        quoteColorClass: "text-white", // Clara
        hrColorClass: "border-white/50",
    },
];

const ClientComments: React.FC = () => {
    // Estado para simular o efeito fade-in do AOS
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simula o carregamento inicial para o efeito de transição
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="py-10">
            {/* Título Responsivo */}
            <h2 className="font-bold text-3xl md:text-5xl text-center my-8 md:my-12">O que nossos clientes dizem</h2>
            
            {/* Seção de Depoimentos: Flex column no mobile (sm:grid) e grid 3 colunas no desktop */}
            <section 
                // Grid layout para responsividade: 1 coluna no mobile, 3 colunas a partir do 'lg'
                className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 
                transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {commentsData.map((comment, index) => (
                    <div 
                        key={index}
                        // Classes de fundo e texto dinâmicas
                        className={`p-6 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl flex flex-col justify-between ${comment.bgColor} ${comment.textColor}`}
                    >
                        {/* Aspas (Substituídas pelo SVG) */}
                        <QuoteIcon colorClass={comment.quoteColorClass} />

                        {/* Texto do Depoimento */}
                        <p className="mt-4 mb-4 min-h-[120px] md:min-h-[140px] text-base leading-relaxed">
                            {comment.comment}
                        </p>
                        
                        {/* Linha Divisória */}
                        <hr className={`${comment.hrColorClass} mb-4 w-full opacity-50`} />
                        
                        {/* Perfil do Cliente */}
                        <div className="flex items-center">
                            {/* Placeholder de Imagem do Cliente */}
                            <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 shadow-inner">
                                {comment.imagePlaceholderText}
                            </div>
                            
                            <span className="font-semibold text-sm">
                                {comment.name}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ClientComments;