import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/types';
// --- 1. Import CSS Module สำหรับหน้านี้ ---
import styles from './PropertyDetailPage.module.css';

// ฟังก์ชันดึงข้อมูล (เหมือนเดิม)
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

// ฟังก์ชันสร้าง Metadata (เหมือนเดิม)
type Props = {
  params: { id: string }
}
export async function generateMetadata({ params }: Props) {
  const property = await getPropertyById(params.id);
  if (!property) {
    return { title: 'Property Not Found' };
  }
  return {
    title: `${property.title} - Phuket Keys`,
    description: property.description || `View details for ${property.title}, a premium property in Phuket.`,
  };
}

// หน้าแสดงรายละเอียด (Detail Page Component - อัปเดตโครงสร้าง UI)
export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  // การจัดการ Not Found (เหมือนเดิม)
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

  // --- ใช้ Price Formatting จากโค้ดใหม่ ---
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(property.price).replace('THB', '฿');
  
  return (
    // --- ใช้ className จาก CSS Module ---
    <main className={styles.pageContainer}> 
      <div className="container">
        
        {/* --- โค้ดทดสอบ CSS Grid --- */}
<div style={{ border: '2px dashed green', padding: '10px', marginBottom: '20px' }}>
  <h2>Grid Test Section</h2>
  <div className={styles.infoGrid}> 
    <div style={{ background: 'lightblue', padding: '10px' }}>Column 1 Test</div>
    <div style={{ background: 'lightcoral', padding: '10px' }}>Column 2 Test</div>
  </div>
</div>
{/* --------------------------- */}

        {/* --- โครงสร้าง Image Gallery จากโค้ดใหม่ --- */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image
              src={property.main_image_url || '/img/placeholder.jpg'}
              alt={property.title}
              fill // ใช้ fill เพื่อให้รูปเต็มกรอบ
              style={{ objectFit: 'cover' }}
              priority // ให้โหลดรูปหลักก่อน
            />
          </div>
          {/* ตรวจสอบว่ามี images หรือไม่ก่อนแสดง */}
          {property.images && property.images.length > 0 && (
            <div className={styles.thumbnailGrid}>
              {property.images.map(img => (
                <div key={img.id} className={styles.thumbnail}>
                  <Image
                    src={img.image_url}
                    alt={`Gallery image for ${property.title}`}
                    fill // ใช้ fill กับ thumbnails ด้วย
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- โครงสร้าง Property Info (2 columns) จากโค้ดใหม่ --- */}
        <div className={styles.infoGrid}>
          <div className={styles.mainInfo}>
            <span className={styles.status}>{property.status}</span>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.price}>
              {priceFormatted} {property.price_period ? `/ ${property.price_period}` : ''}
            </div>
            <div className={styles.specs}>
              {property.bedrooms && <span><i className="fas fa-bed"></i> {property.bedrooms} Bedrooms</span>}
              {property.bathrooms && <span><i className="fas fa-bath"></i> {property.bathrooms} Bathrooms</span>}
              {property.area_sqm && <span><i className="fas fa-ruler-combined"></i> {property.area_sqm} m²</span>}
            </div>
            <div className={styles.description}>
              <h2>About this property</h2>
              <p>{property.description || 'No description available.'}</p>
            </div>
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.contactBox}>
              <h3>Interested in this property?</h3>
              <p>Contact us for more information or to schedule a viewing.</p>
              <a href="#contact" className={styles.contactButton}>Contact Agent</a>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}