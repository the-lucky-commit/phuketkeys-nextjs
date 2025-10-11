'use client'; // 1. ประกาศเป็น Client Component

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 2. Import usePathname

export default function Sidebar() {
  const pathname = usePathname(); // 3. เรียกใช้ Hook เพื่อเอา Path ปัจจุบัน

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
          {/* 4. เพิ่มเงื่อนไขในการใส่ className="active" */}
          <li className={pathname === '/admin' ? 'active' : ''}>
            <Link href="/admin"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
          </li>
          <li className={isPropertiesActive ? 'active' : ''}>
            <Link href="/admin/properties"><i className="fas fa-home"></i> Properties</Link>
          </li>
          <li><a href="#"><i className="fas fa-envelope"></i> Messages</a></li>
          <li><a href="#"><i className="fas fa-cog"></i> Settings</a></li>
          <li><Link href="/"><i className="fas fa-sign-out-alt"></i> Logout</Link></li>
        </ul>
      </nav>
    </aside>
  );
}