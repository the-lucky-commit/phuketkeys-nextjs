import React from 'react';
import PropertiesTable from './PropertiesTable';
import Link from 'next/link'; // <-- 1. Import Link เข้ามา

// Interface และ function getProperties() เหมือนเดิม
interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  created_at: string;
  main_image_url: string;
  price_period?: string;
}

async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch('http://localhost:3000/api/admin/properties', { cache: 'no-store' });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to fetch properties for admin:", error);
    return [];
  }
}

export default async function ManagePropertiesPage() {
  const properties = await getProperties();
  
  return (
    <main className="main-content">
      <header className="main-header with-button">
        <h1>Manage Properties</h1>
        
        {/* 2. แก้จาก <link> เป็น <Link> (ตัว L ใหญ่) */}
        <Link href="/admin/add-property" className="btn-primary">
          <i className="fas fa-plus"></i> Add New Property
        </Link>

      </header>
      <section className="content-area">
        <PropertiesTable initialProperties={properties} />
      </section>
    </main>
  );
}