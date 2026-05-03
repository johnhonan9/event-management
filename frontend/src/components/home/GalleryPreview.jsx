import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { DEMO_GALLERY } from '../../data';

export default function GalleryPreview({ images }) {
  const displayImages = (images && images.length > 0) ? images.slice(0, 4) : DEMO_GALLERY.slice(0, 4);

  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold">Event Gallery</h2>
          <Link to="/gallery" className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[500px]">
          {displayImages.map((img, i) => (
            <div key={img.id} className={`relative overflow-hidden rounded-lg ${i === 0 ? 'lg:row-span-2 lg:col-span-2' : ''}`}>
              <img src={img.image_url || img.imageUrl} alt={img.caption} className="w-full h-full object-cover transition hover:scale-105 duration-500" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}