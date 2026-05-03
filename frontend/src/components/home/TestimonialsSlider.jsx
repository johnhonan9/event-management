import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { DEMO_TESTIMONIALS } from '../../data';

export default function TestimonialsSlider({ testimonials }) {
  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials : DEMO_TESTIMONIALS;

  return (
    <section className="py-16 px-4 bg-pink-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <Swiper modules={[Pagination, Autoplay]} spaceBetween={30} slidesPerView={1} md={{ slidesPerView: 2, spaceBetween: 20 }} lg={{ slidesPerView: 3, spaceBetween: 30 }} pagination={{ clickable: true }} className="!pb-12">
          {displayTestimonials.map(t => (
            <SwiperSlide key={t.id}>
              <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
                <div className="flex gap-1 mb-3 text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < (t.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />)}</div>
                <p className="text-gray-700 italic mb-4 flex-1">"{t.review_text || t.reviewText}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={t.photo_url || t.photoUrl || "https://placehold.co/100x100/E91E8C/fff?text=Client"} alt={t.customer_name || t.customerName} className="w-10 h-10 rounded-full" loading="lazy" />
                  <div>
                    <p className="font-bold text-sm">{t.customer_name || t.customerName}</p>
                    <p className="text-xs text-gray-500">{t.event_type || t.eventType}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}