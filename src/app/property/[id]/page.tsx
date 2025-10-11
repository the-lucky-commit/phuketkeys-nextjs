import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    console.error("Failed to fetch property by ID:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>Property Not Found</h1>
        <p>The property you are looking for does not exist.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }
  
  // Header และ Footer จะถูกนำมาจาก RootLayout โดยอัตโนมัติ
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
              <div className="property-status-badge">{property.status}</div>
              
              <div className="property-description">
                <h3>Property Description</h3>
                <p>
                  Welcome to this exquisite property located in the heart of Phuket. 
                  Offering unparalleled luxury and comfort, this {property.title.toLowerCase()} is perfect for those seeking a premium living experience.
                  Contact us for more information and to schedule a viewing.
                </p>
              </div>

              <div className="property-features">
                 <h3>Key Features</h3>
                 <ul>
                    <li><i className="fas fa-check"></i> Prime Location</li>
                    <li><i className="fas fa-check"></i> Modern Design</li>
                    <li><i className="fas fa-check"></i> 24/7 Security</li>
                    <li><i className="fas fa-check"></i> Close to Amenities</li>
                 </ul>
              </div>
              <a href="#contact" className="btn-primary">Contact Agent</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}