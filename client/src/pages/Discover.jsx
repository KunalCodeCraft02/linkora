import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

const niches = ['all', 'tech', 'fitness', 'food', 'finance', 'art', 'music', 'education', 'comedy', 'fashion', 'travel', 'gaming', 'business'];

const badgeColors = {
  creator: 'bg-white/10 text-white/80',
  business: 'bg-white/10 text-white/80',
  educator: 'bg-white/10 text-white/80',
  artist: 'bg-white/10 text-white/80',
  ngo: 'bg-white/10 text-white/80'
};

const Discover = () => {
  const [creators, setCreators] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('all');
  const [verified, setVerified] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCreators();
    fetchLeaderboard();
  }, [niche, verified, page]);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (niche !== 'all') params.niche = niche;
      if (verified) params.verified = 'true';
      if (search) params.search = search;

      const { data } = await api.get('/directory', { params });
      setCreators(data.users);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/directory/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      // ignore
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCreators();
  };

  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#f5f5f5', fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="fixed top-0 w-full z-50" style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 no-underline">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[11px] sm:text-xs font-bold" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>CP</div>
            <span className="text-[13px] sm:text-sm font-semibold tracking-tight" style={{ color: '#f5f5f5', fontFamily: "'Space Grotesk', sans-serif" }}>CreatorPage</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/login" className="text-[12px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-md transition-all hover:bg-white/5" style={{ color: '#888', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="text-[12px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-md transition-all" style={{ background: '#f5f5f5', color: '#000', textDecoration: 'none' }}>Create your page</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        <div className="mb-8 sm:mb-12">
          <div className="text-[11px] uppercase tracking-[3px] mb-3 sm:mb-4 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
            <div className="w-5 h-px" style={{ background: '#555' }} />
            Directory
          </div>
          <h1 className="text-[28px] sm:text-4xl lg:text-5xl font-bold tracking-[-1.5px] sm:tracking-[-2px] mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Discover Creators
          </h1>
          <p className="text-[15px] sm:text-base" style={{ color: '#888', fontWeight: 300 }}>Find amazing creators from every niche</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="flex-1 rounded-xl px-4 py-3 text-[15px] focus:outline-none"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f5f5' }} />
          <button type="submit" className="px-6 py-3 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
            Search
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {niches.map(n => (
            <button key={n} onClick={() => { setNiche(n); setPage(1); }}
              className="px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-all"
              style={{
                background: niche === n ? '#f5f5f5' : '#0f0f0f',
                color: niche === n ? '#000' : '#888',
                border: '1px solid ' + (niche === n ? 'transparent' : 'rgba(255,255,255,0.07)'),
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
              {n === 'all' ? 'All' : n.charAt(0).toUpperCase() + n.slice(1)}
            </button>
          ))}
          <button onClick={() => { setVerified(!verified); setPage(1); }}
            className="px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-all"
            style={{
              background: verified ? '#f5f5f5' : '#0f0f0f',
              color: verified ? '#000' : '#888',
              border: '1px solid ' + (verified ? 'transparent' : 'rgba(255,255,255,0.07)'),
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
            ✓ Verified Only
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-20">
            <i className="ri-search-line text-5xl mb-4 block" style={{ color: '#555' }} />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No creators found</h3>
            <p style={{ color: '#888' }}>Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((creator, i) => (
              <motion.div key={creator._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link to={`/u/${creator.username}`}
                  className="block rounded-2xl p-5 transition-all hover:-translate-y-1 no-underline"
                  style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-4">
                    {creator.avatar ? (
                      <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{ background: '#1e1e1e', color: '#f5f5f5', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {creator.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold truncate" style={{ color: '#f5f5f5' }}>{creator.name}</p>
                        {creator.isVerified && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}>
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] truncate" style={{ color: '#888' }}>@{creator.username}</p>
                    </div>
                  </div>
                  {creator.bio && <p className="text-[13px] mt-3 line-clamp-2" style={{ color: '#888' }}>{creator.bio}</p>}
                  {creator.niche && (
                    <span className="inline-block mt-2 text-[11px] px-2 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}>
                      {creator.niche}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-10 h-10 rounded-lg transition-all text-[13px] font-semibold"
                style={{
                  background: p === page ? '#f5f5f5' : '#0f0f0f',
                  color: p === page ? '#000' : '#888',
                  border: '1px solid ' + (p === page ? 'transparent' : 'rgba(255,255,255,0.07)'),
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;