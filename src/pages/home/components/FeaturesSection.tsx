import { useState } from 'react';
import FeatureModal from './FeatureModal';

const features = [
  {
    icon: 'ri-scan-2-line',
    iconBg: 'from-indigo-500 to-violet-600',
    pastelBg: 'bg-indigo-50',
    gradient: 'from-indigo-500 to-violet-600',
    title: 'Scan OCR Intelligent',
    badge: 'IA',
    badgeColor: 'from-indigo-500 to-violet-600',
    description: 'Photographiez vos reçus et laissez notre IA extraire et catégoriser chaque dépense automatiquement.',
    keyFigure: '97.3%',
    keyFigureLabel: 'de précision de reconnaissance',
    intro: 'Notre moteur OCR de pointe reconnaît plus de 50 types de documents dans 12 langues, avec une précision de reconnaissance inégalée dans l\'industrie.',
    points: [
      { icon: 'ri-camera-line', color: 'from-indigo-400 to-violet-500', title: 'Capture instantanée', detail: 'Photographiez n\'importe quel reçu, facture ou ticket de caisse en une seconde' },
      { icon: 'ri-translate-2', color: 'from-cyan-400 to-sky-500', title: 'Multi-langues', detail: 'Reconnaissance en 12 langues dont le français, l\'anglais, l\'espagnol et l\'allemand' },
      { icon: 'ri-folder-line', color: 'from-emerald-400 to-teal-500', title: 'Catégorisation auto', detail: 'Chaque dépense est automatiquement associée à la bonne catégorie budgétaire' },
      { icon: 'ri-archive-line', color: 'from-amber-400 to-orange-500', title: 'Archivage cloud', detail: 'Tous vos documents sont sauvegardés et accessibles à tout moment en ligne' },
    ],
  },
  {
    icon: 'ri-pie-chart-2-line',
    iconBg: 'from-cyan-500 to-sky-600',
    pastelBg: 'bg-cyan-50',
    gradient: 'from-cyan-500 to-sky-600',
    title: 'Budgets Dynamiques',
    badge: 'Pro',
    badgeColor: 'from-cyan-500 to-sky-600',
    description: 'Créez des budgets intelligents qui s\'adaptent automatiquement à vos habitudes de dépense mensuelles.',
    keyFigure: '+34%',
    keyFigureLabel: 'd\'économies moyennes en 3 mois',
    intro: 'Les budgets dynamiques de DepenseEasy s\'ajustent en temps réel selon vos dépenses et vous alertent avant tout dépassement pour garder le contrôle total.',
    points: [
      { icon: 'ri-settings-line', color: 'from-cyan-400 to-sky-500', title: 'Budgets adaptatifs', detail: 'Ajustement automatique basé sur vos habitudes des 3 derniers mois' },
      { icon: 'ri-notification-line', color: 'from-indigo-400 to-violet-500', title: 'Alertes proactives', detail: 'Recevez une notification avant d\'atteindre 80% de votre budget' },
      { icon: 'ri-bar-chart-line', color: 'from-emerald-400 to-teal-500', title: 'Rapports visuels', detail: 'Graphiques détaillés de votre consommation par catégorie et par période' },
      { icon: 'ri-refresh-line', color: 'from-amber-400 to-yellow-500', title: 'Report automatique', detail: 'Les économies non dépensées sont reportées sur le mois suivant' },
    ],
  },
  {
    icon: 'ri-robot-2-line',
    iconBg: 'from-violet-500 to-purple-600',
    pastelBg: 'bg-violet-50',
    gradient: 'from-violet-500 to-purple-600',
    title: 'Assistant IA Financier',
    badge: 'Premium',
    badgeColor: 'from-violet-500 to-purple-600',
    description: 'Votre conseiller financier personnel disponible 24/7, qui comprend votre situation et vous guide vers vos objectifs.',
    keyFigure: '24/7',
    keyFigureLabel: 'disponibilité de l\'assistant',
    intro: 'Posez toutes vos questions financières en langage naturel et obtenez des réponses personnalisées basées sur l\'analyse complète de votre profil financier.',
    points: [
      { icon: 'ri-chat-4-line', color: 'from-violet-400 to-purple-500', title: 'Dialogue naturel', detail: 'Posez vos questions en français et obtenez des réponses claires et concrètes' },
      { icon: 'ri-lightbulb-line', color: 'from-amber-400 to-orange-500', title: 'Conseils personnalisés', detail: 'Recommandations basées sur votre historique et vos objectifs personnels' },
      { icon: 'ri-user-smile-line', color: 'from-cyan-400 to-sky-500', title: 'Profil adaptatif', detail: 'L\'IA apprend de vos habitudes pour des conseils toujours plus pertinents' },
      { icon: 'ri-shield-line', color: 'from-emerald-400 to-teal-500', title: 'Confidentialité garantie', detail: 'Vos données financières ne quittent jamais nos serveurs sécurisés en France' },
    ],
  },
  {
    icon: 'ri-line-chart-line',
    iconBg: 'from-emerald-500 to-teal-600',
    pastelBg: 'bg-emerald-50',
    gradient: 'from-emerald-500 to-teal-600',
    title: 'Prévisions Cashflow',
    badge: 'Pro',
    badgeColor: 'from-emerald-500 to-teal-600',
    description: 'Anticipez votre trésorerie sur les 3 prochains mois grâce à l\'analyse prédictive basée sur vos données historiques.',
    keyFigure: '3 mois',
    keyFigureLabel: 'de prévision en avance',
    intro: 'Nos algorithmes de prévision analysent vos revenus, dépenses récurrentes et tendances pour vous offrir une visibilité financière inégalée sur le futur.',
    points: [
      { icon: 'ri-calendar-line', color: 'from-emerald-400 to-teal-500', title: 'Planning trimestriel', detail: 'Vision complète de votre cashflow sur les 90 prochains jours' },
      { icon: 'ri-repeat-line', color: 'from-indigo-400 to-violet-500', title: 'Détection récurrences', detail: 'Identification automatique de tous vos abonnements et paiements réguliers' },
      { icon: 'ri-alarm-line', color: 'from-rose-400 to-pink-500', title: 'Alerte cashflow négatif', detail: 'Prévenu dès qu\'un déficit est anticipé pour éviter les découverts' },
      { icon: 'ri-download-cloud-line', color: 'from-cyan-400 to-sky-500', title: 'Export PDF/Excel', detail: 'Exportez vos prévisions pour votre comptable ou votre banque' },
    ],
  },
  {
    icon: 'ri-alarm-warning-line',
    iconBg: 'from-red-500 to-orange-600',
    pastelBg: 'bg-red-50',
    gradient: 'from-red-500 to-orange-600',
    title: 'Détection d\'Anomalies',
    badge: 'IA',
    badgeColor: 'from-red-500 to-orange-600',
    description: 'Un système de surveillance intelligent qui détecte toute dépense inhabituelle ou suspecte en temps réel.',
    keyFigure: '99.2%',
    keyFigureLabel: 'des fraudes détectées',
    intro: 'Notre IA surveille en permanence vos transactions et vous alerte instantanément en cas de comportement financier anormal ou potentiellement frauduleux.',
    points: [
      { icon: 'ri-search-eye-line', color: 'from-red-400 to-orange-500', title: 'Surveillance temps réel', detail: 'Analyse de chaque transaction dans les secondes suivant son enregistrement' },
      { icon: 'ri-spam-2-line', color: 'from-violet-400 to-purple-500', title: 'Anti-fraude avancé', detail: 'Détection des doublons de facturation et abonnements oubliés' },
      { icon: 'ri-pulse-line', color: 'from-amber-400 to-yellow-500', title: 'Score d\'anomalie', detail: 'Chaque dépense reçoit un score de confiance pour identifier les risques' },
      { icon: 'ri-phone-line', color: 'from-emerald-400 to-teal-500', title: 'Alerte multi-canaux', detail: 'Notifications push, email et SMS pour les alertes critiques' },
    ],
  },
  {
    icon: 'ri-target-line',
    iconBg: 'from-amber-500 to-yellow-600',
    pastelBg: 'bg-amber-50',
    gradient: 'from-amber-500 to-yellow-600',
    title: 'Objectifs d\'Épargne',
    badge: 'Free',
    badgeColor: 'from-amber-500 to-yellow-600',
    description: 'Définissez vos rêves financiers et laissez DepenseEasy créer un plan d\'épargne réaliste pour les atteindre.',
    keyFigure: '87%',
    keyFigureLabel: 'des objectifs atteints dans les délais',
    intro: 'Que ce soit pour un voyage, l\'achat d\'un bien immobilier ou la constitution d\'une épargne de sécurité, notre outil vous accompagne étape par étape vers la réussite.',
    points: [
      { icon: 'ri-flag-line', color: 'from-amber-400 to-yellow-500', title: 'Objectifs illimités', detail: 'Créez autant d\'objectifs que vous souhaitez avec dates cibles et montants' },
      { icon: 'ri-magic-line', color: 'from-violet-400 to-purple-500', title: 'Plan auto-optimisé', detail: 'L\'IA calcule le montant mensuel optimal à épargner selon vos revenus' },
      { icon: 'ri-trophy-line', color: 'from-rose-400 to-pink-500', title: 'Gamification', detail: 'Badges et récompenses pour vous motiver à atteindre vos objectifs' },
      { icon: 'ri-group-line', color: 'from-cyan-400 to-sky-500', title: 'Objectifs partagés', detail: 'Créez des objectifs communs avec votre partenaire ou votre famille' },
    ],
  },
];

export default function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <>
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-5 py-2.5 rounded-full mb-5">
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Intelligence Financière Intégrée</h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">Six outils puissants pour prendre le contrôle total de votre vie financière</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                onClick={() => setSelectedFeature(f)}
                className="group border border-gray-200 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl ${f.pastelBg} flex items-center justify-center mb-6`}>
                  <i className={`${f.icon} bg-gradient-to-br ${f.iconBg} bg-clip-text text-transparent text-2xl`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                  <span className={`flex-shrink-0 bg-gradient-to-r ${f.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                    {f.badge}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{f.description}</p>
                <span className="text-indigo-600 text-sm font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                  En savoir plus <i className="ri-arrow-right-line" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedFeature && (
        <FeatureModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </>
  );
}
