// src/components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

// ⭐️ (สำคัญ) Import สไตล์ .footer จาก globals.css
import '@/app/globals.css'; 

export default function Footer() {
  return (
    // ⭐️ นี่คือโค้ด <footer> เดิมของคุณจาก page.tsx
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Image src="/img/phuket_keys_logo.png" alt="PHUKET KEYS Logo" width={60} height={60} style={{ filter: 'brightness(0) invert(1)' }}/>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {/* ⭐️ แก้ไข: เปลี่ยน <a> เป็น <Link> */}
              <li><Link href="/properties?status=For+Sale">Buy Property</Link></li>
              <li><Link href="/properties?status=For+Rent">Rent Property</Link></li>
              <li><Link href="#services">List Your Property</Link></li>
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#contact">Contact Us</Link></li>
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
  );
}