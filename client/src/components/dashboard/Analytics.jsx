import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [byLink, setByLink] = useState([]);
  const [overTime, setOverTime] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, byLinkRes, overTimeRes, countriesRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/by-link'),
        api.get('/analytics/over-time'),
        api.get('/analytics/countries')
      ]);
      setOverview(overviewRes.data);
      setByLink(byLinkRes.data);
      setOverTime(overTimeRes.data);
      setCountries(countriesRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'All Time', value: overview?.total || 0, color: 'text-primary-400' },
          { label: 'Last 7 Days', value: overview?.last7 || 0, color: 'text-blue-400' },
          { label: 'Last 30 Days', value: overview?.last30 || 0, color: 'text-green-400' },
          { label: 'Email Captures', value: overview?.emailCaptures || 0, color: 'text-yellow-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-4">Clicks Over Time (14 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="clicks" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-4">Clicks by Link</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byLink.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="link.title" stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="clicks" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {countries.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-4">Top Countries</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.slice(0, 8).map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: COLORS[i % COLORS.length] + '33', color: COLORS[i % COLORS.length] }}>
                  {c.country}
                </div>
                <div>
                  <p className="font-medium text-sm">{c.country}</p>
                  <p className="text-xs text-gray-400">{c.clicks} clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;