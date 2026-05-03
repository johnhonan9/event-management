import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Check, X, Loader } from 'lucide-react';
import API from '../../api/axios';

export default function AdminTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/testimonials');
      setData(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleApprove = async (id, current) => {
    await API.put(`/admin/testimonials/${id}`, { is_approved: !current });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete testimonial?')) {
      await API.delete(`/admin/testimonials/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials Manager</h1>
        <button onClick={() => { setEditData(null); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {loading ? <div className="flex justify-center py-10"><Loader className="animate-spin" /></div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4 hidden md:table-cell">Rating</th>
                <th className="p-4 hidden sm:table-cell">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{t.customer_name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{t.review_text}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />)}</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => toggleApprove(t.id, t.is_approved)} className={`p-2 rounded ${t.is_approved ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'}`}>
                      {t.is_approved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setEditData(t); setModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <TestimonialModal close={() => { setModalOpen(false); setEditData(null); fetchData(); }} editData={editData} />}
    </div>
  );
}

const TestimonialModal = ({ close, editData }) => {
  const [form, setForm] = useState({ customer_name: '', review_text: '', rating: 5, event_type: '', photo_url: '', is_approved: false, display_order: 0 });
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (editData) setForm(editData); }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editData?.id) await API.put(`/admin/testimonials/${editData.id}`, form);
      else await API.post('/admin/testimonials', form);
      close();
    } catch (err) { alert('Save failed'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit' : 'Add'} Testimonial</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Customer Name" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full p-2 border rounded" required />
          <textarea placeholder="Review Text" value={form.review_text} onChange={e => setForm({...form, review_text: e.target.value})} rows={3} className="w-full p-2 border rounded" required />
          <div>
            <label className="text-sm font-medium">Rating</label>
            <select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full p-2 border rounded mt-1">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
            </select>
          </div>
          <input placeholder="Event Type (e.g., Birthday)" value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} className="w-full p-2 border rounded" />
          <input placeholder="Photo URL" value={form.photo_url} onChange={e => setForm({...form, photo_url: e.target.value})} className="w-full p-2 border rounded" />
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_approved} onChange={e => setForm({...form, is_approved: e.target.checked})} className="w-4 h-4" /> Approved on publish</label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};