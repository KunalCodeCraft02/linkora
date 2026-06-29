import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const EmailCaptureForm = ({ link, username, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/public/capture-email', {
        linkId: link._id,
        visitorName: name,
        visitorEmail: email,
        visitorWhatsApp: whatsapp,
        creatorUsername: username
      });
      setSubmitted(true);
      toast.success('Thanks for subscribing!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
        className="rounded-lg p-4 mt-2 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-medium" style={{ color: '#d0d0d0' }}>✓ Thanks for subscribing!</p>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Check your email for confirmation.</p>
        <button onClick={onClose} className="text-sm mt-2 transition-colors" style={{ color: '#888' }}>Close</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      className="rounded-lg p-4 mt-2" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
          className="w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required
          className="w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
        <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp (optional)"
          className="w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-md text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#888' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: '#f5f5f5', color: '#000' }}>
            {loading ? 'Submitting...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EmailCaptureForm;