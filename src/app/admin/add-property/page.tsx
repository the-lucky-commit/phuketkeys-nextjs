'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import AmenityChecklist from '@/components/AmenityChecklist';

export default function AddPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('For Sale');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [pricePeriod, setPricePeriod] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // [แทนที่ฟังก์ชันนี้]
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
        // --- ⬇️ [แก้ไข] ส่งกลับเป็น Object ที่มี 2 ค่า ---
        return { 
          imageUrl: data.imageUrl, 
          publicId: data.publicId 
        };
        // --- ⬆️ [แก้ไข] ---
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

  // [แทนที่ฟังก์ชันนี้]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
        toast.error('Please select an image to upload.');
        return;
    }

    // --- ⬇️ [แก้ไข] เปลี่ยนชื่อตัวแปร ---
    const uploadedData = await handleUpload();
    if (!uploadedData) return; // ถ้า uploadData เป็น null (อัปโหลดล้มเหลว)
    // --- ⬆️ [แก้ไข] ---

    setIsLoading(true);
    const notification = toast.loading('Adding new property...');
    
    const propertyData = {
      title,
      status,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || null,
      bathrooms: parseInt(bathrooms) || null,
      area_sqm: parseInt(area) || null,
      description,
      price_period: pricePeriod,
      // --- ⬇️ [แก้ไข] ส่ง 2 ค่านี้ไปยัง Backend ---
      main_image_url: uploadedData.imageUrl,
      main_image_public_id: uploadedData.publicId,
      // --- ⬆️ [แก้ไข] ---
      amenities: selectedAmenityIds
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
                    <input type="text" id="pricePeriod" value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} placeholder="e.g., / Month"/>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="imageFile">Main Image</label>
                <input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" required/>
                {imageFile && <p>Selected file: {imageFile.name}</p>}
            </div>
            {/* ⭐️ 3. วาง Checklist ไว้ตรงนี้ */}
  <AmenityChecklist 
    initialSelectedIds={[]} // ⭐️ หน้า "เพิ่ม" เริ่มจาก 0
    onChange={(ids) => setSelectedAmenityIds(ids)} // ⭐️ อัปเดต State
  />
            <button type="submit" className="btn-primary" disabled={isLoading || isUploading}>
              {isUploading ? 'Uploading Image...' : isLoading ? 'Adding Property...' : 'Add Property'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}