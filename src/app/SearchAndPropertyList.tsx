'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import Pagination from '@/components/Pagination'; // 1. Import Pagination

export default function SearchAndPropertyList({ initialProperties, initialTotalPages }: { initialProperties: Property[], initialTotalPages: number }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isLoading, setIsLoading] = useState(false);

  // State สำหรับฟอร์มค้นหา
  const [status, setStatus] = useState('For Sale');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('Villa');

  // 2. เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const handleSearch = async (page = 1) => { // 3. เพิ่ม parameter 'page'
    setIsLoading(true);
    setCurrentPage(page);

    const query = new URLSearchParams({
        status,
        type,
        keyword,
        page: page.toString(), // 4. ส่ง 'page' ไปกับ query
        limit: '9', // แสดง 9 รายการต่อหน้า
    }).toString();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${query}`);
      const data = await response.json();
      setProperties(data.properties);
      setTotalPages(data.totalPages); // 5. อัปเดต state totalPages
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. สร้างฟังก์ชันสำหรับจัดการการเปลี่ยนหน้า
  const onPageChange = (page: number) => {
    handleSearch(page);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Home in Phuket</h1>
          <p>Experience luxury living with premium properties from PHUKET KEYS</p>
          {/* 7. เปลี่ยน onSubmit ให้เรียก handleSearch() โดยไม่ส่ง event */}
          <form className="search-bar" onSubmit={(e) => { e.preventDefault(); handleSearch(1); }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any Status</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
            <input type="text" placeholder="Keyword (e.g., Patong, Seaview)..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Any Type</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="House">House</option>
            </select>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </section>

      <section id="properties-list" className="featured-properties container">
        <h2>{isLoading ? 'Searching Properties...' : 'Featured Properties'}</h2>
        <div className="property-grid">
          {/* ... โค้ดส่วน .map() เหมือนเดิม ... */}
        </div>

        {/* 8. เรียกใช้ Pagination Component */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}