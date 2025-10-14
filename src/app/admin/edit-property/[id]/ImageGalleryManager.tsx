'use client';

import { useState, useEffect } from 'react'; // 1. Import useEffect
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';

interface Image {
  id: number;
  image_url: string;
}

interface Props {
  propertyId: number;
  initialImages: Image[];
}

export default function ImageGalleryManager({ propertyId, initialImages }: Props) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- 2. เพิ่ม useEffect เพื่อคอยอัปเดต State ---
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]); // โค้ดนี้จะทำงานทุกครั้งที่ initialImages เปลี่ยนไป

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesToUpload(e.target.files);
  };

  const handleUpload = async () => {
    if (!filesToUpload || filesToUpload.length === 0) {
      toast.error('Please select files to upload.');
      return;
    }
    setIsUploading(true);
    const notification = toast.loading(`Uploading ${filesToUpload.length} image(s)...`);

    const formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append('images', filesToUpload[i]);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${propertyId}/images`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeaders().Authorization },
        body: formData,
      });

      if (response.ok) {
        toast.success('Images uploaded successfully!', { id: notification });
        router.refresh(); // บอกให้ Next.js โหลดข้อมูลหน้านี้ใหม่ (ซึ่งจะไป trigger useEffect ข้างบน)
      } else {
        const data = await response.json();
        toast.error(`Upload failed: ${data.error}`, { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred during upload.', { id: notification });
    } finally {
      setIsUploading(false);
      setFilesToUpload(null);
      // clear the file input
      const fileInput = document.getElementById('galleryFiles') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleDelete = async (imageId: number) => {
    if (confirm('Are you sure you want to delete this gallery image?')) {
      setDeletingId(imageId);
      const notification = toast.loading('Deleting image...');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/images/${imageId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          setImages(images.filter(img => img.id !== imageId));
          toast.success('Image deleted successfully!', { id: notification });
        } else {
          toast.error('Failed to delete image.', { id: notification });
        }
      } catch (error) {
        toast.error('An error occurred while deleting.', { id: notification });
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="gallery-manager">
      <h3>Image Gallery</h3>
      <div className="gallery-grid">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <Image src={image.image_url} alt="Gallery image" width={150} height={100} style={{ objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              disabled={deletingId === image.id}
              className="delete-btn"
            >
              {deletingId === image.id ? '...' : '×'}
            </button>
          </div>
        ))}
        {images.length === 0 && <p>No gallery images yet.</p>}
      </div>

      <div className="form-group">
        <label htmlFor="galleryFiles">Upload More Images (up to 5)</label>
        <input
          type="file"
          id="galleryFiles"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !filesToUpload}
          className="btn-outline"
          style={{ marginTop: '10px' }}
        >
          {isUploading ? 'Uploading...' : 'Upload Selected'}
        </button>
      </div>
    </div>
  );
}