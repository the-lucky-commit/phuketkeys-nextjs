// src/components/Footer.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    
    try {
      // Real API call to your backend
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      if (response.ok) {
        alert('✅ Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        const error = await response.json();
        alert(`❌ Failed to subscribe: ${error.message}`);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('❌ Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <h3>Stay Updated with Phuket Properties</h3>
            <p>Get the latest property listings and market insights delivered to your inbox</p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
              <div className={styles.inputGroup}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubscribing}
                  className={isSubscribing ? styles.subscribing : ''}
                >
                  {isSubscribing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.logo}>
              <Image 
                src="/img/phuket_keys_logo.png" 
                alt="PHUKET KEYS Logo" 
                width={80} 
                height={80} 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h3>PHUKET KEYS</h3>
            </div>
            <p className={styles.description}>
              Your trusted partner in Phuket real estate. We help you find the perfect property 
              in paradise with professional service and local expertise.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-line"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/properties?status=For+Sale">Buy Property</Link></li>
              <li><Link href="/properties?status=For+Rent">Rent Property</Link></li>
              <li><Link href="/properties?status=For+Rent+(Daily)">Daily Rentals</Link></li>
              <li><Link href="#services">Property Management</Link></li>
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className={styles.footerSection}>
            <h4>Property Types</h4>
            <ul className={styles.linkList}>
              <li><Link href="/properties?type=Villa">Villas</Link></li>
              <li><Link href="/properties?type=Condo">Condos</Link></li>
              <li><Link href="/properties?type=House">Houses</Link></li>
              <li><Link href="/properties?type=Apartment">Apartments</Link></li>
              <li><Link href="/properties?type=Townhouse">Townhouses</Link></li>
              <li><Link href="/properties?type=Land">Land</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4>Contact Info</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <p>123 Patong Beach Road</p>
                  <p>Phuket 83150, Thailand</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-phone-alt"></i>
                <div>
                  <p>+66 (0) 76 123 456</p>
                  <p>+66 (0) 89 123 4567</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <p>info@phuketkeys.com</p>
                  <p>sales@phuketkeys.com</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>© 2025 PHUKET KEYS. All rights reserved.</p>
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}