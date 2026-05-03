import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs && faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <button 
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold hover:bg-gray-50 transition text-gray-800"
              >
                {faq.question}
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openIndex === idx && (
                <div className="p-4 pt-0 text-gray-600 border-t animate-fadeIn bg-gray-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
          {(!faqs || faqs.length === 0) && <p className="text-center text-gray-500">No FAQs available yet.</p>}
        </div>
      </div>
    </section>
  );
}