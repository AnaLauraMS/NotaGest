'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import React from 'react';

const data = [
  { mes: 'Jan', gastos: 1200 },
  { mes: 'Fev', gastos: 800 },
  { mes: 'Mar', gastos: 1500 },
  { mes: 'Abr', gastos: 1700 },
  { mes: 'Mai', gastos: 900 },
];

const GastosChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-sky-900">Gastos Mensais (simulados)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="gastos" fill="#0284C7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GastosChart;
