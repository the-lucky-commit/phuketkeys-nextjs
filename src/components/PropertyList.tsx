// src/components/PropertyList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import styles from './PropertyList.module.css';

// --- List ของ Property Types ---
const propertyTypes = ['All', 'Villa', 'Condo', 'House', 'Apartment', 'Townhouse', 'Shophouse', 'Land'];

export default function PropertyList({ searchParams: initialSearchParams }: { searchParams: { [key: string]: any } }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State สำหรับ Filter ---
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // --- Fetch Properties Function ---
  const fetchProperties = useCallback(async () => {
    // Determine initial load or significant filter change vs. just page change
    const isInitialLoadOrFilterChange = !searchParams.has('page') || searchParams.get('page') === '1' || isLoading;
     if (isInitialLoadOrFilterChange) {
         setIsLoading(true);
     }

    try {
      const params = new URLSearchParams(searchParams.toString());
      const pageQuery = params.get('page') || '1';
      params.set('page', pageQuery);

      // ใช้ค่าจาก state ล่าสุดในการสร้าง params สำหรับ fetch
      // (State จะถูกอัปเดตจาก URL ใน useEffect ด้านล่างก่อน fetch)
      const currentType = searchParams.get('type') || 'All';
      const currentMinPrice = searchParams.get('minPrice') || '';
      const currentMaxPrice = searchParams.get('maxPrice') || '';

      if (currentType !== 'All') params.set('type', currentType); else params.delete('type');
      if (currentMinPrice) params.set('minPrice', currentMinPrice); else params.delete('minPrice');
      if (currentMaxPrice) params.set('maxPrice', currentMaxPrice); else params.delete('maxPrice');


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`);

      if (!response.ok) throw new Error('Failed to fetch properties');

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isLoading]); // Removed state dependencies to rely solely on URL searchParams

  useEffect(() => {
    // Update local state based on URL searchParams when they change
    setSelectedType(searchParams.get('type') || 'All');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    // Fetch properties whenever searchParams change
    fetchProperties();
  }, [searchParams, fetchProperties]);


  // --- Apply Filters Function ---
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset to page 1 on filter apply

    if (selectedType !== 'All') params.set('type', selectedType); else params.delete('type');
    if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');

    router.push(`${pathname}?${params.toString()}`);
  };

  // --- Handle Page Change Function ---
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // --- Generate Page Title ---
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  let pageTitle = "Properties";
  if (status || keyword || selectedType !== 'All' || minPrice || maxPrice) {
      pageTitle = `Search Results`;
  }

  // --- Render Page Numbers Function ---
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

     if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
             pageNumbers.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
        }
        pageNumbers.push(<button key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>);
    }

    return pageNumbers;
  };

  // --- Main Component Return ---
  return (
    // ใช้ Fragment ครอบ Sidebar และ Results Area เพื่อให้เป็น Grid Items โดยตรง
    <>
      {/* --- Filter Sidebar --- */}
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
            <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0"/>
            <span>-</span>
            <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"/>
          </div>
        </div>
        <button onClick={applyFilters} className={styles.applyFilterButton}>Apply Filters</button>
      </aside>

      {/* --- Results Area --- */}
      <div className={styles.resultsArea}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>

          {isLoading ? (
            <p>Loading...</p> // อาจจะเปลี่ยนเป็น Spinner สวยๆ ทีหลัง
          ) : properties.length > 0 ? (
            <>
              {/* --- Property Grid --- */}
              <div className={styles.propertyGrid}>
                {properties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* --- Pagination --- */}
              {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                   <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                   {renderPageNumbers()}
                   <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
              )}
            </>
          ) : (
            // --- No Results Message ---
            <p>No properties found matching your criteria.</p>
          )}
      </div>
    </>
  );
}