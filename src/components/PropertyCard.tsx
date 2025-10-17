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
      <Link href={`/property/${property.id}`} className={styles.imageLink}>
        <Image
          src={property.main_image_url || '/img/placeholder.jpg'}
          alt={property.title}
          width={400}
          height={250}
          className={styles.cardImage}
        />
      </Link>
      <div className={styles.cardContent}>
        <span className={styles.status}>{property.status}</span>
        <h3 className={styles.title}>
          <Link href={`/property/${property.id}`}>{property.title}</Link>
        </h3>
        {/* นายสามารถเพิ่ม location ได้ ถ้ามีข้อมูลใน API */}
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