// src/app/admin/dashboard/DashboardClientUI.tsx
'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardStats {
  total_properties: number;
  for_sale: number;
  for_rent: number;
}
interface PropertyType {
  type: string | null;
  count: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A239CA', '#D946EF'];

export default function DashboardClientUI() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found.');

        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, typesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties-by-type`, { headers })
        ]);

        if (!statsRes.ok) throw new Error('Failed to fetch dashboard stats.');
        if (!typesRes.ok) throw new Error('Failed to fetch property types.');

        const statsData: DashboardStats = await statsRes.json();
        const typesData: PropertyType[] = await typesRes.json();

        setStats(statsData);
        setPropertyTypes(typesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const chartData = propertyTypes.map(item => ({
    name: item.type || 'Uncategorized',
    value: parseInt(item.count, 10),
  }));

  if (loading) return <div className="loading-spinner">Loading Data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <div className="stat-cards-container">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <p>{stats?.total_properties ?? 0}</p>
        </div>
        <div className="stat-card">
          <h3>For Sale</h3>
          <p>{stats?.for_sale ?? 0}</p>
        </div>
        <div className="stat-card">
          <h3>For Rent</h3>
          <p>{stats?.for_rent ?? 0}</p>
        </div>
      </div>
      
      <div className="chart-container" style={{ marginTop: '40px', width: '100%', height: 400 }}>
        <h2>Properties by Type</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // --- แก้ไขตรงนี้: เพิ่ม Type ให้กับ props ---
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} properties`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for chart.</p>
        )}
      </div>
    </div>
  );
}