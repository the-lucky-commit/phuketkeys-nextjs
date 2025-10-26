// src/components/HeroSearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSearchForm.module.css';

// [ ⬇️ เพิ่ม ] สร้าง List ตัวเลือกสำหรับ Dropdowns 
const propertyTypes = ['All', 'Villa', 'Condo', 'House', 'Apartment', 'Townhouse', 'Shophouse', 'Land'];
const priceRanges = [
  { value: '', label: 'Price Range' },
  { value: '0-10000', label: 'Under 10,000' },
  { value: '10000-30000', label: '10,000 - 30,000' },
  { value: '30000-50000', label: '30,000 - 50,000' },
  { value: '50000-100000', label: '50,000 - 100,000' },
  { value: '100000-', label: '100,000+' },
];
// [ ⬆️ เพิ่ม ]

export default function HeroSearchForm() {
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [keyword, setKeyword] = useState('');
  
  // [ ⬇️ เพิ่ม ] เพิ่ม 2 States ใหม่สำหรับ Dropdowns
  const [type, setType] = useState('All'); // 'All' คือค่าเริ่มต้น
  const [priceRange, setPriceRange] = useState(''); // '' คือค่าเริ่มต้น (Price Range)
  // [ ⬆️ เพิ่ม ]

  // [ 🔄 แก้ไข ] อัปเกรด handleSearch ให้รองรับทุก field
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 

    const params = new URLSearchParams();
    params.append('status', searchStatus);

    if (keyword.trim()) {
      params.append('keyword', keyword.trim());
    }
    
    // [ ⬇️ เพิ่ม ] Logic ใหม่สำหรับ Type และ Price
    if (type !== 'All') {
      params.set('type', type);
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    // [ ⬆️ เพิ่ม ]

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1>Find Your Dream Property in Phuket</h1>
        <p>The best place to find villas, condos, and houses</p>

        {/* [ 🔄 แก้ไข ] เราจะแก้ไขแค่ใน .searchInputWrapper */}
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
          
            {/* [ ⬇️ เพิ่ม ] Dropdown 1: Property Type */}
            <select 
  value={type} 
  onChange={(e) => setType(e.target.value)}
  className={styles.searchDropdown} // ⭐️ ใช้ Class ใหม่
>
              {propertyTypes.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'Property Type' : t}</option>
              ))}
            </select>

            {/* [ ⬇️ เพิ่ม ] Dropdown 2: Price Range */}
            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className={styles.searchDropdown} // ⭐️ ใช้ Class ใหม่
            >
              {priceRanges.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {/* [ ⬆️ เพิ่ม ] */}

            <input
              type="text"
              placeholder="Enter a location, or property name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.searchInput} // ⭐️ Keyword Input (เหมือนเดิม)
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