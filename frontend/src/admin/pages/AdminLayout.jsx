import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Package, 
  LogOut, 
  Menu, 
  X, 
  Inbox, 
  Image, 
  Users, 
  Settings, 
  Monitor, 
  Star, 
  Building2, 
  HelpCircle 
} from 'lucide-react';
import { fetchSettings } from '../../services/publicService';
import { useSettingsStore } from '../../store';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Settings Fetch Logic for Admin Panel
  const [hasFetchedSettings, setHasFetchedSettings] = useState(false);

  useEffect(() => {
    if (!hasFetchedSettings) {
      setHasFetchedSettings(true);
      fetchSettings().then(data => {
        if (data) {
          useSettingsStore.getState().updateSettings({
            companyName: data.company_name,
            tagline: data.tagline,
            logoUrl: data.logo_url,
            whatsappNumber: data.whatsapp_number,
            phone: data.phone_number,
            email: data.email,
            address: data.address,
            instagramUrl: data.instagram_url,
            facebookUrl: data.facebook_url,
            youtubeUrl: data.youtube_url,
            mapEmbedUrl: data.google_maps_link,
            primaryColor: data.primary_color,
            secondaryColor: data.secondary_color,
          });
        }
      }).catch(err => console.error("Admin failed to load settings", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    { to: '/admin/packages', icon: Package, label: 'Packages' },
    { to: '/admin/enquiries', icon: Inbox, label: 'Enquiries' },
    { to: '/admin/gallery', icon: Image, label: 'Gallery' },
    { to: '/admin/banners', icon: Monitor, label: 'Banners' },
    { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { to: '/admin/company-details', icon: Building2, label: 'Company Details' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/users', icon: Users, label: 'Admin Users' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 w-64 bg-white shadow-lg h-full transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden"><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setIsOpen(false)} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === link.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <link.icon className="w-5 h-5" /> {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg mt-4">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex items-center md:hidden">
          <button onClick={() => setIsOpen(true)}><Menu /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}