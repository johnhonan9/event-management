import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  // Start with empty defaults, API will overwrite this
  settings: {
    companyName: "Dream Events",
    tagline: "",
    logoUrl: "",
    whatsappNumber: "",
    phone: "",
    email: "",
    address: "",
    instagramUrl: "#",
    facebookUrl: "#",
    youtubeUrl: "#",
    mapEmbedUrl: ""
  },
  updateSettings: (newData) => set((state) => ({ settings: { ...state.settings, ...newData } })),
}));

export const useCartStore = create((set) => ({
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  enquiryHistory: [],
  addEnquiry: (data) => set((state) => ({ enquiryHistory: [...state.enquiryHistory, { ...data, id: Date.now() }] })),
}));