"use client";
import { IoMdCloudUpload } from "react-icons/io";
import React, { useState } from "react";
import { useEffect } from "react";

interface FileData {
  id: number;
  name: string;
  title: string;
  value: number;
  purchaseDate: string;
  observation: string;
  category: string;
  subcategory: string;
  property: string;
  date: string;
  size: string;
}

interface AddFileModalProps {
  onAddFile: (file: FileData) => void;
  onClose: () => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onAddFile, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [observation, setobservation] = useState("");
  const [category, setCategory] = useState("Construção");
  const [subcategory, setSubcategory] = useState("Iluminação");
  const [property, setProperty] = useState("");

  const subcategories = [
    "Iluminação",
    "Ferragem",
    "Hidráulica",
    "Acabamento",
    "Pintura",
    "Madeiramento",
    "Outros",
  ];

  // Simulando imóveis cadastrados (no futuro virá do banco de dados)
  const exampleProperties = [
    "Casa Jardim América",
    "Obra Centro",
    "Sítio São João",
  ];

  //useEffect para retirar o scroll da lateral no scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = () => {
    if (!file || !property) {
      alert("Selecione um arquivo e um imóvel");
      return;
    }

    const newFile = {
      id: Date.now(),
      name: file.name,
      title,
      value: parseFloat(value),
      purchaseDate,
      observation,
      category,
      subcategory,
      property,
      date: new Date().toLocaleDateString(),
      size: `${(file.size / 1024).toFixed(2)} KB`,
    };

    onAddFile(newFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg ">
        <h2 className="text-2xl font-semibold mb-4 text-sky-900 text-center">
          Adicionar Nota Fiscal
        </h2>

        <div className="space-y-3 text-sm">
          {/* Input arquivo */}

          {/* Título */}
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Valor */}
            <input
              type="number"
              placeholder="Valor da Nota (R$)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            {/* Data da compra */}
            <input
              type="date"
              placeholder="Data da Compra"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Descrição */}
          <textarea
            placeholder="Descrição"
            value={observation}
            onChange={(e) => setobservation(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          {/* Imóvel */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Imóvel
            </label>
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione um imóvel</option>
              {exampleProperties.map((item) => (
                <option key={item} value={item}>
                  {item}
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
        </div>

        {/* Input de arquivo com ícone de upload e background */}
        <div className="flex flex-col gap-2 items-center text-center">
          <label className="cursor-pointer inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-4 rounded-md w-full gap-2 mt-6">
            <IoMdCloudUpload />
            Escolher arquivo
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          <span className="text-sm text-gray-500">
            {file ? file.name : "Nenhum arquivo selecionado"}
          </span>
        </div>

        {/* Botões */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 w-full sm:w-auto"
          >
            Salvar Nota Fiscal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
