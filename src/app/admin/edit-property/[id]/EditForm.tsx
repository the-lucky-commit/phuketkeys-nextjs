'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';
import { Property } from '@/lib/types';
import Image from 'next/image';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(property.main_image_url || '');
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
        setImageUrl(data.imageUrl);
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
    let finalImageUrl = imageUrl;
    
    if (imageFile) {
      const uploadedUrl = await handleUpload();
      if (!uploadedUrl) return;
      finalImageUrl = uploadedUrl;
    }

    setIsLoading(true);
    const notification = toast.loading('Saving changes...');
    
    const updatedData = {
      title,
      status,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms) || null,
      bathrooms: parseInt(bathrooms) || null,
      area_sqm: parseInt(area) || null,
      description,
      price_period: pricePeriod,
      main_image_url: finalImageUrl
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        toast.success('Property updated successfully!', { id: notification });
        router.push('/admin/properties');
        router.refresh();
      } else {
        toast.error('Failed to update property.', { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred while updating.', { id: notification });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <input type="text" id="pricePeriod" value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} />
            </div>
        </div>
        
        <div className="form-group">
            <label>Current Image</label>
            {imageUrl ? (
                <Image src={imageUrl} alt="Current property image" width={200} height={150} style={{ objectFit: 'cover', borderRadius: '5px' }} />
            ) : (
                <p>No image available.</p>
            )}
        </div>
        <div className="form-group">
            <label htmlFor="imageFile">Upload New Image (Optional)</label>
            <input type="file" id="imageFile" onChange={handleFileChange} accept="image/*" />
            {imageFile && <p>New file selected: {imageFile.name}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading || isUploading}>
          {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : 'Save Changes'}
        </button>
    </form>
  );
}