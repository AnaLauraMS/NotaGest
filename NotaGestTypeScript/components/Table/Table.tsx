'use client';

import React from 'react';

interface PropertyNotesData {
  property: string;
  noteCount: number;
}

interface NotesPerPropertyTableProps {
  data: PropertyNotesData[];
}

const NotesPerPropertyTable: React.FC<NotesPerPropertyTableProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-sky-900 mb-4">Quantidade de Notas por Imóvel</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border-b">Imóvel</th>
              <th className="px-4 py-2 border-b">Quantidade de Notas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 border-b">{item.property}</td>
                <td className="px-4 py-2 border-b">{item.noteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesPerPropertyTable;
