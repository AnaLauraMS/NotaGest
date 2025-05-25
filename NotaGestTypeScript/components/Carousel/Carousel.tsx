"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import Banner_1 from "../../assets/1.png";
import Banner_2 from "../../assets/2.png";
import Banner_3 from "../../assets/3.png";
import Banner_4 from "../../assets/4.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel: React.FC = () => {
  const settings: Settings = {
    dots: true,            // Não exibe os indicadores (bolinhas) abaixo do carrossel
    infinite: true,         // Faz o carrossel girar em loop infinito
    speed: 400,             // Velocidade da transição entre os slides (em milissegundos)
    slidesToShow: 1,        // Quantidade de slides visíveis por vez
    slidesToScroll: 1,      // Quantidade de slides que avançam a cada transição
    autoplay: true,         // Ativa o modo automático (carrossel gira sozinho)
    autoplaySpeed: 4000,    // Intervalo entre as transições automáticas (4 segundos)
    arrows: false,          // Oculta as setas de navegação (próximo/anterior)
  };
  return (
    <div className="carousel-container ">
      <Slider {...settings}>
        <div className="Banner">
          <Image src={Banner_1} alt="Banner 1" className="w-full h-auto object-cover" />
        </div>
        <div>
          <Image src={Banner_2} alt="Banner 2" className="w-full h-auto object-cover" />
        </div>
        <div>
          <Image src={Banner_3} alt="Banner 3" className="w-full h-auto object-cover" />
        </div>
        <div>
          <Image src={Banner_4} alt="Banner 4" className="w-full h-auto object-cover" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
