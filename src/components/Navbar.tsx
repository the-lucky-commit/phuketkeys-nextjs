// src/components/Navbar.tsx
'use client'; 
    
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; 
    
export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link href="/"> 
            <Image 
              src="/img/phuket_keys_logo.png" 
              alt="PHUKET KEYS Logo" 
              width={60} 
              height={60} 
              style={{ filter: 'brightness(0) invert(1)' }} 
              priority 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-menu">
          <Link href="/properties?status=For+Sale" className="nav-link">Buy</Link>
          <Link href="/properties?status=For+Rent" className="nav-link">Rent</Link>
          <Link href="#services" className="nav-link">Services</Link>
          <Link href="#about" className="nav-link">About</Link>
          <Link href="#contact" className="nav-link">Contact</Link>
        </nav>
        
        {/* Auth Navigation */}
        <div className="navbar-auth">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : user ? (
            <>
              <span className="user-name">Hi, {user.username}</span>
              <button onClick={logout} className="btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/customer-login" className="btn-outline btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
        {/* Debug info */}
        <div style={{ color: 'white', padding: '10px', fontSize: '12px' }}>
          Menu State: {isMobileMenuOpen ? 'OPEN' : 'CLOSED'}
        </div>
        
        <nav className="mobile-nav" style={{ display: 'block', visibility: 'visible' }}>
          <Link 
            href="/properties?status=For+Sale" 
            className="mobile-link" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', color: 'white', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            Buy
          </Link>
          <Link 
            href="/properties?status=For+Rent" 
            className="mobile-link" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', color: 'white', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            Rent
          </Link>
          <Link 
            href="#services" 
            className="mobile-link" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', color: 'white', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            Services
          </Link>
          <Link 
            href="#about" 
            className="mobile-link" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', color: 'white', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className="mobile-link" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', color: 'white', padding: '16px 24px', borderBottom: 'none' }}
          >
            Contact
          </Link>
        </nav>
        
        {/* Mobile Auth */}
        <div className="mobile-auth">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : user ? (
            <>
              <div className="mobile-user">Hi, {user.username}</div>
              <button onClick={logout} className="btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/customer-login" className="btn-outline btn-sm" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary btn-sm" onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}