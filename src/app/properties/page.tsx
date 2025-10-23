// src/app/properties/page.tsx
import PropertyList from '@/components/PropertyList';
import styles from './properties.module.css'; // Import CSS Module

export default function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    // --- ใช้ className จาก CSS Module ---
    <main className={styles.mainContainer}>
      <div className="container">
        {/* --- เพิ่ม div ครอบ และใช้ Grid Layout --- */}
        <div className={styles.layoutGrid}>
          <PropertyList searchParams={searchParams} />
        </div>
        {/* -------------------------------------- */}
      </div>
    </main>
  );
}