import { useState, useEffect } from 'react';
import api from '../../lib/api';

const linkTypeIcons = {
  youtube: '▶️', instagram: '📸', twitter: '🐦', github: '🐙',
  product: '📦', affiliate: '💰', free_download: '📥', event: '📅',
  newsletter: '📧', spotify: '🎵', pay_tip: '☕', whatsapp: '💬',
  instagram_grid: '🖼️', book_session: '📅', custom: '🔗'
};

const LivePreview = ({ links }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setUser(data);
      } catch (error) {
        // ignore
      }
    };
    fetchProfile();
  }, []);

  const enabledLinks = links?.filter(l => l.isEnabled) || [];

  return (
    <div className="sticky top-6">
      <p className="text-[11px] uppercase tracking-[3px] mb-3" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Live Preview</p>
      <div className="rounded-3xl overflow-hidden" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-4 py-2.5 flex items-center justify-center" style={{ background: '#161616', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
        </div>

        <div className="p-5 max-w-[280px] mx-auto min-h-[400px]">
          <div className="flex flex-col items-center mb-6">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover mb-3" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3"
                style={{ background: '#1e1e1e', color: '#d0d0d0', fontFamily: "'Space Grotesk', sans-serif" }}>
                {user?.name?.charAt(0) || '?'}
              </div>
            )}
            <p className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user?.name || 'Your Name'}</p>
            <p className="text-xs text-center mt-1 line-clamp-2" style={{ color: '#888' }}>{user?.bio || 'Your bio goes here'}</p>
          </div>

          <div className="space-y-2">
            {enabledLinks.length > 0 ? enabledLinks.slice(0, 8).map((link) => (
              <div key={link._id} className="p-3 rounded-xl text-center text-xs font-medium transition-all cursor-pointer"
                style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }}>
                <span className="mr-2">{linkTypeIcons[link.linkType] || '🔗'}</span>
                {link.title}
                {link.linkType === 'affiliate' && <span className="ml-2 text-xs" style={{ color: '#888' }}>Affiliate</span>}
              </div>
            )) : (
              <div className="text-center py-8 text-xs" style={{ color: '#555' }}>
                <p>Add links to see preview</p>
              </div>
            )}
          </div>

          {enabledLinks.length > 8 && (
            <p className="text-center text-xs mt-3" style={{ color: '#555' }}>+{enabledLinks.length - 8} more</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;