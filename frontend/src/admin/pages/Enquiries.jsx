import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Loader } from 'lucide-react';
import API from '../../api/axios';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;

      const { data } = await API.get('/admin/enquiries', { params });
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter, search]);

  const getStatusColor = (status) => {
    const map = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      quoted: 'bg-purple-100 text-purple-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries CRM</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            placeholder="Search name or phone..." 
            className="w-full pl-10 p-2 border rounded-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select 
            className="p-2 border rounded-lg bg-white"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4 hidden md:table-cell">Package</th>
              <th className="p-4 hidden sm:table-cell">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center"><Loader className="animate-spin mx-auto" /></td></tr>
            ) : enquiries.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No enquiries found.</td></tr>
            ) : enquiries.map(enq => (
              <tr key={enq.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-bold">{enq.customer_name}</div>
                  <div className="text-sm text-gray-500">{enq.customer_phone}</div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{enq.Package?.name || 'General'}</span>
                </td>
                <td className="p-4 hidden sm:table-cell text-sm text-gray-600">
                  {new Date(enq.event_date || enq.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enq.status)}`}>
                    {enq.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => navigate(`/admin/enquiries/${enq.id}`)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}