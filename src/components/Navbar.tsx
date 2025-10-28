// src/components/Navbar.tsx
'use client'; 
    
import Link from 'next/link';
import Image from 'next/image';

// --- ⬇️ [1. เพิ่ม Imports] ⬇️ ---
import { useAuth } from '@/context/AuthContext'; 
// --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ ---
    
import '@/app/globals.css'; 
    
export default function Navbar() {
  // --- ⬇️ [2. ดึงข้อมูลจาก Context] ⬇️ ---
  const { user, logout, isLoading } = useAuth();
  // --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ ---

  return (
    <header className="header">
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
        <nav className="navbar">
          <ul>
            <li><Link href="/properties?status=For+Sale">Buy</Link></li>
            <li><Link href="/properties?status=For+Rent">Rent</Link></li>
            <li><Link href="#services">Property Management</Link></li> 
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#contact">Contact Us</Link></li>
          </ul>
        </nav>
        
        {/* (Language Switcher - เหมือนเดิม) */}
        <div className="language-switcher">
          <a href="#">TH</a> | <a href="#" className="active">EN</a>
        </div>
        
        {/* --- ⬇️ [3. เพิ่มส่วน Auth Nav] ⬇️ --- */}
        <div className="auth-nav">
          {isLoading ? (
            // ⭐️ 1. ถ้ากำลังโหลด (เช็ค Token) - ไม่ต้องแสดงอะไรเลย
            null 
          ) : user ? (
            // ⭐️ 2. ถ้า Login แล้ว (มี user)
            <>
              <span className="welcome-text">Hi, {user.username}</span>
              <button onClick={logout} className="auth-button-secondary">
                Logout
              </button>
            </>
          ) : (
            // ⭐️ 3. ถ้ายังไม่ Login
            <>
              <Link href="/customer-login" className="auth-button-secondary">
                Sign In
              </Link>
              <Link href="/register" className="auth-button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ --- */}
          
      </div>
    </header>
  );
}