'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';
import CloseDealModal from '@/components/CloseDealModal';

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- State สำหรับการค้นหาและกรองข้อมูล ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'For Sale', 'For Rent'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // --- useEffect ที่อัปเดตแล้ว: จะทำงานเมื่อมีการค้นหาหรือกรอง ---
  useEffect(() => {
    const fetchProperties = async () => {
      // ไม่ต้อง setIsLoading(true) ที่นี่เพื่อให้ UI ไม่กระพริบตอนพิมพ์
      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('keyword', searchTerm);
        }
        if (statusFilter !== 'All') {
          params.append('status', statusFilter);
        }
        
        const queryString = params.toString();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(apiUrl, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          console.error("Failed to fetch properties, check token or API status.");
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        // setIsLoading(false) จะถูกเรียกแค่ครั้งแรกที่โหลดหน้า
        if (isLoading) setIsLoading(false);
      }
    };

    // เทคนิค Debounce: รอ 300ms หลังจากผู้ใช้หยุดพิมพ์แล้วค่อยยิง API
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, isLoading]); // <-- เพิ่ม isLoading เข้าไป

  // ... (ต่อจาก useEffect) ...

  // --- ⬇️ [เพิ่มฟังก์ชันเหล่านี้] ⬇️ ---
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(false);
  };

  // ⭐️ ใช้ useCallback เพื่อส่งฟังก์ชันนี้ไปให้ useEffect ได้
  const fetchProperties = useCallback(async () => {
    // ... (โค้ด fetch เดิมทั้งหมด ไม่ต้องแก้) ...
    // เพียงแค่หุ้มโค้ดเดิมด้วย useCallback(...)
    try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('keyword', searchTerm);
        if (statusFilter !== 'All') params.append('status', statusFilter);
        
        const queryString = params.toString();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(apiUrl, { headers: getAuthHeaders() });
        
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          console.error("Failed to fetch properties");
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        if (isLoading) setIsLoading(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]); // ⭐️ Dependencies ของ useCallback

  // ⭐️ อัปเดต useEffect ให้เรียก fetchProperties ที่สร้างใหม่
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchProperties();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProperties]); // ⭐️ ใช้ fetchProperties เป็น dependency

  // ⭐️ ฟังก์ชันที่จะถูกเรียกเมื่อ Modal บันทึกสำเร็จ
  const handleDealClosed = () => {
    fetchProperties(); // ⭐️ Refresh ตารางใหม่
  };
  // --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ ---

  // ... (โค้ด handleDelete เหมือนเดิม) ...

  const handleDelete = async (propertyId: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setDeletingId(propertyId);
      const notification = toast.loading('Deleting...');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${propertyId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          setProperties(properties.filter(p => p.id !== propertyId));
          toast.success('Property deleted successfully!', { id: notification });
        } else {
          toast.error('Failed to delete property.', { id: notification });
        }
      } catch (error) {
        toast.error('An error occurred while deleting.', { id: notification });
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  // แสดง Loading แค่ครั้งแรกที่เข้าหน้าเท่านั้น
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading properties...</div>;
  }

  return (
    <>
      {/* --- UI สำหรับการค้นหาและกรองข้อมูล --- */}
      <div className="table-filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="status-filter-buttons">
          <button 
            onClick={() => setStatusFilter('All')} 
            className={statusFilter === 'All' ? 'active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter('For Sale')}
            className={statusFilter === 'For Sale' ? 'active' : ''}
          >
            For Sale
          </button>
          <button 
            onClick={() => setStatusFilter('For Rent')}
            className={statusFilter === 'For Rent' ? 'active' : ''}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* --- ตารางแสดงผลข้อมูล --- */}
      <div className="table-container full-width">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Property Title</th>
              <th>Status</th>
              <th>Price</th>
              <th>Date Added</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties.map(prop => {
                const priceFormatted = new Intl.NumberFormat('th-TH').format(prop.price);
                const dateFormatted = new Date(prop.created_at).toLocaleDateString('en-GB');
                return (
                  <tr key={prop.id}>
                    <td>
                      <Image
                        src={prop.main_image_url || '/img/placeholder.jpg'}
                        alt={prop.title}
                        width={80}
                        height={60}
                        className="property-thumb"
                        style={{ objectFit: 'cover' }}
                      />
                    </td>
                    <td>{prop.title}</td>
                    <td><span className={`status ${prop.status.toLowerCase().replace('for ', '')}`}>{prop.status}</span></td>
                    <td>฿ {priceFormatted} {prop.price_period ? `/ ${prop.price_period}` : ''}</td>
                    <td>{dateFormatted}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {prop.view_count || 0}
                </td>
                    <td className="actions">
                      <Link href={`/admin/edit-property/${prop.id}`} 
                      className="action-btn edit"
                      target="_blank" // ⭐️ 1. เพิ่มบรรทัดนี้
                      rel="noopener noreferrer" // ⭐️ 2. (แนะนำ) เพิ่มบรรทัดนี้เพื่อความปลอดภัย
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Link>

                      {/* --- ⬇️ [เพิ่มปุ่มนี้] ⬇️ --- */}
                      {/* ⭐️ แสดงปุ่มเฉพาะเมื่อ Property ยัง Available/Reserved */}
                      {(prop.availability === 'Available' || prop.availability === 'Reserved') && (
                        <button
                          onClick={() => openModal(prop)} // ⭐️ เรียกฟังก์ชันเปิด Modal
                          className="action-btn close-deal" // ⭐️ ใช้ class ใหม่ (เดี๋ยวเพิ่ม CSS)
                          title="Close Deal"
                        >
                          <i className="fas fa-gavel"></i> {/* ⭐️ ไอคอนค้อน (หรือ fas fa-dollar-sign) */}
                        </button>
                      )}
                      {/* --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ --- */}

                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="action-btn delete"
                        disabled={deletingId === prop.id}
                      >
                        {deletingId === prop.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash-alt"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
               <tr><td colSpan={6} style={{ textAlign: 'center' }}>No properties found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* --- ⬇️ [เพิ่ม: เรียกใช้ Modal] ⬇️ --- */}
      {selectedProperty && (
        <CloseDealModal
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={handleDealClosed} // ⭐️ ส่ง Handler ไป
        />
      )}
      {/* --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ --- */}
    </>
  );
}