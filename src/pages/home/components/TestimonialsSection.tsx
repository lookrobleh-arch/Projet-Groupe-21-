import { useState, useRef, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Freelance Designer',
    quote: 'DepenseEasy a complètement transformé ma gestion financière. En tant que freelance, je jonglais avec des revenus variables. Maintenant, l\'IA anticipe mes besoins et je n\'ai plus jamais de mauvaises surprises en fin de mois. Un outil indispensable !',
    initials: 'SM',
  },
  {
    name: 'Thomas Dubois',
    role: 'Ingénieur Software',
    quote: 'La fonctionnalité OCR m\'a sauvé des heures de saisie manuelle chaque mois. En moins de 2 minutes, toutes mes factures sont catégorisées. L\'interface est magnifique et les prévisions de cashflow sont d\'une précision remarquable.',
    initials: 'TD',
  },
  {
    name: 'Emma Laurent',
    role: 'Professeure',
    quote: 'Grâce aux objectifs d\'épargne de DepenseEasy, j\'ai réussi à économiser 8 000€ en 10 mois pour mon voyage au Japon. L\'assistant IA m\'a aidée à identifier les dépenses superflues sans prise de tête. Je recommande vivement !',
    initials: 'EL',
  },
  {
    name: 'Lucas Bernard',
    role: 'Chef de projet',
    quote: 'La détection d\'anomalies m\'a permis de repérer un abonnement fantôme que j\'avais oublié depuis 18 mois. En une semaine, j\'ai récupéré 180€. La sécurité et la transparence de l\'outil sont vraiment rassurantes au quotidien.',
    initials: 'LB',
  },
  {
    name: 'Julie Leroy',
    role: 'Avocate',
    quote: 'Avec DepenseEasy, j\'ai enfin une vision claire de mes finances personnelles et professionnelles. Les rapports sont clairs, les graphiques parlants, et le support client est réactif. C\'est la référence en matière de gestion financière intelligente.',
    initials: 'JL',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[active] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [active]);

  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Ils Nous Font Confiance</h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">Plus de 15 000 utilisateurs nous font confiance chaque jour pour gérer leurs finances</p>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar px-2" style={{ scrollbarWidth: 'none' }}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-[340px] bg-slate-900 rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                i === active
                  ? 'border-indigo-500 scale-105 shadow-xl shadow-indigo-500/20'
                  : 'border-slate-800 hover:border-slate-600 hover:scale-102'
              }`}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <i key={j} className="ri-star-fill text-amber-400 text-base" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-sm line-clamp-4">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">{t.initials}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                i === active ? 'w-8 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
