import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const Settings = () => {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('en');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setName(data.name);
        setBio(data.bio);
        setUsername(data.username);
        setLanguage(data.language);
        setNiche(data.niche);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', { name, bio, username, language, niche });
      await checkAuth();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await checkAuth();
      toast.success('Avatar updated');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'kn', name: 'Kannada' },
    { code: 'gu', name: 'Gujarati' }
  ];

  if (loading) {
    return <div className="h-64 rounded-xl animate-pulse" style={{ background: '#0f0f0f' }} />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[3px] mb-3 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
          <div className="w-5 h-px" style={{ background: '#555' }} />
          Profile
        </div>
        <h1 className="text-2xl font-bold tracking-[-0.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h1>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl p-6 space-y-5" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-5">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ background: '#1e1e1e', color: '#d0d0d0', fontFamily: "'Space Grotesk', sans-serif" }}>
                {name?.charAt(0)}
              </div>
            )}
            <label className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer transition-all hover:scale-110"
              style={{ background: '#f5f5f5', color: '#000' }}>
              {uploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <i className="ri-camera-line text-sm" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user?.name}</p>
            <p className="text-[13px]" style={{ color: '#888' }}>@{user?.username}</p>
            <p className="text-[11px] mt-1" style={{ color: '#555' }}>Click the camera icon to upload a profile picture</p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Display Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none"
            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Bio ({bio.length}/150)</label>
          <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 150))} rows={2}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Username</label>
          <div className="flex items-center rounded-lg overflow-hidden"
            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)' }}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none" style={{ color: '#f5f5f5' }} />
            <span className="pr-4 text-sm" style={{ color: '#555' }}>.creatorpage.in</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }}>
              <option value="">Select niche</option>
              {['Tech', 'Fitness', 'Food', 'Finance', 'Art', 'Music', 'Education', 'Comedy', 'Fashion', 'Travel', 'Gaming', 'Business'].map(n => (
                <option key={n} value={n.toLowerCase()}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }}>
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="rounded-2xl p-6" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Public Page URL</h2>
        <div className="flex items-center gap-3">
          <input type="text" value={`${window.location.origin}/u/${username}`} readOnly
            className="flex-1 rounded-lg px-4 py-3 text-sm"
            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/u/${username}`); toast.success('URL copied!'); }}
            className="px-4 py-3 rounded-lg transition-all hover:-translate-y-0.5"
            style={{ background: '#f5f5f5', color: '#000' }}>
            <i className="ri-file-copy-line" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;