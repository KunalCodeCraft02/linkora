import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const Referrals = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/referral/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load referral stats');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied!');
  };

  const shareWhatsApp = () => {
    const text = `Join me on CreatorPage! Create your free creator page in seconds: ${stats?.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `I'm using CreatorPage to build my creator page! Check it out: ${stats?.referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />;
  }

  const milestones = [
    { count: 3, reward: '1 month free', reached: stats?.referralCount >= 3 },
    { count: 10, reward: '3 months free', reached: stats?.referralCount >= 10 },
    { count: 25, reward: 'Lifetime free', reached: stats?.referralCount >= 25 }
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Referrals</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-primary-400">{stats?.referralCount || 0}</p>
          <p className="text-sm text-gray-400">Total Referrals</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-green-400">{stats?.rewardMonths === -1 ? '∞' : `${stats?.rewardMonths || 0}`}</p>
          <p className="text-sm text-gray-400">Free Months Earned</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-yellow-400">{stats?.nextMilestone || 3}</p>
          <p className="text-sm text-gray-400">Next Milestone</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="font-semibold mb-4">Reward Progress</h3>
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${m.reached ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                {m.reached ? '✓' : m.count}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${m.reached ? 'text-green-400' : ''}`}>{m.count} referrals → {m.reward}</p>
                {!m.reached && i === milestones.findIndex(m => !m.reached) && (
                  <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (stats?.referralCount / m.count) * 100)}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="font-semibold mb-4">Your Referral Link</h3>
        <div className="flex items-center gap-3 mb-4">
          <input type="text" value={stats?.referralLink} readOnly
            className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm" />
          <button onClick={() => copyLink(stats?.referralLink)}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-3 rounded-xl transition-colors">
            📋 Copy
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={shareWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium transition-colors">
            Share on WhatsApp
          </button>
          <button onClick={shareTwitter}
            className="flex-1 bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-medium transition-colors">
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Referrals;