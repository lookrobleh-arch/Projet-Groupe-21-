import { useState, useEffect } from 'react';

export type Template = 'equilibre' | 'etudiant' | 'strict' | 'flexible';

export type CategoryBudget = {
  id: string;
  name: string;
  icon: string;
  color: string;
  pct: number;
  limit: number;
  spent: number;
};

export const TEMPLATES: Record<Template, { label: string; icon: string; desc: string; dist: Record<string, number> }> = {
  equilibre: {
    label: 'Budget équilibré',
    icon: 'ri-scales-3-line',
    desc: 'Répartition classique 50/30/20 recommandée',
    dist: { Logement: 20, Alimentation: 10, Loisirs: 15, Factures: 20, Épargne: 10, Éducation: 20, Autres: 5 },
  },
  etudiant: {
    label: 'Budget étudiant',
    icon: 'ri-graduation-cap-line',
    desc: 'Priorité alimentation et transport, épargne réduite',
    dist: { Logement: 35, Alimentation: 20, Loisirs: 10, Factures: 15, Épargne: 5, Éducation: 10, Autres: 5 },
  },
  strict: {
    label: 'Budget strict',
    icon: 'ri-lock-line',
    desc: 'Maximiser l\'épargne, réduire les loisirs',
    dist: { Logement: 25, Alimentation: 12, Loisirs: 5, Factures: 18, Épargne: 25, Éducation: 10, Autres: 5 },
  },
  flexible: {
    label: 'Budget flexible',
    icon: 'ri-heart-line',
    desc: 'Confort de vie prioritaire, épargne modérée',
    dist: { Logement: 22, Alimentation: 12, Loisirs: 20, Factures: 18, Épargne: 12, Éducation: 11, Autres: 5 },
  },
};

const ICONS: Record<string, string> = {
  Logement: 'ri-home-4-line',
  Alimentation: 'ri-shopping-basket-2-line',
  Loisirs: 'ri-gamepad-line',
  Factures: 'ri-file-list-3-line',
  Épargne: 'ri-safe-line',
  Éducation: 'ri-book-open-line',
  Autres: 'ri-more-line',
};

const COLORS: Record<string, string> = {
  Logement: '#6366f1',
  Alimentation: '#10b981',
  Loisirs: '#f59e0b',
  Factures: '#3b82f6',
  Épargne: '#8b5cf6',
  Éducation: '#06b6d4',
  Autres: '#94a3b8',
};

interface Props {
  totalBudget: number;
  onSave: (cats: CategoryBudget[], total: number) => void;
  onClose: () => void;
  initialCats?: CategoryBudget[];
}

export default function BudgetSetupModal({ totalBudget: initTotal, onSave, onClose, initialCats }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [total, setTotal] = useState(initTotal || 3500);
  const [template, setTemplate] = useState<Template>('equilibre');
  const [distribution, setDistribution] = useState<Record<string, number>>(
    initialCats
      ? Object.fromEntries(initialCats.map(c => [c.name, c.pct]))
      : TEMPLATES.equilibre.dist
  );

  const sumPct = Object.values(distribution).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (step === 2) {
      setDistribution(TEMPLATES[template].dist);
    }
  }, [template, step]);

  const updatePct = (key: string, val: number) => {
    setDistribution(d => ({ ...d, [key]: Math.max(0, Math.min(100, val)) }));
  };

  const handleSave = () => {
    const cats: CategoryBudget[] = Object.entries(distribution).map(([name, pct]) => ({
      id: name.toLowerCase(),
      name,
      icon: ICONS[name] || 'ri-wallet-line',
      color: COLORS[name] || '#6366f1',
      pct,
      limit: Math.round((pct / 100) * total),
      spent: initialCats?.find(c => c.name === name)?.spent ?? Math.round(Math.random() * (pct / 100) * total * 0.9),
    }));
    onSave(cats, total);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{step === 1 ? 'Définir mon budget' : 'Répartition du budget'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Étape {step}/2</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer text-gray-400"><i className="ri-close-line" /></button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-8">
              {/* Total budget input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Quel est votre budget mensuel total ?</label>
                <div className="relative">
                  <input
                    type="number"
                    value={total}
                    onChange={e => setTotal(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-500 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">€</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Entrez le montant total que vous souhaitez gérer ce mois</p>
              </div>

              {/* Templates */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Choisissez un modèle de répartition</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(TEMPLATES) as Template[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${template === t ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${template === t ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        <i className={`${TEMPLATES[t].icon} text-base`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${template === t ? 'text-indigo-900' : 'text-slate-700'}`}>{TEMPLATES[t].label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{TEMPLATES[t].desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className={`text-right text-sm font-semibold mb-2 ${Math.abs(sumPct - 100) > 0.5 ? 'text-red-500' : 'text-emerald-600'}`}>
                Total: {sumPct.toFixed(0)}% {Math.abs(sumPct - 100) > 0.5 ? '⚠️ Ajustez pour atteindre 100%' : '✓'}
              </div>
              {Object.entries(distribution).map(([name, pct]) => {
                const limit = Math.round((pct / 100) * total);
                return (
                  <div key={name} className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${COLORS[name]}15`, color: COLORS[name] }}>
                      <i className={`${ICONS[name] || 'ri-wallet-line'} text-base`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-700">{name}</span>
                        <span className="text-sm font-black text-slate-900">{limit.toLocaleString('fr')}€</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        value={pct}
                        onChange={e => updatePct(name, Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                    <div className="w-16 flex-shrink-0">
                      <input
                        type="number"
                        value={pct}
                        onChange={e => updatePct(name, Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <span className="text-gray-400 text-sm flex-shrink-0">%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              ← Retour
            </button>
          )}
          {step === 1 ? (
            <button onClick={() => setStep(2)} disabled={!total || total <= 0} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-50 transition-colors">
              Suivant : Répartition →
            </button>
          ) : (
            <button onClick={handleSave} disabled={Math.abs(sumPct - 100) > 5} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-50 transition-all">
              Enregistrer mon budget
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
