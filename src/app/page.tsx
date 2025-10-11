import React from 'react';
import ContactForm from './ContactForm';
import SearchAndPropertyList from './SearchAndPropertyList'; // 1. Import
import { Property } from '@/lib/types';

async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, { cache: 'no-store' });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch initial properties:", error);
    return [];
  }
}

export default async function HomePage() {
  const initialProperties = await getProperties();

  return (
    <>
      <header className="header">{/* ... Header ... */}</header>
      <main>
        {/* 2. เรียกใช้ Component ใหม่ โดยส่งข้อมูลเริ่มต้นเข้าไป */}
        <SearchAndPropertyList initialProperties={initialProperties} />
        
        <section id="rent" className="featured-properties container">{/* ... ส่วน Rent (ยังเป็น Static) ... */}</section>
        <section id="why-us" className="why-us-section">{/* ... Why Us Section ... */}</section>
        <ContactForm />
      </main>
      <footer className="footer">{/* ... Footer ... */}</footer>
    </>
  );
}