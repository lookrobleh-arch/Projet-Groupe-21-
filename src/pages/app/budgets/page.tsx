import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../../../store/AppContext';
import type { BudgetCategory } from '../../../store/types';

const TIPS = [
  'Faites vos courses le mercredi — les prix sont en moyenne 8% moins chers.',
  'Réglez vos achats &gt;50€ en différé de 24h pour éviter les achats impulsifs.',
  'Activez les alertes de prélèvement pour ne jamais rater un abonnement.',
  'Automatisez votre épargne le jour de votre salaire pour ne jamais oublier.',
  'Comparez vos abonnements chaque trimestre — économie potentielle : 30€/mois.',
];

const TEMPLATES = [
  {
    name: 'Équilibré', cats: [
      { name: 'Logement', icon: 'ri-home-4-line', color: '#6366f1', pct: 30 },
      { name: 'Alimentation', icon: 'ri-shopping-basket-2-line', color: '#10b981', pct: 15 },
      { name: 'Loisirs', icon: 'ri-gamepad-line', color: '#f59e0b', pct: 10 },
      { name: 'Factures', icon: 'ri-file-list-3-line', color: '#3b82f6', pct: 15 },
      { name: 'Épargne', icon: 'ri-safe-line', color: '#8b5cf6', pct: 15 },
      { name: 'Transport', icon: 'ri-car-line', color: '#ec4899', pct: 10 },
      { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8', pct: 5 },
    ]
  },
  {
    name: 'Étudiant', cats: [
      { name: 'Logement', icon: 'ri-home-4-line', color: '#6366f1', pct: 40 },
      { name: 'Alimentation', icon: 'ri-shopping-basket-2-line', color: '#10b981', pct: 25 },
      { name: 'Transport', icon: 'ri-car-line', color: '#ec4899', pct: 15 },
      { name: 'Éducation', icon: 'ri-book-open-line', color: '#06b6d4', pct: 10 },
      { name: 'Loisirs', icon: 'ri-gamepad-line', color: '#f59e0b', pct: 7 },
      { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8', pct: 3 },
    ]
  },
  {
    name: 'Économie stricte', cats: [
      { name: 'Logement', icon: 'ri-home-4-line', color: '#6366f1', pct: 30 },
      { name: 'Alimentation', icon: 'ri-shopping-basket-2-line', color: '#10b981', pct: 10 },
      { name: 'Factures', icon: 'ri-file-list-3-line', color: '#3b82f6', pct: 10 },
      { name: 'Épargne', icon: 'ri-safe-line', color: '#8b5cf6', pct: 35 },
      { name: 'Transport', icon: 'ri-car-line', color: '#ec4899', pct: 10 },
      { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8', pct: 5 },
    ]
  },
  {
    name: 'Flexible', cats: [
      { name: 'Logement', icon: 'ri-home-4-line', color: '#6366f1', pct: 25 },
      { name: 'Alimentation', icon: 'ri-shopping-basket-2-line', color: '#10b981', pct: 15 },
      { name: 'Loisirs', icon: 'ri-gamepad-line', color: '#f59e0b', pct: 20 },
      { name: 'Factures', icon: 'ri-file-list-3-line', color: '#3b82f6', pct: 15 },
      { name: 'Épargne', icon: 'ri-safe-line', color: '#8b5cf6', pct: 10 },
      { name: 'Restaurants', icon: 'ri-restaurant-line', color: '#f97316', pct: 10 },
      { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8', pct: 5 },
    ]
  },
];

function SetupModal({ onClose, onSave }: { onClose: () => void; onSave: (total: number, cats: Omit<BudgetCategory, 'id'>[]) => void }) {
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [cats, setCats] = useState<Array<{ name: string; icon: string; color: string; pct: number }>>([]);

  useEffect(() => {
    setCats(TEMPLATES[selectedTemplate].cats.map(c => ({ ...c })));
  }, [selectedTemplate]);

  const totalPct = cats.reduce((s, c) => s + c.pct, 0);
  const totalAmount = parseFloat(total || '0');

  const handleSave = () => {
    if (!totalAmount || totalAmount <= 0) return;
    const normalized = cats.map(c => ({ name: c.name, icon: c.icon, color: c.color, pct: c.pct, limit: Math.round((c.pct / 100) * totalAmount) }));
    onSave(totalAmount, normalized);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Définir mon budget</h3>
            <p className="text-xs text-gray-400">Étape {step}/2</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"><i className="ri-close-line text-gray-400" /></button>
        </div>
        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget mensuel total (€)</label>
              <input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="Ex: 3000" min="0" className="w-full mt-1.5 border border-gray-200 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-400 text-center" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Choisir un modèle</label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t, i) => (
                  <button key={t.name} type="button" onClick={() => setSelectedTemplate(i)} className={`p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${selectedTemplate === i ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t.name}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (parseFloat(total) > 0) setStep(2); }} disabled={!total || parseFloat(total) <= 0} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Continuer →</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`text-xs font-semibold px-3 py-2 rounded-lg ${Math.abs(totalPct - 100) <= 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              Total réparti : {totalPct}% {Math.abs(totalPct - 100) <= 1 ? '✓' : `(écart: ${totalPct - 100}%)`}
            </div>
            {cats.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}><i className={`${cat.icon} text-sm`} /></div>
                <span className="text-sm font-medium text-slate-700 w-28 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <input type="range" min="0" max="100" value={cat.pct} onChange={e => { const updated = [...cats]; updated[i] = { ...cat, pct: parseInt(e.target.value) }; setCats(updated); }} className="flex-1 accent-indigo-600 cursor-pointer" />
                  <span className="text-sm font-bold text-slate-900 w-8 text-right">{cat.pct}%</span>
                </div>
                <span className="text-xs text-gray-400 w-20 text-right">{Math.round((cat.pct / 100) * totalAmount).toLocaleString('fr')}€</span>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">← Retour</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">Enregistrer le budget</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getBarColor(pct: number) {
  if (pct >= 100) return 'bg-red-500';
  if (pct >= 80) return 'bg-amber-400';
  return 'bg-emerald-500';
}

export default function BudgetsPage() {
  const { currentBudget, setBudget, getCategorySpentWithBudgetFallback, stats, currentMonth, discipline, formatCurrency } = useApp();
  const [showSetup, setShowSetup] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'discipline' | 'leaks' | 'challenges'>('overview');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = useCallback((total: number, cats: Omit<BudgetCategory, 'id'>[]) => {
    setBudget(total, cats);
    setShowSetup(false);
  }, [setBudget]);

  const budgetCategoryNames = useMemo(() => currentBudget?.categories.map(c => c.name) ?? [], [currentBudget]);

  const categoriesWithSpent = useMemo(() => {
    if (!currentBudget) return [];
    return currentBudget.categories.map(cat => ({
      ...cat,
      spent: getCategorySpentWithBudgetFallback(cat.name, budgetCategoryNames),
    }));
  }, [currentBudget, getCategorySpentWithBudgetFallback, budgetCategoryNames]);

  const totalSpent = categoriesWithSpent.reduce((s, c) => s + c.spent, 0);
  const totalBudget = currentBudget?.totalAmount ?? 0;
  const globalPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const projectedBalance = totalBudget - Math.round(totalSpent * (daysInMonth / Math.max(now.getDate(), 1)));

  const score = useMemo(() => {
    if (!currentBudget || categoriesWithSpent.length === 0) return 0;
    const withinBudget = categoriesWithSpent.filter(c => c.spent <= c.limit).length;
    const disciplineBonus = discipline.active ? -15 : 0;
    return Math.max(0, Math.min(100, Math.round(
      (withinBudget / categoriesWithSpent.length) * 60 +
      (stats.monthlySavingsRate > 0 ? Math.min(40, stats.monthlySavingsRate * 0.8) : 0) + disciplineBonus
    )));
  }, [categoriesWithSpent, currentBudget, stats.monthlySavingsRate, discipline.active]);

  const alerts = useMemo(() => {
    const list: Array<{ id: string; type: 'danger' | 'warning' | 'info'; message: string }> = [];
    if (discipline.active) {
      list.push({ id: 'discipline', type: 'danger', message: discipline.message });
    }
    categoriesWithSpent.forEach(c => {
      const pct = c.limit > 0 ? (c.spent / c.limit) * 100 : 0;
      if (pct >= 100) list.push({ id: `over_${c.id}`, type: 'danger', message: `Budget ${c.name} dépassé — ${formatCurrency(c.spent - c.limit)} de trop.` });
      else if (pct >= 80) list.push({ id: `warn_${c.id}`, type: 'warning', message: `${Math.round(pct)}% du budget ${c.name} utilisé.` });
    });
    if (stats.monthlySavingsRate > 25) list.push({ id: 'savings', type: 'info', message: `Excellent taux d'épargne ce mois : ${stats.monthlySavingsRate}% !` });
    return list.filter(a => !dismissedAlerts.has(a.id)).slice(0, 5);
  }, [categoriesWithSpent, stats.monthlySavingsRate, discipline, dismissedAlerts, formatCurrency]);

  const currentMonthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  if (!currentBudget) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-black text-slate-900">Coach Budgétaire</h2><p className="text-sm text-gray-400">Votre assistant financier intelligent</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mx-auto mb-6"><i className="ri-pie-chart-line text-4xl" /></div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Aucun budget défini</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Définissez votre budget mensuel pour activer le coach financier intelligent.</p>
          <button onClick={() => setShowSetup(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-colors mx-auto"><i className="ri-settings-3-line" />Définir mon budget pour {currentMonthLabel}</button>
        </div>
        {showSetup && <SetupModal onClose={() => setShowSetup(false)} onSave={handleSave} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-slate-900">Coach Budgétaire</h2><p className="text-sm text-gray-400">{currentMonthLabel}</p></div>
        <button onClick={() => setShowSetup(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors"><i className="ri-settings-3-line" />Modifier le budget</button>
      </div>

      {/* Smart Discipline Alert Banner */}
      {discipline.active && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 flex-shrink-0"><i className="ri-shield-flash-line text-xl" /></div>
            <div className="flex-1">
              <p className="font-black text-base mb-1">🚨 DISCIPLINE FINANCIÈRE ACTIVÉE</p>
              <p className="text-sm text-white/90 mb-2">
                <strong>{discipline.budgetPct}%</strong> du budget consommé en seulement <strong>{discipline.timePct}%</strong> du mois.
                Catégories bloquées : <strong>{discipline.lockedCategories.join(', ')}</strong>
              </p>
              <div className="bg-white/20 rounded-lg px-3 py-2 text-xs font-semibold">
                Reste à vivre : <span className="text-lg font-black">{formatCurrency(Math.max(discipline.dailyAllowance, 0))}/jour</span> — uniquement dépenses vitales autorisées.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dismissable alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${a.type === 'danger' ? 'bg-red-50 border-red-200' : a.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${a.type === 'danger' ? 'text-red-500' : a.type === 'warning' ? 'text-amber-600' : 'text-indigo-600'}`}>
                <i className={`${a.type === 'danger' ? 'ri-error-warning-line' : a.type === 'warning' ? 'ri-alert-line' : 'ri-lightbulb-line'} text-base`} />
              </div>
              <span className={`text-sm font-medium flex-1 ${a.type === 'danger' ? 'text-red-700' : a.type === 'warning' ? 'text-amber-700' : 'text-indigo-700'}`}>{a.message}</span>
              <button onClick={() => setDismissedAlerts(prev => new Set([...prev, a.id]))} className="text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0"><i className="ri-close-line text-sm" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-sm font-semibold text-slate-900">Budget global</p><p className="text-xs text-gray-400">{globalPct}% utilisé</p></div>
            <span className={`text-2xl font-black ${globalPct >= 100 ? 'text-red-500' : globalPct >= 80 ? 'text-amber-500' : 'text-indigo-600'}`}>{globalPct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className={`h-full rounded-full transition-all ${getBarColor(globalPct)}`} style={{ width: `${Math.min(globalPct, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Dépensé : <span className="font-bold text-slate-700">{formatCurrency(totalSpent)}</span></span>
            <span className="text-gray-400">Budget : <span className="font-bold text-slate-700">{formatCurrency(totalBudget)}</span></span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Score Financier</p>
          <p className={`text-5xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{score}</p>
          <p className="text-xs text-gray-400 mt-1">/100</p>
          <p className="text-xs font-semibold mt-2">{score >= 80 ? '🎉 Excellent !' : score >= 60 ? '👍 Bien' : '⚠️ À améliorer'}</p>
          {discipline.active && <p className="text-[10px] text-red-500 font-semibold mt-1">-15pts Discipline</p>}
        </div>

        <div className={`rounded-xl border p-5 flex flex-col justify-center ${projectedBalance >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs font-semibold text-slate-700 mb-1">Prévision fin de mois</p>
          <p className={`text-2xl font-black ${projectedBalance >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {projectedBalance >= 0 ? '+' : ''}{formatCurrency(projectedBalance)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{projectedBalance >= 0 ? 'Vous terminerez positif !' : 'Risque de dépassement'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{daysLeft} jours restants</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {[{ key: 'overview', l: 'Catégories' }, { key: 'discipline', l: discipline.active ? '🚨 Discipline' : 'Discipline' }, { key: 'leaks', l: 'Fuites' }, { key: 'challenges', l: 'Défis' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all ${activeTab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categoriesWithSpent.map(cat => {
            const pct = cat.limit > 0 ? Math.min(Math.round((cat.spent / cat.limit) * 100), 150) : 0;
            const over = cat.spent > cat.limit;
            const isLocked = discipline.active && discipline.lockedCategories.some(l => cat.name.toLowerCase().includes(l.toLowerCase()));
            return (
              <div key={cat.id} className={`bg-white rounded-xl border p-5 ${isLocked ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}><i className={`${cat.icon} text-lg`} /></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
                      <p className="text-xs text-gray-400">{cat.pct}% du budget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isLocked && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full whitespace-nowrap"><i className="ri-lock-line mr-0.5" />Bloqué</span>}
                    {over && !isLocked && <span className="text-[10px] font-bold bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">Dépassé !</span>}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-gray-400">Utilisé</span>
                    <span className={`font-semibold ${over ? 'text-red-500' : pct >= 80 ? 'text-amber-600' : 'text-emerald-600'}`}>{Math.min(pct, 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${getBarColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900">{formatCurrency(cat.spent)}</span>
                  <span className="text-xs text-gray-400">/ {formatCurrency(cat.limit)}</span>
                </div>
                <div className={`mt-1 text-xs font-semibold ${over ? 'text-red-500' : 'text-emerald-600'}`}>
                  {over ? `${formatCurrency(cat.spent - cat.limit)} au-delà` : `${formatCurrency(cat.limit - cat.spent)} restants`}
                </div>
              </div>
            );
          })}
          <div className="md:col-span-2 xl:col-span-3 bg-gradient-to-r from-indigo-50 via-violet-50 to-cyan-50 rounded-xl border border-indigo-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 flex-shrink-0"><i className="ri-lightbulb-line text-lg" /></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">Conseil du jour</p>
              <p className="text-sm text-indigo-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: TIPS[tipIndex] }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discipline' && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-5 ${discipline.active ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${discipline.active ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <i className={`${discipline.active ? 'ri-shield-flash-line' : 'ri-shield-check-line'} text-2xl`} />
              </div>
              <div>
                <p className="font-black text-slate-900">{discipline.active ? 'DISCIPLINE ACTIVÉE' : 'Finances sous contrôle'}</p>
                <p className="text-xs text-gray-500">{discipline.active ? 'Restrictions en vigueur' : 'Aucune restriction active'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Temps écoulé du mois</p>
                <p className="text-2xl font-black text-slate-900">{discipline.timePct}%</p>
                <div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${discipline.timePct}%` }} /></div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Budget consommé</p>
                <p className={`text-2xl font-black ${discipline.budgetPct > discipline.timePct * 1.5 ? 'text-red-500' : 'text-emerald-600'}`}>{discipline.budgetPct}%</p>
                <div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className={`h-full rounded-full ${getBarColor(discipline.budgetPct)}`} style={{ width: `${Math.min(discipline.budgetPct, 100)}%` }} /></div>
              </div>
            </div>
            {discipline.active && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-red-700">Catégories verrouillées :</p>
                <div className="flex flex-wrap gap-2">
                  {discipline.lockedCategories.map(cat => (
                    <span key={cat} className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                      <i className="ri-lock-line" />{cat}
                    </span>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-3 mt-2">
                  <p className="text-xs text-gray-500">Reste à vivre quotidien (besoins vitaux uniquement)</p>
                  <p className="text-xl font-black text-red-600">{formatCurrency(Math.max(discipline.dailyAllowance, 0))}/jour</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="font-semibold text-slate-900 mb-3">Règle de déclenchement</p>
            <p className="text-sm text-gray-500">La discipline s&apos;active automatiquement si :</p>
            <p className="text-sm font-semibold text-slate-900 mt-2 bg-gray-50 rounded-lg px-3 py-2">Budget consommé &gt; Temps écoulé × 1,5</p>
            <p className="text-xs text-gray-400 mt-2">Exemple : si vous êtes au 10ème jour (33% du mois) et avez dépensé plus de 50% du budget → discipline activée.</p>
          </div>
        </div>
      )}

      {activeTab === 'leaks' && (
        <div className="space-y-4">
          {categoriesWithSpent.filter(c => c.spent > 0).length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400"><i className="ri-leak-line text-3xl mb-2" /><p className="text-sm">Ajoutez des transactions pour détecter les fuites.</p></div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0"><i className="ri-leak-line text-lg" /></div>
                <div><p className="font-bold text-amber-800 text-sm">Analyse des dépenses — ce mois</p><p className="text-xs text-amber-600 mt-0.5">Top dépenses triées par montant.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoriesWithSpent.filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent).slice(0, 4).map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: `${c.color}15`, color: c.color }}><i className={`${c.icon} text-lg`} /></div>
                      <div><p className="font-bold text-slate-900 text-sm">{c.name}</p><p className="text-xl font-black text-slate-900">{formatCurrency(c.spent)}</p></div>
                    </div>
                    {c.spent > c.limit && (
                      <div className="p-2 bg-red-50 rounded-lg text-xs text-red-600">
                        Réduire de 20% → économie <span className="font-semibold">+{formatCurrency(c.spent * 0.2)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Réduire les dépenses de 10%', desc: `Objectif : max ${formatCurrency(totalBudget * 0.9)} ce mois`, progress: totalBudget > 0 ? Math.max(0, Math.min(100, 100 - globalPct)) : 0 },
              { title: 'Respecter tous les budgets', desc: 'Aucune catégorie ne dépasse sa limite', progress: categoriesWithSpent.length > 0 ? Math.round((categoriesWithSpent.filter(c => c.spent <= c.limit).length / categoriesWithSpent.length) * 100) : 0 },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0"><i className="ri-trophy-line text-lg" /></div>
                  <div><p className="font-bold text-slate-900 text-sm">{c.title}</p><p className="text-xs text-gray-400">{c.desc}</p></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{c.progress}% accompli</span>
                  <span className="font-semibold text-indigo-600">+100 pts</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 flex-shrink-0"><i className="ri-target-line text-2xl" /></div>
              <div>
                <p className="font-bold text-lg">Objectif automatique du mois</p>
                <p className="text-white/70 text-sm mt-1">{totalBudget > totalSpent ? `Économiser encore ${formatCurrency(totalBudget - totalSpent)} avant la fin du mois.` : 'Réduire les dépenses pour revenir dans le budget.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSetup && <SetupModal onClose={() => setShowSetup(false)} onSave={handleSave} />}
    </div>
  );
}
