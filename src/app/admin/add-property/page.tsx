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
  
  // --- 1. เพิ่ม State สำหรับจัดการไฟล์ ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
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
        headers: {
          // สำหรับ FormData ไม่ต้องตั้ง 'Content-Type', browser จะจัดการให้
          'Authorization': getAuthHeaders().Authorization,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Image uploaded!', { id: notification });
        setImageUrl(data.imageUrl); // เก็บ URL ที่ได้จาก Cloudinary
        return data.imageUrl; // ส่ง URL กลับไปให้ handleSubmit ใช้
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
    
    // --- 2. แก้ไข Logic การ Submit ---
    let finalImageUrl = imageUrl; // ใช้ URL ที่มีอยู่แล้ว (ถ้ามี)
    
    // ถ้ามีการเลือกไฟล์ใหม่ ให้ทำการอัปโหลดก่อน
    if (imageFile) {
      const uploadedUrl = await handleUpload();
      if (!uploadedUrl) {
        // ถ้าอัปโหลดไม่สำเร็จ ให้หยุดการทำงาน
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    setIsLoading(true);
    const notification = toast.loading('Adding new property...');
    
    const propertyData = {
      title, status, price: parseFloat(price),
      price_period: pricePeriod, main_image_url: finalImageUrl,
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
            {/* ... input fields อื่นๆ เหมือนเดิม ... */}
            
            {/* --- 3. เปลี่ยนช่องกรอก URL เป็น File Input --- */}
            <div className="form-group">
                <label htmlFor="imageFile">Main Image</label>
                <input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" />
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