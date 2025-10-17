// src/app/admin/dashboard/PropertyPieChart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- แก้ไข Type ตรงนี้ ---
interface ChartData {
  name: string;
  value: number;
  [key: string]: any; // เพิ่ม Index Signature เพื่อให้เข้ากันได้กับ Recharts
}
// -------------------------

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A239CA', '#D946EF'];

export default function PropertyPieChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return <p>No data available for chart.</p>;
  }
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} properties`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}