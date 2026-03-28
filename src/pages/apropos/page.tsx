import LandingNav from '../home/components/LandingNav';
import Footer from '../home/components/Footer';

const team = [
  { name: 'Alexandre Martin', role: 'CEO & Co-fondateur', avatar: 'AM', color: 'from-indigo-500 to-violet-500' },
  { name: 'Claire Dubois', role: 'CTO', avatar: 'CD', color: 'from-cyan-500 to-sky-500' },
  { name: 'Romain Lefort', role: 'Head of Product', avatar: 'RL', color: 'from-emerald-500 to-teal-500' },
  { name: 'Sophie Nguyen', role: 'Lead IA Engineer', avatar: 'SN', color: 'from-amber-500 to-orange-500' },
];

const values = [
  { icon: 'ri-lightbulb-line', title: 'Innovation', desc: 'Nous repoussons les limites de la technologie financière pour créer des outils vraiment utiles.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: 'ri-heart-line', title: 'Empathie', desc: 'Nous concevons chaque fonctionnalité en pensant aux vraies difficultés de nos utilisateurs.', color: 'bg-rose-50 text-rose-500' },
  { icon: 'ri-lock-line', title: 'Confiance', desc: 'La transparence et la sécurité sont au cœur de tout ce que nous construisons.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'ri-global-line', title: 'Accessibilité', desc: 'La gestion financière intelligente doit être accessible à tous, pas seulement aux experts.', color: 'bg-cyan-50 text-cyan-600' },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-20">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">À propos</span>
          <h1 className="text-5xl font-black text-slate-900 mb-5">Notre mission : simplifier <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">votre avenir financier</span></h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">Fondée en 2023 à Paris, DepenseEasy réunit une équipe passionnée de fintech pour démocratiser la gestion financière intelligente grâce à l&apos;IA.</p>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '15K+', label: 'Utilisateurs actifs' },
              { val: '2M€', label: 'Économisés' },
              { val: '97.3%', label: 'Précision OCR' },
              { val: '4.9/5', label: 'Note utilisateurs' },
            ].map(s => (
              <div key={s.label} className="text-center p-6 bg-gray-50 rounded-2xl">
                <p className="text-3xl font-black text-slate-900 mb-1">{s.val}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="p-6 rounded-2xl border border-gray-100 text-center">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mx-auto mb-4 ${v.color}`}><i className={`${v.icon} text-xl`} /></div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">L&apos;équipe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-3`}>{m.avatar}</div>
                <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
