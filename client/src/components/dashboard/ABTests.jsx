import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const ABTests = () => {
  const [tests, setTests] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState('');
  const [variantBTitle, setVariantBTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, linksRes] = await Promise.all([
        api.get('/analytics/abtests'),
        api.get('/links')
      ]);
      setTests(testsRes.data);
      setLinks(linksRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    if (!selectedLink || !variantBTitle) {
      toast.error('Select a link and enter variant B title');
      return;
    }

    try {
      await api.post(`/links/${selectedLink}/abtest`, { variantBTitle });
      toast.success('A/B test started');
      setSelectedLink('');
      setVariantBTitle('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start test');
    }
  };

  const endTest = async (linkId, abTestId) => {
    try {
      await api.put(`/links/${linkId}/abtest/end`, { abTestId });
      toast.success('Test ended');
      fetchData();
    } catch (error) {
      toast.error('Failed to end test');
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />;
  }

  const activeTests = tests.filter(t => t.status === 'active');
  const completedTests = tests.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">A/B Tests</h1>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
        <h3 className="font-semibold">Create New Test</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select Link</label>
            <select value={selectedLink} onChange={e => setSelectedLink(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500">
              <option value="">Choose a link</option>
              {links.filter(l => !l.abTestActive).map(link => (
                <option key={link._id} value={link._id}>{link.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Variant B Title</label>
            <input type="text" value={variantBTitle} onChange={e => setVariantBTitle(e.target.value)}
              placeholder="Alternative title for testing"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
        </div>
        <button onClick={startTest}
          className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-xl transition-colors">
          Start A/B Test
        </button>
        <p className="text-xs text-gray-500">Traffic is split 50/50. Test ends when one variant reaches 60%+ share after 100+ clicks.</p>
      </div>

      {activeTests.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Active Tests ({activeTests.length})</h3>
          <div className="space-y-3">
            {activeTests.map(test => {
              const total = test.variantA.clicks + test.variantB.clicks;
              const percentA = total > 0 ? Math.round((test.variantA.clicks / total) * 100) : 50;
              const percentB = 100 - percentA;

              return (
                <div key={test._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">{test.linkId?.title || 'Link'}</p>
                    <button onClick={() => endTest(test.linkId?._id, test._id)}
                      className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30">
                      End Test
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Variant A</p>
                      <p className="font-medium">{test.variantA.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percentA}%` }} />
                        </div>
                        <span className="text-sm">{percentA}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{test.variantA.clicks} clicks</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Variant B</p>
                      <p className="font-medium">{test.variantB.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${percentB}%` }} />
                        </div>
                        <span className="text-sm">{percentB}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{test.variantB.clicks} clicks</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Total: {total} clicks</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedTests.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Completed Tests</h3>
          <div className="space-y-3">
            {completedTests.map(test => (
              <div key={test._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 opacity-70">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{test.linkId?.title || 'Link'}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${test.winner === 'A' ? 'bg-primary-500/20 text-primary-400' : test.winner === 'B' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {test.winner === 'tie' ? 'Tie' : `Winner: ${test.winner}`}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">A: {test.variantA.title} ({test.variantA.clicks}) vs B: {test.variantB.title} ({test.variantB.clicks})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTests;