import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPackages, fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';
import Breadcrumb from '../components/shared/Breadcrumb';
import SEOHead from '../components/shared/SEOHead';
import Loader from '../components/shared/Loader';
import NotFound from './NotFound';
import EnquiryModal from '../components/shared/EnquiryModal';
import PackageCard from '../components/home/PackageCard';
import { formatPrice, generateWhatsAppLink } from '../data';
import { Clock, Users, MessageCircle } from 'lucide-react';

const PackageDetail = () => {
  const { slug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [mainImg, setMainImg] = useState(0);

  // ✅ Settings Fetch Logic (Fixes Navbar & Footer)
  const [hasFetchedSettings, setHasFetchedSettings] = useState(false);
  const settings = useSettingsStore(s => s.settings);

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
      }).catch(err => console.error("PackageDetail failed to load settings", err));
    }
  }, []);

  // Fetch live packages
  const { data: packages, isLoading, error } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
  });

  // Search logic: strict check first
  const pkg = packages?.find(p => p.slug?.trim().toLowerCase() === slug?.trim().toLowerCase());

  if (isLoading) return <Loader />;
  
  // If not found, show 404
  if (!pkg) {
    return <NotFound />;
  }

  // Fallbacks for missing backend relations
  const mainImage = pkg.images && pkg.images.length > 0 
    ? pkg.images[0].image_url 
    : "https://placehold.co/800x600/E91E8C/ffffff?text=No+Image";

  const related = packages.filter(p => String(p.category_id) === String(pkg.category_id) && p.id !== pkg.id).slice(0, 3);

  // Dynamic Colors
  const primaryColor = settings.primaryColor || '#1E3A5F';
  const secondaryColor = settings.secondaryColor || '#E91E8C';
  const whatsappNumber = settings.whatsappNumber || settings.whatsapp_number || "919876543210";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Packages", link: "/category" }, { label: pkg.name }]} />
      <SEOHead 
  title={pkg.name} 
  description={pkg.short_description || `Check out our ${pkg.name} package.`} 
  image={pkg.images && pkg.images.length > 0 ? pkg.images[0].image_url : "https://placehold.co/1200x630/1E3A5F/ffffff?text=Dream+Events"} 
  type="article"
/>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div>
          <img src={mainImage} alt={pkg.name} className="w-full rounded-xl mb-4 aspect-video object-cover bg-gray-100" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Thumbnail (Main Image) */}
            <button onClick={() => setMainImg(0)} className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${mainImg === 0 ? 'border-blue-600' : 'border-transparent'}`}>
              <img src={mainImage} className="w-full h-full object-cover" loading="lazy" alt="Thumb" />
            </button>
            {/* Additional Thumbnails if available */}
            {pkg.images && pkg.images.slice(1, 4).map((img, idx) => (
              <button key={idx} onClick={() => setMainImg(idx + 1)} className="shrink-0 w-20 h-20 rounded-lg border-2 border-transparent overflow-hidden hover:opacity-80 transition">
                <img src={img.image_url} className="w-full h-full object-cover" loading="lazy" alt="Thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold" style={{ color: primaryColor }}>
              {formatPrice(Number(pkg.discounted_price || pkg.price))}
            </span>
            {pkg.price && Number(pkg.discounted_price) < Number(pkg.price) && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(Number(pkg.price))}</span>
            )}
            {pkg.badge_text && (
              <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: secondaryColor }}>
                {pkg.badge_text}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600"><Clock className="w-5 h-5" /> {pkg.duration_hours || 4} Hours</div>
            <div className="flex items-center gap-2 text-gray-600"><Users className="w-5 h-5" /> {pkg.min_guests || 10}-{pkg.max_guests || 50} Guests</div>
          </div>

          <p className="text-lg text-gray-600 mb-4 italic">
            {pkg.short_description || "No description available."}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">{pkg.full_description || pkg.short_description || 'No description.'}</p>
          
          <div className="flex gap-3 mt-8 flex-wrap">
            <button 
              onClick={() => setModalOpen(true)} 
              className="flex-1 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              style={{ backgroundColor: primaryColor }}
            >
              Send Enquiry
            </button>
            <a 
              href={generateWhatsAppLink(whatsappNumber, pkg.whatsapp_message || `Hi! I'm interested in ${pkg.name}`)} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Related Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(p => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      )}
      
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialData={{ message: `Hi! I'm interested in ${pkg.name}.` }} />
    </div>
  );
};

export default PackageDetail;