'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- State สำหรับการค้นหาและกรองข้อมูล ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'For Sale', 'For Rent'

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
  }, [searchTerm, statusFilter]); // <-- ทำงานใหม่ทุกครั้งที่ searchTerm หรือ statusFilter เปลี่ยน

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
                    <td className="actions">
                      <Link href={`/admin/edit-property/${prop.id}`} className="action-btn edit">
                        <i className="fas fa-pencil-alt"></i>
                      </Link>
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
    </>
  );
}