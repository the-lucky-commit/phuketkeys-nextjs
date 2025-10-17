// src/components/PropertyList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard'; // เราจะสร้างไฟล์นี้ในขั้นตอนถัดไป
import styles from './PropertyList.module.css';

export default function PropertyList({ searchParams: initialSearchParams }: { searchParams: { [key: string]: any } }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ใช้ useSearchParams hook เพื่อให้ component re-render เมื่อ URL เปลี่ยน
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // สร้าง URL query string จาก searchParams ที่ได้รับมา
        const params = new URLSearchParams(searchParams.toString());
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error(error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]); // ให้ useEffect ทำงานใหม่ทุกครั้งที่ searchParams เปลี่ยน

  // ดึงค่า keyword และ status จาก URL มาแสดงเป็นหัวข้อ
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');
  const pageTitle = `Search Results for "${status || ''}${keyword ? ` - ${keyword}` : ''}"`;

  return (
    <div>
      <h1 className={styles.pageTitle}>{pageTitle}</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : properties.length > 0 ? (
        <div className={styles.propertyGrid}>
          {properties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <p>No properties found matching your criteria.</p>
      )}
    </div>
  );
}