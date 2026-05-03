import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore, useSettingsStore } from '../store';
import SEOHead from '../components/shared/SEOHead';
import Breadcrumb from '../components/shared/Breadcrumb';
import { Phone, Mail, MessageCircle, Check, MapPin } from 'lucide-react';
import { submitEnquiry, fetchSettings } from '../services/publicService';

const enquirySchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Valid phone required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  eventDate: z.string().min(1, "Event date required"),
  message: z.string().min(10, "Message too short"),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  
  // ✅ Single Source of Truth: Global Store
  const settings = useSettingsStore(s => s.settings);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ 
    resolver: zodResolver(enquirySchema) 
  });
  
  const addEnquiry = useCartStore(s => s.addEnquiry);

  // ✅ Fetch Settings on Mount if not present in Store
  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      fetchSettings().then(data => {
        if (data) {
          // Update Global Store so Navbar, Footer, and this page all share the same data
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
      }).catch(err => console.error("Contact page failed to load settings", err));
    }
  }, []); 

  // ✅ Use Settings from Store with Fallbacks
  const primaryColor = settings.primaryColor || '#1E3A5F';
  const secondaryColor = settings.secondaryColor || '#E91E8C';
  
  const mapUrl = settings.mapEmbedUrl && settings.mapEmbedUrl.includes('google.com/maps/embed') 
    ? settings.mapEmbedUrl 
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112478.64535956036!2d77.11872249055996!3d28.62275040000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d047309fff32f%3A0xfc5e83963238e924!2sConnaught+Place%2C+New+Delhi%2C+Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const onSubmit = async (data) => {
    try {
      await submitEnquiry({ ...data, source: 'contact_form' });
      setSent(true);
      reset();
    } catch (err) {
      alert('Failed to send enquiry.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SEOHead title="Contact Us" description="Get in touch to plan your next event." />
      <Breadcrumb items={[{ label: "Contact" }]} />
      <h1 className="text-3xl font-bold mb-8">Get In Touch</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <div className="bg-gray-50 p-8 rounded-2xl h-full">
          <h2 className="text-xl font-bold mb-4">Send us a message</h2>
          {sent ? (
            <div className="text-center py-10">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Enquiry Sent!</h3>
              <button onClick={() => setSent(false)} className="text-blue-600 font-medium hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register("customerName")} placeholder="Full Name" className="w-full px-4 py-3 border rounded-lg" />
              {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message}</p>}
              
              <input {...register("customerPhone")} placeholder="Phone Number" className="w-full px-4 py-3 border rounded-lg" />
              {errors.customerPhone && <p className="text-red-500 text-xs">{errors.customerPhone.message}</p>}
              
              <input {...register("customerEmail")} placeholder="Email Address" className="w-full px-4 py-3 border rounded-lg" />
              <input type="date" {...register("eventDate")} className="w-full px-4 py-3 border rounded-lg" />
              {errors.eventDate && <p className="text-red-500 text-xs">{errors.eventDate.message}</p>}
              <textarea {...register("message")} rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 border rounded-lg resize-none" />
              {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
              
              <button disabled={isSubmitting} type="submit" className="w-full text-white py-3 rounded-lg font-bold hover:opacity-90 transition" style={{ backgroundColor: primaryColor }}>
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl flex items-start gap-4" style={{ backgroundColor: `${primaryColor}15` }}>
            <MapPin className="w-8 h-8 shrink-0 mt-1" style={{ color: primaryColor }} />
            <div><h4 className="font-bold">Our Office</h4><p className="text-gray-600">{settings.address || "Loading..."}</p></div>
          </div>

          <div className="p-6 rounded-xl flex items-center gap-4" style={{ backgroundColor: `${primaryColor}15` }}>
            <Phone className="w-8 h-8 shrink-0" style={{ color: primaryColor }} />
            <div><h4 className="font-bold">Phone</h4><p className="text-gray-600">{settings.phone || "+91 9876543210"}</p></div>
          </div>

          <div className="p-6 rounded-xl flex items-center gap-4" style={{ backgroundColor: `${secondaryColor}15` }}>
            <Mail className="w-8 h-8 shrink-0" style={{ color: secondaryColor }} />
            <div><h4 className="font-bold">Email</h4><p className="text-gray-600">{settings.email || "hello@dreamevents.co"}</p></div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-green-600 shrink-0" />
            <div><h4 className="font-bold">WhatsApp</h4><p className="text-gray-600">{settings.whatsappNumber || "+91 9876543210"}</p></div>
          </div>
          
          <div className="rounded-xl overflow-hidden h-64 shadow-sm bg-gray-200 relative">
            <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Google Map"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}