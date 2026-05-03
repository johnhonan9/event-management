import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader, ShieldCheck } from 'lucide-react';
import API from '../../api/axios';

export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor', is_active: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/admins');
      setAdmins(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this admin?')) {
      await API.delete(`/admin/admins/${id}`);
      fetchData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await API.put(`/admin/admins/${editData.id}`, { ...form, new_password: form.password || undefined });
      } else {
        if (!form.password) return alert('Password is required for new admins');
        await API.post('/admin/admins', form);
      }
      setModalOpen(false);
      setEditData(null);
      setForm({ name: '', email: '', password: '', role: 'editor', is_active: true });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button onClick={() => { setEditData(null); setForm({ name: '', email: '', password: '', role: 'editor', is_active: true }); setModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4 hidden md:table-cell">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center"><Loader className="animate-spin mx-auto" /></td></tr>
            ) : admins.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium flex items-center gap-2">
                    {a.name}
                    {a.role === 'superadmin' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="text-sm text-gray-500">{a.email}</div>
                </td>
                <td className="p-4 capitalize">{a.role}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2 py-1 rounded text-xs ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => { setEditData(a); setForm({ ...a, password: '' }); setModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Admin' : 'Add Admin'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={!!editData} />
              <Input label={editData ? "New Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editData} />
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full p-2 border rounded">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4" /> Active</label>
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

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full p-2 border rounded" />
  </div>
);