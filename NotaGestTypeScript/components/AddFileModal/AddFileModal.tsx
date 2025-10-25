"use client";
import { IoMdCloudUpload } from "react-icons/io";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Tipo para os imóveis que vêm da UploadsPage
type Property = {
 _id: string;
 nome: string;
};

// Tipo para os dados *do formulário* que serão enviados
interface NewFilePayload {
 title: string;
 value: number;
 purchaseDate: string;
 observation: string;
 category: string;
 subcategory: string;
 property: string;
}

// Props que o modal recebe
interface AddFileModalProps {
 onAddFile: (fileData: NewFilePayload, file: File | null) => void; // Envia dados + arquivo
 onClose: () => void;
 properties: Property[]; // Recebe a lista de imóveis
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onAddFile, onClose, properties }) => {

 // Estados para CADA campo do formulário + o arquivo
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [title, setTitle] = useState("");
 const [value, setValue] = useState<number | "">("");
 const [purchaseDate, setPurchaseDate] = useState("");
 const [observation, setObservation] = useState("");
 const [category, setCategory] = useState("Construção");
 const [subcategory, setSubcategory] = useState("Iluminação");
 const [property, setProperty] = useState(""); // Guarda o NOME do imóvel selecionado

 const subcategories = ["Iluminação", "Ferragem", "Hidráulica", "Acabamento", "Pintura", "Madeiramento", "Outros"];

 // Efeito para travar o scroll (correto)
 useEffect(() => {
   document.body.style.overflow = "hidden";
   return () => {
     document.body.style.overflow = "";
   };
 }, []);

 // Função chamada ao selecionar um arquivo
 const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
     if (event.target.files && event.target.files[0]) {
       setSelectedFile(event.target.files[0]);
     } else {
       setSelectedFile(null);
     }
   };

 // Função chamada ao submeter o formulário
 const handleSubmit = (event: FormEvent) => {
   event.preventDefault();

   // Validação dos campos obrigatórios
   if (!title || value === "" || !property || !purchaseDate) {
     alert("Por favor, preencha os campos obrigatórios: Título, Valor, Data da Compra e Imóvel.");
     return;
   }

   // Cria o objeto SÓ com os dados do formulário (metadados)
   const newFilePayload: NewFilePayload = {
     title,
     value: Number(value),
     purchaseDate,
     observation,
     category,
     subcategory,
     property, // Envia o nome selecionado
   };

   // Chama a função da UploadsPage, passando os metadados E o arquivo (File ou null)
   onAddFile(newFilePayload, selectedFile);

   // A UploadsPage é quem fecha o modal após o sucesso
 };

 return (
   // Container do modal (fundo escuro)
   <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-50 px-4 py-6"> {/* Adicionado py-6 para scroll */}
     {/* Card branco do modal */}
     <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-lg max-h-full overflow-y-auto"> {/* Adicionado max-h-full e overflow */}
       <h2 className="text-2xl font-semibold mb-4 text-sky-900 text-center">
         Adicionar Nota Fiscal
       </h2>

       {/* Formulário */}
       <form onSubmit={handleSubmit} className="space-y-3 text-sm">

         {/* --- CAMPOS DE DADOS --- */}

         {/* Título */}
         <input
           type="text"
           placeholder="Título"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="w-full border rounded px-3 py-2"
           required
         />

         {/* Valor e Data (lado a lado em telas maiores) */}
         <div className="flex flex-col sm:flex-row gap-3">
           <input
             type="number"
             placeholder="Valor da Nota (R$)"
             value={value}
             onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
             className="w-full border rounded px-3 py-2"
             required
             step="0.01" // Permite centavos
           />
           <input
             type="date"
             placeholder="Data da Compra"
             value={purchaseDate}
             onChange={(e) => setPurchaseDate(e.target.value)}
             className="w-full border rounded px-3 py-2"
             required
           />
         </div>

         {/* Descrição (Observação) */}
         <textarea
           placeholder="Observação (Opcional)"
           value={observation}
           onChange={(e) => setObservation(e.target.value)}
           className="w-full border rounded px-3 py-2"
           rows={2} // Ajuste a altura conforme necessário
         />

         {/* Imóvel (Dropdown com dados reais) */}
         <div>
           <label className="block mb-1 text-sm font-medium text-gray-700">
             Imóvel *
           </label>
           <select
             value={property} // Guarda o 'nome' do imóvel selecionado
             onChange={(e) => setProperty(e.target.value)}
             className="w-full border rounded px-3 py-2"
             required
           >
             <option value="" disabled>Selecione um imóvel</option>
             {properties.length === 0 ? (
                 <option disabled>Nenhum imóvel cadastrado</option>
             ) : (
                properties.map((prop) => (
                    <option key={prop._id} value={prop.nome}>
                    {prop.nome}
                    </option>
                ))
             )}
           </select>
         </div>

         {/* Categoria e Subcategoria (lado a lado em telas maiores) */}
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1">
             <label className="block mb-1 text-sm font-medium text-gray-700">
               Categoria *
             </label>
             <select
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               className="w-full border rounded px-3 py-2"
             >
               <option value="Construção">Construção</option>
               <option value="Reforma">Reforma</option>
               {/* Adicione mais categorias se precisar */}
             </select>
           </div>
           <div className="flex-1">
             <label className="block mb-1 text-sm font-medium text-gray-700">
               Subcategoria *
             </label>
             <select
               value={subcategory}
               onChange={(e) => setSubcategory(e.target.value)}
               className="w-full border rounded px-3 py-2"
             >
               {subcategories.map((item) => (
                 <option key={item} value={item}>{item}</option>
               ))}
             </select>
           </div>
         </div>

         {/* --- CAMPO DE UPLOAD --- */}
         <div className="mt-4">
           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
             Anexar Arquivo (Opcional)
           </label>
           <div className="flex items-center justify-center w-full">
             <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
               <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-2"> {/* Adicionado px-2 */}
                 <IoMdCloudUpload className="w-8 h-8 mb-2 text-gray-500" />
                 {selectedFile ? (
                   <p className="text-sm text-green-600 font-semibold truncate max-w-full">{selectedFile.name}</p> // Truncate para nomes longos
                 ) : (
                   <>
                     <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                     <p className="text-xs text-gray-500">PDF, PNG, JPG, etc.</p>
                   </>
                 )}
               </div>
               <input id="file-upload" name="file" type="file" className="hidden" onChange={handleFileChange} />
             </label>
           </div>
         </div>

         {/* --- BOTÕES --- */}
         <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
           <button
             type="button"
             onClick={onClose}
             className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 w-full sm:w-auto"
           >
             Cancelar
           </button>
           <button
             type="submit"
             className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 w-full sm:w-auto"
           >
             Salvar Nota Fiscal
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default AddFileModal;