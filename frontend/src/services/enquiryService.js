import API from '../api/axios';

export const submitEnquiry = async (data) => {
  return API.post('/enquiries', {
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    customer_email: data.customerEmail || null,
    event_date: data.eventDate || null,
    message: data.message,
    package_id: data.packageId || null,
    category_id: data.categoryId || null,
    source: data.packageId ? 'whatsapp' : 'contact_form'
  });
};