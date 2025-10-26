"use client";
import { IoMdCloudUpload } from "react-icons/io";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

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
  onAddFile: (fileData: NewFilePayload, file: File | null) => void;
  onClose: () => void;
  properties: Property[];
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onAddFile, onClose, properties }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [observation, setObservation] = useState("");
  const [category, setCategory] = useState("Construção");
  const [subcategory, setSubcategory] = useState("Iluminação");
  const [property, setProperty] = useState("");
  const [fileError, setFileError] = useState<string>("");

  const subcategories = ["Iluminação", "Ferragem", "Hidráulica", "Acabamento", "Pintura", "Madeiramento", "Outros"];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 🔍 Função de validação de arquivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setFileError("");
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFileError("Apenas arquivos PDF, PNG ou JPG são permitidos.");
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setFileError(`O arquivo excede o limite de ${maxSizeMB} MB.`);
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title || value === "" || !property || !purchaseDate) {
      alert("Preencha os campos obrigatórios: Título, Valor, Data da Compra e Imóvel.");
      return;
    }

    if (fileError) {
      alert("Por favor, corrija o erro do arquivo antes de salvar.");
      return;
    }

    const newFilePayload: NewFilePayload = {
      title,
      value: Number(value),
      purchaseDate,
      observation,
      category,
      subcategory,
      property,
    };

    onAddFile(newFilePayload, selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-50 px-4 py-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-sky-900 text-center">
          Adicionar Nota Fiscal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              placeholder="Valor da Nota (R$)"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
              step="0.01"
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

          <textarea
            placeholder="Observação (Opcional)"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Imóvel *</label>
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>Selecione um imóvel</option>
              {properties.length === 0 ? (
                <option disabled>Nenhum imóvel cadastrado</option>
              ) : (
                properties.map((prop) => (
                  <option key={prop._id} value={prop.nome}>{prop.nome}</option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Categoria *</label>
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Subcategoria *</label>
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

          {/* --- CAMPO DE UPLOAD COM VALIDAÇÃO --- */}
          <div className="mt-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Anexar Arquivo (PDF, PNG ou JPG — até 5MB)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-2">
                  <IoMdCloudUpload className="w-8 h-8 mb-2 text-gray-500" />
                  {selectedFile ? (
                    <p className="text-sm text-green-600 font-semibold truncate max-w-full">
                      {selectedFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste
                      </p>
                      <p className="text-xs text-gray-500">Apenas PDF, PNG e JPG (máx. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {fileError && (
              <p className="text-red-600 text-sm mt-2 text-center">{fileError}</p>
            )}
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
