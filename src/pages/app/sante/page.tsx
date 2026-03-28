import { useMemo } from 'react';
import { useApp } from '../../../store/AppContext';

function ScoreGauge({ score }: { score: number }) {
  const radius = 56;
  const circumference = radius * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
        <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="70" y="65" textAnchor="middle" fontSize="24" fontWeight="900" fill="#1e293b">{score}</text>
        <text x="70" y="78" textAnchor="middle" fontSize="9" fill="#94a3b8">/100</text>
      </svg>
      <span className={`text-sm font-bold ${score >= 70 ? 'text-emerald-600' : score >= 45 ? 'text-amber-600' : 'text-red-500'}`}>
        {score >= 70 ? 'Bon' : score >= 45 ? 'Moyen' : 'À améliorer'}
      </span>
    </div>
  );
}

export default function SantePage() {
  const { transactions, accounts, goals, currentBudget, getCategorySpent, subscriptions, currentMonth, totalBalance } = useApp();

  const hasData = transactions.length > 0 || accounts.length > 0;

  const { score, criteria, recommendations } = useMemo(() => {
    const monthlyIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.amount, 0);
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

    let budgetRespect = 100;
    if (currentBudget && currentBudget.categories.length > 0) {
      const overBudget = currentBudget.categories.filter(c => {
        const spent = getCategorySpent(c.name);
        return c.limit > 0 && spent > c.limit;
      });
      budgetRespect = Math.max(0, 100 - overBudget.length * 20);
    }

    const diversificationScore = Math.min(accounts.length * 20, 100);

    const goalProgress = goals.length > 0
      ? goals.reduce((s, g) => s + (g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0), 0) / goals.length
      : 0;

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const monthlySubCost = activeSubs.reduce((s, sub) => s + (sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount), 0);
    const subBurden = monthlyIncome > 0 ? (monthlySubCost / monthlyIncome) * 100 : 0;
    const subScore = subBurden > 30 ? 40 : subBurden > 15 ? 70 : 100;

    const savingsScore = Math.min(savingsRate * 2.5, 100);

    const overallScore = hasData
      ? Math.round((savingsScore * 0.3 + budgetRespect * 0.25 + diversificationScore * 0.2 + goalProgress * 0.15 + subScore * 0.1))
      : 0;

    const criteriaList = [
      { label: 'Taux d\'épargne', score: Math.round(savingsScore), icon: 'ri-safe-line', color: '#10b981', desc: monthlyIncome > 0 ? `${Math.round(savingsRate)}% d'épargne ce mois` : 'Aucun revenu ce mois' },
      { label: 'Respect du budget', score: Math.round(budgetRespect), icon: 'ri-pie-chart-2-line', color: '#f59e0b', desc: currentBudget ? `Budget ${budgetRespect === 100 ? 'respecté' : 'partiellement dépassé'}` : 'Aucun budget défini' },
      { label: 'Diversification', score: Math.round(diversificationScore), icon: 'ri-bank-line', color: '#6366f1', desc: `${accounts.length} compte${accounts.length > 1 ? 's' : ''} actif${accounts.length > 1 ? 's' : ''}` },
      { label: 'Objectifs', score: Math.round(goalProgress), icon: 'ri-trophy-line', color: '#06b6d4', desc: goals.length > 0 ? `${goals.length} objectif${goals.length > 1 ? 's' : ''} en cours` : 'Aucun objectif défini' },
      { label: 'Abonnements', score: Math.round(subScore), icon: 'ri-repeat-line', color: '#8b5cf6', desc: activeSubs.length > 0 ? `${monthlySubCost.toFixed(2)}€/mois d'abonnements` : 'Aucun abonnement actif' },
      { label: 'Solde global', score: totalBalance > 0 ? Math.min(100, Math.round(totalBalance / 50)) : 0, icon: 'ri-wallet-3-line', color: '#ec4899', desc: `Solde total : ${totalBalance.toLocaleString('fr', { minimumFractionDigits: 2 })}€` },
    ];

    const recs: { priority: string; icon: string; color: string; title: string; desc: string }[] = [];
    if (savingsRate < 10 && monthlyIncome > 0) recs.push({ priority: 'high', icon: 'ri-alert-line', color: 'bg-red-50 text-red-500 border-red-100', title: 'Taux d\'épargne insuffisant', desc: `Vous épargnez ${Math.round(savingsRate)}% de vos revenus. Visez au moins 20%.` });
    if (!currentBudget) recs.push({ priority: 'medium', icon: 'ri-pie-chart-2-line', color: 'bg-amber-50 text-amber-600 border-amber-100', title: 'Définissez un budget mensuel', desc: 'Un budget vous permettra de mieux contrôler vos dépenses.' });
    if (goals.length === 0) recs.push({ priority: 'low', icon: 'ri-trophy-line', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Créez un objectif d\'épargne', desc: 'Les objectifs vous motivent et structurent votre épargne.' });
    if (accounts.length < 2) recs.push({ priority: 'low', icon: 'ri-bank-line', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', title: 'Diversifiez vos comptes', desc: 'Ajoutez un compte épargne pour séparer vos finances.' });

    return { score: overallScore, criteria: criteriaList, recommendations: recs };
  }, [transactions, accounts, goals, currentBudget, getCategorySpent, subscriptions, currentMonth, totalBalance, hasData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Santé Financière</h2>
        <p className="text-sm text-gray-400">Score calculé automatiquement depuis vos données réelles</p>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-heart-pulse-line text-3xl" /></div>
          <p className="font-semibold text-slate-700 mb-2">Aucune donnée disponible</p>
          <p className="text-sm text-gray-400">Ajoutez des transactions pour calculer votre score de santé financière.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold text-gray-500 mb-2">Score global</p>
              <ScoreGauge score={score} />
              <p className="text-xs text-gray-300 mt-2">Calculé en temps réel</p>
              {score > 0 && (
                <div className="flex items-center gap-1 text-xs text-indigo-500 font-medium">
                  <i className="ri-robot-2-line" />Basé sur {transactions.length} transactions
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
              <p className="font-semibold text-slate-900 mb-4">Détail par critère</p>
              <div className="grid grid-cols-2 gap-4">
                {criteria.map(c => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ color: c.color }}>
                          <i className={`${c.icon} text-sm`} />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{c.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{c.score}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.score}%`, backgroundColor: c.color }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="font-semibold text-slate-900 mb-4">Recommandations prioritaires</p>
              <div className="space-y-3">
                {recommendations.map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${r.color}`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${r.color}`}><i className={`${r.icon} text-sm`} /></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${r.priority === 'high' ? 'bg-red-100 text-red-600' : r.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {r.priority === 'high' ? 'Urgent' : r.priority === 'medium' ? 'Important' : 'Conseil'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
