import React from 'react';
import EditForm from './EditForm';

// ... (ใส่ Interface Property ที่นี่) ...
interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
}

async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    return <p>Property not found.</p>;
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