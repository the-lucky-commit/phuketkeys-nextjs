// src/components/FeaturedProperties.tsx
import { Property } from '@/lib/types';
import styles from './FeaturedProperties.module.css'; // ⭐️ Import styles (แค่ครั้งเดียว)

// [ ⬇️ เพิ่ม ] Import Component ใหม่ของเรา
import PropertyCarousel from './PropertyCarousel';
import PropertyCard from './PropertyCard';
import Link from 'next/link'; // ⭐️ 1. Import Link

// ฟังก์ชันดึงข้อมูล Featured Properties (ทำงานบน Server)
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // Use direct fetch instead of API wrapper for server-side
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/featured`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error("Failed to fetch featured properties, status:", response.status);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return []; 
  }
}

export default async function FeaturedProperties() {
  const featured = await getFeaturedProperties();

  if (!featured || featured.length === 0) {
    return null; 
  }

  // --- ⬇️ [แก้ไข] โครงสร้างที่ถูกต้องอยู่ตรงนี้ ⬇️ ---
  return (
    <section className={styles.featuredSection}>
      <div className={styles.container}>
        <h2>Featured Properties</h2>

        {/* Properties Grid instead of Carousel for better mobile experience */}
        <div className={styles.propertiesGrid}>
          {featured.slice(0, 4).map((property) => (
            <div key={property.id} className={styles.propertyItem}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
        
        {/* 2. ปุ่ม View All อยู่นอก Grid */}
        <div className={styles.viewAllWrapper}>
          <Link href="/properties" className={styles.viewAllButton}>
            View All Properties
          </Link>
        </div>

      </div>
    </section>
  );
  // --- ⬆️ [สิ้นสุดการแก้ไข] ---
}