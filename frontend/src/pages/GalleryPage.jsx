import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGallery, fetchCategories, fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';
import Breadcrumb from '../components/shared/Breadcrumb';
import SEOHead from '../components/shared/SEOHead';
import Loader from '../components/shared/Loader';
import { optimizeCloudinaryUrl } from '../utils/imageUtils'; // ✅ Using imageUtils

export default function GalleryPage() {
  const [filterCat, setFilterCat] = useState("all");
  
  // ✅ Settings Fetch Logic (Fixes Navbar & Footer)
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
      }).catch(err => console.error("Gallery page failed to load settings", err));
    }
  }, []);

  const { data: galleryData, isLoading: galleryLoading } = useQuery({ queryKey: ['gallery'], queryFn: fetchGallery });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  // Filter gallery data. Note: API uses 'category_id', Demo used 'categoryId'.
  const filtered = filterCat === "all" 
    ? galleryData 
    : galleryData?.filter(g => String(g.category_id) === String(filterCat));

  if (galleryLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Gallery" }]} />
      <SEOHead title="Gallery" description="Browse our past event decorations and setups." />
      <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <button onClick={() => setFilterCat("all")} className={`px-4 py-2 rounded-full whitespace-nowrap ${filterCat === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All Events</button>
        {categories?.map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} className={`px-4 py-2 rounded-full whitespace-nowrap ${filterCat === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{c.name}</button>
        ))}
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered?.map(img => (
          <div key={img.id} className="break-inside-avoid rounded-xl overflow-hidden group relative">
            {/* ✅ Using optimizeCloudinaryUrl for image optimization */}
            <img src={optimizeCloudinaryUrl(img.image_url)} alt={img.caption} className="w-full transition duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition">
              <p className="text-white text-sm font-medium">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}