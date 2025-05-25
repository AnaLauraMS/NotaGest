import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaCloud, FaLeaf, FaLock, FaTools } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  useEffect(() => {
    AOS.init({});
  }, []);

  return (
    <section className="bg-[#0c4a6e] text-white py-16" id="about-us-section">
      <div data-aos="fade-right" data-aos-offset="300" className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-5">Sobre Nós</h2>
        <div className="flex justify-center gap-6 text-4xl mb-6 text-green-300">
          <FaCloud title="Armazenamento em Nuvem" />
          <FaTools title="Construção Civil" />
          <FaLeaf title="Sustentabilidade" />
          <FaLock title="Segurança dos Documentos" />
        </div>
        <p className="text-base md:text-ml leading-relaxed ">
          Somos uma empresa comprometida em transformar a gestão documental no setor de construção civil, oferecendo soluções digitais que facilitam a organização de comprovantes e recibos, reduzem o uso de papel e ajudam a proteger o meio ambiente.<br /><br />
          Nosso objetivo é simplificar processos burocráticos e garantir que todos os documentos importantes estejam seguros, acessíveis e bem organizados, tanto para pequenas obras quanto para grandes projetos.<br /><br />
          Com a crescente demanda por soluções sustentáveis e eficientes, criamos uma plataforma intuitiva e segura que permite que nossos usuários armazenem e gerenciem seus documentos em qualquer lugar e a qualquer momento. Acreditamos que a tecnologia pode não apenas facilitar o dia a dia, mas também contribuir para um futuro mais verde, reduzindo o desperdício de papel e acelerando a transição para um mundo digital.<br /><br />
          Junte-se a nós nessa jornada rumo à digitalização e simplificação dos processos na construção civil!
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
