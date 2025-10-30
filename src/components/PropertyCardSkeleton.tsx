// src/components/PropertyCardSkeleton.tsx
'use client';

import styles from './PropertyCardSkeleton.module.css';

export default function PropertyCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageContainer}>
        <div className={styles.imageSkeleton}></div>
        <div className={styles.statusSkeleton}></div>
        <div className={styles.favoriteSkeleton}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.titleSkeletonSecond}></div>
        
        <div className={styles.priceSkeleton}></div>
        
        <div className={styles.details}>
          <div className={styles.detailSkeleton}></div>
          <div className={styles.detailSkeleton}></div>
          <div className={styles.detailSkeleton}></div>
        </div>
      </div>
    </div>
  );
}
