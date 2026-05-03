import API from '../api/axios';

export const fetchCategories = async () => {
  const { data } = await API.get('/admin/categories'); // Hitting admin route for now (no auth middleware active)
  return data.filter(c => c.is_active);
};

export const fetchBanners = async () => {
  const { data } = await API.get('/admin/banners');
  return data.filter(b => b.is_active);
};

// export const fetchTestimonials = async () => {
//   const { data } = await API.get('/admin/testimonials');
//   return data.filter(t => t.is_approved);
// };

// export const fetchSettings = async () => {
//   const { data } = await API.get('/admin/settings');
//   return data;
// };

export const fetchFaqs = async () => {
  // Note: If you created a public route /api/faqs, use that. 
  // For now, we use the admin route as per previous steps, but ideally make it public.
  const { data } = await API.get('/admin/faqs'); 
  return data.filter(f => f.is_active); // Only show active FAQs
};

export const fetchSettings = async () => {
  // ✅ CHANGE THIS: Use the new public endpoint
  const { data } = await API.get('/company-details'); 
  return data;
};

export const fetchPackages = async () => {
  const { data } = await API.get('/admin/packages');
  return data.filter(p => p.is_active);
};

// export const fetchGallery = async () => {
//   const { data } = await API.get('/admin/gallery');
//   return data.filter(g => g.is_active);
// };

export const fetchTestimonials = async () => {
  const { data } = await API.get('/admin/testimonials');
  // Filter only approved testimonials
  return data.filter(t => t.is_approved === true);
};

export const fetchGallery = async () => {
  const { data } = await API.get('/admin/gallery');
  // Filter only active images
  return data.filter(g => g.is_active !== false);
};

export const submitEnquiry = async (enquiryData) => {
  const response = await API.post('/enquiries', enquiryData);
  return response.data;
};