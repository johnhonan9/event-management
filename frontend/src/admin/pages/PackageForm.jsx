import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader, Image as ImageIcon } from 'lucide-react';
import API from '../../api/axios';
import ImageUpload from '../../components/shared/ImageUpload';

export default function PackageForm({ close, editData }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Explicit Form State (prevents DB metadata from polluting the form)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    short_description: '',
    full_description: '',
    price: '',
    discounted_price: '',
    duration_hours: 4,
    min_guests: 10,
    max_guests: 50,
    is_featured: false,
    is_active: true,
    badge_text: '',
    whatsapp_message: '',
    images: [] 
  });

  // Fetch Categories & Handle Edit Data
  useEffect(() => {
    API.get('/admin/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
    
    if (editData) {
      setForm({
        name: editData.name || '',
        slug: editData.slug || '',
        category_id: editData.category_id || '',
        short_description: editData.short_description || '',
        full_description: editData.full_description || '',
        price: editData.price || '',
        discounted_price: editData.discounted_price || '',
        duration_hours: editData.duration_hours || 4,
        min_guests: editData.min_guests || 10,
        max_guests: editData.max_guests || 50,
        is_featured: editData.is_featured || false,
        is_active: editData.is_active || true,
        badge_text: editData.badge_text || '',
        whatsapp_message: editData.whatsapp_message || '',
        images: Array.isArray(editData.images) ? editData.images : []
      });
    }
  }, [editData]);

  // Auto-generate Slug from Name
  useEffect(() => {
    if (!editData && form.name) {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.name, editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Image Upload Success
  const handleImageUpload = (url) => {
    if (!url) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { image_url: url }]
    }));
  };

  // Remove an Image
  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove images with empty URLs before sending
      const cleanImages = form.images.filter(img => img.image_url);
      const payload = { ...form, images: cleanImages };

      if (editData?.id) {
        await API.put(`/admin/packages/${editData.id}`, payload);
      } else {
        await API.post('/admin/packages', payload);
      }
      close(); // Triggers parent's fetchPackages()
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">{editData ? 'Edit Package' : 'Add New Package'}</h2>
          <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Package Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (Auto-generated)</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Badge Text (e.g., "Best Seller")</label>
              <input name="badge_text" value={form.badge_text} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Optional" />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <textarea name="short_description" value={form.short_description} onChange={handleChange} rows={2} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Brief summary for cards..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea name="full_description" value={form.full_description} onChange={handleChange} rows={4} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Detailed details for the package page..." />
          </div>

          {/* Pricing & Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-bold mb-1">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Discounted Price (₹)</label>
              <input type="number" name="discounted_price" value={form.discounted_price} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Duration (Hours)</label>
              <input type="number" name="duration_hours" value={form.duration_hours} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Max Guests</label>
              <input type="number" name="max_guests" value={form.max_guests} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* ✅ IMAGE UPLOAD SECTION */}
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Package Images</h3>
            
            {/* Main Upload Area */}
            <div className="mb-4">
               <ImageUpload 
                 label="Upload Image"
                 currentImage={null}
                 onUploadSuccess={handleImageUpload}
               />
            </div>

            {/* Image List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                  <img 
                    src={img.image_url || img} 
                    alt={`Preview ${idx}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => e.target.src = "https://placehold.co/150x150?text=Error"}
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="col-span-full text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                  <ImageIcon className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  No images uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-4 border-t">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium">Active (Visible on website)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium">Featured (Show on Homepage)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={close} className="px-4 py-2 border rounded hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Package'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}