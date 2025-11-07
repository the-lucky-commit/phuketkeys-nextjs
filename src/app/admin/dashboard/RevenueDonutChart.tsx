// src/app/admin/dashboard/RevenueDonutChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface RevenueDonutChartProps {
  data: ChartData[];
}

const COLORS = ['#2a5934', '#4a7c59', '#6a9f7e', '#8ac2a3'];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RevenueDonutChart({ data }: RevenueDonutChartProps) {
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);

  if (filteredData.length === 0) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ fontSize: '14px', color: '#333' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
