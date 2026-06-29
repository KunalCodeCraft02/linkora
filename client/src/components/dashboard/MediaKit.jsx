import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const MediaKit = () => {
  const [mediaKit, setMediaKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState('');
  const [platforms, setPlatforms] = useState([{ name: 'Instagram', followers: 0, engagementRate: 0 }]);
  const [audienceAge, setAudienceAge] = useState('');
  const [audienceGender, setAudienceGender] = useState('');
  const [topContent, setTopContent] = useState('');
  const [pastCollabs, setPastCollabs] = useState([{ brand: '', description: '' }]);
  const [rateCard, setRateCard] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMediaKit();
  }, []);

  const fetchMediaKit = async () => {
    try {
      const { data } = await api.get('/mediakit');
      setMediaKit(data);
      setNiche(data.niche || '');
      setPlatforms(data.platforms?.length > 0 ? data.platforms : [{ name: 'Instagram', followers: 0, engagementRate: 0 }]);
      setAudienceAge(data.audienceAge || '');
      setAudienceGender(data.audienceGender || '');
      setTopContent(data.topContent?.join('\n') || '');
      setPastCollabs(data.pastCollabs?.length > 0 ? data.pastCollabs : [{ brand: '', description: '' }]);
      setRateCard(data.rateCard || '');
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/mediakit', {
        niche,
        platforms,
        audienceAge,
        audienceGender,
        topContent: topContent.split('\n').filter(Boolean),
        pastCollabs: pastCollabs.filter(c => c.brand),
        rateCard
      });
      toast.success('Media kit saved');
    } catch (error) {
      toast.error('Failed to save media kit');
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/mediakit/generate', {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'media-kit.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF generated');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Kit</h1>
          <p className="text-gray-400 text-sm">Create a professional media kit for brand collaborations</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition-colors">
            Save
          </button>
          <button onClick={generatePDF} disabled={generating}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
            {generating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Niche</label>
          <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g., Tech, Fitness, Food"
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Platforms</label>
          {platforms.map((p, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input type="text" value={p.name} onChange={e => {
                const newPlatforms = [...platforms];
                newPlatforms[i].name = e.target.value;
                setPlatforms(newPlatforms);
              }} placeholder="Platform"
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
              <input type="number" value={p.followers} onChange={e => {
                const newPlatforms = [...platforms];
                newPlatforms[i].followers = Number(e.target.value);
                setPlatforms(newPlatforms);
              }} placeholder="Followers"
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
              <input type="number" value={p.engagementRate} onChange={e => {
                const newPlatforms = [...platforms];
                newPlatforms[i].engagementRate = Number(e.target.value);
                setPlatforms(newPlatforms);
              }} placeholder="Engagement %"
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
            </div>
          ))}
          <button onClick={() => setPlatforms([...platforms, { name: '', followers: 0, engagementRate: 0 }])}
            className="text-sm text-primary-400 hover:text-primary-300">+ Add Platform</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Audience Age Range</label>
            <input type="text" value={audienceAge} onChange={e => setAudienceAge(e.target.value)} placeholder="e.g., 18-34"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Audience Gender Split</label>
            <input type="text" value={audienceGender} onChange={e => setAudienceGender(e.target.value)} placeholder="e.g., 60% Male, 40% Female"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Top Content (one URL per line)</label>
          <textarea value={topContent} onChange={e => setTopContent(e.target.value)} rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none text-sm" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Past Collaborations</label>
          {pastCollabs.map((c, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input type="text" value={c.brand} onChange={e => {
                const newCollabs = [...pastCollabs];
                newCollabs[i].brand = e.target.value;
                setPastCollabs(newCollabs);
              }} placeholder="Brand name"
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
              <input type="text" value={c.description} onChange={e => {
                const newCollabs = [...pastCollabs];
                newCollabs[i].description = e.target.value;
                setPastCollabs(newCollabs);
              }} placeholder="Description"
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
            </div>
          ))}
          <button onClick={() => setPastCollabs([...pastCollabs, { brand: '', description: '' }])}
            className="text-sm text-primary-400 hover:text-primary-300">+ Add Collaboration</button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Rate Card</label>
          <textarea value={rateCard} onChange={e => setRateCard(e.target.value)} rows={3}
            placeholder="Instagram Story: ₹5,000&#10;YouTube Video: ₹15,000&#10;Instagram Reel: ₹8,000"
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none text-sm" />
        </div>
      </div>

      {mediaKit?.shareToken && (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-3">Shareable Link</h3>
          <div className="flex items-center gap-3">
            <input type="text" value={`${window.location.origin}/media-kit/${mediaKit.shareToken}`} readOnly
              className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm" />
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/media-kit/${mediaKit.shareToken}`); toast.success('Link copied!'); }}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl transition-colors">
              📋
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaKit;