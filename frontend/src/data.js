import { Gift, Heart, Sparkles, Users, MapPin, Baby, Car, Music } from 'lucide-react';

export const DEMO_SETTINGS = {
  companyName: "Dream Events Co.",
  tagline: "Making Every Moment Magic",
  logoUrl: "https://placehold.co/150x40/1e3a5f/ffffff?text=DE",
  whatsappNumber: "919876543210",
  phone: "+91 987 654 3210",
  email: "hello@dreamevents.co",
  address: "123 Party Lane, Celebration City, India",
  primaryColor: "#1E3A5F",
  secondaryColor: "#E91E8C",
  instagramUrl: "#",
  facebookUrl: "#",
  youtubeUrl: "#",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.0!2d77.0!3d28.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000"
};

export const DEMO_CATEGORIES = [
  { id: "1", name: "Birthday Bash", slug: "birthday-bash", description: "Unforgettable birthday celebrations.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Birthday", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Birthday+Bash", icon: "Gift", displayOrder: 1 },
  { id: "2", name: "Anniversary", slug: "anniversary", description: "Celebrate love and milestones.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Anniversary", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Anniversary", icon: "Heart", displayOrder: 2 },
  { id: "3", name: "Haldi Mehendi", slug: "haldi-mehendi", description: "Vibrant traditional pre-wedding.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Haldi", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Haldi+Mehendi", icon: "Sparkles", displayOrder: 3 },
  { id: "4", name: "Kids Theme Party", slug: "kids-theme-party", description: "Magical themed worlds.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Kids+Party", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Kids+Theme", icon: "Users", displayOrder: 4 },
  { id: "5", name: "Pre Bridal", slug: "pre-bridal", description: "Dreamy pre-wedding photoshoots.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Pre+Bridal", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Pre+Bridal", icon: "Heart", displayOrder: 5 },
  { id: "6", name: "Welcome Baby", slug: "welcome-baby", description: "Sweet setups for baby showers.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Welcome+Baby", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Welcome+Baby", icon: "Baby", displayOrder: 6 },
  { id: "7", name: "Car Booth", slug: "car-booth", description: "Automotive-themed spaces.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Car+Booth", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Car+Booth", icon: "Car", displayOrder: 7 },
  { id: "8", name: "Cabana Setup", slug: "cabana-setup", description: "Luxurious outdoor designs.", thumbnail_url: "https://placehold.co/400x300/E91E8C/ffffff?text=Cabana", bannerUrl: "https://placehold.co/1200x400/E91E8C/ffffff?text=Cabana+Setup", icon: "MapPin", displayOrder: 8 },
];

export const ICON_MAP = { Gift, Heart, Sparkles, Users, MapPin, Baby, Car, Music };

// Re-added Generator for Fallback
export const DEMO_PACKAGES = (() => {
  let packages = [];
  let idCounter = 1;
  DEMO_CATEGORIES.forEach((cat) => {
    const tiers = ["Silver", "Gold", "Platinum"];
    const basePrices = [5000, 12000, 25000];
    tiers.forEach((tier, tIdx) => {
      packages.push({
        id: `pkg-${idCounter++}`,
        category_id: cat.id,
        name: `${tier} ${cat.name}`,
        slug: `${tier.toLowerCase()}-${cat.slug}`,
        short_description: `${tier}-tier package featuring premium ${cat.name.toLowerCase()} essentials.`,
        full_description: `Experience our premium ${tier} package designed specifically for ${cat.name.toLowerCase()}.`,
        price: basePrices[tIdx],
        discounted_price: basePrices[tIdx] * 0.85,
        duration_hours: 4 + tIdx * 2,
        min_guests: 20 + tIdx * 10,
        max_guests: 50 + tIdx * 30,
        is_featured: tIdx === 1,
        is_active: true,
        badge_text: tIdx === 1 ? "Best Seller" : null,
        whatsapp_message: `Hi! I'm interested in the ${tier} ${cat.name}.`,
        images: [
          { image_url: `https://placehold.co/800x600/E91E8C/ffffff?text=${cat.name}+Main` }
        ]
      });
    });
  });
  return packages;
})();

export const DEMO_BANNERS = [
  { id: "b1", title: "Transform Your Moments", subtitle: "Expert event styling.", image_url: "https://placehold.co/1200x600/1E3A5F/ffffff?text=Hero+1", mobile_image_url: "https://placehold.co/800x600/1E3A5F/ffffff?text=Mobile+Hero+1", cta_text: "Explore Packages", cta_link: "/category" },
  { id: "b2", title: "Premium Decor Packages", subtitle: "From intimate gatherings to grand celebrations.", image_url: "https://placehold.co/1200x600/E91E8C/ffffff?text=Hero+2", mobile_image_url: "https://placehold.co/800x600/E91E8C/ffffff?text=Mobile+Hero+2", cta_text: "View Gallery", cta_link: "/gallery" },
  { id: "b3", title: "Book Your Date Today", subtitle: "Limited availability this season.", image_url: "https://placehold.co/1200x600/059669/ffffff?text=Hero+3", mobile_image_url: "https://placehold.co/800x600/059669/ffffff?text=Mobile+Hero+3", cta_text: "Contact Us", cta_link: "/contact" },
];

export const DEMO_GALLERY = Array.from({ length: 15 }, (_, i) => ({
  id: `gal-${i+1}`,
  image_url: `https://placehold.co/600x${[400,500,450,600,400,500,400,450,500,400,450,500,400,600,450][i]}/333/fff?text=Gallery+${i+1}`,
  caption: `Event highlight moment #${i+1}`,
  category_id: DEMO_CATEGORIES[i % DEMO_CATEGORIES.length]?.id,
}));

export const DEMO_TESTIMONIALS = [
  { id: "t1", customer_name: "Priya Sharma", review_text: "Absolutely stunning setup!", rating: 5, event_type: "Birthday", photo_url: "https://placehold.co/100x100/E91E8C/fff?text=PS" },
  { id: "t2", customer_name: "Rahul Mehta", review_text: "Exceeded all expectations.", rating: 5, event_type: "Anniversary", photo_url: "https://placehold.co/100x100/1E3A5F/fff?text=RM" },
  { id: "t3", customer_name: "Anita Verma", review_text: "Beautiful haldi decor.", rating: 4, event_type: "Haldi Mehendi", photo_url: "https://placehold.co/100x100/059669/fff?text=AV" },
  { id: "t4", customer_name: "Vikram Singh", review_text: "Seamless execution.", rating: 5, event_type: "Pre Bridal", photo_url: "https://placehold.co/100x100/F59E0B/fff?text=VS" },
  { id: "t5", customer_name: "Sonia Kapoor", review_text: "My son loved the theme party!", rating: 5, event_type: "Kids Theme Party", photo_url: "https://placehold.co/100x100/DC2626/fff?text=SK" },
  { id: "t6", customer_name: "Arjun Patel", review_text: "Great value for money.", rating: 4, event_type: "Cabana Setup", photo_url: "https://placehold.co/100x100/8B5CF6/fff?text=AP" },
];

export const DEMO_FAQS = [
  { id: "f1", question: "How far in advance should I book?", answer: "We recommend booking 30-45 days in advance." },
  { id: "f2", question: "Do you provide catering services?", answer: "We focus on decor, but can recommend partners." },
  { id: "f3", question: "What is your cancellation policy?", answer: "Cancellations 14+ days prior receive 75% refund." },
  { id: "f4", question: "Can I customize a package?", answer: "Absolutely! All packages are fully customizable." },
  { id: "f5", question: "Do you handle event setup and teardown?", answer: "Yes, we handle everything." },
  { id: "f6", question: "What areas do you serve?", answer: "We serve all major metro areas." },
  { id: "f7", question: "Are there any hidden charges?", answer: "No. All prices are final." },
  { id: "f8", question: "Do you offer payment installments?", answer: "Yes, split payments are available." },
];

export const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};