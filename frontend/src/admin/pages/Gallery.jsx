import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, Loader } from 'lucide-react';
import ImageUpload from '../../components/shared/ImageUpload'; // Import your new component
import API from '../../api/axios';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [imgRes, catRes] = await Promise.all([
        API.get('/admin/gallery', { params: filterCat !== 'all' ? { category_id: filterCat } : {} }),
        API.get('/admin/categories')
      ]);
      setImages(imgRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterCat]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image permanently?')) {
      await API.delete(`/admin/gallery/${id}`);
      fetchData();
    }
  };

  const openEdit = (img) => {
    setEditData(img);
    setModalOpen(true);
  };

  const toggleActive = async (id, currentStatus) => {
    await API.put(`/admin/gallery/${id}`, { is_active: !currentStatus });
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Gallery Manager</h1>
        <div className="flex gap-3">
          <select className="p-2 border rounded" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => { setEditData(null); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-10"><Loader className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map(img => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm overflow-hidden group relative">
              <div className="h-48 overflow-hidden relative">
                <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${img.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {img.is_active ? 'Active' : 'Hidden'}
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium truncate">{img.caption || 'No Caption'}</p>
                <p className="text-xs text-gray-500 mt-1">{img.category?.name || 'General'}</p>
                <div className="flex justify-end gap-2 mt-3 opacity-80 group-hover:opacity-100 transition">
                  <button onClick={() => toggleActive(img.id, img.is_active)} className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(img)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No gallery images found.</div>}
        </div>
      )}

      {modalOpen && (
        <GalleryModal 
          close={() => { setModalOpen(false); setEditData(null); fetchData(); }} 
          editData={editData} 
          categories={categories} 
        />
      )}
    </div>
  );
}

// Gallery Add/Edit Modal
const GalleryModal = ({ close, editData, categories }) => {
  const [form, setForm] = useState({
    image_url: '', caption: '', category_id: '', is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData?.id) await API.put(`/admin/gallery/${editData.id}`, form);
      else await API.post('/admin/gallery', form);
      close();
    } catch (err) {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Image' : 'Add Image'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ✅ UPDATED: Use ImageUpload Component instead of text input */}
          <ImageUpload 
            label="Gallery Image"
            currentImage={form.image_url} 
            onUploadSuccess={(url) => setForm({ ...form, image_url: url })} 
          />

          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <input name="caption" value={form.caption} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">None (General)</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
            <span>Active (Visible on website)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading || !form.image_url} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
