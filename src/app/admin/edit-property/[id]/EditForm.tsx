'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';
import Image from 'next/image'; // Import Image
import AmenityChecklist from '@/components/AmenityChecklist';

export default function EditForm({ property }: { property: Property }) {
  const router = useRouter();

  // --- State สำหรับข้อมูล Property (เหมือนเดิม) ---
  const [title, setTitle] = useState(property.title);
  const [status, setStatus] = useState(property.status);
  const [price, setPrice] = useState(property.price.toString());
  const [bedrooms, setBedrooms] = useState(property.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(property.bathrooms?.toString() || '');
  const [area, setArea] = useState(property.area_sqm?.toString() || '');
  const [description, setDescription] = useState(property.description || '');
  const [pricePeriod, setPricePeriod] = useState(property.price_period || '');
  const [availability, setAvailability] = useState(property.availability || 'Available');
  
  // --- ⬇️ [เพิ่ม] State สำหรับการอัปโหลดรูป (เหมือนหน้า Add) ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- ⬇️ [เพิ่ม] State สำหรับเก็บข้อมูลรูปภาพ *ปัจจุบัน* ---
  // เราใช้ state นี้เพื่อที่ handleSubmit จะได้รู้ว่า public_id "เก่า" คืออะไร
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState(property.main_image_url);
  const [currentMainImagePublicId, setCurrentMainImagePublicId] = useState(property.main_image_public_id);
  // ⭐️ 2. คำนวณ ID ของ Amenities ที่ถูกเลือกไว้แล้ว
  const initialAmenityIds = property.amenities ? property.amenities.map(a => a.id) : [];
  // ⭐️ 3. เพิ่ม State นี้
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>(initialAmenityIds);


  // --- ⬇️ [เพิ่ม] ฟังก์ชันสำหรับจัดการไฟล์ (เหมือนหน้า Add) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // สร้าง URL ชั่วคราวเพื่อแสดง Preview
      setCurrentMainImageUrl(URL.createObjectURL(file));
    }
  };

  // --- ⬇️ [เพิ่ม] ฟังก์ชันสำหรับอัปโหลด (เหมือนหน้า Add) ---
  const handleUpload = async () => {
    if (!imageFile) return null; // ไม่ควรเกิดขึ้นถ้า logic ถูกต้อง

    setIsUploading(true);
    const notification = toast.loading('Uploading new image...');
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
        return { 
          imageUrl: data.imageUrl, 
          publicId: data.publicId 
        };
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

  // --- ⬇️ [แก้ไข] อัปเกรด handleSubmit ให้ซับซ้อนขึ้น ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Saving changes...');

    let mainImageUrl = currentMainImageUrl; // รูปเดิม
    let mainImagePublicId = currentMainImagePublicId; // ID เดิม
    let oldMainImagePublicId = null; // ID ที่จะใช้ลบ (ถ้ามี)

    // --- Path B: ถ้ามีการเลือกไฟล์ใหม่ ---
    if (imageFile) {
      const uploadedData = await handleUpload();
      if (uploadedData) {
        // อัปเดตเป็นข้อมูลรูปใหม่
        mainImageUrl = uploadedData.imageUrl;
        mainImagePublicId = uploadedData.publicId;
        // **สำคัญ:** เก็บ ID เก่าไว้ เพื่อส่งไปให้ Backend ลบทิ้ง
        oldMainImagePublicId = currentMainImagePublicId; 
      } else {
        // ถ้าการอัปโหลดล้มเหลว ให้หยุดทำงาน
        setIsLoading(false);
        toast.error('Failed to upload new image. Changes not saved.', { id: notification });
        return;
      }
    }
    // --- ถ้าไม่มีการเลือกไฟล์ใหม่ (Path A) ก็แค่ใช้ค่า mainImageUrl, mainImagePublicId เดิม ---

    const updatedData = {
      title,
      status,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || null,
      bathrooms: parseInt(bathrooms) || null,
      area_sqm: parseInt(area) || null,
      description,
      price_period: pricePeriod,
      // ข้อมูลรูปภาพ (ไม่ว่าจะเป็นของเก่า หรือของใหม่ที่เพิ่งอัปโหลด)
      main_image_url: mainImageUrl,
      main_image_public_id: mainImagePublicId,
      // **สำคัญ:** ส่ง ID เก่าไปให้ Backend ด้วย (ถ้ามี)
      old_main_image_public_id: oldMainImagePublicId,
      amenities: selectedAmenityIds,
      availability: availability
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData), 
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
  // --- ⬆️ [สิ้นสุดการแก้ไข handleSubmit] ---

  return (
    <form onSubmit={handleSubmit}>
        <h3>Property Details</h3>
        
        {/* --- ⬇️ [เพิ่ม] ส่วนสำหรับแสดงผลและเปลี่ยนรูปภาพ --- */}
        <div className="form-group">
            <label>Main Image</label>
            {currentMainImageUrl && (
              <div style={{ marginBottom: '15px' }}>
                <Image 
                  src={currentMainImageUrl} 
                  alt="Current main image" 
                  width={200} 
                  height={150} 
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              </div>
            )}
            <input 
              type="file" 
              id="imageFile" 
              onChange={handleFileChange} 
              accept="image/*"
            />
            {imageFile && <p style={{ marginTop: '5px' }}>New file selected: {imageFile.name}</p>}
        </div>
        {/* --- ⬆️ [เพิ่ม] --- */}

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
    <label htmlFor="status">Status (Sale/Rent)</label>
    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="For Sale">For Sale</option>
      <option value="For Rent">For Rent</option>
      <option value="For Rent (Daily)">For Rent (Daily)</option>
    </select>
  </div>

  {/* --- ⬇️ [เพิ่ม Dropdown นี้] ⬇️ --- */}
  <div className="form-group">
    <label htmlFor="availability">Availability</label>
    <select 
      id="availability" 
      value={availability} 
      onChange={(e) => setAvailability(e.target.value)}
    >
      <option value="Available">Available</option>
      <option value="Reserved">Reserved</option>
      <option value="Rented">Rented</option>
      <option value="Sold">Sold</option>
    </select>
  </div>
  {/* --- ⬆️ [สิ้นสุดการเพิ่ม] ⬆️ --- */}
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

        {/* ⭐️ 4. วาง Checklist ไว้ตรงนี้ */}
    <AmenityChecklist 
      initialSelectedIds={initialAmenityIds} // ⭐️ ส่งของเก่าเข้าไป
      onChange={(ids) => setSelectedAmenityIds(ids)} // ⭐️ อัปเดต State
    />
        
        <button type="submit" className="btn-primary" disabled={isLoading || isUploading}>
          {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : 'Save Changes'}
        </button>
    </form>
  );
}