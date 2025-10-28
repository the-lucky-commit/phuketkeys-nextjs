'use client'; // ⭐️ 1. นี่คือ Client Component

import { useState } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/lib/types'; // ⭐️ 2. Import Type ของรูปภาพ
import styles from './PropertyGallery.module.css'; // ⭐️ 3. เราจะสร้าง CSS ใหม่นี้

// 4. กำหนด Props ที่จะรับ
interface PropertyGalleryProps {
  mainImageUrl: string;
  galleryImages: PropertyImage[]; // นี่คือ array จาก property.images
}

export default function PropertyGallery({ mainImageUrl, galleryImages }: PropertyGalleryProps) {
  
  // 5. ⭐️ หัวใจหลัก: ใช้ State เก็บ URL ของรูปที่กำลัง Active
  const [activeImage, setActiveImage] = useState(mainImageUrl);

  // 6. รวมรูปหลัก + รูปย่อย ให้เป็น Array เดียวสำหรับ Thumbnail
  const allThumbnails = [
    { id: 0, image_url: mainImageUrl }, // ใส่รูปหลักเป็นรูปแรก
    ...galleryImages // ต่อด้วยรูปอื่นๆ ใน Gallery
  ];

  return (
    <div className={styles.galleryContainer}>
      
      {/* 7. ส่วนแสดง "รูปหลัก" (ที่ Active อยู่) */}
      <div className={styles.mainImage}>
        <Image
          src={activeImage} // ⭐️ ใช้ URL จาก State
          alt="Main property view"
          fill
          style={{ objectFit: 'cover' }}
          priority
          // ⭐️ ใช้ key={activeImage} เพื่อบังคับให้ React re-render ตอนเปลี่ยนรูป
          //    (แก้ปัญหา Image cache ไม่ยอมเปลี่ยนรูป)
          key={activeImage} 
        />
      </div>

      {/* 8. ส่วนแสดง "แถบ Thumbnail" (เฉพาะเมื่อมีรูปมากกว่า 1) */}
      {allThumbnails.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {allThumbnails.map((img) => (
            <div
              key={img.id}
              // ⭐️ 9. เช็คว่า Thumbnail นี้ Active หรือไม่
              className={`${styles.thumbnail} ${
                img.image_url === activeImage ? styles.activeThumbnail : ''
              }`}
              // ⭐️ 10. เมื่อคลิก ให้เปลี่ยน State
              onClick={() => setActiveImage(img.image_url)}
            >
              <Image
                src={img.image_url}
                alt="Property thumbnail"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}