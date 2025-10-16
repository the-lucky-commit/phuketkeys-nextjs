// src/app/admin/dashboard/page.tsx

import React from 'react';
import DashboardClientUI from './DashboardClientUI'; // เรากำลังจะสร้างไฟล์นี้ในขั้นตอนถัดไป

export default function DashboardPage() {
  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Dashboard</h1>
      </header>

      <section className="content-area">
        <DashboardClientUI />
      </section>
    </main>
  );
}