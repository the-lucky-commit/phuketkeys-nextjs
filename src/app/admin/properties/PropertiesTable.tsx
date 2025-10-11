'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth'; // 1. Import helper function

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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (propertyId: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setDeletingId(propertyId);
      const notification = toast.loading('Deleting...');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${propertyId}`, {
          method: 'DELETE',
          headers: getAuthHeaders() // 2. ใช้งาน helper function
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

  return (
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
                  <td><img src={prop.main_image_url || '/img/placeholder.jpg'} alt={prop.title} className="property-thumb" /></td>
                  <td>{prop.title}</td>
                  <td><span className={`status ${prop.status.toLowerCase().replace('for ', '')}`}>{prop.status}</span></td>
                  <td>฿ {priceFormatted} {prop.price_period || ''}</td>
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
  );
}