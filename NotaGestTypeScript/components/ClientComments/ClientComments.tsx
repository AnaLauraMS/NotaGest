"use client";
import React, { useEffect } from 'react';
import juliano from '../../assets/photo_01.png';
import roberto from '../../assets/photo_2.png';
import mariana from '../../assets/photo_3.png';
import aspas_escura from '../../assets/aspas_escura.png';
import aspas_clara from '../../assets/aspas_clara.png';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';

const ClientComments: React.FC = () => {
    useEffect(() => {
      Aos.init();
    }, []);

    return (
        <div>
            <h2 className="font-bold text-5xl text-center my-12 mt-25">O que nossos clientes dizem</h2>
            <section className="flex justify-between px-5 sm:px-10 lg:px-5 py-5 mt-15">
                <div className="flex-1 mx-2 p-6 rounded-lg bg-[#f0f0f0] text-gray-800 shadow-lg" data-aos="fade-up">
                    <Image src={aspas_escura} alt="Aspas Escura" className="w-11 h-9" />
                    <p className="mt-4 mb-2 min-h-[160px]">Com o sistema, consegui organizar toda a documentação da obra de forma prática e rápida. Agora, encontrar comprovantes e notas fiscais é muito mais simples. Foi uma ótima escolha!</p>
                    <hr className="border-gray-300 mb-4 w-4/5 mx-auto" />
                    <div className="flex items-center">
                        <Image src={juliano} alt="Juliano Souza" className="w-12 h-12 rounded-full mr-4" />
                        <span className="font-semibold">Juliano Souza, Engenheiro Civil</span>
                    </div>
                </div>

                <div className="flex-1 mx-2 p-6 rounded-lg bg-[#059669] text-white" data-aos="fade-up">
                    <Image src={aspas_clara} alt="Aspas Clara" className="w-11 h-9" />
                    <p className="mt-4 mb-4 min-h-[160px]">Nunca foi tão fácil gerenciar os documentos das construções que administro. O sistema não só economizou tempo, mas também eliminou o risco de perder arquivos importantes.</p>
                    <hr className="border-white mb-4 w-4/5 mx-auto" />
                    <div className="flex items-center">
                        <Image src={roberto} alt="Roberto Lima" className="w-12 h-12 rounded-full mr-4" />
                        <span className="font-semibold">Roberto Lima, Arquiteto</span>
                    </div>
                </div>

                <div className="flex-1 mx-2 p-6 rounded-lg bg-[#059669] text-white" data-aos="fade-up">
                    <Image src={aspas_clara} alt="Aspas Clara" className="w-11 h-9" />
                    <p className="mt-4 mb-4 min-h-[160px]">Eu costumava perder horas tentando localizar recibos e comprovantes. Esse sistema mudou tudo! Agora, tenho todos os documentos organizados e prontos para a declaração de imposto de renda.</p>
                    <hr className="border-white mb-4 w-4/5 mx-auto" />
                    <div className="flex items-center">
                        <Image src={mariana} alt="Mariana Alves" className="w-12 h-12 rounded-full mr-4" />
                        <span className="font-semibold">Mariana Alves, Proprietária de Imóveis</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClientComments;
