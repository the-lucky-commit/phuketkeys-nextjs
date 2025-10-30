// src/components/FeaturedProperties.tsx
import { Property } from '@/lib/types';
import styles from './FeaturedProperties.module.css'; // ⭐️ Import styles (แค่ครั้งเดียว)

// [ ⬇️ เพิ่ม ] Import Component ใหม่ของเรา
import PropertyCarousel from './PropertyCarousel';
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
      <div className="container">
        <h2>Featured Properties</h2>

        {/* 1. เรียก Carousel แค่ครั้งเดียว และส่ง 'featured' (Array) เข้าไป */}
        <PropertyCarousel properties={featured} />
        
        {/* 2. ปุ่ม View All อยู่นอก Carousel (ไม่ใช่ข้างใน) */}
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