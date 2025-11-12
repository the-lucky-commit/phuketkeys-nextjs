'use client';

import { useState, useEffect, useCallback } from 'react'; // ⭐️ ตรวจสอบ Imports
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';
import CloseDealModal from '@/components/CloseDealModal'; // ⭐️ Import Modal

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ⭐️ เริ่มที่ true สำหรับโหลดครั้งแรก
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- State สำหรับการค้นหาและกรองข้อมูล ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [typeFilter, setTypeFilter] = useState('All'); // ⭐️ เพิ่ม filter สำหรับ type_of_sale 

  // --- ⭐️ State สำหรับ Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // --- ⭐️ ฟังก์ชัน Fetch ข้อมูล (ใช้ useCallback) ---
  const fetchProperties = useCallback(async () => {
    // ไม่ต้อง setIsLoading(true) ที่นี่เพื่อให้ UI ไม่กระพริบตอนพิมพ์
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('keyword', searchTerm);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (typeFilter !== 'All') params.append('type_of_sale', typeFilter); // ⭐️ เพิ่ม type_of_sale filter
      
      const queryString = params.toString();
      // ⭐️ (สำคัญ) API Endpoint ต้องเป็น /api/admin/properties เพื่อให้ได้ Availability
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties${queryString ? `?${queryString}` : ''}`; 

      const response = await fetch(apiUrl, { headers: getAuthHeaders() });
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error("Failed to fetch properties, check token or API status.");
        toast.error('Failed to load properties.'); // แจ้ง User ด้วย
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error('Error loading properties.');
      setProperties([]);
    } finally {
      // setIsLoading(false) จะถูกเรียกแค่ครั้งแรกที่โหลดหน้า
      // หรือเมื่อ fetchProperties ถูกเรียกโดยตรง (เช่น หลังปิดดีล)
      if (isLoading) setIsLoading(false); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, typeFilter]); // ⭐️ เพิ่ม typeFilter ใน dependencies

  // --- ⭐️ useEffect หลัก (ใช้ Debounce) ---
  useEffect(() => {
    // โหลดครั้งแรก (ถ้า isLoading เป็น true)
    if (isLoading) {
      fetchProperties();
    } else {
      // ใช้ Debounce สำหรับการพิมพ์ค้นหา
      const delayDebounceFn = setTimeout(() => {
          fetchProperties();
      }, 300); // รอ 300ms หลังหยุดพิมพ์
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, statusFilter, typeFilter, fetchProperties, isLoading]); // ⭐️ เพิ่ม typeFilter

  // --- ⭐️ ฟังก์ชันสำหรับ Modal ---
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(false);
  };

  // ⭐️ ฟังก์ชันเมื่อ Modal บันทึกสำเร็จ
  const handleDealClosed = () => {
    fetchProperties(); // Refresh ตารางใหม่
  };

  // --- ฟังก์ชัน Delete (เหมือนเดิม) ---
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
  
  // --- Loading State (สำหรับโหลดครั้งแรก) ---
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading properties...</div>;
  }

  // --- JSX (Return) ---
  return (
    <>
      {/* --- UI Filter (เพิ่ม Rent (Daily)) --- */}
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
            onClick={() => setTypeFilter('All')} 
            className={typeFilter === 'All' ? 'active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setTypeFilter('For Sale')}
            className={typeFilter === 'For Sale' ? 'active' : ''}
          >
            For Sale
          </button>
          <button 
            onClick={() => setTypeFilter('For Rent')}
            className={typeFilter === 'For Rent' ? 'active' : ''}
          >
            For Rent
          </button>
          <button 
            onClick={() => setTypeFilter('Daily Rent')}
            className={typeFilter === 'Daily Rent' ? 'active' : ''}
          >
            Daily Rent
          </button>
        </div>
      </div>

      {/* --- ตาราง --- */}
      <div className="table-container full-width">
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              <th>Image</th>
              <th>Property Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Price</th>
              <th>Date Added</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties.map((prop, index) => {
                const priceFormatted = new Intl.NumberFormat('th-TH').format(prop.price);
                const dateFormatted = new Date(prop.created_at).toLocaleDateString('en-GB');
                // ⭐️ สร้าง class สำหรับ Status Badge
                const statusClass = prop.status?.toLowerCase()
                                      .replace('for ', '')
                                      .replace(' (daily)', '-daily') || '';
                // ⭐️ สร้าง class สำหรับ Type Badge
                const typeClass = prop.type_of_sale?.toLowerCase()
                                    .replace('for ', '')
                                    .replace(' ', '-') || 'sale';
                return (
                  <tr key={prop.id}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#666' }}>
                      {index + 1}
                    </td>
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
                    <td><span className={`status ${typeClass}`}>{prop.type_of_sale || 'For Sale'}</span></td>
                    <td><span className={`status ${statusClass}`}>{prop.status}</span></td>
                    <td>฿ {priceFormatted} {prop.price_period ? `/ ${prop.price_period}` : ''}</td>
                    <td>{dateFormatted}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {prop.view_count || 0}
                    </td>
                    <td className="actions"> 
                      <Link 
                        href={`/admin/edit-property/${prop.id}`} 
                        className="action-btn edit"
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Edit"
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Link>

                      {/* ⭐️ ปุ่ม Close Deal */}
                      {(prop.availability === 'Available' || prop.availability === 'Reserved') && (
                        <button
                          onClick={() => openModal(prop)}
                          className="action-btn close-deal"
                          title="Close Deal"
                        >
                          <i className="fas fa-gavel"></i>
                        </button>
                      )}

                      {/* ปุ่ม Delete */}
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="action-btn delete"
                        disabled={deletingId === prop.id}
                        title="Delete"
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
               <tr><td colSpan={8} style={{ textAlign: 'center' }}>No properties found matching your criteria.</td></tr> 
            )}
          </tbody>
        </table>
      </div>

      {/* --- ส่วน Modal --- */}
      {selectedProperty && (
        <CloseDealModal
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={handleDealClosed}
        />
      )}
    </>
  );
}