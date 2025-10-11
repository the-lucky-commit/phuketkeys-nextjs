'use client'; // 1. ประกาศเป็น Client Component

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 2. Import usePathname

export default function Sidebar() {
  const pathname = usePathname(); // 3. เรียกใช้ Hook เพื่อเอา Path ปัจจุบัน
  const router = useRouter();

   const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    };

  // ฟังก์ชันช่วยเช็คเพื่อให้ลิงก์ Properties active ในหน้า add และ edit ด้วย
  const isPropertiesActive = pathname.startsWith('/admin/properties') || 
                              pathname === '/admin/add-property' || 
                              pathname.startsWith('/admin/edit-property');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Image src="/img/phuket_keys_logo.png" alt="Logo" className="sidebar-logo" width={50} height={50} />
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* --- แก้ไขบรรทัดข้างล่างนี้ --- */}
          <li className={isDashboardActive ? 'active' : ''}>
            <Link href="/admin/properties"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
          </li>
          <li className={isPropertiesActive ? 'active' : ''}>
            <Link href="/admin/properties"><i className="fas fa-home"></i> Properties</Link>
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