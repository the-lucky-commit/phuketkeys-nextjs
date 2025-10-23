// src/app/admin/layout.tsx
'use client'; // <-- Add 'use client' because we need useState and onClick

import { useState } from 'react'; // <-- Import useState
import AdminAuthProvider from '@/components/AdminAuthProvider';
import './admin-style.css';
import Sidebar from './Sidebar';

// Metadata can still be defined, but layout becomes a Client Component
// export const metadata = { title: "Phuket Keys Admin" }; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // --- State for sidebar toggle ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // -----------------------------

  return (
    <AdminAuthProvider>
      {/* --- Hamburger Button --- */}
      <button className="hamburger-button" onClick={toggleSidebar}>
        ☰ {/* Hamburger Icon */}
      </button>

      {/* --- Overlay --- */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar} // Close sidebar when clicking overlay
      ></div>

      {/* --- Wrapper --- */}
      <div className="admin-wrapper">
        {/* --- Pass state and toggle function to Sidebar --- */}
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        
        {/* Main Content Area */}
        {children} 
      </div>
    </AdminAuthProvider>
  );
}