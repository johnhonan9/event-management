import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';
import { DEMO_CATEGORIES } from '../data';
import CategoryGrid from '../components/home/CategoryGrid';
import SEOHead from '../components/shared/SEOHead';
import Loader from '../components/shared/Loader';
import Breadcrumb from '../components/shared/Breadcrumb'; // ✅ Added Import

export default function AllCategoriesPage() {
  // ✅ 1. Settings Fetch Logic (Fixes Navbar & Footer)
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
      }).catch(err => console.error("Categories page failed to load settings", err));
    }
  }, []);

  // ✅ 2. Fetch Live Data for Categories
  const { data: apiCategories, isLoading } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });
  
  // Fallback to demo data if API is empty or still loading
  const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : DEMO_CATEGORIES;

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* ✅ Added Breadcrumb here */}
      <Breadcrumb items={[{ label: "Packages" }]} />
      
      <SEOHead title="All Categories" description="Browse all our event decoration categories." />
      {/* <h1 className="text-3xl font-bold text-center mb-12">All Event Categories</h1> */}
      <CategoryGrid categories={categories} />
    </div>
  );
}