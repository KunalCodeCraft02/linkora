import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const BookingModal = ({ link, username, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) fetchSlots();
  }, [date]);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get(`/booking/availability/${username}`, { params: { date } });
      setSlots(data.slots || []);
    } catch (error) {
      toast.error('Failed to load available slots');
    }
  };

  const handleBooking = async () => {
    if (!name || !email) {
      toast.error('Please enter your name and email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/booking/create', {
        username,
        date,
        slot: selectedSlot,
        visitorName: name,
        visitorEmail: email,
        sessionName: link.title
      });

      toast.success('Booking created! Payment integration coming soon.');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl w-full max-w-md" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }} onClick={e => e.stopPropagation()}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}>Book: {link.title}</h2>
          <button onClick={onClose} className="text-sm transition-colors" style={{ color: '#888' }}>✕</button>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: '#888' }}>Select a date:</p>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
              {slots.length > 0 && (
                <div>
                  <p className="text-sm mb-2" style={{ color: '#888' }}>Available times:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(slot => (
                      <button key={slot} onClick={() => { setSelectedSlot(slot); setStep(2); }}
                        className="p-2 rounded-md text-sm transition-all"
                        style={{
                          background: selectedSlot === slot ? '#f5f5f5' : 'rgba(255,255,255,0.04)',
                          color: selectedSlot === slot ? '#000' : '#d0d0d0',
                          border: `1px solid ${selectedSlot === slot ? '#f5f5f5' : 'rgba(255,255,255,0.07)'}`
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {date && slots.length === 0 && (
                <p className="text-sm" style={{ color: '#555' }}>No available slots for this date</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: '#888' }}>Date: {new Date(date).toLocaleDateString()} at {selectedSlot}</p>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#d0d0d0' }}>
                  Back
                </button>
                <button onClick={handleBooking} disabled={loading}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: '#f5f5f5', color: '#000' }}>
                  {loading ? 'Booking...' : 'Book & Pay'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;