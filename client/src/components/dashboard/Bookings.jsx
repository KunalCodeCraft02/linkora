import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionName, setSessionName] = useState('Session');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(500);
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [availableDays, setAvailableDays] = useState([1, 2, 3, 4, 5]);
  const [timeSlots, setTimeSlots] = useState('10:00, 11:00, 14:00, 15:00');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/booking/list');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    try {
      await api.post('/booking/availability', {
        sessionName,
        duration: Number(duration),
        price: Number(price),
        bufferMinutes: Number(bufferMinutes),
        availableDays,
        timeSlots: timeSlots.split(',').map(s => s.trim())
      });
      toast.success('Availability saved');
    } catch (error) {
      toast.error('Failed to save availability');
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/booking/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.bookedDate) >= new Date());
  const past = bookings.filter(b => b.status === 'confirmed' && new Date(b.bookedDate) < new Date());

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
        <h3 className="font-semibold">Session Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Session Name</label>
            <input type="text" value={sessionName} onChange={e => setSessionName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Duration (min)</label>
            <select value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
              <option value="30">30 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Buffer (min)</label>
            <select value={bufferMinutes} onChange={e => setBufferMinutes(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Available Days</label>
          <div className="flex gap-2">
            {days.map((day, i) => (
              <button key={i} onClick={() => setAvailableDays(availableDays.includes(i) ? availableDays.filter(d => d !== i) : [...availableDays, i])}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${availableDays.includes(i) ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Time Slots (comma separated)</label>
          <input type="text" value={timeSlots} onChange={e => setTimeSlots(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
        </div>

        <button onClick={saveAvailability} className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-xl transition-colors">
          Save Availability
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Upcoming ({upcoming.length})</h3>
          <div className="space-y-3">
            {upcoming.map(booking => (
              <div key={booking._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.sessionName}</p>
                    <p className="text-sm text-gray-400">{booking.visitorName} • {booking.visitorEmail}</p>
                    <p className="text-sm text-gray-400">{new Date(booking.bookedDate).toLocaleDateString()} at {booking.bookedSlot}</p>
                  </div>
                  <button onClick={() => cancelBooking(booking._id)} className="text-sm text-red-400 hover:text-red-300">Cancel</button>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-gray-500 text-sm">No upcoming bookings</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Past ({past.length})</h3>
          <div className="space-y-3">
            {past.slice(0, 5).map(booking => (
              <div key={booking._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 opacity-70">
                <p className="font-medium">{booking.sessionName}</p>
                <p className="text-sm text-gray-400">{booking.visitorName} • ₹{booking.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;