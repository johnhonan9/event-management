import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import API from '../../api/axios';
// ✅ Import the Image Upload Component
import ImageUpload from '../../components/shared/ImageUpload';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Initial State
  const initialFormState = { 
    name: '', 
    description: '', 
    thumbnail_url: '', 
    display_order: 0, 
    is_active: true 
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch Data
  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/admin/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Handle Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await API.put(`/admin/categories/${formData.id}`, formData);
      } else {
        await API.post('/admin/categories', formData);
      }
      setModalOpen(false);
      setFormData(initialFormState);
      fetchCategories();
    } catch (err) {
      alert('Error saving category');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      await API.delete(`/admin/categories/${id}`);
      fetchCategories();
    }
  };

  // Open Modal for Edit
  const openEdit = (cat) => {
    setFormData(cat);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Manager</h1>
        <button onClick={() => { setFormData(initialFormState); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? <div className="flex justify-center py-10"><Loader className="animate-spin" /></div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-16">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4 hidden md:table-cell">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {cat.thumbnail_url ? (
                      <img src={cat.thumbnail_url} alt={cat.name} className="w-12 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    <div>{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat.slug}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-gray-600 max-w-xs truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {cat.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ✅ REPLACED: Text Input with ImageUpload Component */}
              <ImageUpload 
                label="Category Thumbnail"
                currentImage={formData.thumbnail_url}
                onUploadSuccess={(url) => setFormData({ ...formData, thumbnail_url: url })}
              />

              <input 
                type="text" placeholder="Category Name" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              
              <textarea 
                placeholder="Description"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={3}
              />
              
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium">Active</span>
                </label>
                
                <div className="flex-1">
                   <input 
                    type="number" placeholder="Display Order"
                    value={formData.display_order} onChange={e => setFormData({...formData, display_order: Number(e.target.value)})} 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}