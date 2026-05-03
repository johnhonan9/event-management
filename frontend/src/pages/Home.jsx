import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchBanners, 
  fetchCategories, 
  fetchPackages, 
  fetchTestimonials, 
  fetchGallery,
  fetchFaqs,
  fetchSettings // ✅ Import fetchSettings
} from '../services/publicService';
import { useSettingsStore } from '../store'; // ✅ Import Store
import { 
  DEMO_CATEGORIES, 
  DEMO_PACKAGES, 
  DEMO_BANNERS, 
  DEMO_TESTIMONIALS, 
  DEMO_GALLERY,
  DEMO_FAQS 
} from '../data';
import SEOHead from '../components/shared/SEOHead';
import Loader from '../components/shared/Loader';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedPackages from '../components/home/FeaturedPackages';
import HowItWorks from '../components/home/HowItWorks';
import GalleryPreview from '../components/home/GalleryPreview';
import TestimonialsSlider from '../components/home/TestimonialsSlider';
import FAQSection from '../components/home/FAQSection';
import EnquiryModal from '../components/shared/EnquiryModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

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
      }).catch(err => console.error("Home page failed to load settings", err));
    }
  }, []);

  // ✅ 2. Fetch Live Data for Sections (Restored Correct Syntax)
  const { data: apiBanners, isLoading: bannersLoading } = useQuery({ queryKey: ['banners'], queryFn: fetchBanners });
  const { data: apiCategories, isLoading: catsLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: apiPackages, isLoading: packagesLoading } = useQuery({ queryKey: ['packages'], queryFn: fetchPackages });
  const { data: apiTestimonials, isLoading: testiLoading } = useQuery({ queryKey: ['testimonials'], queryFn: fetchTestimonials });
  const { data: apiGallery } = useQuery({ queryKey: ['gallery'], queryFn: fetchGallery });
  
  const { data: apiFaqs } = useQuery({ 
    queryKey: ['faqs'], 
    queryFn: fetchFaqs 
  });

  // ✅ 3. Fallback Logic (Use API if exists, else Demo)
  const banners = (apiBanners && apiBanners.length > 0) ? apiBanners : DEMO_BANNERS;
  const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : DEMO_CATEGORIES;
  const packages = (apiPackages && apiPackages.length > 0) ? apiPackages : DEMO_PACKAGES;
  const testimonials = (apiTestimonials && apiTestimonials.length > 0) ? apiTestimonials : DEMO_TESTIMONIALS;
  const galleryImages = (apiGallery && apiGallery.length > 0) ? apiGallery : DEMO_GALLERY;
  
  const faqs = (apiFaqs && apiFaqs.length > 0) ? apiFaqs : (DEMO_FAQS || []);
  
  const featured = packages.filter(p => p.is_featured === true).length > 0 
    ? packages.filter(p => p.is_featured === true) 
    : packages.slice(0, 3);

  return (
    <>
      <SEOHead title="Home" description="Premium event styling and decor packages." />
      
      {bannersLoading ? <Loader /> : <HeroBanner banners={banners} />} 
      
      {catsLoading ? <Loader /> : <CategoryGrid categories={categories} />}
      
      {packagesLoading ? <Loader /> : <FeaturedPackages packages={featured} onEnquiry={() => setModalOpen(true)} />}
      
      <HowItWorks />
      
      <GalleryPreview images={galleryImages} />
      
      {testiLoading ? <Loader /> : <TestimonialsSlider testimonials={testimonials} />}
      
      <FAQSection faqs={faqs} />
      
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}