import React from 'react';
import { Link } from 'react-router-dom';
import { ICON_MAP } from '../../data';
import { Gift } from 'lucide-react';

export default function CategoryGrid({ categories }) {
  // Default placeholder image if thumbnail_url is missing
  const DEFAULT_THUMB = "https://placehold.co/400x300/E91E8C/ffffff?text=Category";

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">All Event Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map(cat => {
            // ✅ FIX: Use fallback if thumbnail_url is empty or null
            const thumbUrl = cat.thumbnail_url || cat.thumbnailUrl || DEFAULT_THUMB;

            return (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer">
                <img 
                  src={thumbUrl} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {cat.icon && React.createElement(ICON_MAP[cat.icon] || Gift, { className: "w-5 h-5 text-pink-400" })}
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}