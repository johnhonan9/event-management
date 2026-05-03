import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, Image as ImageIcon } from 'lucide-react';
import API from '../../api/axios';
import PackageForm from './PackageForm';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchPackages = async () => {
    try {
      const { data } = await API.get('/admin/packages');
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this package?')) {
      await API.delete(`/admin/packages/${id}`);
      fetchPackages();
    }
  };

  const openEdit = (pkg) => {
    setEditData(pkg);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditData(null);
    fetchPackages();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Package Manager</h1>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader className="animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-16">Image</th>
                <th className="p-4">Package Name</th>
                <th className="p-4 hidden md:table-cell">Category</th>
                <th className="p-4 hidden md:table-cell">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => {
                const thumb = pkg.images && pkg.images.length > 0 ? pkg.images[0].image_url : null;
                return (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {thumb ? (
                        <img src={thumb} alt="Thumb" className="w-12 h-12 object-cover rounded-md border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      <div>{pkg.name}</div>
                      <div className="text-xs text-gray-500">{pkg.slug}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {pkg.Category?.name || pkg.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {pkg.discounted_price ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-green-600">₹{pkg.discounted_price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{pkg.price}</span>
                        </div>
                      ) : (
                        <span>₹{pkg.price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pkg.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openEdit(pkg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {packages.length === 0 && (
            <div className="p-8 text-center text-gray-500">No packages found. Add one to get started!</div>
          )}
        </div>
      )}

      {formOpen && <PackageForm close={closeForm} editData={editData} />}
    </div>
  );
}