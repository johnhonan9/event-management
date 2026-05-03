import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../../api/axios';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', display_order: 0, is_active: true });

  const fetchFaqs = async () => {
    try {
      const { data } = await API.get('/admin/faqs');
      setFaqs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData?.id) await API.put(`/admin/faqs/${editData.id}`, form);
      else await API.post('/admin/faqs', form);
      setModalOpen(false);
      setEditData(null);
      setForm({ question: '', answer: '', category: 'General', display_order: 0, is_active: true });
      fetchFaqs();
    } catch (err) { alert('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      await API.delete(`/admin/faqs/${id}`);
      fetchFaqs();
    }
  };

  const openEdit = (faq) => {
    setEditData(faq);
    setForm(faq);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ Manager</h1>
        <button onClick={() => { setEditData(null); setForm({ question: '', answer: '', category: 'General', display_order: 0, is_active: true }); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {loading ? <div className="flex justify-center py-10"><Loader className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map(faq => (
            <div key={faq.id} className="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-300 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{faq.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(faq)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{faq.question}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{faq.answer}</p>
            </div>
          ))}
          {faqs.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No FAQs found.</div>}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Question" value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full p-2 border rounded" required />
              <textarea placeholder="Answer" rows={4} value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} className="w-full p-2 border rounded" required />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Category (e.g. Pricing)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded" />
                <input type="number" placeholder="Order" value={form.display_order} onChange={e => setForm({...form, display_order: Number(e.target.value)})} className="w-full p-2 border rounded" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4" /> Active
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}