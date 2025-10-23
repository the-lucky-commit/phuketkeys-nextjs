// src/components/PropertyList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import styles from './PropertyList.module.css';

// --- สร้าง List ของ Property Types (นายสามารถเพิ่ม/แก้ไขได้ตามต้องการ) ---
const propertyTypes = ['All', 'Villa', 'Condo', 'House', 'Apartment', 'Townhouse', 'Shophouse', 'Land'];

export default function PropertyList({ searchParams: initialSearchParams }: { searchParams: { [key: string]: any } }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State สำหรับ Filter ใหม่ ---
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // --- ใช้ useCallback ห่อหุ้ม fetchProperties ---
  const fetchProperties = useCallback(async () => {
    // setIsLoading(true) เฉพาะตอนโหลดครั้งแรก หรือเมื่อ Filter หลักเปลี่ยน (ไม่ใช่แค่เปลี่ยนหน้า)
     if (searchParams.get('page') === '1' || !searchParams.has('page')) {
         setIsLoading(true);
     }
    try {
      const params = new URLSearchParams(searchParams.toString());
      // อ่านค่า page จาก URLSearchParams ถ้าไม่มีให้ใช้ 1
      const pageQuery = params.get('page') || '1';
      params.set('page', pageQuery);

      // --- เพิ่ม Filter ใหม่เข้าไปใน Params ---
      if (selectedType !== 'All') {
        params.set('type', selectedType);
      } else {
        params.delete('type'); // ถ้าเลือก All ไม่ต้องส่ง type ไป
      }
      if (minPrice) {
        params.set('minPrice', minPrice);
      } else {
        params.delete('minPrice');
      }
      if (maxPrice) {
        params.set('maxPrice', maxPrice);
      } else {
        params.delete('maxPrice');
      }
      // ------------------------------------

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error(error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, selectedType, minPrice, maxPrice]); // เพิ่ม dependencies

  useEffect(() => {
    // อัปเดต state จาก URL เมื่อ component โหลดครั้งแรกหรือ URL เปลี่ยน
    setSelectedType(searchParams.get('type') || 'All');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    fetchProperties();
  }, [searchParams, fetchProperties]); // เรียก fetchProperties เมื่อ searchParams เปลี่ยน

  // --- ฟังก์ชันสำหรับอัปเดต Filter และ URL ---
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // กลับไปหน้า 1 เสมอเมื่อใช้ Filter ใหม่

    if (selectedType !== 'All') {
      params.set('type', selectedType);
    } else {
      params.delete('type');
    }
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }

    router.push(`${pathname}?${params.toString()}`);
  };


  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  let pageTitle = "Properties";
  if (status || keyword || selectedType !== 'All' || minPrice || maxPrice) {
      pageTitle = `Search Results`; // ปรับ Title ให้กระชับขึ้น
  }

  const renderPageNumbers = () => { /* ... โค้ดส่วนนี้เหมือนเดิม ... */ };

  return (
    <div>
      {/* --- เพิ่ม Filter Sidebar --- */}
      <aside className={styles.filterSidebar}>
        <h3>Filters</h3>
        <div className={styles.filterGroup}>
          <label htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Price Range (฿)</label>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>
        <button onClick={applyFilters} className={styles.applyFilterButton}>Apply Filters</button>
      </aside>

      {/* --- ส่วนแสดงผลหลัก --- */}
      <div className={styles.resultsArea}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>

          {isLoading ? (
            <p>Loading...</p>
          ) : properties.length > 0 ? (
            <>
              <div className={styles.propertyGrid}>
                {properties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  {/* ... ปุ่ม Pagination เหมือนเดิม ... */}
                </div>
              )}
            </>
          ) : (
            <p>No properties found matching your criteria.</p>
          )}
      </div>
    </div>
  );
}