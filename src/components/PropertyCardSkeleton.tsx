// src/components/PropertyCardSkeleton.tsx
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import base styles
import styles from './PropertyCard.module.css'; // ใช้สไตล์จาก Card จริง

export default function PropertyCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className={styles.card}>
        {/* Skeleton for Image */}
        <Skeleton height={220} style={{ display: 'block' }} /> 
        <div className={styles.cardContent}>
          {/* Skeleton for Status Badge */}
          <Skeleton width={80} height={20} style={{ marginBottom: '10px', borderRadius: '20px' }} />
          {/* Skeleton for Title */}
          <Skeleton height={24} style={{ marginBottom: '10px' }} />
          {/* Skeleton for Price */}
          <Skeleton height={28} width="50%" style={{ marginBottom: '15px' }} />
          {/* Skeleton for Details */}
          <div className={styles.details} style={{ borderTop: 'none', paddingTop: 0 }}>
            <Skeleton width={60} />
            <Skeleton width={60} />
            <Skeleton width={80} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
