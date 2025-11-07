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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
          <Link href="/" className="nav-link">Home</Link>
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
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(184, 134, 11, 0.1)',
                  border: '1px solid #b8860b',
                  borderRadius: '24px',
                  padding: '8px 16px',
                  color: '#b8860b',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 134, 11, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 134, 11, 0.1)';
                }}
              >
                <i className="fas fa-user-circle" style={{ fontSize: '18px' }}></i>
                <span>Hi, {user.username}</span>
                <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
              </button>
              
              {showProfileMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: '200px',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <Link 
                    href="/profile" 
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      color: '#1a2e44',
                      textDecoration: 'none',
                      borderBottom: '1px solid #e9ecef',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <i className="fas fa-user" style={{ fontSize: '16px', color: '#b8860b' }}></i>
                    <span style={{ fontWeight: '500' }}>My Profile</span>
                  </Link>
                  <Link 
                    href="/profile?tab=favorites" 
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      color: '#1a2e44',
                      textDecoration: 'none',
                      borderBottom: '1px solid #e9ecef',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <i className="fas fa-heart" style={{ fontSize: '16px', color: '#dc3545' }}></i>
                    <span style={{ fontWeight: '500' }}>Favorites</span>
                  </Link>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      background: 'white',
                      border: 'none',
                      color: '#dc3545',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <i className="fas fa-sign-out-alt" style={{ fontSize: '16px' }}></i>
                    <span style={{ fontWeight: '500' }}>Logout</span>
                  </button>
                </div>
              )}
            </div>
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
        {/* Navigation Links */}
        <div style={{ 
          padding: '20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>🏡 Home</Link>
          </div>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <Link href="/properties?status=For+Sale" style={{ color: 'white', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>🏠 Buy</Link>
          </div>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <Link href="/properties?status=For+Rent" style={{ color: 'white', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>🔑 Rent</Link>
          </div>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <a href="#services" style={{ color: 'white', textDecoration: 'none' }}>🛠️ Services</a>
          </div>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>ℹ️ About</a>
          </div>
          <div style={{ 
            display: 'block',
            color: 'white',
            padding: '16px 24px',
            borderBottom: 'none',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>📞 Contact</a>
          </div>
        </div>
        
        {/* Mobile Auth */}
        <div className="mobile-auth">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : user ? (
            <>
              <div className="mobile-user">Hi, {user.username}</div>
              <Link href="/profile" className="btn-outline btn-sm" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-user"></i> My Profile
              </Link>
              <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="btn-outline btn-sm">
                <i className="fas fa-sign-out-alt"></i> Logout
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