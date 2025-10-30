// src/components/HeroSearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertiesAPI } from '@/lib/api';
import styles from './HeroSearchForm.module.css';

const propertyTypes = ['All', 'Villa', 'Condo', 'House', 'Apartment', 'Townhouse', 'Shophouse', 'Land'];
const priceRanges = [
  { value: '', label: 'Price Range' },
  { value: '0-10000', label: 'Under ฿10,000' },
  { value: '10000-30000', label: '฿10,000 - ฿30,000' },
  { value: '30000-50000', label: '฿30,000 - ฿50,000' },
  { value: '50000-100000', label: '฿50,000 - ฿100,000' },
  { value: '100000-', label: '฿100,000+' },
];

const bedroomOptions = [
  { value: '', label: 'Bedrooms' },
  { value: '1', label: '1+ Bedroom' },
  { value: '2', label: '2+ Bedrooms' },
  { value: '3', label: '3+ Bedrooms' },
  { value: '4', label: '4+ Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
];

export default function HeroSearchForm() {
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState<'For Sale' | 'For Rent' | 'For Rent (Daily)'>('For Sale');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('All');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSearching(true);

    try {
      const params = new URLSearchParams();
      params.append('status', searchStatus);

      if (keyword.trim()) {
        params.append('keyword', keyword.trim());
      }
      
      let minPrice: string | null = null;
      let maxPrice: string | null = null;
      
      if (type !== 'All') {
        params.set('type', type);
      }
      
      if (priceRange) {
        const [min, max] = priceRange.split('-');
        if (min) {
          params.set('minPrice', min);
          minPrice = min;
        }
        if (max) {
          params.set('maxPrice', max);
          maxPrice = max;
        }
      }

      if (bedrooms) {
        params.set('bedrooms', bedrooms);
      }

      // Log search (fire-and-forget)
      const logData = {
        status: searchStatus,
        type: type !== 'All' ? type : null,
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        keyword: keyword.trim() || null
      };

      propertiesAPI.logSearch(logData).catch(() => {}); // Ignore errors

      // Navigate to results
      router.push(`/properties?${params.toString()}`);
    } finally {
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>Find Your</span> Dream Property
            <br />
            <span className={styles.location}>in Phuket</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover the perfect villa, condo, or house in paradise
          </p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.statusTabs}>
            <button
              type="button"
              className={`${styles.statusTab} ${searchStatus === 'For Sale' ? styles.active : ''}`}
              onClick={() => setSearchStatus('For Sale')}
            >
              <i className="fas fa-home"></i>
              <span>Buy</span>
            </button>
            <button
              type="button"
              className={`${styles.statusTab} ${searchStatus === 'For Rent' ? styles.active : ''}`}
              onClick={() => setSearchStatus('For Rent')}
            >
              <i className="fas fa-key"></i>
              <span>Rent</span>
            </button>
            <button
              type="button"
              className={`${styles.statusTab} ${searchStatus === 'For Rent (Daily)' ? styles.active : ''}`}
              onClick={() => setSearchStatus('For Rent (Daily)')}
            >
              <i className="fas fa-calendar-day"></i>
              <span>Daily</span>
            </button>
          </div>

          <div className={styles.searchInputWrapper}>
            <div className={styles.inputGroup}>
              <i className="fas fa-building"></i>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className={styles.searchSelect}
              >
                {propertyTypes.map(t => (
                  <option key={t} value={t}>{t === 'All' ? 'Property Type' : t}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <i className="fas fa-dollar-sign"></i>
              <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className={styles.searchSelect}
              >
                {priceRanges.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <i className="fas fa-bed"></i>
              <select 
                value={bedrooms} 
                onChange={(e) => setBedrooms(e.target.value)}
                className={styles.searchSelect}
              >
                {bedroomOptions.map(b => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Enter location, property name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <button 
              type="submit" 
              className={`${styles.searchButton} ${isSearching ? styles.searching : ''}`}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  <span>Search Properties</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}