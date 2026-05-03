import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchPackages, fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';
import Breadcrumb from '../components/shared/Breadcrumb';
import SEOHead from '../components/shared/SEOHead';
import Loader from '../components/shared/Loader';
import NotFound from './NotFound';
import PackageCard from '../components/home/PackageCard';
import { formatPrice, DEMO_CATEGORIES, DEMO_PACKAGES } from '../data'; // Import fallbacks

export default function CategoryDetail() {
  const { slug } = useParams();
  
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
      }).catch(err => console.error("CategoryDetail page failed to load settings", err));
    }
  }, []);

  const { data: apiCategories, isLoading: catsLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: apiPackages, isLoading: pkgsLoading } = useQuery({ queryKey: ['packages'], queryFn: fetchPackages });

  // FALLBACK LOGIC
  const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : DEMO_CATEGORIES;
  const packages = (apiPackages && apiPackages.length > 0) ? apiPackages : DEMO_PACKAGES;

  const cat = categories?.find(c => c.slug === slug);
  const catPackages = packages?.filter(p => String(p.category_id) === String(cat?.id)) || [];
  
  const [filterPrice, setFilterPrice] = useState(0);
  const [filterGuests, setFilterGuests] = useState(0);

  if (catsLoading || pkgsLoading) return <Loader />;
  if (!cat) return <NotFound />;

  const filteredPackages = catPackages.filter(p => {
    const price = Number(p.price) || 0;
    const guests = Number(p.max_guests) || 0;
    return price >= filterPrice && guests >= (filterGuests || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Packages" }, { label: cat.name }]} />
      <SEOHead title={cat.name} description={cat.description} />
      <div className="bg-gray-100 rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">{cat.name} Packages</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{cat.description}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Max Budget: {formatPrice(filterPrice || 50000)}</label>
          <input type="range" min="0" max="50000" step="1000" value={filterPrice} onChange={e => setFilterPrice(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Guest Count: {filterGuests || 'Any'}</label>
          <input type="range" min="0" max="300" step="10" value={filterGuests} onChange={e => setFilterGuests(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      {filteredPackages.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No packages found for this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      )}
    </div>
  );
}