import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../store';
import { generateWhatsAppLink } from '../../data';
import { fetchSettings } from '../../services/publicService';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils'; // ✅ Import

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" }, 
    { to: "/category", label: "Packages" }, 
    { to: "/gallery", label: "Gallery" }, 
    { to: "/about", label: "About" }, 
    { to: "/contact", label: "Contact" }
  ];
  
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
      }).catch(err => console.error("Navbar failed to load settings", err));
    }
  }, [hasFetched, settings]);

  const primaryColor = settings.primaryColor || '#1E3A5F';
  const whatsappNumber = settings.whatsappNumber || settings.whatsapp_number || "919876543210";

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-2">
            {settings.logoUrl ? (
              // ✅ Use Optimized URL
              <img 
                src={optimizeCloudinaryUrl(settings.logoUrl)} 
                alt="Company Logo" 
                className="h-10 w-auto object-contain" 
              />
            ) : (
              <>
                <Sparkles className="w-8 h-8" style={{ color: primaryColor }} />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {settings.companyName || 'Dream Events'}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <Link 
                key={l.to} 
                to={l.to} 
                className={`font-medium transition ${location.pathname === l.to ? 'border-b-2' : 'text-gray-700 hover:text-gray-900'}`}
                style={{ borderColor: location.pathname === l.to ? primaryColor : 'transparent', color: location.pathname === l.to ? primaryColor : undefined }}
              >
                {l.label}
              </Link>
            ))}
            
            <a 
              href={generateWhatsAppLink(whatsappNumber, "Hi! I need help with event planning.")} 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-2 rounded-full flex items-center gap-2 text-white transition hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageCircle className="w-4 h-4" /> Chat Now
            </a>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {links.map(l => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  onClick={() => setIsOpen(false)} 
                  className="text-lg font-medium py-2 border-b border-gray-100"
                  style={{ color: location.pathname === l.to ? primaryColor : '#374151' }}
                >
                  {l.label}
                </Link>
              ))}
              <a 
                href={generateWhatsAppLink(whatsappNumber, "Hi!")} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-3 rounded-lg flex items-center justify-center gap-2 mt-2 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}