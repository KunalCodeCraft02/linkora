import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import PublicLinkButton from '../components/public/PublicLinkButton';
import EmailCaptureForm from '../components/public/EmailCaptureForm';
import BookingModal from '../components/public/BookingModal';
import ThemeStyles from '../components/public/ThemeStyles';

const PublicPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [captureLink, setCaptureLink] = useState(null);
  const [bookingLink, setBookingLink] = useState(null);
  const [country, setCountry] = useState('');

  useEffect(() => {
    fetchCountry();
    fetchPage();
  }, [username]);

  const fetchCountry = async () => {
    try {
      const res = await fetch('https://ip-api.com/json/?fields=countryCode');
      const data = await res.json();
      setCountry(data.countryCode || '');
    } catch (error) {
      // ignore
    }
  };

  const fetchPage = async () => {
    try {
      const { data } = await api.get(`/public/${username}`, { params: { country } });
      setData(data);
    } catch (error) {
      setError(error.response?.status === 404 ? 'Creator not found' : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && country) {
      fetchPage();
    }
  }, [country]);

  const recordClick = async (linkId, isQR = false, abVariant = '') => {
    try {
      await api.post(`/public/${username}/click`, {
        linkId,
        referrer: document.referrer,
        country,
        isQR,
        abVariant
      });
    } catch (error) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#f5f5f5' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808', color: '#f5f5f5' }}>
        <div className="text-center">
          <p className="text-5xl mb-4" style={{ color: '#333' }}>◈</p>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</h1>
          <p className="text-sm" style={{ color: '#888' }}>This creator page doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { user, links } = data;
  const theme = user?.theme || 'midnight';

  return (
    <>
      <ThemeStyles theme={theme} />
      <div className={`min-h-screen theme-${theme} flex items-center justify-center p-4`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] theme-container rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col items-center mb-8 pt-4">
            {user?.avatar ? (
              <motion.div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden animate-pulse-ring" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{ background: '#1e1e1e', color: '#d0d0d0', border: '2px solid rgba(255,255,255,0.1)' }}>
                {user?.name?.charAt(0)}
              </div>
            )}
            <h1 className="text-xl font-bold theme-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user?.name}</h1>
            {user?.bio && <p className="text-center mt-2 text-sm theme-text-secondary" style={{ fontWeight: 300 }}>{user.bio}</p>}
            {user?.isVerified && (
              <span className="mt-2 px-3 py-1 rounded text-[10px] uppercase tracking-[1px]"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#d0d0d0', fontFamily: "'Space Mono', monospace" }}>
                ✓ Verified {user.verifiedBadgeType}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {links?.map((link, index) => (
              <motion.div key={link._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}>
                {link.linkType === 'newsletter' || link.linkType === 'free_download' ? (
                  <div>
                    <PublicLinkButton link={link} onClick={() => setCaptureLink(link)} />
                    {captureLink?._id === link._id && (
                      <EmailCaptureForm link={link} username={username} onClose={() => setCaptureLink(null)} />
                    )}
                  </div>
                ) : link.linkType === 'book_session' ? (
                  <div>
                    <PublicLinkButton link={link} onClick={() => setBookingLink(link)} />
                    {bookingLink?._id === link._id && (
                      <BookingModal link={link} username={username} onClose={() => setBookingLink(null)} />
                    )}
                  </div>
                ) : (
                  <PublicLinkButton link={link} onClick={() => recordClick(link._id)} />
                )}
              </motion.div>
            ))}
          </div>

          {links?.some(l => l.linkType === 'instagram_grid') && (
            <div className="mt-6 grid grid-cols-3 gap-1.5">
              {links.filter(l => l.linkType === 'instagram_grid').slice(0, 9).map((link, i) => (
                <motion.a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="aspect-square rounded-lg overflow-hidden transition-opacity"
                  style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {link.icon ? (
                    <img src={link.icon} alt={link.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl" style={{ color: '#333' }}>□</div>
                  )}
                </motion.a>
              ))}
            </div>
          )}

          <div className="mt-10 text-center text-[11px] pb-4" style={{ color: '#555', fontFamily: "'Space Mono', monospace" }}>
            <a href="/" className="transition-colors no-underline" style={{ color: '#555' }}>Powered by CreatorPage</a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PublicPage;