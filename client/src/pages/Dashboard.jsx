import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LinksManager from '../components/dashboard/LinksManager';
import Appearance from '../components/dashboard/Appearance';
import Analytics from '../components/dashboard/Analytics';
import Settings from '../components/dashboard/Settings';
import Products from '../components/dashboard/Products';
import Bookings from '../components/dashboard/Bookings';
import MediaKit from '../components/dashboard/MediaKit';
import Referrals from '../components/dashboard/Referrals';
import ABTests from '../components/dashboard/ABTests';

const navItems = [
  { path: 'links', label: 'Links', icon: '◈' },
  { path: 'appearance', label: 'Appearance', icon: '△' },
  { path: 'analytics', label: 'Analytics', icon: '◇' },
  { path: 'products', label: 'Products', icon: '□' },
  { path: 'bookings', label: 'Bookings', icon: '○' },
  { path: 'mediakit', label: 'Media Kit', icon: '⬡' },
  { path: 'referrals', label: 'Referrals', icon: '⬢' },
  { path: 'abtests', label: 'A/B Tests', icon: '◆' },
  { path: 'settings', label: 'Settings', icon: '⏣' }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg" style={{ background: '#161616' }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f5f5f5' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0f0f0f', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="p-5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>CP</div>
          <span className="text-sm font-semibold" style={{ color: '#f5f5f5', fontFamily: "'Space Grotesk', sans-serif" }}>CreatorPage</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} to={`/dashboard/${item.path}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all no-underline`}
              style={({ isActive }) => ({
                color: isActive ? '#f5f5f5' : '#888',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent'
              })}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#1e1e1e', color: '#d0d0d0' }}>
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: '#f5f5f5' }}>{user?.name}</p>
              <p className="text-[11px] truncate" style={{ color: '#555' }}>@{user?.username}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <a href={`/u/${user?.username}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-[11px] py-1.5 rounded-md transition-all no-underline"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#d0d0d0' }}>
              View Page
            </a>
            <button onClick={logout} className="text-[11px] px-2.5 py-1.5 rounded-md transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#888' }}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="links" element={<LinksManager />} />
            <Route path="appearance" element={<Appearance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="products" element={<Products />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="mediakit" element={<MediaKit />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="abtests" element={<ABTests />} />
            <Route path="*" element={<LinksManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;