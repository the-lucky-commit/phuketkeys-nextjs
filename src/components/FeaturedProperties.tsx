// src/components/FeaturedProperties.tsx
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard'; // ใช้ PropertyCard เดิม
import styles from './FeaturedProperties.module.css'; // สร้าง CSS Module ใหม่

// ฟังก์ชันดึงข้อมูล Featured Properties (ทำงานบน Server)
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // ใช้ URL เต็ม (Internal fetch บน Server ต้องใช้ Absolute URL หรือตั้งค่าให้รู้จัก)
    // หรือถ้า deploy ที่เดียวกัน อาจใช้แค่ /api/properties/featured
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/properties/featured`;
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate ทุกชั่วโมง
    });

    if (!response.ok) {
      console.error("Failed to fetch featured properties, status:", response.status);
      return []; // คืนค่า array ว่างถ้ามีปัญหา
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return []; // คืนค่า array ว่างถ้ามี error
  }
}

export default async function FeaturedProperties() {
  const featured = await getFeaturedProperties();

  if (!featured || featured.length === 0) {
    return null; // ไม่ต้องแสดงผล Section นี้ถ้าไม่มีข้อมูล
  }

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <h2>Featured Properties</h2>
        <div className={styles.propertyGrid}>
          {featured.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}