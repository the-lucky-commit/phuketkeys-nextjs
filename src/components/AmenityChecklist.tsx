'use client'; // ⭐️ นี่คือ Client Component

import { useState, useEffect } from 'react';
import { Amenity } from '@/lib/types'; // ⭐️ Import Type ที่เราเพิ่งสร้าง
import { getAuthHeaders } from '@/lib/auth';
import styles from './AmenityChecklist.module.css'; // ⭐️ เราจะสร้าง CSS นี้

// 1. กำหนด Props ที่จะรับ
interface AmenityChecklistProps {
  // รับ ID ของ Amenities ที่ถูกเลือกไว้แล้ว (สำหรับหน้า Edit)
  initialSelectedIds: number[]; 
  // ส่ง Array ของ ID ที่ติ๊กแล้ว กลับไปให้ฟอร์มแม่
  onChange: (selectedIds: number[]) => void; 
}

export default function AmenityChecklist({ initialSelectedIds, onChange }: AmenityChecklistProps) {
  // State 1: เก็บ "รายการ" Amenities ทั้งหมด (สระว่ายน้ำ, ฟิตเนส, ฯลฯ)
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  // State 2: เก็บ "ID" ของอันที่ถูกติ๊ก
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(initialSelectedIds) // ⭐️ ใช้ Set เพื่อให้จัดการง่าย
  );
  const [isLoading, setIsLoading] = useState(true);

  // 3. ดึงรายการ Amenities ทั้งหมดจาก API (ที่เราสร้างไว้ใน server.js)
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/amenities`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data: Amenity[] = await response.json();
          setAllAmenities(data);
        } else {
          console.error('Failed to fetch amenities');
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAmenities();
  }, []); // ทำงานแค่ครั้งเดียวตอนเริ่ม

  // 4. เมื่อมีการติ๊ก (Handler)
  const handleCheckboxChange = (amenityId: number) => {
    // สร้าง Set ใหม่จากอันเก่า
    const newSelectedIds = new Set(selectedIds);
    
    if (newSelectedIds.has(amenityId)) {
      newSelectedIds.delete(amenityId); // ถ้ามีอยู่แล้ว (ติ๊กซ้ำ) = ลบออก
    } else {
      newSelectedIds.add(amenityId); // ถ้ายังไม่มี = เพิ่มเข้าไป
    }
    
    setSelectedIds(newSelectedIds); // อัปเดต State
    onChange(Array.from(newSelectedIds)); // ⭐️ ส่ง Array กลับไปให้ฟอร์มแม่
  };

  if (isLoading) {
    return <p>Loading amenities...</p>;
  }

  return (
    <div className={styles.checklistContainer}>
      <h3>Amenities</h3>
      <div className={styles.grid}>
        {allAmenities.length > 0 ? (
          allAmenities.map((amenity) => (
            <label key={amenity.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedIds.has(amenity.id)} // ⭐️ เช็คว่า ID นี้อยู่ใน Set หรือไม่
                onChange={() => handleCheckboxChange(amenity.id)}
              />
              <i className={amenity.icon || 'fas fa-check'}></i> {/* ⭐️ แสดง Icon */}
              <span>{amenity.name}</span>
            </label>
          ))
        ) : (
          <p>No amenities found. (Please check DB)</p>
        )}
      </div>
    </div>
  );
}