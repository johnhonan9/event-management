import React from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../store';
import { formatPrice } from '../../data';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils'; // ✅ Import

export default function PackageCard({ pkg, onEnquiry }) {
  const settings = useSettingsStore(s => s.settings);
  const primaryColor = settings.primaryColor || '#1E3A5F';

  // ✅ Robust Image Extraction + Optimization
  let imageUrl = "https://placehold.co/800x600/E91E8C/ffffff?text=No+Image";

  if (pkg.images) {
    // Case 1: Array of objects [{ image_url: "..." }]
    if (Array.isArray(pkg.images) && pkg.images.length > 0) {
      imageUrl = pkg.images[0].image_url || pkg.images[0];
    } 
    // Case 2: Single string URL (legacy)
    else if (typeof pkg.images === 'string') {
      imageUrl = pkg.images;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {/* ✅ Use Optimized URL */}
        <img 
          src={optimizeCloudinaryUrl(imageUrl)} 
          alt={pkg.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          loading="lazy" 
          onError={(e) => {
            e.target.src = "https://placehold.co/800x600/E91E8C/ffffff?text=Error";
          }}
        />
        {pkg.badge_text && (
          <span className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: primaryColor }}>
            {pkg.badge_text}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {pkg.category?.name || 'Event Package'}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
          {pkg.short_description || 'Premium event styling package.'}
        </p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(Number(pkg.discounted_price || pkg.price))}</span>
          {pkg.price && Number(pkg.discounted_price) < Number(pkg.price) && <span className="text-gray-400 line-through text-sm">{formatPrice(Number(pkg.price))}</span>}
        </div>
        <div className="flex gap-2 mt-auto">
          <Link to={`/package/${pkg.slug}`} className="flex-1 border border-gray-300 py-2 rounded-lg text-center font-medium hover:bg-gray-50 transition">View Details</Link>
          {onEnquiry && (
            <button 
              onClick={() => onEnquiry(pkg)} 
              className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
              style={{ backgroundColor: primaryColor }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}