'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';

// รับ initialProperties มาเป็นค่าเริ่มต้น
export default function SearchAndPropertyList({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isLoading, setIsLoading] = useState(false);

  // State สำหรับฟอร์มค้นหา
  const [status, setStatus] = useState('For Sale');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('Villa');

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);

    // สร้าง URL พร้อม query parameters
    const query = new URLSearchParams({
        status,
        type,
        keyword,
    }).toString();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${query}`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Search failed:', error);
      // อาจจะแสดง toast error ที่นี่
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Home in Phuket</h1>
          <p>Experience luxury living with premium properties from PHUKET KEYS</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
            <input type="text" placeholder="Keyword (e.g., Patong, Seaview)..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
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

      <section id="buy" className="featured-properties container">
        <h2>{isLoading ? 'Searching Properties...' : 'Featured Properties'}</h2>
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
            <p>{isLoading ? '' : 'No properties match your search criteria.'}</p>
          )}
        </div>
      </section>
    </>
  );
}