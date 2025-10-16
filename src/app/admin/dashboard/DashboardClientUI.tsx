// src/app/admin/dashboard/DashboardClientUI.tsx
'use client'; // <-- สำคัญมาก! บอกให้ Next.js รู้ว่านี่คือ Client Component

import { useState, useEffect } from 'react';

// สร้าง Type สำหรับข้อมูลที่จะได้รับกลับมา (ตามสไตล์ TypeScript)
interface DashboardStats {
  total_properties: number;
  for_sale: number;
  for_rent: number;
}

interface PropertyType {
  type: string;
  count: string; // API อาจจะส่งมาเป็น string, เราจะแปลงเป็น number ทีหลัง
}

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

        const token = localStorage.getItem('token'); // ใช้ key 'token' ตามโค้ดของนาย
        if (!token) {
          // AdminAuthProvider ควรจะจัดการ redirect แล้ว แต่เราเช็คอีกชั้นเพื่อความปลอดภัย
          throw new Error('Authentication token not found.');
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // ใช้ Promise.all เพื่อดึงข้อมูลทั้ง 2 API พร้อมกัน
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

  if (loading) return <div className="loading-spinner">Loading Data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      {/* Stat Cards */}
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

      {/* Chart Area (Placeholder) */}
      <div className="chart-container" style={{ marginTop: '40px' }}>
        <h2>Properties by Type</h2>
        {/* เราจะเอากราฟมาใส่ตรงนี้ในขั้นตอนต่อไป */}
        <pre>{JSON.stringify(propertyTypes, null, 2)}</pre>
      </div>
    </div>
  );
}