// src/app/admin/dashboard/RevenueBarChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyRevenue {
  month: string;
  sales: number;
  rental: number;
}

interface RevenueBarChartProps {
  data: MonthlyRevenue[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RevenueBarChart({ data }: RevenueBarChartProps) {
  if (!data || data.length === 0) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#666', fontSize: 12 }}
          axisLine={{ stroke: '#999' }}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 12 }}
          axisLine={{ stroke: '#999' }}
          tickFormatter={(value) => `฿${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        <Bar 
          dataKey="sales" 
          fill="#2a5934" 
          name="Sales Revenue"
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="rental" 
          fill="#6a9f7e" 
          name="Rental Revenue"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
