import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from './store';
import { fetchSettings } from './services/publicService';

// Admin Imports
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/pages/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import AdminCategories from './admin/pages/Categories';
import AdminPackages from './admin/pages/Packages';
import Enquiries from './admin/pages/Enquiries';
import EnquiryDetail from './admin/pages/EnquiryDetail';
import AdminGallery from './admin/pages/Gallery';
import AdminBanners from './admin/pages/Banners';
import AdminTestimonials from './admin/pages/Testimonials';
// import AdminSettings from './admin/pages/Settings'; // Deprecated
import AdminUsers from './admin/pages/AdminUsers';
import CompanyDetails from './admin/pages/CompanyDetails';
import AdminFaqs from './admin/pages/Faqs';

// Public Page Imports
import Home from './pages/Home';
import CategoryDetail from './pages/CategoryDetail';
import PackageDetail from './pages/PackageDetail';
import GalleryPage from './pages/GalleryPage';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AllCategoriesPage from './pages/AllCategoriesPage';

// Layout Imports
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppFAB from './components/layout/WhatsAppFAB';
import Loader from './components/shared/Loader';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
};

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <WhatsAppFAB />
  </div>
);

// ✅ Helper Function for Mapping DB snake_case to Frontend camelCase
const mapSettings = (apiData) => {
  if (!apiData) return {};
  return {
    companyName: apiData.company_name || "Dream Events Co.",
    tagline: apiData.tagline || "Making Every Moment Magic",
    logoUrl: apiData.logo_url || "",
    whatsappNumber: apiData.whatsapp_number || "919876543210",
    phone: apiData.phone_number || "+91 987 654 3210",
    email: apiData.email || "hello@dreamevents.co",
    address: apiData.address || "123 Party Lane, Celebration City, India",
    instagramUrl: apiData.instagram_url || "#",
    facebookUrl: apiData.facebook_url || "#",
    youtubeUrl: apiData.youtube_url || "#",
    mapEmbedUrl: apiData.google_maps_link || "",
    primaryColor: apiData.primary_color || "#1E3A5F",
    secondaryColor: apiData.secondary_color || "#E91E8C",
  };
};

export default function App() {
  const { updateSettings } = useSettingsStore();
  
  const { isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      if (data) {
        console.log("✅ App.jsx: Settings Loaded & Mapped");
        updateSettings(mapSettings(data));
      }
    },
    onError: (err) => {
      console.error("❌ App.jsx: Failed to load settings", err);
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<AllCategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/package/:slug" element={<PackageDetail />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="enquiries/:id" element={<EnquiryDetail />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="company-details" element={<CompanyDetails />} />
            <Route path="*" element={<h1 className="text-center mt-10">Coming Soon</h1>} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}