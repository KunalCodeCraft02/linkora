import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const linkTypes = [
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'github', label: 'GitHub', icon: '🐙' },
  { value: 'product', label: 'Product', icon: '📦' },
  { value: 'affiliate', label: 'Affiliate', icon: '💰' },
  { value: 'free_download', label: 'Free Download', icon: '📥' },
  { value: 'event', label: 'Event/Webinar', icon: '📅' },
  { value: 'newsletter', label: 'Newsletter', icon: '📧' },
  { value: 'spotify', label: 'Spotify', icon: '🎵' },
  { value: 'pay_tip', label: 'Pay/Tip', icon: '☕' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'instagram_grid', label: 'Instagram Grid', icon: '🖼️' },
  { value: 'book_session', label: 'Book Session', icon: '📅' },
  { value: 'custom', label: 'Custom', icon: '🔗' }
];

const LinkForm = ({ link, onClose, onSave }) => {
  const [title, setTitle] = useState(link?.title || '');
  const [url, setUrl] = useState(link?.url || '');
  const [linkType, setLinkType] = useState(link?.linkType || 'custom');
  const [commissionRate, setCommissionRate] = useState(link?.commissionRate || 0);
  const [productName, setProductName] = useState(link?.productName || '');
  const [goLiveAt, setGoLiveAt] = useState(link?.goLiveAt ? new Date(link.goLiveAt).toISOString().slice(0, 10) : '');
  const [expiresAt, setExpiresAt] = useState(link?.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 10) : '');
  const [geoShowIn, setGeoShowIn] = useState(link?.geoShowIn?.join(', ') || '');
  const [geoHideIn, setGeoHideIn] = useState(link?.geoHideIn?.join(', ') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url && url.startsWith('http')) {
      const timer = setTimeout(() => suggestTitles(), 1000);
      return () => clearTimeout(timer);
    }
  }, [url]);

  const suggestTitles = async () => {
    try {
      const { data } = await api.post('/ai/title', { url });
      setSuggestions(data);
    } catch (error) {
      // AI title suggestion is optional
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        url,
        linkType,
        commissionRate: linkType === 'affiliate' ? Number(commissionRate) : 0,
        productName,
        goLiveAt: goLiveAt || null,
        expiresAt: expiresAt || null,
        geoShowIn: geoShowIn ? geoShowIn.split(',').map(c => c.trim().toUpperCase()) : [],
        geoHideIn: geoHideIn ? geoHideIn.split(',').map(c => c.trim().toUpperCase()) : []
      };

      let data;
      if (link) {
        ({ data } = await api.put(`/links/${link._id}`, payload));
      } else {
        ({ data } = await api.post('/links', payload));
      }

      onSave(data);
      toast.success(link ? 'Link updated' : 'Link created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}
        style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{link ? 'Edit Link' : 'Add Link'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: '#888' }}>
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Link Type</label>
            <div className="grid grid-cols-5 gap-2">
              {linkTypes.map(type => (
                <button key={type.value} type="button" onClick={() => setLinkType(type.value)}
                  className="p-2 rounded-xl text-center text-[11px] transition-all"
                  style={{
                    background: linkType === type.value ? '#f5f5f5' : '#080808',
                    color: linkType === type.value ? '#000' : '#888',
                    border: '1px solid ' + (linkType === type.value ? 'transparent' : 'rgba(255,255,255,0.07)')
                  }}>
                  <span className="text-lg block">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
            {suggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-[11px]" style={{ color: '#555' }}>AI Suggestions:</p>
                {suggestions.map((s, i) => (
                  <button key={i} type="button" onClick={() => setTitle(s.title)}
                    className="w-full text-left text-sm p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#d0d0d0' }}>
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>

          {linkType === 'affiliate' && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Product Name</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Commission Rate (%)</label>
                <input type="number" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} min="0" max="100"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Go Live At</label>
              <input type="date" value={goLiveAt} onChange={e => setGoLiveAt(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Expires At</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Show in Countries</label>
              <input type="text" value={geoShowIn} onChange={e => setGeoShowIn(e.target.value)} placeholder="IN, US, UK"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Hide in Countries</label>
              <input type="text" value={geoHideIn} onChange={e => setGeoHideIn(e.target.value)} placeholder="CN, PK"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#d0d0d0' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
              {loading ? 'Saving...' : link ? 'Update' : 'Add Link'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LinkForm;