// src/app/admin/dashboard/PropertyPieChart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

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
          // --- แก้ไขตรงนี้: ใช้ any เพื่อให้ Type ยืดหยุ่น ---
          label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
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