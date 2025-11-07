// src/app/admin/Sidebar.tsx
'use client'; // <-- Still needs to be client for hooks and onClick

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// --- Accept props: isOpen and toggle ---
export default function Sidebar({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isPropertiesActive = pathname.startsWith('/admin/properties') || 
                              pathname.startsWith('/admin/add-property') || 
                              pathname.startsWith('/admin/edit-property');

  // --- Add a close button for mobile ---
  const closeSidebar = () => {
    if (isOpen) {
        toggle(); // Call the toggle function passed from layout
    }
  }

  return (
    // --- Apply 'open' class conditionally ---
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Image src="/img/phuket_keys_logo.png" alt="Logo" className="sidebar-logo" width={50} height={50} />
        <h2>Admin Panel</h2>
        {/* Add a close button visible on mobile */}
        <button className="close-sidebar-button" onClick={closeSidebar}>×</button>
      </div>
      <nav className="sidebar-nav">
        {/* Add onClick={closeSidebar} to links to close sidebar after navigation */}
        <ul>
          <li className={pathname === '/admin/dashboard' ? 'active' : ''}>
            <Link href="/admin/dashboard" onClick={closeSidebar}>
              <i className="fas fa-chart-pie"></i> Dashboard
            </Link>
          </li>
          <li className={isPropertiesActive ? 'active' : ''}>
            <Link href="/admin/properties" onClick={closeSidebar}>
              <i className="fas fa-building"></i> Manage Properties
            </Link>
          </li>
          <li className={pathname === '/admin/users' ? 'active' : ''}>
            <Link href="/admin/users" onClick={closeSidebar}>
              <i className="fas fa-users"></i> User Management
            </Link>
          </li>
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

// --- Add CSS for the close button inside admin-style.css ---
/* .close-sidebar-button {
    display: none; // Hidden by default
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: var(--color-ivory); // Adjust color if needed
    font-size: 24px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .close-sidebar-button {
        display: block; // Show on mobile inside the open sidebar
    }
}
*/