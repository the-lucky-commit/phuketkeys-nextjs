// src/app/(public)/layout.tsx

import { Suspense } from 'react';
import Navbar from '@/components/Navbar'; // 1. Import Navbar
import Footer from '@/components/Footer'; // 2. Import Footer

function LoadingSpinner() {
  return (
    <div className="loading-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }}>
      <div className="loading-spinner"></div>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>

      <Footer />
    </>
  );
}