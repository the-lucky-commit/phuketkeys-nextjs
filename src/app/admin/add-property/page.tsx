'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AddPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- 1. เพิ่ม State สำหรับ Loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // <-- 2. เริ่ม Loading
    const notification = toast.loading('Adding new property...');

    const propertyData = {
      title, status, price: parseFloat(price),
      price_period: pricePeriod, main_image_url: imageUrl,
    };

    try {
      const response = await fetch('http://localhost:3000/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        toast.success('Property added successfully!', { id: notification });
        router.push('/admin/properties');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add property: ${errorData.error}`, { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred.', { id: notification });
    } finally {
      setIsLoading(false); // <-- 3. สิ้นสุด Loading (ไม่ว่าจะสำเร็จหรือล้มเหลว)
    }
  };

  return (
    <main className="main-content">
      <header className="main-header"><h1>Add New Property</h1></header>
      <section className="content-area">
        <div className="form-container">
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
                <label htmlFor="pricePeriod">Price Period (e.g., / Month)</label>
                <input type="text" id="pricePeriod" value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} placeholder="Only for rentals" />
            </div>
            <div className="form-group">
                <label htmlFor="imageUrl">Main Image URL</label>
                <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/img/your-image.jpg" />
            </div>

            {/* 4. อัปเดตปุ่มให้มีสถานะ disabled และเปลี่ยนข้อความ */}
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Property'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}