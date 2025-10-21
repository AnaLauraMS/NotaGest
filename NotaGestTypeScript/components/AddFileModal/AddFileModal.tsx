"use client";
import { IoMdCloudUpload } from "react-icons/io";
import React, { useState, useEffect } from "react";

// 🎯 AJUSTE 1: Esta interface agora representa o "pacote de dados"
// que será enviado para a API. Apenas os campos que o backend espera.
type Property = {
  _id: string;
  nome: string;
};

interface NewFilePayload {
  title: string;
  value: number;
  purchaseDate: string;
  observation: string;
  category: string;
  subcategory: string;
  property: string;
}

interface AddFileModalProps {
  onAddFile: (fileData: NewFilePayload) => void;
  onClose: () => void;
  properties: Property[];
}

interface AddPropertyModalProps {
  onClose: () => void;
  onAddProperty: (propertyData: { nome: string }) => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onAddFile, onClose, properties }) => {

  const [title, setTitle] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [observation, setObservation] = useState("");
  const [category, setCategory] = useState("Construção");
  const [subcategory, setSubcategory] = useState("Iluminação");
  const [property, setProperty] = useState("");

  // O resto das suas definições (subcategories, exampleProperties) está perfeito...
  const subcategories = ["Iluminação", "Ferragem", "Hidráulica", "Acabamento", "Pintura", "Madeiramento", "Outros"];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 🎯 AJUSTE 2: Usando o evento do formulário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página

    if (!title || !value || !property || !purchaseDate) {
      alert("Por favor, preencha os campos obrigatórios: Título, Valor, Data e Imóvel.");
      return;
    }

    // 🎯 AJUSTE 3: Criamos o objeto payload APENAS com os dados que o backend precisa.
    const newFilePayload: NewFilePayload = {
      title,
      value: Number(value), // Garantimos que o valor é um número
      purchaseDate,
      observation,
      category,
      subcategory,
      property,
    };

    // Chamamos a função da página principal, enviando o pacote de dados correto
    onAddFile(newFilePayload);

    // A página principal (UploadsPage) será responsável por fechar o modal após o sucesso da API
    // onClose(); // Comentamos aqui
  };

  return (
    <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg ">
        <h2 className="text-2xl font-semibold mb-4 text-sky-900 text-center">
          Adicionar Nota Fiscal
        </h2>

        {/* 🎯 AJUSTE 4: Envolvemos tudo em uma tag <form> */}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {/* Título */}
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Valor */}
            <input
              type="number"
              placeholder="Valor da Nota (R$)"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            />
            {/* Data da compra */}
            <input
              type="date"
              placeholder="Data da Compra"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Descrição */}
          <textarea
            placeholder="Descrição"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {/* ... Seus outros inputs e selects estão perfeitos ... */}
          {/* Imóvel */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Imóvel
            </label>
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecione um imóvel</option>
              {properties.map((item) => (
                <option key={item._id} value={item.nome}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria e Subcategoria */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Construção">Construção</option>
                <option value="Reforma">Reforma</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Subcategoria
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {subcategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button" // Importante para não submeter o formulário
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit" // O botão principal agora é do tipo "submit"
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