// src/components/PropertyCard.tsx
'use client'; // ⭐️ 1. (สำคัญมาก!) เปลี่ยนเป็น Client Component

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import styles from './PropertyCard.module.css';

// --- ⬇️ [เพิ่ม] 2. Import สิ่งที่เราต้องใช้ ---
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
// --- ⬆️ [สิ้นสุดการเพิ่ม] ---

export default function PropertyCard({ property }: { property: Property }) {
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(property.price).replace('THB', '฿');

  // --- ⬇️ [เพิ่ม] 3. ดึงข้อมูลจาก AuthContext ---
  const { user, favoriteIds, addFavorite, removeFavorite } = useAuth();
  const router = useRouter();
  
  // 4. เช็คว่า Property นี้ถูก "ถูกใจ" หรือยัง
  const isFavorite = favoriteIds.has(property.id);
  // --- ⬆️ [สิ้นสุดการเพิ่ม] ---

  // --- ⬇️ [เพิ่ม] 5. สร้างฟังก์ชันสำหรับกดปุ่มหัวใจ ---
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();  // ⭐️ 1. ป้องกัน Link (หน้า) เปลี่ยน
    e.stopPropagation(); // ⭐️ 2. ป้องกัน Event ซ้อน

    if (!user) {
      // ⭐️ ถ้ายังไม่ Login
      toast.error('Please log in to add favorites.');
      router.push('/customer-login'); // ⭐️ ส่งไปหน้า Login
      return;
    }

    // ⭐️ ถ้า Login แล้ว
    if (isFavorite) {
      removeFavorite(property.id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(property.id);
      toast.success('Added to favorites!');
    }
  };
  // --- ⬆️ [สิ้นสุดการเพิ่ม] ---

  // Helper function to get badge text
  const getBadgeText = () => {
    if (property.type_of_sale === 'For Rent (Daily)') return 'DAILY RENT';
    if (property.type_of_sale === 'For Rent') return 'FOR RENT';
    if (property.type_of_sale === 'For Sale') return 'FOR SALE';
    return property.status || 'AVAILABLE';
  };

  return (
    <div className={styles.card}>
      <Link href={`/property/${property.id}`} className={styles.imageLink}>
        
        <span className={styles.status}>{getBadgeText()}</span> 

        {/* --- ⬇️ [เพิ่ม] 6. "ปุ่มหัวใจ" (Favorite Button) --- */}
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {/* ⭐️ ใช้ 'fas' (หัวใจทึบ) เมื่อ 'ถูกใจ' และ 'far' (หัวใจโปร่ง) เมื่อยังไม่ถูกใจ */}
          <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
        {/* --- ⬆️ [สิ้นสุดการเพิ่ม] --- */}

        <Image
          src={property.main_image_url || '/img/placeholder.jpg'}
          alt={property.title}
          width={400} 
          height={220}
          className={styles.cardImage}
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHBEf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      
      <div className={styles.cardContent}>
        <h3 className={styles.title}>
          <Link href={`/property/${property.id}`}>{property.title}</Link>
        </h3>
        <div className={styles.price}>
          {priceFormatted} {property.price_period ? `/ ${property.price_period}` : ''}
        </div>
        <div className={styles.details}>
          {property.bedrooms && <span><i className="fas fa-bed"></i> {property.bedrooms} Beds</span>}
          {property.bathrooms && <span><i className="fas fa-bath"></i> {property.bathrooms} Baths</span>}
          {property.area_sqm && <span><i className="fas fa-ruler-combined"></i> {property.area_sqm} m²</span>}
        </div>
      </div>
    </div>
  );
}