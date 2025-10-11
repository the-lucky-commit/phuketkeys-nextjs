import React from 'react';
import ContactForm from './ContactForm';
import SearchAndPropertyList from './SearchAndPropertyList';
import { Property } from '@/lib/types';

// อัปเดตฟังก์ชัน getProperties
async function getProperties() {
  try {
    // ขอข้อมูลหน้าแรก 9 รายการ
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?page=1&limit=9`, { cache: 'no-store' });
    if (!response.ok) return { properties: [], totalPages: 0 };
    const data = await response.json();
    return { 
      properties: data.properties || [], 
      totalPages: data.totalPages || 0 
    };
  } catch (error) {
    console.error("Failed to fetch initial properties:", error);
    return { properties: [], totalPages: 0 };
  }
}

export default async function HomePage() {
  // เรียกใช้ฟังก์ชันและรับค่ากลับมา
  const { properties, totalPages } = await getProperties();

  return (
    <>
      <header className="header">{/* ... Header ... */}</header>
      <main>
        {/* ส่ง initialTotalPages เข้าไปใน Component */}
        <SearchAndPropertyList initialProperties={properties} initialTotalPages={totalPages} />

        {/* ... ส่วนอื่นๆ ที่เหลือ ... */}
        <ContactForm />
      </main>
      <footer className="footer">{/* ... Footer ... */</footer>
    </>
  );
}