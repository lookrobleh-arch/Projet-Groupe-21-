import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = 'https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png';

const features = [
  { icon: 'ri-robot-2-line', color: 'from-violet-500 to-purple-600', title: 'Assistant IA', desc: "Conseils financiers intelligents personnalisés en temps réel" },
  { icon: 'ri-scan-2-line', color: 'from-cyan-500 to-sky-600', title: 'OCR Scan', desc: "Scannez vos reçus en moins de 2 minutes automatiquement" },
  { icon: 'ri-pie-chart-2-line', color: 'from-indigo-500 to-blue-600', title: 'Budgets', desc: "Gérez vos budgets dynamiques par catégorie intelligemment" },
  { icon: 'ri-line-chart-line', color: 'from-emerald-500 to-teal-600', title: 'Prévisions', desc: "Anticipez vos dépenses futures avec l\'IA prédictive" },
  { icon: 'ri-alarm-warning-line', color: 'from-red-500 to-orange-600', title: 'Anomalies', desc: "Détection automatique de dépenses suspectes ou inhabituelles" },
  { icon: 'ri-target-line', color: 'from-amber-500 to-yellow-600', title: 'Objectifs', desc: "Définissez et suivez vos objectifs d\'épargne personnalisés" },
];

const labels: Record<string, Record<string, string>> = {
  FR: {
    features: 'Fonctionnalités',
    contact: 'Contact',
    security: 'Sécurité',
    about: 'À propos',
    login: 'Connexion',
    start: 'Commencer à s\'inscrire',
  },
  EN: {
    features: 'Features',
    contact: 'Contact',
    security: 'Security',
    about: 'About',
    login: 'Login',
    start: 'Get Started',
  },
};

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = labels[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg border-b border-gray-200'
            : 'bg-white/5 backdrop-blur-md border-b border-white/10'
        }`}
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
            <img src={LOGO_URL} alt="DepenseEasy" className="w-10 h-10 rounded-full object-cover" />
            <span className={`font-bold text-xl whitespace-nowrap transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              DepenseEasy
            </span>
          </Link>

          {/* Center nav - desktop */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {/* Dropdown Features */}
            <button
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                scrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-white/90 hover:text-white'
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {t.features}
              <i className={`ri-arrow-down-s-line text-base transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {[
              { label: t.contact, to: '/contact' },
              { label: t.security, to: '/securite' },
              { label: t.about, to: '/apropos' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors duration-300 whitespace-nowrap underline-offset-4 hover:underline ${
                  scrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions - desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language selector */}
            <div className={`flex items-center border rounded-full overflow-hidden text-xs font-semibold transition-colors duration-300 ${scrolled ? 'border-gray-300' : 'border-white/30'}`}>
              {(['FR', 'EN'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 cursor-pointer whitespace-nowrap transition-all duration-200 ${
                    lang === l
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white'
                      : scrolled ? 'text-slate-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <Link
              to="/login"
              className={`border-2 rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'border-slate-800 text-slate-800 hover:bg-slate-50'
                  : 'border-white/70 text-white hover:bg-white/10'
              }`}
            >
              {t.login}
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {t.start}
            </Link>
          </div>

          {/* Hamburger - mobile */}
          <button
            className={`lg:hidden p-2 cursor-pointer transition-colors duration-300 ${scrolled ? 'text-slate-800' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-slate-800' : 'bg-white'}`} />
            <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''} ${scrolled ? 'bg-slate-800' : 'bg-white'}`} />
            <div className={`w-6 h-0.5 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-slate-800' : 'bg-white'}`} />
          </button>
        </div>

        {/* Mega Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 p-5 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-cyan-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                    <i className={`${f.icon} text-white text-xl`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-700">{f.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="DepenseEasy" className="w-8 h-8 rounded-full" />
                <span className="font-bold text-slate-900">DepenseEasy</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer p-1">
                <i className="ri-close-line text-2xl text-slate-700" />
              </button>
            </div>
            <div className="flex px-6 py-4 border-b">
              {(['FR', 'EN'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all ${lang === l ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white' : 'text-slate-600'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
              {[t.features, t.contact, t.security, t.about].map((label) => (
                <button key={label} className="text-left py-3 px-4 rounded-xl text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors">
                  {label}
                </button>
              ))}
            </div>
            <div className="px-6 pb-8 flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="border-2 border-slate-800 text-slate-800 rounded-full py-3 text-center font-semibold text-sm cursor-pointer whitespace-nowrap">
                {t.login}
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-full py-3 text-center font-semibold text-sm cursor-pointer whitespace-nowrap">
                {t.start}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
