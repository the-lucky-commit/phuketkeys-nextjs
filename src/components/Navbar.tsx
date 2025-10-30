// src/components/Navbar.tsx
'use client'; 
    
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import '@/app/globals.css'; 
    
export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link href="/"> 
            <Image 
              src="/img/phuket_keys_logo.png" 
              alt="PHUKET KEYS Logo" 
              width={80} 
              height={80} 
              style={{ filter: 'brightness(0) invert(1)' }} 
              priority 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar desktop-nav">
          <ul>
            <li><Link href="/properties?status=For+Sale">Buy</Link></li>
            <li><Link href="/properties?status=For+Rent">Rent</Link></li>
            <li><Link href="#services">Property Management</Link></li> 
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#contact">Contact Us</Link></li>
          </ul>
        </nav>
        
        {/* Language Switcher - Desktop */}
        <div className="language-switcher desktop-only">
          <a href="#">TH</a>
          <span>|</span>
          <a href="#" className="active">EN</a>
        </div>
        
        {/* Auth Navigation - Desktop */}
        <div className="auth-nav desktop-only">
          {isLoading ? (
            <div className="auth-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : user ? (
            <>
              <span className="welcome-text">Hi, {user.username}</span>
              <button onClick={logout} className="auth-button-secondary">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/customer-login" className="auth-button-secondary">
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </Link>
              <Link href="/register" className="auth-button-primary">
                <i className="fas fa-user-plus"></i>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <nav className="mobile-navbar">
            <ul>
              <li><Link href="/properties?status=For+Sale" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link></li>
              <li><Link href="/properties?status=For+Rent" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link></li>
              <li><Link href="#services" onClick={() => setIsMobileMenuOpen(false)}>Property Management</Link></li> 
              <li><Link href="#about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
              <li><Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link></li>
            </ul>
          </nav>
          
          {/* Mobile Language Switcher */}
          <div className="mobile-language-switcher">
            <a href="#">TH</a>
            <span>|</span>
            <a href="#" className="active">EN</a>
          </div>
          
          {/* Mobile Auth */}
          <div className="mobile-auth">
            {isLoading ? (
              <div className="auth-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : user ? (
              <>
                <div className="mobile-welcome">Hi, {user.username}</div>
                <button onClick={logout} className="mobile-auth-button">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/customer-login" className="mobile-auth-button" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </Link>
                <Link href="/register" className="mobile-auth-button primary" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}