// src/app/admin/dashboard/DashboardClientUI.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic

// ใช้ dynamic import เพื่อเรียก Component กราฟ (เหมือนเดิม)
const PropertyPieChart = dynamic(() => import('./PropertyPieChart'), { 
  ssr: false,
  loading: () => <p>Loading chart...</p> 
});

// --- [ 1. อัปเดต Interface ] ---
// (เพิ่ม fields ใหม่ให้ตรงกับ API ที่เราแก้)
interface DashboardStats {
  total_properties: number;
  for_sale: number;
  for_rent: number;
  available: number; // ⭐️ เพิ่ม
  reserved: number;  // ⭐️ เพิ่ม
  for_rent_daily: number; // ⭐️ เพิ่ม
}

// (Interface นี้เหมือนเดิม)
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
    // --- [ 2. ส่วน Fetch Data (เหมือนเดิม ไม่ต้องแก้) ] ---
    // (Logic นี้ถูกต้องอยู่แล้ว ดึง /api/admin/stats มาครบ)
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
  }, []); // (ทำงานครั้งเดียว ถูกต้อง)

  // --- [ 3. ส่วน Data ของกราฟ (เหมือนเดิม ไม่ต้องแก้) ] ---
  const chartData = propertyTypes.map(item => ({
    name: item.type || 'Uncategorized',
    value: parseInt(item.count, 10),
  }));

  // --- [ 4. ส่วน Loading/Error (เหมือนเดิม ไม่ต้องแก้) ] ---
  if (loading) return <div className="loading-spinner">Loading Data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  // --- [ 5. (Optional) สร้างตัวแปรช่วยรวมยอดเช่า ] ---
  // (ใช้ Number() เพื่อความปลอดภัย กันค่าที่มาจาก DB เป็น string)
  const totalRent = (stats ? Number(stats.for_rent) : 0) + (stats ? Number(stats.for_rent_daily) : 0);

  // --- [ 6. อัปเดต JSX (Return) ] ---
  // (แสดงผลการ์ดสถิติใหม่ทั้งหมด)
  return (
    <div>
      <div className="stat-cards-container">
        
        <div className="stat-card">
          <h3>Total Units</h3>
          <p>{stats ? stats.total_properties : 0}</p> 
        </div>

        <div className="stat-card">
          <h3>Available Units</h3>
          <p>{stats ? stats.available : 0}</p> 
        </div>

        <div className="stat-card">
          <h3>Reserved Units</h3>
          <p>{stats ? stats.reserved : 0}</p> 
        </div>
        
        <div className="stat-card">
          <h3>Units For Sale</h3>
          <p>{stats ? stats.for_sale : 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total For Rent</h3>
          <p>{totalRent}</p> 
        </div>

         <div className="stat-card">
          <h3>Daily Rent</h3>
          <p>{stats ? stats.for_rent_daily : 0}</p> 
        </div>

      </div>

      {/* --- ส่วน Pie Chart (เหมือนเดิม) --- */}
      <div className="chart-container" style={{ marginTop: '40px' }}>
        <h2>Properties by Type</h2>
        <PropertyPieChart data={chartData} />
      </div>
    </div>
  );
}