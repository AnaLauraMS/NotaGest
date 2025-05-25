import React from 'react';
import Image from 'next/image';
import vetor from '../../assets/Vector 5.png';

const HowItWork = () => {
  return (
    <section className="text-center py-12 font-[Plus Jakarta Sans] mb-20 ml-20 mr-20 mt-5" id="how-it-work-section">
      <h2 className="font-bold text-5xl mb-12">Como Funciona</h2>
      <p className="mb-24 text-base">
        Com uma interface amigável e recursos que atendem desde profissionais da construção civil até proprietários de imóveis,
        você terá controle total sobre seus arquivos em poucos passos. Veja como é simples começar a organizar seus documentos com
        segurança e praticidade.
      </p>
      <div className="caixas flex items-center justify-center">
        <div className="caixa flex flex-col items-center">
          <h3 className="font-bold title-how text-[#0c4a6e] bg-[#e2e2e2] w-24 h-28 rounded-[1.5rem] flex items-center justify-center text-7xl">
            1
          </h3>
          <div className="text-center mt-4">
            <h4 className="h4 text-xl">Criação de conta</h4>
            <p className="description text-sm mt-4">Inscreva-se em minutos inserindo algumas informações básicas, como nome, e-mail e senha.</p>
          </div>
        </div>
        <div className="pb-30 w-100">
          <Image src={vetor} alt="Vetor" />
        </div>
        <div className="caixa flex flex-col items-center">
          <h3 className="font-bold title-how text-[#0c4a6e] bg-[#e2e2e2] w-24 h-28 rounded-[1.5rem] flex items-center justify-center text-7xl">
            2
          </h3>
          <div className="text-center mt-4">
            <h4 className="h4 text-xl">Upload de documentos</h4>
            <p className="description text-sm mt-4">Carregue fotos, PDFs e outros documentos diretamente do seu computador ou dispositivo móvel.</p>
          </div>
        </div>
        <div className="pb-25 w-100">
          <Image src={vetor} alt="Vetor" />
        </div>
        <div className="caixa flex flex-col items-center">
          <h3 className="font-bold title-how text-[#0c4a6e] bg-[#e2e2e2] w-24 h-28 rounded-[1.5rem] flex items-center justify-center text-7xl">
            3
          </h3>
          <div className="text-center mt-4">
            <h4 className="h4 text-xl">Organize e categorize</h4>
            <p className="description text-sm mt-4">Classifique seus documentos por categorias ou até por data. Isso facilita a organização e o acesso posterior.</p>
          </div>
        </div>
      </div>
      <div className="global-description">
      </div>
    </section>
  );
};

export default HowItWork;
