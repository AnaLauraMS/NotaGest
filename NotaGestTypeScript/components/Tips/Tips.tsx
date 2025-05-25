import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaTools, FaFileInvoiceDollar, FaClipboardList } from 'react-icons/fa'; // ícones ilustrativos

const Tips = () => {
  const tipsData = [
    {
      title: "Mão de Obra e Serviços Terceirizados",
      description: "Não se esqueça de arquivar recibos e notas de serviços prestados na obra. Isso ajudará na dedução do seu Imposto de Renda.",
      link: "https://avt.com.br/construcao-de-casas-documentacao-necessaria/",
      icon: <FaTools size={36} className="text-[#10B981] mb-4" />,
    },
    {
      title: "Simplifique a Declaração do Imposto de Renda",
      description: "Ao manter todos os comprovantes organizados, a declaração do Imposto de Renda se torna mais simples e eficiente.",
      link: "https://einvestidor.estadao.com.br/educacao-financeira/imposto-de-renda-2024-documentos-necessarios-declaracao/?gad_source=1&gclid=CjwKCAiArva5BhBiEiwA-oTnXaw1HCZzW4_UEtYGdRWO9UvKJht0ROzk_3j8rpWCLtAsUbIwnS88aBoCASsQAvD_BwE",
      icon: <FaFileInvoiceDollar size={36} className="text-[#10B981] mb-4" />,
    },
    {
      title: "Saiba Quais Documentos São Obrigatórios Para a Declaração",
      description: "Não sabe quais documentos guardar? Tenha em mãos tudo o que for necessário para comprovar seus gastos na construção do imóvel.",
      link: "https://investnews.com.br/guias/imposto-de-renda-o-que-e/?gad_source=1&gclid=CjwKCAiArva5BhBiEiwA-oTnXTgQC0AGuFupWGcwiEwil6QyQKcipzBeSkPQhv27iyT5rWpearIFVxoCBVsQAvD_BwE",
      icon: <FaClipboardList size={36} className="text-[#10B981] mb-4" />,
    },
  ];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      className="mt-18 mb-15 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto font-[Plus Jakarta Sans]"
      id="tips"
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      data-aos-duration="1000"
    >
      {tipsData.map((tip, index) => (
        <div
        key={index}
        className="bg-[#10b98110] text-gray-800 shadow-gray-300 rounded-4xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between text-center min-h-[400px]"
        data-aos="fade-up"
      >
          <div className="bg-[#10b981] rounded-full w-18 h-18 flex items-center justify-center mx-auto">
            {React.cloneElement(tip.icon, { size: 24, className: "text-white" })}
          </div>
          <h3 className="text-lg font-bold">{tip.title}</h3>
          <p className="text-sm leading-relaxed mb-4">{tip.description}</p>
          <a
            href={tip.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 bg-[#10B981] text-white rounded-full text-sm font-medium hover:bg-[#059669] transition-colors"
          >
            Saiba mais
          </a>
        </div>
      ))}
    </div>
  );
};

export default Tips;
