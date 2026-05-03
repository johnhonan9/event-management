import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettingsStore } from '../../store';
import { generateWhatsAppLink } from '../../data';

export default function WhatsAppFAB() {
  const settings = useSettingsStore(s => s.settings);
  return (
    <a href={generateWhatsAppLink(settings.whatsappNumber, "Hi! I'm interested in your event services.")} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:bg-green-600 transition-all duration-300 group">
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded shadow text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition">Chat with us</span>
    </a>
  );
}