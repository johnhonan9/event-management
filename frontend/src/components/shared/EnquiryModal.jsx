import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCartStore } from '../../store';
import { submitEnquiry } from '../../services/publicService';

const enquirySchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Valid phone required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  eventDate: z.string().min(1, "Event date required"),
  message: z.string().min(10, "Message too short"),
});

export default function EnquiryModal({ isOpen, onClose, initialData = {} }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: { eventDate: initialData.eventDate || '', message: initialData.message || '' }
  });
  const addEnquiry = useCartStore(s => s.addEnquiry);

  const onSubmit = async (data) => {
    try {
    // Send to backend with package context
    await submitEnquiry({
      ...data,
      packageId: initialData.packageId,
      categoryId: initialData.categoryId,
      source: 'package_modal'
    });

    // Success UI
    alert('Enquiry sent successfully! We will contact you shortly.');
    onClose();
    reset();
  } catch (err) {
    console.error(err);
    alert('Failed to send enquiry. Please try again.');
  }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Send Enquiry</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input {...register("customerName")} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input {...register("customerPhone")} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9876543210" />
              {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Date *</label>
              <input type="date" {...register("eventDate")} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea {...register("message")} rows={4} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Tell us about your event..." />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {isSubmitting ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}