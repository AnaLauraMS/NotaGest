// components/PropertyManagerModal/PropertyManagerModal.tsx
"use client";
import React from "react";
import { IoTrashBinSharp } from "react-icons/io5";

type Property = {
  _id: string;
  nome: string;
  // Adicione outros campos se quiser exibi-los
};

interface PropertyManagerModalProps {
  properties: Property[];
  onClose: () => void;
  onDeleteProperty: (propertyId: string) => Promise<void>; // Função que chama a API
}

const PropertyManagerModal: React.FC<PropertyManagerModalProps> = ({
  properties,
  onClose,
  onDeleteProperty,
}) => {
  return (
    // 1. Fundo do Modal: Alterado para bg-sky-950 com opacidade
    <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-30 px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          {/* 2. Título do Modal: Cor azul consistente */}
          <h2 className="text-xl font-bold text-sky-900">Gerenciar Imóveis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {properties.length === 0 ? (
          <p className="text-gray-600 text-center">Nenhum imóvel cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {properties.map((property) => (
              <li
                key={property._id}
                className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
              >
                <span className="text-gray-800">{property.nome}</span>
                <button
                  onClick={() => onDeleteProperty(property._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Excluir Imóvel"
                >
                  <IoTrashBinSharp size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            // 3. Botão "Fechar": Alterado para bg-sky-700 e texto branco para consistência
            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagerModal;