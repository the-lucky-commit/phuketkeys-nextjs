// src/components/PropertyList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import styles from './PropertyList.module.css';

export default function PropertyList({ searchParams: initialSearchParams }: { searchParams: { [key: string]: any } }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        // อ่านค่า page จาก URLSearchParams ถ้าไม่มีให้ใช้ 1
        const pageQuery = params.get('page') || '1';
        params.set('page', pageQuery); // Ensure page param is always set for API call

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
    };

    fetchProperties();
  }, [searchParams]); // Re-run effect when searchParams change (including 'page')

  const handlePageChange = (newPage: number) => {
    // ตรวจสอบว่าหน้าที่เลือกอยู่ในขอบเขตที่ถูกต้อง
    if (newPage < 1 || newPage > totalPages) {
        return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    // ใช้ router.push เพื่ออัปเดต URL ซึ่งจะ trigger useEffect ใหม่
    router.push(`${pathname}?${params.toString()}`);
  };

  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  let pageTitle = "Properties";
  if (status || keyword) {
      pageTitle = `Search Results${status ? ` for "${status}"` : ''}${keyword ? ` matching "${keyword}"` : ''}`;
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
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

    // เพิ่มปุ่ม '...' ถ้าหน้าแรกไม่ได้ถูกแสดง
    if (startPage > 1) {
        pageNumbers.push(<button key={1} onClick={() => handlePageChange(1)}>1</button>);
        if (startPage > 2) {
            pageNumbers.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
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

    // เพิ่มปุ่ม '...' ถ้าหน้าสุดท้ายไม่ได้ถูกแสดง
     if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
             pageNumbers.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
        }
        pageNumbers.push(<button key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>);
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