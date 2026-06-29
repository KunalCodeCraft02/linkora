import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const themes = [
  { id: 'midnight', name: 'Midnight', bg: '#080808', accent: 'rgba(255,255,255,0.08)', desc: 'Deep black with subtle particles' },
  { id: 'aurora', name: 'Aurora', bg: '#0a0a0a', accent: 'rgba(255,255,255,0.04)', desc: 'Soft floating light gradients' },
  { id: 'glass', name: 'Glassmorphism', bg: '#0d0d0d', accent: 'rgba(255,255,255,0.03)', desc: 'Frosted glass effect' },
  { id: 'neon', name: 'Neon City', bg: '#060606', accent: 'rgba(255,255,255,0.1)', desc: 'Subtle glow on hover' },
  { id: 'minimal_light', name: 'Minimal Light', bg: '#ffffff', accent: 'rgba(0,0,0,0.05)', desc: 'Clean white theme' },
  { id: 'minimal_dark', name: 'Minimal Dark', bg: '#080808', accent: 'rgba(255,255,255,0.05)', desc: 'Clean dark theme' },
  { id: 'sunset', name: 'Sunset', bg: '#0c0c0c', accent: 'rgba(255,255,255,0.04)', desc: 'Warm dark tones' },
  { id: 'forest', name: 'Forest', bg: '#090909', accent: 'rgba(255,255,255,0.05)', desc: 'Earthy dark tones' }
];

const Appearance = () => {
  const [selectedTheme, setSelectedTheme] = useState('midnight');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setSelectedTheme(data.theme || 'midnight');
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveTheme = async (themeId) => {
    setSelectedTheme(themeId);
    try {
      await api.put('/profile', { theme: themeId });
      toast.success('Theme updated');
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: '#161616' }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Appearance</h1>
      <p className="text-sm mb-6" style={{ color: '#888' }}>Choose a monochrome theme for your public page</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map(theme => (
          <button key={theme.id} onClick={() => saveTheme(theme.id)}
            className="rounded-2xl p-4 transition-all hover:scale-105"
            style={{
              background: theme.bg,
              border: `2px solid ${selectedTheme === theme.id ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
              boxShadow: selectedTheme === theme.id ? '0 8px 32px rgba(255,255,255,0.08)' : 'none'
            }}>
            <div className="h-24 flex items-center justify-center">
              <div className="space-y-2 w-full">
                <div className="h-2 rounded-full mx-8" style={{ background: theme.accent }} />
                <div className="h-2 rounded-full mx-6" style={{ background: theme.accent }} />
                <div className="h-2 rounded-full mx-10" style={{ background: theme.accent }} />
              </div>
            </div>
            <p className="text-sm font-semibold mt-3" style={{ color: theme.id === 'minimal_light' ? '#111' : '#f5f5f5', fontFamily: "'Space Grotesk', sans-serif" }}>{theme.name}</p>
            <p className="text-xs" style={{ color: theme.id === 'minimal_light' ? '#666' : '#888' }}>{theme.desc}</p>
            {selectedTheme === theme.id && (
              <div className="mt-2 text-xs font-medium" style={{ color: '#d0d0d0' }}>✓ Active</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Appearance;