import React from 'react';
import EditForm from './EditForm';
import { Property } from '@/lib/types'; // <-- 1. Import Type กลางเข้ามา

// 2. ลบ interface Property ที่เคยอยู่ตรงนี้ทิ้งไป

async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    // บอก TypeScript ว่าข้อมูลที่ได้มาเป็น Type Property
    const data: Property = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch property by ID for edit page:", error);
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    return (
        <main className="main-content">
            <p style={{textAlign: 'center', padding: '50px'}}>Property not found or failed to load.</p>
        </main>
    );
  }

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Edit Property: {property.title}</h1>
      </header>
      <section className="content-area">
         <div className="form-container">
            <EditForm property={property} />
         </div>
      </section>
    </main>
  );
}