"use client"; 

import AboutUs from "../components/AboutUs/AboutUs";
import Carousel from "../components/Carousel/Carousel";
import ClientComments from "../components/ClientComments/ClientComments";
import FAQ from "../components/FAQ/FAQ";
import Header from "../components/Header/Header";
import HowItWork from "../components/HowItWork/HowItWork";
import Tips from "../components/Tips/Tips";
import Footer from "../components/Footer/Footer";
import ContactUs from "../components/ContactUs/ContactUs";

export default function Home() {
  return (
    <div className="home">
      <Header />
      <Carousel />
      <Tips />
      <HowItWork />
      <AboutUs />
      <ClientComments />
      <FAQ />
      <ContactUs />
      <Footer />
    </div>
  );
}
