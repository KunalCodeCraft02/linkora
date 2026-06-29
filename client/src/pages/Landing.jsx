import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Model3D from '../components/public/Model3D';

const themes = [
  { name: 'Midnight', bg: 'bg-[#080808]', accent: 'bg-white/10' },
  { name: 'Aurora', bg: 'bg-[#0a0a0a]', accent: 'bg-white/5' },
  { name: 'Glassmorphism', bg: 'bg-[#0d0d0d]', accent: 'bg-white/[0.03]' },
  { name: 'Neon City', bg: 'bg-[#060606]', accent: 'bg-white/10' },
  { name: 'Minimal Light', bg: 'bg-white', accent: 'bg-black/5' },
  { name: 'Minimal Dark', bg: 'bg-[#080808]', accent: 'bg-white/5' },
  { name: 'Sunset', bg: 'bg-[#0c0c0c]', accent: 'bg-white/[0.04]' },
  { name: 'Forest', bg: 'bg-[#090909]', accent: 'bg-white/5' }
];

const features = [
  { icon: 'ri-links-line', title: 'Unlimited Links', desc: 'Add all your social media, websites, and content in one beautiful page.' },
  { icon: 'ri-bar-chart-grouped-line', title: 'Real Analytics', desc: 'Track every click, see where visitors come from, and optimize your links.' },
  { icon: 'ri-shopping-bag-3-line', title: 'Sell Products', desc: 'Sell digital products directly from your page. 0% platform fee on paid plans.' },
  { icon: 'ri-calendar-check-line', title: 'Book Sessions', desc: 'Let visitors book paid sessions with you. Calendar integration included.' },
  { icon: 'ri-brain-line', title: 'AI-Powered', desc: 'AI bio writer, link title suggestions, and weekly optimization tips.' },
  { icon: 'ri-smartphone-line', title: 'Mobile Optimized', desc: 'Your page looks stunning on every device. Fast loading, beautiful design.' }
];

const steps = [
  { num: '01', title: 'Sign Up', desc: 'Create your free account in 30 seconds.' },
  { num: '02', title: 'Add Your Links', desc: 'Add your social media, products, and more.' },
  { num: '03', title: 'Share Your Page', desc: 'Share your unique URL with your audience.' }
];

const faqs = [
  { q: 'Is CreatorPage free?', a: 'Yes! CreatorPage is free forever with no limits on links. Paid plans offer premium features like custom domains and priority support.' },
  { q: 'Can I sell products?', a: 'Absolutely! You can sell digital products with 0% platform fee. We only charge for premium features, not your earnings.' },
  { q: 'How do I get paid?', a: 'We use Razorpay for payments. You can receive payments via UPI, cards, net banking, and more. All in INR.' },
  { q: 'Can I customize my page?', a: 'Yes! Choose from 8 animated themes, customize colors, and even add your own CSS on Pro plans.' },
  { q: 'Is there a mobile app?', a: 'CreatorPage is mobile-optimized and works great in any browser. A native app is coming soon!' },
  { q: 'How does the AI work?', a: 'Our AI helps you write better bios, suggests link titles, and gives you weekly tips to improve your page performance.' }
];

const Landing = () => {
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

      <section className="relative min-h-[100svh] sm:min-h-screen flex flex-col justify-center overflow-hidden px-4 sm:px-6 pt-28 sm:pt-32 pb-8 sm:pb-16">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '160px' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] items-center gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center lg:text-left">
            <div className="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-7 justify-center lg:justify-start">
              <div className="w-7 sm:w-9 h-px" style={{ background: '#d0d0d0' }} />
              <span className="text-[11px] sm:text-[11px] uppercase tracking-[2px] sm:tracking-[2.5px]" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>Link-in-Bio Platform</span>
            </div>
            <h1 className="text-[34px] leading-[1.1] sm:text-5xl lg:text-[68px] sm:leading-[1.04] font-bold tracking-[-1.5px] sm:tracking-[-2.5px] mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}>
              Your entire creator world,{' '}
              <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)', color: 'transparent' }}>
                one beautiful page
              </span>
            </h1>
            <p className="text-[15px] sm:text-base mb-7 sm:mb-9 max-w-md mx-auto lg:mx-0 leading-relaxed" style={{ color: '#888', fontWeight: 300 }}>
              The ultimate link-in-bio platform for content creators. Sell products, book sessions, and grow your audience — all from one page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] font-semibold transition-all hover:-translate-y-0.5 no-underline" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
                Create your free page <i className="ri-arrow-right-line" />
              </Link>
              <Link to="/discover" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] transition-all no-underline" style={{ background: 'transparent', color: '#f5f5f5', border: '1px solid rgba(255,255,255,0.14)', fontFamily: "'Space Grotesk', sans-serif" }}>
                Browse creators
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex justify-center lg:justify-center">
            <Model3D />
          </motion.div>
        </div>

        <div className="hidden sm:flex absolute bottom-7 left-4 sm:left-6 z-10 items-center gap-2.5" style={{ color: '#555', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          <span>Scroll down</span>
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </section>

      <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: '#080808' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-16">
            <div className="text-[11px] uppercase tracking-[3px] mb-3 sm:mb-4 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
              <div className="w-5 h-px" style={{ background: '#555' }} />
              Features
            </div>
            <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-bold tracking-[-1px] sm:tracking-[-1.5px] mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything you need
            </h2>
            <p className="text-[15px] sm:text-sm max-w-md leading-relaxed" style={{ color: '#888', fontWeight: 300 }}>
              Powerful features to help you grow your audience and monetize your content.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-4 sm:p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)' }}>
                <i className={`${f.icon} text-xl sm:text-3xl mb-3 sm:mb-4 block`} style={{ color: '#c8c8c8' }} />
                <h3 className="text-[15px] sm:text-lg font-semibold mb-1.5 sm:mb-2 tracking-[-0.2px] sm:tracking-[-0.3px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
                <p className="text-[13px] sm:text-sm leading-relaxed" style={{ color: '#888', fontWeight: 300 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-16">
            <div className="text-[11px] uppercase tracking-[3px] mb-3 sm:mb-4 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
              <div className="w-5 h-px" style={{ background: '#555' }} />
              Process
            </div>
            <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-bold tracking-[-1px] sm:tracking-[-1.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How it works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="text-center sm:text-left">
                <div className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 tracking-[-2px] sm:tracking-[-3px]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(255,255,255,0.08)' }}>{s.num}</div>
                <h3 className="text-[17px] sm:text-xl font-bold mb-1.5 sm:mb-2 tracking-[-0.2px] sm:tracking-[-0.3px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
                <p className="text-[14px] sm:text-sm" style={{ color: '#888', fontWeight: 300 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: '#080808' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-16">
            <div className="text-[11px] uppercase tracking-[3px] mb-3 sm:mb-4 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
              <div className="w-5 h-px" style={{ background: '#555' }} />
              Themes
            </div>
            <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-bold tracking-[-1px] sm:tracking-[-1.5px] mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>8 monochrome themes</h2>
            <p className="text-[15px] sm:text-sm" style={{ color: '#888', fontWeight: 300 }}>Choose from beautifully crafted animated themes.</p>
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {themes.map((t, i) => (
              <motion.div key={i} whileHover={{ scale: 1.04 }} className={`flex-shrink-0 w-28 sm:w-44 h-40 sm:h-60 ${t.bg} rounded-2xl p-3 sm:p-4 flex flex-col justify-end`}
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className={`w-7 h-7 sm:w-10 sm:h-10 ${t.accent} rounded-lg mb-2`} />
                <p className="font-semibold text-[13px] sm:text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <div className="text-[11px] uppercase tracking-[3px] mb-3 sm:mb-4 flex items-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
              <div className="w-5 h-px" style={{ background: '#555' }} />
              FAQ
            </div>
            <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-bold tracking-[-1px] sm:tracking-[-1.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Frequently asked questions</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-xl overflow-hidden group" style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.07)' }}>
                <summary className="p-3.5 sm:p-5 cursor-pointer font-semibold flex items-center justify-between text-[14px] sm:text-sm transition-colors hover:text-white" style={{ color: '#d0d0d0' }}>
                  {faq.q}
                  <i className="ri-add-line transition-transform group-open:rotate-45" style={{ color: '#555' }} />
                </summary>
                <p className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 text-[14px] sm:text-sm leading-relaxed" style={{ color: '#888', fontWeight: 300 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-24 px-4 sm:px-6" style={{ background: '#080808' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[3px] mb-4 sm:mb-6 flex items-center justify-center gap-2.5" style={{ color: '#888', fontFamily: "'Space Mono', monospace" }}>
            <div className="w-5 h-px" style={{ background: '#555' }} />
            Join Us
          </div>
          <h2 className="text-[22px] sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-[-1px] sm:tracking-[-1.5px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Join 10,000+ creators already using CreatorPage
          </h2>
          <p className="text-[15px] sm:text-sm mb-6 sm:mb-8" style={{ color: '#888', fontWeight: 300 }}>
            Start building your beautiful creator page today. It's free forever.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-3.5 rounded-lg text-[15px] font-semibold transition-all hover:-translate-y-0.5 no-underline" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>
            Create your free page <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </section>

      <footer className="py-8 sm:py-12 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#080808' }}>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-[10px] sm:text-[10px] font-bold" style={{ background: '#f5f5f5', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>CP</div>
            <span className="text-[13px] sm:text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CreatorPage</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 text-[13px] sm:text-xs" style={{ color: '#888' }}>
            <Link to="/" className="hover:text-white transition-colors no-underline" style={{ color: '#888' }}>Home</Link>
            <Link to="/discover" className="hover:text-white transition-colors no-underline" style={{ color: '#888' }}>Discover</Link>
            <Link to="/register" className="hover:text-white transition-colors no-underline" style={{ color: '#888' }}>Sign Up</Link>
          </div>
          <p className="text-[11px] sm:text-[11px]" style={{ color: '#555', fontFamily: "'Space Mono', monospace" }}>&copy; 2026 CreatorPage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
