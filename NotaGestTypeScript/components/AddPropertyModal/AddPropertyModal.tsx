'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddPropertyModalProps {
    onClose: () => void;
    onAddProperty: (property: string) => void;
}

const AddPropertyModal = ({ onClose, onAddProperty }: AddPropertyModalProps) => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [type, setType] = useState('');

    const propertyTypes = ['Casa', 'Apartamento', 'Sítio', 'Chácara', 'Comercial'];

    const fetchAddressByCep = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setStreet(data.logradouro);
                setNeighborhood(data.bairro);
                setCity(data.localidade);
                setState(data.uf);
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            alert('Erro ao buscar o CEP.');
        }
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
        setCep(newCep); // Atualiza o estado do CEP digitado

        // Quando o CEP tem exatamente 8 caracteres, faz a busca do endereço
        if (newCep.length === 8) {
            fetchAddressByCep(newCep);// Chama a função para buscar o endereço
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Aqui futuramente tera a integração com o banco de dados
        const fullAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`;
        console.log({
            name,
            type,
            address: fullAddress,
        });

        onAddProperty('Imóvel adicionado com sucesso');
        onClose(); // Fecha o modal após a adição
    };

    const handleCancel = () => {
        onClose(); // Fecha o modal quando o usuário clica em "Cancelar"
    };

    return (
        <div className="fixed inset-0 bg-sky-950 bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4 text-sky-900 text-center">Adicionar novo imóvel</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    {/* Nome do Imóvel */}
                    <input
                        type="text"
                        placeholder="Nome do imóvel"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* CEP */}
                    <input
                        type="text"
                        placeholder="CEP"
                        value={cep}
                        onChange={handleCepChange}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Endereço automático */}
                    <input
                        type="text"
                        placeholder="Rua"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Bairro"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    <input
                        type="text"
                        placeholder="Número"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    </div>

                    {/* Bairro, Cidade e Estado */}
                    <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Estado"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    </div>

                    {/* Tipo do Imóvel */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Tipo de imóvel</option>
                        {propertyTypes.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {/* Botões */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}  // Fecha o modal
                            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 w-full sm:w-auto"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyModal;
