// src/app/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Logic การเช็ค Active State สำหรับหน้า Properties (อันนี้ดีอยู่แล้ว)
  const isPropertiesActive = pathname.startsWith('/admin/properties') || 
                              pathname.startsWith('/admin/add-property') || 
                              pathname.startsWith('/admin/edit-property');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Image src="/img/phuket_keys_logo.png" alt="Logo" className="sidebar-logo" width={50} height={50} />
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* ====================================================== */}
          {/* === ส่วนที่เราแก้ไขและเพิ่มเติม === */}
          {/* ====================================================== */}

          {/* 1. เมนู Dashboard ใหม่ (ลิงก์ไปหน้า dashboard ที่เราจะสร้าง) */}
          <li className={pathname === '/admin/dashboard' ? 'active' : ''}>
            <Link href="/admin/dashboard">
              <i className="fas fa-chart-pie"></i> Dashboard
            </Link>
          </li>

          {/* 2. แก้ไขเมนูเดิมให้ถูกต้อง (ลิงก์ไปหน้า properties) */}
          <li className={isPropertiesActive ? 'active' : ''}>
            <Link href="/admin/properties">
              <i className="fas fa-building"></i> Manage Properties
            </Link>
          </li>
          
          {/* ====================================================== */}

          <li><a href="#"><i className="fas fa-envelope"></i> Messages</a></li>
          <li><a href="#"><i className="fas fa-cog"></i> Settings</a></li>
          <li>
              <button onClick={handleLogout} className="logout-button">
                  <i className="fas fa-sign-out-alt"></i> Logout
              </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}