import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import ImageUpload from '../../components/shared/ImageUpload';
import API from '../../api/axios';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/banners');
      setBanners(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      await API.delete(`/admin/banners/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Manager</h1>
        <button onClick={() => { setEditData(null); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {loading ? <div className="flex justify-center py-10"><Loader className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-32 bg-gray-200 relative">
                <img src={b.image_url || "https://placehold.co/1200x400?text=No+Image"} className="w-full h-full object-cover" alt={b.title} />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${b.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{b.is_active ? 'Active' : 'Hidden'}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{b.title}</h3>
                <p className="text-sm text-gray-500 truncate">{b.subtitle}</p>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => { setEditData(b); setModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No banners found.</div>}
        </div>
      )}

      {modalOpen && <BannerModal close={() => { setModalOpen(false); setEditData(null); fetchData(); }} editData={editData} />}
    </div>
  );
}

const BannerModal = ({ close, editData }) => {
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', mobile_image_url: '', cta_text: '', cta_link: '', display_order: 0, is_active: true });
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (editData) setForm(editData); }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editData?.id) await API.put(`/admin/banners/${editData.id}`, form);
      else await API.post('/admin/banners', form);
      close();
    } catch (err) { alert('Save failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Banner' : 'Add Banner'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ✅ UPDATED: Desktop Image Upload */}
          <ImageUpload 
            label="Desktop Image (1200x600 recommended)"
            currentImage={form.image_url} 
            onUploadSuccess={(url) => setForm({ ...form, image_url: url })} 
          />

          {/* ✅ UPDATED: Mobile Image Upload */}
          <ImageUpload 
            label="Mobile Image (800x600 recommended)"
            currentImage={form.mobile_image_url} 
            onUploadSuccess={(url) => setForm({ ...form, mobile_image_url: url })} 
          />

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input placeholder="Explore" value={form.cta_text} onChange={e => setForm({...form, cta_text: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <input placeholder="/category" value={form.cta_link} onChange={e => setForm({...form, cta_link: e.target.value})} className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4" /> 
            <span>Active</span>
          </label>
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading || !form.image_url} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};