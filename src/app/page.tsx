import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from './ContactForm'; // Component ที่เราสร้างสำหรับฟอร์ม

// --- Data Fetching and Types ---

interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
}

async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("API response was not ok.");
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

// --- Page Component ---

export default async function HomePage() {
  const properties = await getProperties();

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
        <section className="hero-section">
          <div className="hero-content">
            <h1>Find Your Dream Home in Phuket</h1>
            <p>Experience luxury living with premium properties from PHUKET KEYS</p>
            <div className="search-bar">
              <select name="transaction-type">
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              <input type="text" placeholder="Location (e.g., Patong, Kamala)..." />
              <select name="property-type">
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="house">House</option>
              </select>
              <button className="btn-primary">Search</button>
            </div>
          </div>
        </section>

        <section id="buy" className="featured-properties container">
          <h2>Featured Properties for Sale</h2>
          <div className="property-grid">
            {properties.length > 0 ? (
              properties.map((prop) => (
                <div key={prop.id} className="property-card">
                  <Image src={prop.main_image_url || '/img/placeholder.jpg'} alt={prop.title} width={400} height={220} style={{width: '100%', height: '220px', objectFit: 'cover'}} />
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
              <p>No properties available at the moment.</p>
            )}
          </div>
        </section>

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
                        <a href="#" className="btn-outline">View Details</a>
                    </div>
                </div>
                <div className="property-card">
                    <Image src="/img/condo_rent_1.jpg" alt="Seaview Condo for Rent" width={400} height={220} style={{width: '100%', height: '220px', objectFit: 'cover'}}/>
                    <div className="card-content">
                        <h3>Seaview Condo Near the Beach</h3>
                        <p className="location">Kata, Phuket</p>
                        <p className="details">2 Beds | 2 Baths</p>
                        <p className="price">฿ 45,000 / Month</p>
                        <a href="#" className="btn-outline">View Details</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="why-us" className="why-us-section">
          { /* ... Why Us Section ... */ }
        </section>

        {/* --- ส่วน Contact Form ถูกแทนที่ด้วย Component --- */}
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