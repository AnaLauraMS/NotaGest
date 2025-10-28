"use client";

import React from 'react';

// A função ConnectionLine foi removida conforme solicitado.

const HowItWork = () => {
    const stepsData = [
        {
            number: 1,
            title: "Criação de Conta",
            description: "Inscreva-se em minutos inserindo algumas informações básicas, como nome, e-mail e senha."
        },
        {
            number: 2,
            title: "Upload de Documentos",
            description: "Carregue fotos, PDFs e outros documentos diretamente do seu computador ou dispositivo móvel."
        },
        {
            number: 3,
            title: "Organize e Categorize",
            description: "Classifique seus documentos por categorias ou até por data. Isso facilita a organização e o acesso posterior."
        },
    ];

    return (
        <section 
            // Ajuste das margens laterais (ml-20 mr-20) para um padding responsivo (px-4 md:px-12)
            className="text-center py-12 md:py-20 font-[Plus Jakarta Sans] px-4 md:px-12 mt-5" 
            id="how-it-work-section"
        >
            <h2 className="font-bold text-4xl sm:text-5xl mb-12 text-[#0c4a6e]">Como Funciona</h2>
            
            <p className="mb-16 md:mb-24 text-base max-w-4xl mx-auto text-gray-700">
                Com uma interface amigável e recursos que atendem desde profissionais da construção civil até proprietários de imóveis,
                você terá controle total sobre seus arquivos em poucos passos. Veja como é simples começar a organizar seus documentos com
                segurança e praticidade.
            </p>
            
            {/* Contêiner de Passos: 
                Em mobile, usamos flex-col para empilhar verticalmente.
                Em desktop (md:), usamos flex-row para exibir horizontalmente.
                Adicionamos 'gap-8' para espaçar os itens após a remoção das linhas de conexão.
            */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12">
                {stepsData.map((step) => (
                    <div key={step.number} className="flex flex-col items-center max-w-xs md:max-w-[200px] w-full">
                        {/* Número da Caixa */}
                        <div className="font-bold text-[#0c4a6e] bg-[#e2e2e2] w-20 h-20 md:w-24 md:h-28 rounded-xl flex items-center justify-center text-5xl md:text-7xl shadow-lg transform hover:scale-105 transition duration-300">
                            {step.number}
                        </div>
                        
                        {/* Descrição do Passo */}
                        <div className="text-center mt-4 p-2">
                            <h4 className="h4 text-xl font-semibold text-[#0c4a6e]">{step.title}</h4>
                            <p className="description text-sm mt-2 text-gray-600">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="global-description">
                {/* Você pode adicionar um call-to-action ou descrição global aqui */}
            </div>
        </section>
    );
};

export default HowItWork;