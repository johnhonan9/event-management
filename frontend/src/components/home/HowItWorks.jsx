import React from 'react';
import { Search, Calendar, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [{ title: "Choose a Package", desc: "Browse our curated event categories and select your ideal setup.", icon: Search }, { title: "Book Your Date", desc: "Secure your slot with a simple online enquiry and 30% advance.", icon: Calendar }, { title: "Celebrate!", desc: "We handle the entire setup. You just enjoy your special day.", icon: Sparkles }];
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><s.icon className="w-8 h-8" /></div>
              <span className="text-sm font-bold text-pink-600 mb-1">STEP {i + 1}</span>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}