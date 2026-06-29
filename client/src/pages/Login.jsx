import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard/links');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          <h1 className="text-2xl font-bold mt-6 mb-2 tracking-[-0.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: '#888' }}>Sign in to your creator dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-4" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[1px] mb-2" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#888' }}>
          Don't have an account? <Link to="/register" className="font-medium transition-colors no-underline" style={{ color: '#d0d0d0' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;