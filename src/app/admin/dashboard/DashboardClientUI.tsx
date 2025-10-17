// src/app/admin/dashboard/DashboardClientUI.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // <-- 1. Import dynamic

// --- 2. ใช้ dynamic import เพื่อเรียก Component กราฟ ---
// นี่คือการบอก Next.js ว่าไม่ต้อง Render Component นี้ในฝั่ง Server (ssr: false)
const PropertyPieChart = dynamic(() => import('./PropertyPieChart'), { 
  ssr: false,
  loading: () => <p>Loading chart...</p> // แสดงข้อความระหว่างรอโหลด Component
});

// (Type definitions เหมือนเดิม)
interface DashboardStats {
  total_properties: number;
  for_sale: number;
  for_rent: number;
}
interface PropertyType {
  type: string | null;
  count: string;
}

export default function DashboardClientUI() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... โค้ด fetchData เหมือนเดิมทุกประการ ไม่ต้องแก้ไข ...
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
      {/* Stat Cards (เหมือนเดิม) */}
      <div className="stat-cards-container">
        {/* ...การ์ดแสดงผลตัวเลข... */}
      </div>

      {/* --- 3. เรียกใช้ Component กราฟตัวใหม่ของเรา --- */}
      <div className="chart-container" style={{ marginTop: '40px' }}>
        <h2>Properties by Type</h2>
        <PropertyPieChart data={chartData} />
      </div>
    </div>
  );
}