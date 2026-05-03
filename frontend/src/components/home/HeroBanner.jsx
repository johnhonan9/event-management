import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroBanner = ({ banners }) => {
  if (!banners || banners.length === 0) return <div className="h-[50vh] bg-gray-100" />;

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] bg-gray-100 overflow-hidden">
      <Swiper modules={[Navigation, Pagination, Autoplay]} autoplay={{ delay: 5000 }} navigation pagination={{ clickable: true }} className="w-full h-full">
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={window.innerWidth < 768 ? banner.mobile_image_url || banner.image_url : banner.image_url} alt={banner.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute left-0 md:left-16 lg:left-24 bottom-10 md:bottom-20 p-6 md:p-10 text-white max-w-2xl">
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{banner.title}</motion.h1>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl mb-8 text-gray-200">{banner.subtitle}</motion.p>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Link to={banner.cta_link || '/category'} className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition">
                    {banner.cta_text || 'Explore'} <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;