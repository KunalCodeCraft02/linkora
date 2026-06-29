import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const referralCode = searchParams.get('ref') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, username, referralCode);
      toast.success('Welcome to CreatorPage!');
      navigate('/dashboard/links');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080808' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>CP</div>
            <span className="text-xl font-semibold" style={{ color: '#f5f5f5', fontFamily: "'Space Grotesk', sans-serif" }}>CreatorPage</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2 tracking-[-0.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}>Create your page</h1>
          <p className="text-sm" style={{ color: '#888' }}>Start building your creator page in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-4" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Username</label>
            <div className="flex items-center rounded-lg overflow-hidden" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)' }}>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} required
                className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none" style={{ color: '#f5f5f5' }} placeholder="yourname" />
              <span className="pr-4 text-sm" style={{ color: '#555' }}>.creatorpage.in</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>
          {referralCode && (
            <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#d0d0d0' }}>
              Referred by a friend!
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
            {loading ? 'Creating...' : 'Create your page'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#888' }}>
          Already have an account? <Link to="/login" className="font-medium transition-colors no-underline" style={{ color: '#d0d0d0' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;