import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/applications', { params: { password } });
      setApplications(data);
      setAuthenticated(true);
    } catch (error) {
      toast.error('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const reviewApplication = async (id, status) => {
    try {
      await api.put(`/admin/applications/${id}`, { password, status });
      setApplications(applications.filter(a => a._id !== id));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Failed to review application');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Admin password" onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
            <button onClick={login} disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Verification Applications</h1>

        {applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📋</p>
            <h3 className="text-xl font-bold mb-2">No pending applications</h3>
            <p className="text-gray-400">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">{app.userId?.name}</span>
                      <span className="text-gray-400">@{app.userId?.username}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        app.badgeType === 'creator' ? 'bg-purple-500/20 text-purple-400' :
                        app.badgeType === 'business' ? 'bg-blue-500/20 text-blue-400' :
                        app.badgeType === 'educator' ? 'bg-green-500/20 text-green-400' :
                        app.badgeType === 'artist' ? 'bg-pink-500/20 text-pink-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {app.badgeType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{app.description}</p>
                    <a href={app.socialUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary-400 hover:text-primary-300">{app.socialUrl}</a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => reviewApplication(app._id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      Approve
                    </button>
                    <button onClick={() => reviewApplication(app._id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;