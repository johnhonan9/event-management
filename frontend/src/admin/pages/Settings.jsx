import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import API from '../../api/axios';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: '', tagline: '', whatsapp_number: '', phone_number: '',
    email: '', address: '', google_maps_link: '', instagram_url: '',
    facebook_url: '', youtube_url: '', primary_color: '#1E3A5F', secondary_color: '#E91E8C'
  });

  useEffect(() => {
    API.get('/admin/settings').then(res => setForm({ ...form, ...res.data }))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/admin/settings', form);
      alert('Settings saved successfully!');
    } catch (err) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) return <div className="flex justify-center py-10"><Loader className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Branding & Contact */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Branding & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name" name="company_name" value={form.company_name} onChange={handleChange} />
            <Input label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
            <Input label="WhatsApp Number" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="e.g. 919876543210" />
            <Input label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Full Address" name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        {/* Section 2: Socials & Map */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Social & Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Instagram URL" name="instagram_url" value={form.instagram_url} onChange={handleChange} />
            <Input label="Facebook URL" name="facebook_url" value={form.facebook_url} onChange={handleChange} />
            <Input label="YouTube URL" name="youtube_url" value={form.youtube_url} onChange={handleChange} />
            <Input label="Google Maps Embed URL" name="google_maps_link" value={form.google_maps_link} onChange={handleChange} />
          </div>
        </div>

        {/* Section 3: Theme Colors */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} className="h-10 w-14 cursor-pointer rounded border" />
                <input name="primary_color" value={form.primary_color} onChange={handleChange} className="flex-1 p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.secondary_color} onChange={e => setForm({...form, secondary_color: e.target.value})} className="h-10 w-14 cursor-pointer rounded border" />
                <input name="secondary_color" value={form.secondary_color} onChange={handleChange} className="flex-1 p-2 border rounded" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
  </div>
);