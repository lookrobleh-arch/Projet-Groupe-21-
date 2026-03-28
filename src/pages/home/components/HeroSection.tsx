import { useState } from 'react';
import { Link } from 'react-router-dom';
import DemoModal from './DemoModal';

const miniCards = [
  { icon: 'ri-robot-2-line', color: 'from-violet-500 to-purple-600', title: 'Assistant IA', sub: 'Conseils en temps réel' },
  { icon: 'ri-scan-2-line', color: 'from-cyan-500 to-sky-600', title: 'OCR Scan', sub: 'Lecture auto des reçus' },
  { icon: 'ri-line-chart-line', color: 'from-emerald-500 to-teal-600', title: 'Prévisions', sub: 'Cashflow intelligent' },
  { icon: 'ri-shield-check-line', color: 'from-indigo-500 to-blue-600', title: 'Sécurité', sub: 'Certifié ISO 27001' },
];

export default function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20dark%20geometric%20technology%20background%20with%20intricate%20network%20nodes%20and%20connecting%20lines%20deep%20navy%20indigo%20dark%20slate%20gradient%20minimal%20futuristic%20digital%20pattern%20with%20subtle%20glowing%20mesh%20lines%20and%20hexagonal%20shapes&width=1920&height=1080&seq=hero1&orientation=landscape"
            alt="background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto pt-28 pb-16">
          {/* Animated pill */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-sm text-white/90 font-medium">Nouveau : Assistant IA Financier v2.0</span>
          </div>

          {/* H1 */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white mb-6">
            Maîtrisez Vos{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Finances
            </span>{' '}
            Avec Intelligence
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            DepenseEasy automatise le suivi de vos dépenses, scanne vos reçus et vous guide vers l&apos;indépendance financière grâce à l&apos;intelligence artificielle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              to="/login"
              state={{ tab: 'register' }}
              className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-full px-10 py-4 text-lg font-semibold shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Commencer à s&apos;inscrire
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-10 py-4 text-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-play-circle-line text-xl" />
              Découvrir la Démo
            </button>
          </div>

          {/* Mini cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
            {miniCards.map((card) => (
              <div
                key={card.title}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:border-white/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                  <i className={`${card.icon} text-white text-xl`} />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{card.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bounce arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 animate-bounce">
          <i className="ri-arrow-down-s-line text-white/40 text-2xl" />
          <i className="ri-arrow-down-s-line text-white/20 text-2xl -mt-3" />
        </div>
      </section>

      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}
    </>
  );
}
