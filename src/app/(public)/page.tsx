// src/app/(public)/page.tsx
// ⭐️ (สะอาดแล้ว - ไม่มี Header/Footer)

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- Imports (เหมือนเดิม) ---
import HeroSearchForm from '@/components/HeroSearchForm';
import CleaningServices from '../CleaningServices'; // ⭐️ (Next.js จะหาเจอเอง)
import ContactForm from '../ContactForm';         // ⭐️ (Next.js จะหาเจอเอง)
import FeaturedProperties from '@/components/FeaturedProperties';
import CategoryIcons from '@/components/CategoryIcons';

// --- Home Page Component ---
export default function HomePage() {

  return (
    // ⭐️ สังเกตว่า <header> และ <footer> หายไปแล้ว
    // ⭐️ เราจะเหลือแค่ <main> เท่านั้น
    <main>
      {/* --- Hero Search Section --- */}
      <HeroSearchForm />
      <CategoryIcons />

      {/* --- Featured Properties Section (Using the new component) --- */}
      <FeaturedProperties />

      {/* --- Why Us Section --- */}
      <section id="why-us" className="why-us-section">
          <div className="container">
              <h2>Why PHUKET KEYS?</h2>
              <div className="advantages-grid">
                  <div className="advantage-item">
                      <i className="fas fa-map-marked-alt"></i>
                      <h3>Local Expertise</h3>
                      <p>We have a deep understanding of the Phuket real estate market to provide you with the best advice.</p>
                  </div>
                  <div className="advantage-item">
                      <i className="fas fa-star"></i>
                      <h3>Premium Listings</h3>
                      <p>We handpick the finest properties to ensure a superior living experience for you.</p>
                  </div>
                  <div className="advantage-item">
                      <i className="fas fa-handshake"></i>
                      <h3>Seamless Service</h3>
                      <p>Our professional team is dedicated to supporting you every step of the way with excellent service.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Cleaning Services Section --- */}
      <CleaningServices />

      {/* --- About Us Section --- */}
      <section id="about" className="about-section">
          <div className="container">
              <div className="about-content">
                  <Image src="/img/about_us_team.jpg" alt="Our Team" className="about-image" width={500} height={400} />
                  <div>
                      <h2>About Us</h2>
                      <p>PHUKET KEYS is a leading real estate agency in Phuket. We are committed to connecting buyers, sellers, and renters with their dream homes in this tropical paradise. With extensive experience and a deep understanding of the local market, we are ready to provide the best service to meet all your needs.</p>
                      <p>We believe finding a home is not just about finding a place to live, but about discovering a lifestyle. PHUKET KEYS is dedicated to offering a diverse range of quality properties, from luxury beachfront villas to modern condominiums in the city center.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Contact Form Section --- */}
      <ContactForm />
    </main>
  );
}