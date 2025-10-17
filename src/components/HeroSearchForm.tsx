// src/components/HeroSearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSearchForm.module.css'; // เราจะสร้างไฟล์ CSS นี้ในขั้นตอนต่อไป

export default function HeroSearchForm() {
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันไม่ให้ฟอร์มรีเฟรชหน้า

    const params = new URLSearchParams();
    params.append('status', searchStatus);

    if (keyword.trim()) {
      params.append('keyword', keyword.trim());
    }

    // ส่งผู้ใช้ไปที่หน้าแสดงผลการค้นหา (เราจะสร้างหน้านี้ทีหลัง)
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1>Find Your Dream Property in Phuket</h1>
        <p>The best place to find villas, condos, and houses</p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.statusTabs}>
            <button
              type="button"
              className={searchStatus === 'For Sale' ? styles.active : ''}
              onClick={() => setSearchStatus('For Sale')}
            >
              Sale
            </button>
            <button
              type="button"
              className={searchStatus === 'For Rent' ? styles.active : ''}
              onClick={() => setSearchStatus('For Rent')}
            >
              Rent
            </button>
          </div>

          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Enter a location, or property name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}