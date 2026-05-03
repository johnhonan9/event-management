import React, { useState, useEffect } from 'react';
import { Users, Package, Image, TrendingUp, Phone, Mail, Calendar } from 'lucide-react';
import API from '../../api/axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Enquiries" 
          value={stats.totalEnquiries} 
          icon={<Users className="w-8 h-8 text-blue-500" />} 
          subtext={`${stats.newEnquiries} New`}
          color="bg-blue-50"
        />
        <StatCard 
          title="Active Packages" 
          value={stats.activePackages} 
          icon={<Package className="w-8 h-8 text-green-500" />} 
          subtext="Live on Site"
          color="bg-green-50"
        />
        <StatCard 
          title="Gallery Images" 
          value={stats.totalImages} 
          icon={<Image className="w-8 h-8 text-purple-500" />} 
          subtext="Active Photos"
          color="bg-purple-50"
        />
        <StatCard 
          title="Conversion Rate" 
          value="12%" 
          icon={<TrendingUp className="w-8 h-8 text-orange-500" />} 
          subtext="Est. Monthly"
          color="bg-orange-50"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">Customer</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnquiries.map(enq => (
                <tr key={enq.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{enq.customer_name}</td>
                  <td className="p-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {enq.customer_phone}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      enq.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                      enq.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {enq.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentEnquiries.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No recent enquiries.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats Cards
const StatCard = ({ title, value, icon, subtext, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
  </div>
);