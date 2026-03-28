import LandingNav from '../home/components/LandingNav';
import Footer from '../home/components/Footer';

const securityPoints = [
  { icon: 'ri-shield-check-line', title: 'Chiffrement AES-256', desc: 'Toutes vos données sont chiffrées avec l\'algorithme AES-256, le standard utilisé par les banques mondiales.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: 'ri-lock-password-line', title: 'Authentification 2FA', desc: 'Double authentification disponible pour sécuriser votre compte contre les accès non autorisés.', color: 'bg-violet-50 text-violet-600' },
  { icon: 'ri-server-line', title: 'Hébergement certifié', desc: 'Vos données sont hébergées en Europe sur des serveurs certifiés ISO 27001, HDS et SOC 2 Type II.', color: 'bg-cyan-50 text-cyan-600' },
  { icon: 'ri-eye-off-line', title: 'Vie privée totale', desc: 'Aucune revente de données. Vos finances restent strictement privées et jamais partagées à des tiers.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'ri-refresh-line', title: 'Sauvegardes automatiques', desc: 'Vos données sont sauvegardées automatiquement toutes les 6h avec rétention de 90 jours.', color: 'bg-amber-50 text-amber-600' },
  { icon: 'ri-file-shield-2-line', title: 'Conformité RGPD', desc: 'Entièrement conforme au Règlement Général sur la Protection des Données de l\'Union Européenne.', color: 'bg-red-50 text-red-500' },
];

export default function SecuritePage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">Sécurité</span>
          <h1 className="text-5xl font-black text-slate-900 mb-4">Vos finances, protégées</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">DepenseEasy applique les standards de sécurité les plus élevés pour protéger vos données financières à chaque instant.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityPoints.map(s => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:-translate-y-1 transition-transform duration-200">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 mb-4 ${s.color}`}><i className={`${s.icon} text-xl`} /></div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/10 text-emerald-400 text-3xl mx-auto mb-5"><i className="ri-shield-star-line" /></div>
            <h2 className="text-2xl font-black text-white mb-3">Certifié ISO 27001</h2>
            <p className="text-gray-300 max-w-xl mx-auto text-sm leading-relaxed">Notre infrastructure et nos processus sont certifiés ISO 27001, la norme internationale de référence en matière de sécurité de l&apos;information.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
