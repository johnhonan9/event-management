import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettingsStore } from '../../store';
import { fetchSettings } from '../../services/publicService';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils'; // ✅ Import

// Social Icons
const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)
const Facebook = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
const Youtube = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
)

export default function Footer() {
  const settings = useSettingsStore(s => s.settings);
  
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && (!settings || !settings.companyName)) {
      setHasFetched(true);
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
      }).catch(err => console.error("Footer failed to load settings", err));
    }
  }, [hasFetched, settings]);

  const primaryColor = settings.primaryColor || '#1E3A5F';
  const secondaryColor = settings.secondaryColor || '#E91E8C';
  
  const address = settings.address || "Loading...";
  const phone = settings.phone || settings.phone_number || "Loading...";
  const email = settings.email || "Loading...";
  const companyName = settings.companyName || "Dream Events";

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          {settings.logoUrl ? (
            // ✅ Use Optimized URL
            <img 
              src={optimizeCloudinaryUrl(settings.logoUrl)} 
              alt="Company Logo" 
              className="h-12 w-auto object-contain mb-4 bg-white/10 p-2 rounded-lg" 
            />
          ) : (
            <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
          )}
          
          <p className="text-gray-400 mb-4">{settings.tagline || 'Making Every Moment Magic'}</p>
          <div className="flex gap-4">
            <a href={settings.instagramUrl || '#'} target="_blank" rel="noreferrer" 
               className="p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
               style={{ backgroundColor: primaryColor }}>
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href={settings.facebookUrl || '#'} target="_blank" rel="noreferrer" 
               className="p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
               style={{ backgroundColor: primaryColor }}>
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a href={settings.youtubeUrl || '#'} target="_blank" rel="noreferrer" 
               className="p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
               style={{ backgroundColor: primaryColor }}>
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/category" className="hover:text-white transition">Packages</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 shrink-0" style={{ color: primaryColor }} /> 
              {address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 shrink-0" style={{ color: primaryColor }} /> 
              {phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 shrink-0" style={{ color: primaryColor }} /> 
              {email}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}