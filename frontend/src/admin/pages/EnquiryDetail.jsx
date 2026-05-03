import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Clock, User, MessageSquare, Mail, X } from 'lucide-react';
import API from '../../api/axios';
import Loader from '../../components/shared/Loader';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const statusOptions = ['new', 'contacted', 'quoted', 'confirmed', 'cancelled', 'closed'];

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await API.get(`/admin/enquiries/${id}`);
        setEnquiry(data);
        
        // Pre-fill email fields when data loads
        if (data) {
          setEmailSubject(`Regarding your enquiry on ${new Date().toLocaleDateString()}`);
          setEmailBody(`Dear ${data.customer_name},\n\nThank you for reaching out to us.\n\nBest regards,\nEvents Team`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.put(`/admin/enquiries/${id}/status`, { status: newStatus });
      const { data } = await API.get(`/admin/enquiries/${id}`);
      setEnquiry(data);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await API.post(`/admin/enquiries/${id}/notes`, { note: noteText });
      setNoteText('');
      const { data } = await API.get(`/admin/enquiries/${id}`);
      setEnquiry(data);
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;
    setSendingEmail(true);
    try {
      await API.post(`/admin/enquiries/${id}/email`, {
        enquiryId: id,
        to: enquiry.customer_email,
        subject: emailSubject,
        body: emailBody
      });
      alert('Email sent successfully!');
      setEmailModalOpen(false);
      
      // Refresh to see the activity log entry
      const { data } = await API.get(`/admin/enquiries/${id}`);
      setEnquiry(data);
    } catch (err) {
      alert('Failed to send email: ' + (err.response?.data?.error || err.message));
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) return <Loader />;
  if (!enquiry) return <div className="p-8 text-center">Enquiry not found</div>;

  const getStatusColor = (status) => {
    const map = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      quoted: 'bg-purple-100 text-purple-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return map[status] || 'bg-gray-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
      <button onClick={() => navigate('/admin/enquiries')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Enquiries
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{enquiry.customer_name}</h1>
                <p className="text-gray-500 text-sm">Received on {new Date(enquiry.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(enquiry.status)}`}>
                {enquiry.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 block">Phone</span>
                <span className="font-medium">{enquiry.customer_phone}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 block">Email</span>
                <span className="font-medium">{enquiry.customer_email || 'N/A'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 block">Event Date</span>
                <span className="font-medium">{enquiry.event_date ? new Date(enquiry.event_date).toLocaleDateString() : 'Not specified'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 block">Guests</span>
                <span className="font-medium">{enquiry.guest_count || 'Not specified'}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-xs text-gray-500 block mb-1">Message</span>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-line">{enquiry.message}</p>
            </div>
          </div>

          {/* Activity Log / Notes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Internal Notes
            </h2>
            
            <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={noteText} 
                onChange={(e) => setNoteText(e.target.value)} 
                placeholder="Add a private note..." 
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" disabled={savingNote} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {savingNote ? 'Saving...' : 'Add'}
              </button>
            </form>

            <div className="space-y-4">
              {enquiry.activityLog && enquiry.activityLog.length > 0 ? (
                enquiry.activityLog.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {log.action === 'Note Added' ? <MessageSquare className="w-4 h-4 text-blue-600" /> : 
                         log.action === 'Email Sent' ? <Mail className="w-4 h-4 text-green-600" /> :
                         <Clock className="w-4 h-4 text-gray-600" />}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{log.action}</span>
                        <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.note}</p>
                      <span className="text-xs text-gray-400">by {log.admin?.name || 'Admin'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No notes yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold mb-4">Update Status</h3>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                    enquiry.status === status 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <a 
              href={`https://wa.me/${enquiry.customer_phone.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mb-2 justify-center"
            >
              <User className="w-4 h-4" /> WhatsApp Customer
            </a>
            
            {/* ✅ Updated Email Button to Open Modal */}
            <button 
              onClick={() => setEmailModalOpen(true)}
              disabled={!enquiry.customer_email}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition justify-center mb-2
                ${enquiry.customer_email 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              title={!enquiry.customer_email ? "No email provided" : ""}
            >
              <Mail className="w-4 h-4" /> Email Customer
            </button>
          </div>
        </div>

      </div>

      {/* ✅ Email Composition Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" /> Send Email
              </h2>
              <button onClick={() => setEmailModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input 
                  type="email" 
                  value={enquiry.customer_email} 
                  readOnly 
                  className="w-full p-2 border rounded bg-gray-50 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  rows={6}
                  value={emailBody} 
                  onChange={(e) => setEmailBody(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEmailModalOpen(false)} 
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={sendingEmail} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingEmail ? 'Sending...' : <><Send className="w-4 h-4" /> Send Email</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}