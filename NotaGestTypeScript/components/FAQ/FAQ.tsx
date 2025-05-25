import React, { useState } from 'react';
import faq from '../../assets/FAQ.jpg';
import Image from 'next/image';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Como o sistema ajuda com a documentação de impostos?",
      answer:
        "O sistema organiza seus documentos relacionados aos impostos, facilitando a consulta e a apresentação de comprovantes quando necessário.",
    },
    {
      question: "O que devo fazer se encontrar um erro ao fazer upload?",
      answer:
        "Se você encontrar um erro, verifique sua conexão com a internet e o formato do arquivo. Se o problema persistir, entre em contato com nosso suporte técnico.",
    },
    {
      question: "Como posso entrar em contato com o suporte?",
      answer:
        "Você pode entrar em contato com nosso suporte enviando um e-mail para notagestsuporte@outlook.com",
    },
    {
      question: "Como posso recuperar um arquivo que deletei?",
      answer:
        "Uma vez que um arquivo é deletado, não podemos recuperá-lo. Recomendamos ter cópias de segurança dos documentos mais importantes.",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-16 bg-white faq-section">
      <div className="flex-shrink-0 mb-6 lg:mb-0">
        <Image
          src={faq}
          alt="FAQ"
          className="rounded-xl w-[280px] h-[280px] object-cover"
        />
      </div>

      <div className="w-full max-w-150 h-[500px] overflow-y-auto px-2">
        <h2 className="text-4xl font-bold text-center mb-15 text-gray-800">Perguntas Frequentes</h2>

        <div className="space-y-6 ">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-3 transition-all duration-300"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-ml font-medium text-gray-800">{faq.question}</h3>
                <button
                  className="text-2xl font-bold text-green-600 focus:outline-none"
                  aria-label={openIndex === index ? 'Fechar resposta' : 'Abrir resposta'}
                >
                  {openIndex === index ? '−' : '+'}
                </button>
              </div>

              {/* Resposta com transição controlada */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 mt-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
