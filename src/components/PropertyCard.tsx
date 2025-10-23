// src/components/PropertyCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }: { property: Property }) {
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(property.price).replace('THB', '฿');

  return (
    <div className={styles.card}>
      {/* --- กรอบอ้างอิง Relative --- */}
      <Link href={`/property/${property.id}`} className={styles.imageLink}>
        
        {/* --- ย้าย Status Badge มาไว้ข้างในนี้ --- */}
        <span className={styles.status}>{property.status}</span> 
        {/* -------------------------------------- */}

        <Image
          src={property.main_image_url || '/img/placeholder.jpg'}
          alt={property.title}
          width={400} 
          height={220} // Make sure this matches CSS height for consistency
          className={styles.cardImage}
          priority={false} // Only use priority on above-the-fold images if needed
        />
      </Link>
      
      {/* --- ส่วน Content (ไม่มี Status Badge แล้ว) --- */}
      <div className={styles.cardContent}>
        <h3 className={styles.title}>
          <Link href={`/property/${property.id}`}>{property.title}</Link>
        </h3>
        {/* <p className={styles.location}>Phuket, Thailand</p> */}
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