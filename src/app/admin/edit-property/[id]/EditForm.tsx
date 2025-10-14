'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';

export default function EditForm({ property }: { property: Property }) {
  const router = useRouter();
  const [title, setTitle] = useState(property.title);
  const [status, setStatus] = useState(property.status);
  const [price, setPrice] = useState(property.price.toString());
  const [bedrooms, setBedrooms] = useState(property.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(property.bathrooms?.toString() || '');
  const [area, setArea] = useState(property.area_sqm?.toString() || '');
  const [description, setDescription] = useState(property.description || '');
  const [pricePeriod, setPricePeriod] = useState(property.price_period || '');
  const [isLoading, setIsLoading] = useState(false);

  // ** เราได้ลบ Logic การจัดการไฟล์รูปภาพหลักออกจากฟอร์มนี้แล้ว **

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Saving changes...');
    
    // ข้อมูลที่ส่งจะไม่มี main_image_url อีกต่อไป เพราะเราจะจัดการแยกกัน
    const updatedData = {
      title,
      status,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || null,
      bathrooms: parseInt(bathrooms) || null,
      area_sqm: parseInt(area) || null,
      description,
      price_period: pricePeriod,
    };

    try {
      // เราจะแก้ไข API endpoint ในอนาคตให้รับ main_image_url แยก
      // แต่ตอนนี้จะใช้ API เดิมไปก่อน
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...updatedData, main_image_url: property.main_image_url }), // ยังส่ง URL เดิมไปก่อน
      });

      if (response.ok) {
        toast.success('Property details updated successfully!', { id: notification });
        router.refresh(); // รีเฟรชข้อมูลเพื่อให้เห็นการเปลี่ยนแปลง
      } else {
        toast.error('Failed to update property details.', { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred while updating.', { id: notification });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h3>Property Details</h3>
        <div className="form-group">
            <label htmlFor="title">Property Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="form-group-grid">
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="price">Price (฿)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input type="number" id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input type="number" id="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="area">Area (sqm)</label>
                <input type="number" id="area" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="pricePeriod">Price Period</label>
                <input type="text" id="pricePeriod" value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} />
            </div>
        </div>
        
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
    </form>
  );
}