import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';

// Import Components
import SearchAndPropertyList from './SearchAndPropertyList';
import CleaningServices from './CleaningServices';
import ContactForm from './ContactForm';

// ฟังก์ชันดึงข้อมูล (Data Fetching Function)
async function getProperties() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?page=1&limit=9`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

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
            <Image src="/img/phuket_keys_logo.png" alt="PHUKET KEYS Logo" width={80} height={80} style={{ filter: 'brightness(0) invert(1)' }} priority />
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

        <section id="rent" className="featured-properties container">
            <h2>Featured Properties for Rent</h2>
            <div className="property-grid">
                <div className="property-card">
                    <Image src="/img/villa_rent_1.jpg" alt="Luxury Villa for Rent" width={400} height={220} style={{width: '100%', height: '220px', objectFit: 'cover'}}/>
                    <div className="card-content">
                        <h3>Villa with Private Pool</h3>
                        <p className="location">Cherngtalay, Phuket</p>
                        <p className="details">4 Beds | 5 Baths</p>
                        <p className="price">฿ 150,000 / Month</p>
                        <Link href="#" className="btn-outline">View Details</Link>
                    </div>
                </div>
                <div className="property-card">
                    <Image src="/img/condo_rent_1.jpg" alt="Seaview Condo for Rent" width={400} height={220} style={{width: '100%', height: '220px', objectFit: 'cover'}}/>
                    <div className="card-content">
                        <h3>Seaview Condo Near the Beach</h3>
                        <p className="location">Kata, Phuket</p>
                        <p className="details">2 Beds | 2 Baths</p>
                        <p className="price">฿ 45,000 / Month</p>
                        <Link href="#" className="btn-outline">View Details</Link>
                    </div>
                </div>
            </div>
        </section>

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

        {/* --- เรียกใช้ Component บริการทำความสะอาด --- */}
        <CleaningServices />

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

        <ContactForm />
      </main>

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