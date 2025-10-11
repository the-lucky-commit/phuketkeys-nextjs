'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import Pagination from '@/components/Pagination';

export default function SearchAndPropertyList({ initialProperties, initialTotalPages }: { initialProperties: Property[], initialTotalPages: number }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isLoading, setIsLoading] = useState(false);
  
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    setCurrentPage(page);

    const query = new URLSearchParams({
        status,
        type,
        keyword,
        page: page.toString(),
        limit: '9',
    }).toString();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${query}`);
      const data = await response.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Search failed:', error);
      setProperties([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPageChange = (page: number) => {
    handleSearch(page);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Home in Phuket</h1>
          <p>Experience luxury living with premium properties from PHUKET KEYS</p>
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
        
        {/* --- จุดที่แก้ไข --- */}
        <div className="property-grid">
          {!isLoading && properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop.id} className="property-card">
                <Image src={prop.main_image_url || '/img/placeholder.jpg'} alt={prop.title} width={400} height={220} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div className="card-content">
                  <h3>{prop.title}</h3>
                  <p className="location">Phuket, Thailand</p>
                  <p className="details">{prop.status}</p>
                  <p className="price">฿ {new Intl.NumberFormat('th-TH').format(prop.price)}</p>
                  <Link href={`/property/${prop.id}`} className="btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // แสดงข้อความนี้เมื่อไม่กำลังโหลดและไม่มีข้อมูล
            !isLoading && <p>No properties match your search criteria.</p>
          )}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </section>
    </>
  );
}