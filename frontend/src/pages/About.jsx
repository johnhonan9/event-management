import React, { useState, useEffect } from 'react';
import SEOHead from '../components/shared/SEOHead';
import Breadcrumb from '../components/shared/Breadcrumb';
import { Check } from 'lucide-react';
import { fetchSettings } from '../services/publicService';
import { useSettingsStore } from '../store';

export default function About() {
  const [hasFetched, setHasFetched] = useState(false);
  const settings = useSettingsStore(s => s.settings);

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
      }).catch(err => console.error("About page failed to load settings", err));
    }
  }, []);

  const primaryColor = settings.primaryColor || '#1E3A5F';
  const secondaryColor = settings.secondaryColor || '#E91E8C';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SEOHead title={`About Us | ${settings.companyName || 'Dream Events'}`} description="Learn about our journey in creating magical events." />
      <Breadcrumb items={[{ label: "About" }]} />
      
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <img src="https://placehold.co/600x400/1E3A5F/ffffff?text=Our+Story" alt="About" className="rounded-2xl shadow-lg w-full" />
        <div>
          <h1 className="text-4xl font-bold mb-4">Crafting Memories Since 2015</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {settings.companyName || 'Dream Events'} started with a simple idea: every celebration, big or small, deserves world-class styling. From intimate home gatherings to grand ballroom setups, our dedicated team handles every detail with passion.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We believe that an event is more than just a date on a calendar; it's a milestone in your life story. That's why we invest heavily in premium materials, innovative designs, and flawless execution.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}15` }}>
              <h4 className="font-bold text-2xl" style={{ color: primaryColor }}>500+</h4>
              <p className="text-sm">Events Styled</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${secondaryColor}15` }}>
              <h4 className="font-bold text-2xl" style={{ color: secondaryColor }}>98%</h4>
              <p className="text-sm">Happy Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: "Expert Designers", d: "Professional stylists with 10+ years experience." },
          { t: "Premium Materials", d: "Only high-grade, durable, and safe decor items." },
          { t: "Transparent Pricing", d: "No hidden costs. What you see is what you pay." },
          { t: "Dedicated Manager", d: "A single point of contact for your entire event." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border hover:border-pink-300 transition">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-bold mb-1">{item.t}</h4>
            <p className="text-sm text-gray-600">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}