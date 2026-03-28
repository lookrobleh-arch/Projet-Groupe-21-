const stats = [
  {
    icon: 'ri-money-euro-circle-line',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'from-amber-400/10 to-orange-500/10',
    value: '2M€+',
    label: 'Économisés par nos utilisateurs',
    detail: 'En optimisant leurs dépenses quotidiennes',
  },
  {
    icon: 'ri-star-fill',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'from-emerald-400/10 to-teal-500/10',
    value: '98.7%',
    label: 'Taux de satisfaction client',
    detail: 'Basé sur 2 400 avis vérifiés',
  },
  {
    icon: 'ri-scan-2-line',
    gradient: 'from-indigo-400 to-violet-500',
    bg: 'from-indigo-400/10 to-violet-500/10',
    value: '< 2min',
    label: 'Temps moyen de scan OCR',
    detail: 'Reconnaissance automatique multi-langues',
  },
  {
    icon: 'ri-global-line',
    gradient: 'from-cyan-400 to-sky-500',
    bg: 'from-cyan-400/10 to-sky-500/10',
    value: '15K+',
    label: 'Utilisateurs actifs',
    detail: 'Dans 12 pays européens',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Des Résultats Prouvés</h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Des chiffres qui parlent d&apos;eux-mêmes, obtenus par des milliers d&apos;utilisateurs comme vous</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-6`}>
                <i className={`${s.icon} bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent text-3xl`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</p>
              <p className="text-gray-300 font-semibold text-sm mb-2">{s.label}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
