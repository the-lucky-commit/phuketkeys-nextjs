'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';

export default function AddPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return null;
    setIsUploading(true);
    const notification = toast.loading('Uploading image...');
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeaders().Authorization },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Image uploaded!', { id: notification });
        return data.imageUrl;
      } else {
        toast.error(`Upload failed: ${data.error}`, { id: notification });
        return null;
      }
    } catch (error) {
      toast.error('An error occurred during upload.', { id: notification });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
        toast.error('Please select an image to upload.');
        return;
    }

    const uploadedUrl = await handleUpload();
    if (!uploadedUrl) return;

    setIsLoading(true);
    const notification = toast.loading('Adding new property...');
    const propertyData = {
      title, status, price: parseFloat(price),
      price_period: pricePeriod, main_image_url: uploadedUrl,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
            {/* --- เพิ่ม Input Fields ที่หายไปกลับเข้ามา --- */}
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
            {/* ------------------------------------- */}
            <div className="form-group">
                <label htmlFor="imageFile">Main Image</label>
                <input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" required/>
                {imageFile && <p>Selected file: {imageFile.name}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading || isUploading}>
              {isUploading ? 'Uploading Image...' : isLoading ? 'Adding Property...' : 'Add Property'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}