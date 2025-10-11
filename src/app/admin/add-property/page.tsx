'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth'; // 1. Import helper function

export default function AddPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Adding new property...');

    const propertyData = {
      title, status, price: parseFloat(price),
      price_period: pricePeriod, main_image_url: imageUrl,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, {
        method: 'POST',
        headers: getAuthHeaders(), // 2. ใช้งาน helper function
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
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <header className="main-header"><h1>Add New Property</h1></header>
      <section className="content-area">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Property'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}