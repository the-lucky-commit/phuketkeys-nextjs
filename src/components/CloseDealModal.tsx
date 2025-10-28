// src/components/CloseDealModal.tsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import styles from './CloseDealModal.module.css'; // เราจะสร้าง CSS นี้

interface CloseDealModalProps {
  propertyId: number;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void; // ฟังก์ชันปิด Modal
  onSuccess: () => void; // ฟังก์ชันเมื่อบันทึกสำเร็จ (เช่น refresh ตาราง)
}

export default function CloseDealModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onSuccess
}: CloseDealModalProps) {
  const [transactionType, setTransactionType] = useState<'Sold' | 'Rented' | ''>('');
  const [finalPrice, setFinalPrice] = useState('');
  // (Optional) เรายังไม่มี User list ให้เลือก, จะเพิ่มทีหลัง
  // const [userId, setUserId] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState(false);

  // Reset ฟอร์มทุกครั้งที่ Modal เปิด
  useEffect(() => {
    if (isOpen) {
      setTransactionType('');
      setFinalPrice('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionType || !finalPrice) {
      toast.error('Please select transaction type and enter final price.');
      return;
    }

    setIsLoading(true);
    const notification = toast.loading('Recording transaction...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${propertyId}/close-deal`, {
        method: 'POST',
        headers: getAuthHeaders(), // ใช้ Token Admin (Default)
        body: JSON.stringify({
          transaction_type: transactionType,
          final_price: parseFloat(finalPrice),
          // user_id: userId // (Optional) เพิ่มทีหลัง
        })
      });

      if (response.ok) {
        toast.success('Transaction recorded successfully!', { id: notification });
        onSuccess(); // แจ้งให้แม่ (ตาราง) รู้ว่าสำเร็จ
        onClose();   // ปิด Modal
      } else {
        const errorData = await response.json();
        toast.error(`Failed: ${errorData.error}`, { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred.', { id: notification });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null; // ถ้า Modal ไม่ได้เปิด ไม่ต้อง Render อะไร
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Close Deal: {propertyTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="transactionType">Transaction Type</label>
            <select
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'Sold' | 'Rented')}
              required
            >
              <option value="" disabled>Select type...</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="finalPrice">Final Price (฿)</label>
            <input
              type="number"
              id="finalPrice"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              required
              min="0"
              step="any"
            />
          </div>
          {/* (Optional) Dropdown เลือก User จะเพิ่มตรงนี้ */}
          
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Confirm Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}