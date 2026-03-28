const advantages = [
  {
    badge: 'Technologie OCR',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    title: 'Scannez et Oubliez',
    description: 'Notre moteur OCR de pointe extrait automatiquement toutes les informations de vos reçus et factures. Plus besoin de saisie manuelle fastidieuse : DepenseEasy s\'occupe de tout en quelques secondes.',
    points: [
      'Reconnaissance automatique de +50 types de documents',
      'Catégorisation intelligente sans effort',
      'Archivage numérique sécurisé de tous vos reçus',
    ],
    img: 'https://readdy.ai/api/search-image?query=close%20up%20receipt%20scanning%20with%20smartphone%20camera%20on%20clean%20white%20surface%20with%20soft%20blue%20light%20glow%20modern%20minimal%20scene%20sharp%20focus%20on%20phone%20and%20receipt%20paper%20with%20text%20recognition%20overlay%20effect%20clean%20background&width=800&height=800&seq=adv1&orientation=squarish',
    reverse: false,
  },
  {
    badge: 'Intelligence Artificielle',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    title: 'Recommandations Personnalisées',
    description: 'Votre assistant IA analyse vos habitudes financières et vous propose des recommandations concrètes pour optimiser votre budget. Comme avoir un conseiller financier personnel disponible 24h/24.',
    points: [
      'Analyse comportementale de vos dépenses récurrentes',
      'Alertes proactives avant tout dépassement de budget',
      'Plan d\'épargne personnalisé adapté à vos objectifs',
    ],
    img: 'https://readdy.ai/api/search-image?query=modern%20AI%20financial%20dashboard%20interface%20on%20sleek%20laptop%20screen%20with%20graphs%20and%20intelligent%20recommendations%20displayed%20soft%20ambient%20cyan%20indigo%20lighting%20clean%20minimal%20desk%20setup%20professional%20modern%20look&width=800&height=800&seq=adv2&orientation=squarish',
    reverse: true,
  },
  {
    badge: 'Sécurité Bancaire',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    title: 'Vos Données, Protégées',
    description: 'La sécurité de vos données financières est notre priorité absolue. DepenseEasy utilise un chiffrement de niveau bancaire et est certifié ISO 27001 pour garantir une protection maximale de vos informations.',
    points: [
      'Chiffrement AES-256 de toutes vos données sensibles',
      'Hébergement en France conforme au RGPD',
      'Authentification à deux facteurs obligatoire',
    ],
    img: 'https://readdy.ai/api/search-image?query=digital%20security%20shield%20concept%20with%20glowing%20green%20padlock%20on%20dark%20background%20with%20abstract%20data%20streams%20and%20protection%20network%20nodes%20modern%20cybersecurity%20visualization%20clean%20professional&width=800&height=800&seq=adv3&orientation=squarish',
    reverse: false,
  },
];

export default function AdvantagesSection() {
  return (
    <section className="bg-gray-50/50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Pourquoi Choisir DepenseEasy ?</h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">Une solution pensée pour simplifier votre vie financière au quotidien</p>
        </div>

        <div className="flex flex-col gap-24">
          {advantages.map((adv, i) => (
            <div
              key={i}
              className={`flex flex-col ${adv.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative max-w-lg mx-auto">
                  <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white hover:scale-105 hover:rotate-1 transition-all duration-300">
                    <img src={adv.img} alt={adv.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-xl" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${adv.badgeColor}`}>
                  {adv.badge}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{adv.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{adv.description}</p>
                <div className="flex flex-col gap-4">
                  {adv.points.map((point, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-check-line text-white text-xs" />
                      </div>
                      <span className="text-slate-800 font-medium leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
