const themes = {
  midnight: {
    bg: '#080808',
    container: 'bg-[#080808]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[#0f0f0f] border-[rgba(255,255,255,0.07)]',
    cardHover: 'hover:border-[rgba(255,255,255,0.14)]',
    accent: '#f5f5f5'
  },
  aurora: {
    bg: '#0a0a0a',
    container: 'bg-[#0a0a0a]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[#111111] border-[rgba(255,255,255,0.07)]',
    cardHover: 'hover:border-[rgba(255,255,255,0.14)]',
    accent: '#d0d0d0'
  },
  glass: {
    bg: '#0d0d0d',
    container: 'bg-[#0d0d0d]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] backdrop-blur-md',
    cardHover: 'hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)]',
    accent: '#c8c8c8'
  },
  neon: {
    bg: '#060606',
    container: 'bg-[#060606]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[#0d0d0d] border-[rgba(255,255,255,0.1)]',
    cardHover: 'hover:border-[rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    accent: '#e8e8e8'
  },
  minimal_light: {
    bg: '#ffffff',
    container: 'bg-white',
    text: '#111111',
    textSecondary: '#666666',
    card: 'bg-[#f5f5f5] border-[#e0e0e0]',
    cardHover: 'hover:border-[#aaaaaa]',
    accent: '#111111'
  },
  minimal_dark: {
    bg: '#080808',
    container: 'bg-[#080808]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[#111111] border-[rgba(255,255,255,0.07)]',
    cardHover: 'hover:border-[rgba(255,255,255,0.14)]',
    accent: '#888888'
  },
  sunset: {
    bg: '#0c0c0c',
    container: 'bg-[#0c0c0c]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)]',
    cardHover: 'hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]',
    accent: '#f5f5f5'
  },
  forest: {
    bg: '#090909',
    container: 'bg-[#090909]',
    text: '#f5f5f5',
    textSecondary: '#888888',
    card: 'bg-[#0f0f0f] border-[rgba(255,255,255,0.06)]',
    cardHover: 'hover:border-[rgba(255,255,255,0.12)]',
    accent: '#d0d0d0'
  }
};

const ThemeStyles = ({ theme }) => {
  const t = themes[theme] || themes.midnight;

  return (
    <style>{`
      .theme-${theme} {
        background: ${t.bg};
        min-height: 100vh;
      }
      .theme-${theme} .theme-container {
        background: ${t.container};
      }
      .theme-${theme} .theme-text {
        color: ${t.text};
      }
      .theme-${theme} .theme-text-secondary {
        color: ${t.textSecondary};
      }
      .theme-${theme} .theme-card {
        background: ${t.card.split(' ')[0]};
        border-color: ${t.card.split(' ')[1]};
      }
      .theme-${theme} .theme-card-hover {
        ${t.cardHover};
      }

      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
        70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
      }
      .animate-pulse-ring {
        animation: pulse-ring 2s infinite;
      }

      ${theme === 'midnight' ? `
        .theme-midnight::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.08), transparent),
                            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.06), transparent),
                            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.07), transparent),
                            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.05), transparent),
                            radial-gradient(1px 1px at 160px 30px, rgba(255,255,255,0.06), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: twinkle 6s infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      ` : ''}

      ${theme === 'aurora' ? `
        .theme-aurora::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 50%);
          animation: aurora 20s infinite;
          pointer-events: none;
          z-index: 0;
        }
        .theme-aurora::after {
          content: '';
          position: fixed;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 50%);
          animation: aurora 25s infinite reverse;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes aurora {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(40px, 30px) scale(1.05); }
        }
      ` : ''}

      ${theme === 'neon' ? `
        .theme-neon .theme-card {
          transition: all 0.3s ease;
        }
        .theme-neon .theme-card:hover {
          box-shadow: 0 0 20px rgba(255,255,255,0.06), inset 0 0 20px rgba(255,255,255,0.02);
        }
      ` : ''}

      ${theme === 'glass' ? `
        .theme-glass .theme-card {
          backdrop-filter: blur(12px);
        }
      ` : ''}
    `}</style>
  );
};

export default ThemeStyles;