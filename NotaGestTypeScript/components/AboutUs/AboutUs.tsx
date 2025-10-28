"use client";

import React, { useEffect, useState } from 'react';
// Ícones SVG customizados para evitar erros de importação de 'react-icons'
const IconCloud = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {props.title && <title>{props.title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.8 1.999A7.001 7.001 0 103 15z"></path>
  </svg>
);
const IconTools = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {props.title && <title>{props.title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 00-2 2v2m0-2a2 2 0 012-2m0 2v2m0 2a2 2 0 002 2v2m0-2a2 2 0 01-2-2m0 2v2m-6-4H8m4 0h6m-6 0h.01"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const IconLeaf = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {props.title && <title>{props.title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);
const IconLock = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {props.title && <title>{props.title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 10V7a2 2 0 012-2h0a2 2 0 012 2v3"></path>
  </svg>
);


const AboutUs: React.FC = () => {
    // Estado para simular o efeito fade-in do AOS
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simula o carregamento inicial para o efeito de transição
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-[#0c4a6e] text-white py-16" id="about-us-section">
            <div 
                // Substituição do data-aos: Usamos classes Tailwind de transição
                className={`max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-5">Sobre Nós</h2>
                
                {/* Ícones: Substituído FaCloud, etc. pelos componentes SVG */}
                <div className="flex justify-center gap-6 text-4xl mb-6 text-[#10B981]">
                    <IconCloud className="w-8 h-8 md:w-10 md:h-10" title="Armazenamento em Nuvem" />
                    <IconTools className="w-8 h-8 md:w-10 md:h-10" title="Construção Civil" />
                    <IconLeaf className="w-8 h-8 md:w-10 md:h-10" title="Sustentabilidade" />
                    <IconLock className="w-8 h-8 md:w-10 md:h-10" title="Segurança dos Documentos" />
                </div>
                
                <p className="text-base leading-relaxed md:text-lg max-w-4xl mx-auto">
                    Somos uma empresa comprometida em transformar a gestão documental no setor de construção civil, oferecendo soluções digitais que facilitam a organização de comprovantes e recibos, reduzem o uso de papel e ajudam a proteger o meio ambiente.
                    <br /><br />
                    Nosso objetivo é simplificar processos burocráticos e garantir que todos os documentos importantes estejam seguros, acessíveis e bem organizados, tanto para pequenas obras quanto para grandes projetos.
                    <br /><br />
                    Com a crescente demanda por soluções sustentáveis e eficientes, criamos uma plataforma intuitiva e segura que permite que nossos usuários armazenem e gerenciem seus documentos em qualquer lugar e a qualquer momento. Acreditamos que a tecnologia pode não apenas facilitar o dia a dia, mas também contribuir para um futuro mais verde, reduzindo o desperdício de papel e acelerando a transição para um mundo digital.
                    <br /><br />
                    Junte-se a nós nessa jornada rumo à digitalização e simplificação dos processos na construção civil!
                </p>
            </div>
        </section>
    );
};

export default AboutUs;