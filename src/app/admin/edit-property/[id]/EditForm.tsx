'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ... Interface Property ...
interface Property {
  id: number;
  title: string;
  status: string;
  price: number;
  main_image_url: string;
  price_period?: string;
}

export default function EditForm({ property }: { property: Property }) {
  const router = useRouter();
  const [title, setTitle] = useState(property.title);
  const [status, setStatus] = useState(property.status);
  const [price, setPrice] = useState(property.price.toString());
  const [pricePeriod, setPricePeriod] = useState(property.price_period || '');
  const [imageUrl, setImageUrl] = useState(property.main_image_url || '');
  const [isLoading, setIsLoading] = useState(false); // <-- 1. เพิ่ม State

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // <-- 2. เริ่ม Loading
    const notification = toast.loading('Saving changes...');
    
    const updatedData = { title, status, price: parseFloat(price), price_period: pricePeriod, main_image_url: imageUrl };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, { cache: 'no-store' });
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        toast.success('Property updated successfully!', { id: notification });
        router.push('/admin/properties');
      } else {
        toast.error('Failed to update property.', { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred while updating.', { id: notification });
    } finally {
      setIsLoading(false); // <-- 3. สิ้นสุด Loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        {/* ... input fields เหมือนเดิม ... */}
        <div className="form-group">
            <label htmlFor="title">Property Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
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
            <label htmlFor="pricePeriod">Price Period</label>
            <input type="text" id="pricePeriod" value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="imageUrl">Main Image URL</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        {/* 4. อัปเดตปุ่ม */}
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
    </form>
  );
}