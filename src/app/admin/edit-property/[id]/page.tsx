'use client'; // <-- 1. ย้ายขึ้นมาอยู่บรรทัดแรกสุด

import { useState, useEffect } from 'react';
import React from 'react';
import EditForm from './EditForm';
import ImageGalleryManager from './ImageGalleryManager';
import { Property } from '@/lib/types';
import { getAuthHeaders } from '@/lib/auth';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${params.id}`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="main-content">
        <p style={{ textAlign: 'center', padding: '50px' }}>Loading property details...</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="main-content">
        <p style={{ textAlign: 'center', padding: '50px' }}>Property not found.</p>
      </main>
    );
  }

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Edit Property: {property.title}</h1>
      </header>
      <section className="content-area">
         <div className="form-container" style={{display: 'flex', gap: '40px', alignItems: 'flex-start'}}>
            <div style={{flex: 1}}>
                <EditForm property={property} />
            </div>
            <div style={{flex: 1}}>
                <ImageGalleryManager propertyId={property.id} initialImages={property.images || []} />
            </div>
         </div>
      </section>
    </main>
  );
}