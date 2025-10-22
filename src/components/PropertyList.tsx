// src/components/PropertyList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Import เพิ่ม
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import styles from './PropertyList.module.css';

export default function PropertyList({ searchParams: initialSearchParams }: { searchParams: { [key: string]: any } }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // --- 1. เพิ่ม State สำหรับ Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // สร้าง URL query string จาก searchParams ปัจจุบัน
        const params = new URLSearchParams(searchParams.toString());
        // ตรวจสอบว่ามี page ใน params หรือไม่ ถ้าไม่มีให้ใช้ currentPage จาก state
        if (!params.has('page')) {
          params.set('page', currentPage.toString());
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        
        const data = await response.json();
        setProperties(data.properties || []);
        // --- 2. อัปเดต State ของ Pagination จากข้อมูลที่ API ส่งมา ---
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        
      } catch (error) {
        console.error(error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
    // ให้ useEffect ทำงานใหม่ทุกครั้งที่ searchParams (รวมถึง page) เปลี่ยน
  }, [searchParams]); 

  // --- 3. ฟังก์ชันสำหรับเปลี่ยนหน้า ---
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    // ใช้ router.push เพื่ออัปเดต URL โดยไม่รีเฟรชหน้า
    router.push(`${pathname}?${params.toString()}`);
  };

  // ดึงค่า keyword และ status จาก URL มาแสดงเป็นหัวข้อ
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  let pageTitle = "Properties";
  if (status || keyword) {
      pageTitle = `Search Results${status ? ` for "${status}"` : ''}${keyword ? ` matching "${keyword}"` : ''}`;
  }


  // --- 4. Logic สร้างปุ่มหมายเลขหน้า (แสดงแค่บางส่วนถ้ามีหน้าเยอะ) ---
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // จำนวนปุ่มสูงสุดที่จะแสดง
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={currentPage === i ? styles.activePage : ''}
            >
                {i}
            </button>
        );
    }
    return pageNumbers;
  };

  return (
    <div>
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

          {/* --- 5. แสดงผล Pagination UI --- */}
          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No properties found matching your criteria.</p>
      )}
    </div>
  );
}