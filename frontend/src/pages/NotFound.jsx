import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';
import SEOHead from '../components/shared/SEOHead';

export default function NotFound() {
  const [hasFetched, setHasFetched] = useState(false);
  const settings = useSettingsStore(s => s.settings);
  const primaryColor = settings.primaryColor || '#1E3A5F';

  // ✅ Fetch Settings on Mount (Prevents Navbar/Footer breakage on direct 404 access)
  useEffect(() => {
    if (!hasFetched) {
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
      }).catch(err => console.error("NotFound page failed to load settings", err));
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <SEOHead title="Page Not Found" description="The page you are looking for does not exist." />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-medium"
        style={{ backgroundColor: primaryColor }}
      >
        Go Home
      </Link>
    </div>
  );
}