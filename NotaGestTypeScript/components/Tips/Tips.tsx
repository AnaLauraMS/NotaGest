"use client";

import React, { useEffect, useState } from 'react';
// Ícones SVG customizados para evitar erros de importação de 'react-icons'
const IconTools = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 001-1v-1a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 001-1v-1a2 2 0 114 0m-4-4a2 2 0 00-2 2v1h4v-1a2 2 0 00-2-2zM3 20h2M19 20h2"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const IconFile = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);
const IconClipboard = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
  </svg>
);

const Tips = () => {
  // Dados das dicas com os novos ícones SVG
  const tipsData = [
    {
      title: "Mão de Obra e Serviços Terceirizados",
      description: "Não se esqueça de arquivar recibos e notas de serviços prestados na obra. Isso ajudará na dedução do seu Imposto de Renda.",
      link: "https://avt.com.br/construcao-de-casas-documentacao-necessaria/",
      icon: <IconTools width={36} height={36} className="text-[#10B981]" />,
    },
    {
      title: "Simplifique a Declaração do Imposto de Renda",
      description: "Ao manter todos os comprovantes organizados, a declaração do Imposto de Renda se torna mais simples e eficiente.",
      link: "https://einvestidor.estadao.com.br/educacao-financeira/imposto-de-renda-2024-documentos-necessarios-declaracao/?gad_source=1",
      icon: <IconFile width={36} height={36} className="text-[#10B981]" />,
    },
    {
      title: "Saiba Quais Documentos São Obrigatórios Para a Declaração",
      description: "Não sabe quais documentos guardar? Tenha em mãos tudo o que for necessário para comprovar seus gastos na construção do imóvel.",
      link: "https://investnews.com.br/guias/imposto-de-renda-o-que-e/?gad_source=1",
      icon: <IconClipboard width={36} height={36} className="text-[#10B981]" />,
    },
  ];

  // Estado e useEffect para simular o efeito "fade-up" do AOS
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simula o carregamento inicial com um pequeno delay para o efeito de transição
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 1. Contêiner Principal: 
    // Ajustado margens e padding para classes válidas (mt-10, mb-10)
    // Usamos 'opacity-0 translate-y-10' para o estado inicial, e 'opacity-100 translate-y-0' para o estado final.
    <div
      className={`mt-10 mb-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto font-[Plus Jakarta Sans] transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      id="tips"
    >
      <h2 className="text-3xl font-extrabold text-[#0c4a6e] col-span-1 md:col-span-3 text-center mb-4">
        Dicas de Documentação para Sua Obra
      </h2>
      
      {tipsData.map((tip, index) => (
        <div
          key={index}
          // 2. Cards Responsivos: Adicionado shadow-xl no hover para melhor efeito.
          // Ajustado 'rounded-4xl' para 'rounded-3xl' (Tailwind padrão).
          // Removida a altura fixa (min-h-[400px]) para melhor fluxo responsivo, confiando no justify-between
          className="bg-[#10b98110] text-gray-800 shadow-xl rounded-3xl p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between text-center"
          // Simula o fade-up individual com delay
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          {/* 3. Ícone: Ajustado 'w-18 h-18' para 'w-14 h-14' (o mais próximo em Tailwind) */}
          <div className="bg-[#10b981] rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            {/* O ícone SVG agora usa as props dinamicamente */}
            {React.cloneElement(tip.icon, { className: "text-white w-7 h-7" })} 
          </div>

          <h3 className="text-xl font-bold mb-3 text-[#0c4a6e]">{tip.title}</h3>
          
          {/* O text-sm e leading-relaxed garantem boa legibilidade em mobile */}
          <p className="text-base leading-relaxed mb-6 flex-grow">{tip.description}</p>
          
          <a
            href={tip.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-[#25aff0] text-white rounded-full text-base font-medium hover:bg-[#1e8fd4] transition-colors shadow-md mx-auto"
          >
            Saiba mais
          </a>
        </div>
      ))}
    </div>
  );
};

export default Tips;