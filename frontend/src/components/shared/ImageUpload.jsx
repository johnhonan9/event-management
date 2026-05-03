import React, { useState } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils'; // ✅ Import utility

export default function ImageUpload({ onUploadSuccess, currentImage, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const CLOUD_NAME = "dgsjaazue"; 
  const UPLOAD_PRESET = "event-admin"; 

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error.message);
      } else {
        // ✅ Optimize URL before saving to database
        const rawUrl = data.secure_url;
        const optimizedUrl = optimizeCloudinaryUrl(rawUrl);
        onUploadSuccess(optimizedUrl);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      
      {currentImage ? (
        <div className="relative group">
          {/* ✅ Display optimized URL */}
          <img src={optimizeCloudinaryUrl(currentImage)} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
            <label className="cursor-pointer bg-white px-3 py-1 rounded-full text-xs font-bold text-black">
              Change Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition relative">
          {uploading ? (
            <Loader className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
          )}
          
          <p className="text-xs text-gray-500 mb-2">
            {uploading ? 'Uploading...' : 'Click to select image'}
          </p>
          
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
      
      {currentImage && !uploading && (
        <p className="text-green-500 text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Image saved & optimized
        </p>
      )}
    </div>
  );
}