import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const linkTypeStyles = {
  youtube: { icon: '◈' },
  instagram: { icon: '△' },
  twitter: { icon: '◇' },
  github: { icon: '□' },
  product: { icon: '○' },
  affiliate: { icon: '⬡' },
  free_download: { icon: '⬢' },
  event: { icon: '◆' },
  newsletter: { icon: '⏣' },
  spotify: { icon: '◈' },
  pay_tip: { icon: '△' },
  whatsapp: { icon: '◇' },
  instagram_grid: { icon: '□' },
  book_session: { icon: '○' },
  custom: { icon: '◈' }
};

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-xs ml-2" style={{ color: '#888' }}>{timeLeft}</span>;
};

const PublicLinkButton = ({ link, onClick }) => {
  const style = linkTypeStyles[link.linkType] || linkTypeStyles.custom;
  const isExternal = link.linkType !== 'newsletter' && link.linkType !== 'free_download' && link.linkType !== 'book_session';

  const content = (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
      className="rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <span className="text-sm" style={{ color: '#c8c8c8' }}>{style.icon}</span>
      <span className="flex-1 font-medium text-sm" style={{ color: '#f5f5f5' }}>{link.title}</span>
      {link.linkType === 'affiliate' && (
        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#d0d0d0', fontFamily: "'Space Mono', monospace" }}>affiliate</span>
      )}
      {link.expiresAt && <CountdownTimer expiresAt={link.expiresAt} />}
      {isExternal && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#555' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={onClick} className="block no-underline">
        {content}
      </a>
    );
  }

  return (
    <div onClick={onClick}>
      {content}
    </div>
  );
};

export default PublicLinkButton;