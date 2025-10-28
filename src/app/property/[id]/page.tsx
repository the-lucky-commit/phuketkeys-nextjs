import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyImage } from '@/lib/types'; // ⭐️ แก้ไข: Import "PropertyImage" ด้วย
import styles from './PropertyDetailPage.module.css';
import PropertyGallery from '@/components/PropertyGallery'; // ⭐️⭐️ 1. เพิ่ม Import นี้ ⭐️⭐️

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

        {/* --- ⭐️⭐️ 2. แทนที่ Gallery เดิมด้วย Component ใหม่ ⭐️⭐️ --- */}
<PropertyGallery 
  mainImageUrl={property.main_image_url || '/img/placeholder.jpg'}
  galleryImages={property.images || []} // ส่ง Array รูปย่อยไป
/>
{/* ---------------------------------------------------- */}

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
            {/* --- ⬇️ [เพิ่ม] Section Amenities ⬇️ --- */}
      {property.amenities && property.amenities.length > 0 && (
        <div className={styles.amenitiesSection}>
          <h2>Amenities</h2>
          <div className={styles.amenitiesGrid}>
            {property.amenities.map((amenity) => (
              <div key={amenity.id} className={styles.amenityItem}>
                {/* ⭐️ แสดง Icon (Font Awesome) ⭐️ */}
                <i className={amenity.icon || 'fas fa-check'}></i>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ --- */}
            <div className={styles.description}>
              <h2>About this property</h2>
              <p>{property.description || 'No description available.'}</p>
            </div>
          </div>
          {/* --- ⬇️ [แทนที่] .contactBox เดิมด้วยโค้ดใหม่นี้ ⬇️ --- */}
<div className={styles.contactBox}>
  <h3>Interested in this property?</h3>

  {/* (Optional) ใส่ชื่อ Agent ถ้ามี */}
  <p className={styles.agentName}>Contact Agent</p>

  {/* ⭐️ ปุ่มใหม่: โทร (Phone) ⭐️ */}
  {/* TODO: อย่าลืมเปลี่ยนเบอร์โทร 08X-XXX-XXXX ให้เป็นเบอร์จริง */}
  <a 
    href="tel:08X-XXX-XXXX" 
    className={`${styles.contactButton} ${styles.phoneButton}`}
  >
    <i className="fas fa-phone-alt"></i> Call Now
  </a>

  {/* ⭐️ ปุ่มใหม่: WhatsApp (หรือ LINE) ⭐️ */}
  {/* TODO: 
      1. เปลี่ยน '668XXXXXXXX' เป็นเบอร์ WhatsApp (เช่น 66812345678)
      2. หรือเปลี่ยน href เป็นลิงก์ LINE (เช่น https://line.me/ti/p/...) 
  */}
  <a 
    href="https://wa.me/668XXXXXXXX" 
    target="_blank" 
    rel="noopener noreferrer"
    className={`${styles.contactButton} ${styles.whatsappButton}`}
  >
    <i className="fab fa-whatsapp"></i> Chat on WhatsApp
  </a>

  {/* ปุ่มเดิม (เปลี่ยนเป็นปุ่มรอง) */}
  <a href="#contact" className={`${styles.contactButton} ${styles.emailButton}`}>
    <i className="fas fa-envelope"></i> Send Enquiry
  </a>
</div>
{/* --- ⬆️ [สิ้นสุดการแทนที่] ⬆️ --- */}
        </div>

      </div>
    </main>
  );
}