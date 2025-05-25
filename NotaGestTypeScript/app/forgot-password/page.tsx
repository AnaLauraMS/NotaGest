import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/Logo.png";
import Footer from "../../components/Footer/Footer";

export default function ForgotPassword() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Faixa azul no topo */}
      <div className="w-full h-[20vh] bg-sky-900" />

      <main className="font-['Plus_Jakarta_Sans'] w-full max-w-sm mx-auto bg-[#FAFAFC] p-6 rounded-lg shadow-md -mt-20 z-10 relative mb-10">
        <section className="flex flex-col gap-5">
          <h1 className=" my-5 text-gray-600 text-2xl text-center font-semibold mt-4 mb-10">
            Esqueceu sua senha?
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>

          {/* Formulário */}
          <form className="flex flex-col gap-4">
            <fieldset className="border-0 p-0 m-0 flex flex-col gap-3">
              <input
                name="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded text-base"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
              />
              <button
                type="submit"
                className="bg-[#0c4a6e] text-white py-2 rounded-md hover:bg-[#075985] transition-colors mt-10"
              >
                Enviar link de recuperação
              </button>
            </fieldset>
          </form>

          <div className="text-center mt-2">
            <Link href="/login" className="text-sm text-[#0c4a6e] hover:underline">
              Voltar para o login
            </Link>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 w-full bg-[#0c4a6e] text-white px-6 py-2 font-sans">
        {/* Rodapé */}
        <Footer />
      </div>
    </div>
  );
}
