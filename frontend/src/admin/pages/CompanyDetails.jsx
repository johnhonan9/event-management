import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import API from '../../api/axios';
import ImageUpload from '../../components/shared/ImageUpload'; // ✅ Import Upload Component

export default function CompanyDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: '', 
    tagline: '', 
    logo_url: '',         // ✅ Add logo_url to state
    whatsapp_number: '', 
    phone_number: '',
    email: '', 
    address: '', 
    google_maps_link: '', 
    instagram_url: '',
    facebook_url: '', 
    youtube_url: '', 
    primary_color: '#1E3A5F', 
    secondary_color: '#E91E8C'
  });

  useEffect(() => {
    API.get('/admin/company-details')
      .then(res => setForm({ ...form, ...res.data }))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/admin/company-details', form);
      alert('Company Details saved successfully!');
    } catch (err) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) return <div className="flex justify-center py-10"><Loader className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Company Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ✅ NEW: Logo Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Brand Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <ImageUpload 
              label="Company Logo"
              currentImage={form.logo_url}
              onUploadSuccess={(url) => setForm({ ...form, logo_url: url })}
            />
            <div className="space-y-4">
               <Input 
                 label="Company Name (Optional)" 
                 name="company_name" 
                 value={form.company_name} 
                 onChange={handleChange} 
                 placeholder="e.g. Dream Events"
               />
               <Input 
                 label="Tagline" 
                 name="tagline" 
                 value={form.tagline} 
                 onChange={handleChange} 
                 placeholder="e.g. Making Moments Magic"
               />
            </div>
          </div>
        </div>

        {/* Branding & Contact (Rest of the form remains same) */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="WhatsApp Number" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} />
            <Input label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Full Address" name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        {/* Socials & Map (Rest of the form remains same) */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Social & Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Instagram URL" name="instagram_url" value={form.instagram_url} onChange={handleChange} />
            <Input label="Facebook URL" name="facebook_url" value={form.facebook_url} onChange={handleChange} />
            <Input label="YouTube URL" name="youtube_url" value={form.youtube_url} onChange={handleChange} />
            <Input label="Google Maps Embed URL" name="google_maps_link" value={form.google_maps_link} onChange={handleChange} />
          </div>
        </div>

        {/* Theme Colors (Rest of the form remains same) */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorInput label="Primary Color" name="primary_color" value={form.primary_color} onChange={handleChange} />
            <ColorInput label="Secondary Color" name="secondary_color" value={form.secondary_color} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save All Details'}
        </button>
      </form>
    </div>
  );
}

// Helper Components
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
  </div>
);

const ColorInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex gap-2">
      <input type="color" {...props} className="h-10 w-14 cursor-pointer rounded border" />
      <input {...props} className="flex-1 p-2 border rounded" />
    </div>
  </div>
);