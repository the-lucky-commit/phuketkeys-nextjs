'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// ... Interface Property ...
interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  created_at: string;
  main_image_url: string;
  price_period?: string;
}

export default function PropertiesTable({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties);
  // 1. เปลี่ยน State เป็นการเก็บ ID ที่กำลังลบ
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (propertyId: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setDeletingId(propertyId); // <-- 2. เริ่ม Loading โดยเก็บ ID
      const notification = toast.loading('Deleting...');

      try {
        const response = await fetch(`http://localhost:3000/api/admin/properties/${propertyId}`, {
          method: 'DELETE',
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
        setDeletingId(null); // <-- 3. สิ้นสุด Loading
      }
    }
  };

  return (
    <div className="table-container full-width">
      <table>
        {/* ... thead ... */}
        <tbody>
          {properties.length > 0 ? (
            properties.map(prop => (
              <tr key={prop.id}>
                {/* ... td อื่นๆ ... */}
                <td className="actions">
                  <Link href={`/admin/edit-property/${prop.id}`} className="action-btn edit">
                    <i className="fas fa-pencil-alt"></i>
                  </Link>
                  {/* 4. อัปเดตปุ่ม Delete */}
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
            ))
          ) : (
             <tr><td colSpan={6} style={{ textAlign: 'center' }}>No properties found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}