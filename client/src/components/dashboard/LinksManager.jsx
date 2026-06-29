import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import LinkForm from './LinkForm';
import LivePreview from './LivePreview';

const linkTypeIcons = {
  youtube: '▶️', instagram: '📸', twitter: '🐦', github: '🐙',
  product: '📦', affiliate: '💰', free_download: '📥', event: '📅',
  newsletter: '📧', spotify: '🎵', pay_tip: '☕', whatsapp: '💬',
  instagram_grid: '🖼️', book_session: '📅', custom: '🔗'
};

const LinksManager = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await api.get('/links');
      setLinks(data);
    } catch (error) {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setLinks(items);

    try {
      await api.put('/links/reorder', { orderedIds: items.map(l => l._id) });
    } catch (error) {
      toast.error('Failed to reorder');
      fetchLinks();
    }
  };

  const toggleLink = async (id, isEnabled) => {
    try {
      await api.put(`/links/${id}`, { isEnabled: !isEnabled });
      setLinks(links.map(l => l._id === id ? { ...l, isEnabled: !isEnabled } : l));
      toast.success(isEnabled ? 'Link disabled' : 'Link enabled');
    } catch (error) {
      toast.error('Failed to update link');
    }
  };

  const deleteLink = async (id) => {
    if (!confirm('Delete this link?')) return;
    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(l => l._id !== id));
      toast.success('Link deleted');
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const editLink = (link) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleSave = (link) => {
    if (editingLink) {
      setLinks(links.map(l => l._id === link._id ? link : l));
    } else {
      setLinks([...links, link]);
    }
    setShowForm(false);
    setEditingLink(null);
  };

  const getScheduleBadge = (link) => {
    const now = new Date();
    if (link.goLiveAt && new Date(link.goLiveAt) > now) {
      return <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}>Scheduled</span>;
    }
    if (link.expiresAt && new Date(link.expiresAt) - now < 24 * 60 * 60 * 1000) {
      return <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}>Expiring soon</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: '#0f0f0f' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Links</h1>
            <p className="text-sm" style={{ color: '#888' }}>{links.length} links • Drag to reorder</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setEditingLink(null); setShowForm(true); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
              + Add Link
            </button>
            <button onClick={() => {
                const url = `${window.location.origin}/u/${user?.username}`;
                navigator.clipboard.writeText(url);
                toast.success('Bio link copied!');
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', color: '#d0d0d0' }}>
              <i className="ri-file-copy-line mr-1" /> Copy Bio Link
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {links.map((link, index) => (
                  <Draggable key={link._id} draggableId={link._id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}
                        className="rounded-xl p-4 flex items-center gap-4 transition-all"
                        style={{
                          background: '#0f0f0f',
                          border: snapshot.isDragging ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                          opacity: !link.isEnabled ? 0.5 : 1,
                          boxShadow: snapshot.isDragging ? '0 10px 40px rgba(0,0,0,0.5)' : 'none'
                        }}>
                        <div {...provided.dragHandleProps} className="cursor-grab" style={{ color: '#555' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>

                        <span className="text-xl">{linkTypeIcons[link.linkType] || '🔗'}</span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate" style={{ color: '#f5f5f5' }}>{link.title}</p>
                            {link.linkType === 'affiliate' && <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}>Affiliate</span>}
                            {link.abTestActive && <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}>A/B Test</span>}
                            {getScheduleBadge(link)}
                          </div>
                          <p className="text-sm truncate" style={{ color: '#555' }}>{link.url}</p>
                        </div>

                        <button onClick={() => toggleLink(link._id, link.isEnabled)}
                          className="w-12 h-6 rounded-full transition-all relative"
                          style={{ background: link.isEnabled ? '#f5f5f5' : '#1e1e1e' }}>
                          <div className="w-5 h-5 rounded-full absolute top-0.5 transition-transform"
                            style={{
                              background: link.isEnabled ? '#000' : '#555',
                              transform: link.isEnabled ? 'translateX(26px)' : 'translateX(2px)'
                            }} />
                        </button>

                        <button onClick={() => editLink(link)} className="p-2 transition-colors"
                          style={{ color: '#888' }}>
                          <i className="ri-edit-line" />
                        </button>

                        <button onClick={() => deleteLink(link._id)} className="p-2 transition-colors"
                          style={{ color: '#888' }}>
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {links.length === 0 && (
          <div className="text-center py-20">
            <i className="ri-link text-5xl mb-4 block" style={{ color: '#555' }} />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No links yet</h3>
            <p className="mb-6" style={{ color: '#888' }}>Add your first link to get started</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
              + Add your first link
            </button>
          </div>
        )}
      </div>

      <div className="hidden xl:block w-80">
        <LivePreview links={links} />
      </div>

      <AnimatePresence>
        {showForm && (
          <LinkForm link={editingLink} onClose={() => { setShowForm(false); setEditingLink(null); }} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinksManager;