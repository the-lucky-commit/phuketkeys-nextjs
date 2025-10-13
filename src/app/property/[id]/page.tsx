import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/types'; // 1. Import Type กลางเข้ามา
import type { Metadata } from 'next';

// ฟังก์ชันดึงข้อมูล (Data Fetching Function)
async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, { 
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!response.ok) {
        console.error(`Failed to fetch property ${id}, status: ${response.status}`);
        return null;
    }
    const data: Property = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching property by ID ${id}:`, error);
    return null;
  }
}

// --- 2. เพิ่มฟังก์ชัน generateMetadata ---
type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyById(params.id);

  if (!property) {
    return {
      title: 'Property Not Found - Phuket Keys',
    };
  }

  return {
    title: `${property.title} - Phuket Keys`,
    description: property.description || `View details for ${property.title}, a premium property available in Phuket.`,
  };
}

// หน้าแสดงรายละเอียด (Detail Page Component)
export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    return (
      <main>
          <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
            <h1>Property Not Found</h1>
            <p>The property you are looking for does not exist or could not be loaded.</p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
      </main>
    );
  }
  
  return (
    <main>
      <section className="property-detail-section">
        <div className="container">
          <div className="property-detail-layout">
            <div className="property-gallery">
              <Image 
                src={property.main_image_url || '/img/placeholder.jpg'} 
                alt={property.title}
                width={800}
                height={600}
                className="property-main-image"
                priority
              />
            </div>
            <div className="property-info">
              <h1>{property.title}</h1>
              <p className="price">฿ {new Intl.NumberFormat('th-TH').format(property.price)} {property.price_period || ''}</p>
              
              {/* --- ส่วนที่แก้ไข: แสดงข้อมูลใหม่ --- */}
              <div className="property-quick-stats">
                {property.bedrooms && <span><i className="fas fa-bed"></i> {property.bedrooms} Beds</span>}
                {property.bathrooms && <span><i className="fas fa-bath"></i> {property.bathrooms} Baths</span>}
                {property.area_sqm && <span><i className="fas fa-ruler-combined"></i> {property.area_sqm} sqm</span>}
              </div>
              
              <div className="property-description">
                <h3>Property Description</h3>
                <p>{property.description || 'Contact us for more information about this property.'}</p>
              </div>

              <a href="#contact" className="btn-primary">Contact Agent</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}