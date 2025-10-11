import React from 'react';
import ContactForm from './ContactForm';
import SearchAndPropertyList from './SearchAndPropertyList';
import { Property } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

// ฟังก์ชันดึงข้อมูล (Data Fetching Function)
async function getProperties() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?page=1&limit=9`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("API response was not ok during build.");
      return { properties: [], totalPages: 0 };
    }
    const data = await response.json();
    return { 
      properties: data.properties || [], 
      totalPages: data.totalPages || 0 
    };
  } catch (error) {
    console.error("Failed to fetch initial properties during build:", error);
    return { properties: [], totalPages: 0 };
  }
}

// หน้า Home (Home Page Component)
export default async function HomePage() {
  const { properties, totalPages } = await getProperties();

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">
            <Image src="/img/phuket_keys_logo.png" alt="PHUKET KEYS Logo" width={80} height={80} style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <nav className="navbar">
            <ul>
              <li><a href="#buy">Buy</a></li>
              <li><a href="#rent">Rent</a></li>
              <li><a href="#sell">Sell</a></li>
              <li><a href="#services">Property Management</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
          <div className="language-switcher">
            <a href="#">TH</a> | <a href="#" className="active">EN</a>
          </div>
        </div>
      </header>
      
      <main>
        <SearchAndPropertyList initialProperties={properties} initialTotalPages={totalPages} />
        
        <section id="rent" className="featured-properties container">{/* ... ส่วน Rent (ยังเป็น Static) ... */}</section>
        <section id="why-us" className="why-us-section">{/* ... Why Us Section ... */}</section>
        
        <ContactForm />
      </main>

      {/* --- จุดที่แก้ไข --- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Image src="/img/phuket_keys_logo.png" alt="PHUKET KEYS Logo" width={60} height={60} style={{ filter: 'brightness(0) invert(1)' }}/>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#buy">Buy Property</a></li>
                <li><a href="#rent">Rent Property</a></li>
                <li><a href="#sell">List Your Property</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p><i className="fas fa-phone-alt"></i> +66 (0) 76 123 456</p>
              <p><i className="fas fa-envelope"></i> info@phuketkeys.com</p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-line"></i></a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>© 2025 PHUKET KEYS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}