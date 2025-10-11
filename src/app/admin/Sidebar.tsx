'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // Import ให้ครบ

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // ปรับ Logic การเช็ค Active State ให้ง่ายขึ้น
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
          {/* --- แก้ไขตรงนี้ --- */}
          {/* เปลี่ยนลิงก์ Dashboard ให้ชี้ไปที่ /admin/properties และลบลิงก์ Properties ที่ซ้ำซ้อนออก */}
          <li className={isPropertiesActive ? 'active' : ''}>
            <Link href="/admin/properties"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
          </li>

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