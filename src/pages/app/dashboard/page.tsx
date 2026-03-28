import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppContext';
import { transactionStore } from '../../../store/dataStore';

function KpiCard({ title, value, sub, icon, iconBg, trend, trendVal, empty }: {
  title: string; value: string; sub: string; icon: string; iconBg: string;
  trend?: 'up' | 'down'; trendVal?: string; empty?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconBg}`}>
          <i className={`${icon} text-lg`} />
        </div>
        {trendVal && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            <i className={`${trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs`} />
            {trendVal}
          </span>
        )}
      </div>
      {empty ? (
        <p className="text-sm text-gray-300 font-medium">Aucune donnée</p>
      ) : (
        <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      )}
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xs text-gray-300 mt-0.5">{sub}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc, action, onAction }: {
  icon: string; title: string; desc: string; action?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mb-4">
        <i className={`${icon} text-2xl`} />
      </div>
      <p className="font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400 mb-4">{desc}</p>
      {action && onAction && (
        <button onClick={onAction} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />{action}
        </button>
      )}
    </div>
  );
}

function BarChart({ data }: { data: Array<{ month: string; income: number; expense: number }> }) {
  const max = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const hasData = data.some(d => d.income > 0 || d.expense > 0);
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
        <i className="ri-bar-chart-2-line text-3xl" />
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end" style={{ height: '96px' }}>
            <div className="flex-1 bg-indigo-100 rounded-sm transition-all" style={{ height: `${(d.income / max) * 96}px` }} />
            <div className="flex-1 bg-red-100 rounded-sm transition-all" style={{ height: `${(d.expense / max) * 96}px` }} />
          </div>
          <span className="text-[10px] text-gray-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Alimentation: '#10b981', Logement: '#6366f1', Transport: '#f59e0b', Loisirs: '#ec4899',
  Abonnements: '#8b5cf6', Factures: '#3b82f6', Santé: '#ef4444', Restaurants: '#f97316',
  Sport: '#14b8a6', Éducation: '#06b6d4', Autres: '#94a3b8',
};

function DonutChart({ categoryMap }: { categoryMap: Record<string, number> }) {
  const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-gray-300 text-sm">
        <i className="ri-pie-chart-2-line text-3xl" />
      </div>
    );
  }
  let cumulative = 0;
  const slices = entries.map(([cat, amount]) => {
    const pct = amount / total;
    const start = cumulative;
    cumulative += pct;
    return { cat, amount, start, pct, color: CATEGORY_COLORS[cat] ?? '#94a3b8' };
  });
  const polar = (cx: number, cy: number, r: number, angle: number) => {
    const a = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100" className="flex-shrink-0">
        {slices.map(s => {
          const startAngle = s.start * 360;
          const endAngle = (s.start + s.pct) * 360;
          const st = polar(50, 50, 40, startAngle);
          const en = polar(50, 50, 40, endAngle);
          const largeArc = s.pct > 0.5 ? 1 : 0;
          const is = polar(50, 50, 26, endAngle);
          const ie = polar(50, 50, 26, startAngle);
          const d = `M ${st.x} ${st.y} A 40 40 0 ${largeArc} 1 ${en.x} ${en.y} L ${is.x} ${is.y} A 26 26 0 ${largeArc} 0 ${ie.x} ${ie.y} Z`;
          return <path key={s.cat} d={d} fill={s.color} />;
        })}
        <text x="50" y="48" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="bold">{total.toLocaleString('fr')}€</text>
        <text x="50" y="57" textAnchor="middle" fontSize="6" fill="#94a3b8">total</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {slices.map(s => (
          <div key={s.cat} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-500 truncate">{s.cat}</span>
            <span className="text-xs font-semibold text-slate-700 ml-auto pl-2">{s.amount.toLocaleString('fr')}€</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, transactions, currentBudget, stats, currentMonth, accounts, discipline, formatCurrency } = useApp();

  const monthlyData = useMemo(() => transactionStore.getMonthlyData(transactions, 6), [transactions]);
  const categoryExpenses = useMemo(() => transactionStore.computeCategoryExpenses(transactions, currentMonth), [transactions, currentMonth]);
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);
  const hasTransactions = transactions.length > 0;
  const hasMonthlyData = stats.monthlyIncome > 0 || stats.monthlyExpense > 0;
  const firstName = currentUser?.name.split(' ')[0] ?? 'Utilisateur';

  const budgetCategories = useMemo(() => {
    if (!currentBudget) return [];
    return currentBudget.categories.map(cat => {
      const spent = (categoryExpenses[cat.name] ?? 0);
      return { ...cat, spent };
    });
  }, [currentBudget, categoryExpenses]);

  const insights = useMemo(() => {
    const list: Array<{ icon: string; text: string; color: string }> = [];
    if (stats.monthlySavingsRate > 20) list.push({ icon: 'ri-trending-up-line', text: `Excellent ! Votre taux d'épargne est de ${stats.monthlySavingsRate}% ce mois.`, color: 'text-emerald-600' });
    if (stats.monthlyExpense > stats.monthlyIncome && stats.monthlyIncome > 0) list.push({ icon: 'ri-alert-line', text: 'Attention : vos dépenses dépassent vos revenus ce mois.', color: 'text-red-500' });
    if (budgetCategories.some(c => c.spent > c.limit)) list.push({ icon: 'ri-error-warning-line', text: 'Certains budgets ont été dépassés ce mois.', color: 'text-amber-600' });
    if (list.length === 0 && hasTransactions) list.push({ icon: 'ri-robot-2-line', text: 'Ajoutez plus de transactions pour obtenir des recommandations personnalisées.', color: 'text-indigo-600' });
    return list;
  }, [stats, budgetCategories, hasTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Bonjour, {firstName} 👋</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} • Aperçu de vos finances
          </p>
        </div>
        <button onClick={() => navigate('/app/transactions')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
          <i className="ri-add-line" />Ajouter
        </button>
      </div>

      {/* Smart Discipline Banner */}
      {discipline.active && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-xl p-4 text-white flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 flex-shrink-0"><i className="ri-shield-flash-line text-xl" /></div>
          <div className="flex-1">
            <p className="font-black text-sm mb-1">🚨 DISCIPLINE FINANCIÈRE ACTIVÉE</p>
            <p className="text-xs text-white/90">{discipline.budgetPct}% du budget consommé en {discipline.timePct}% du mois — Catégories bloquées : <strong>{discipline.lockedCategories.join(', ')}</strong></p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center flex-shrink-0">
            <p className="text-[10px] text-white/70">Reste/jour</p>
            <p className="text-base font-black">{formatCurrency(Math.max(discipline.dailyAllowance, 0))}</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Revenus" value={formatCurrency(stats.monthlyIncome)} sub={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} icon="ri-arrow-up-circle-line" iconBg="bg-emerald-50 text-emerald-600" empty={!hasMonthlyData} />
        <KpiCard title="Dépenses" value={formatCurrency(stats.monthlyExpense)} sub={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} icon="ri-arrow-down-circle-line" iconBg="bg-red-50 text-red-500" empty={!hasMonthlyData} />
        <KpiCard title="Solde total" value={formatCurrency(stats.totalBalance)} sub={`${accounts.length} compte${accounts.length > 1 ? 's' : ''}`} icon="ri-wallet-3-line" iconBg="bg-indigo-50 text-indigo-600" empty={accounts.length === 0} />
        <KpiCard title="Taux d'épargne" value={`${stats.monthlySavingsRate}%`} sub="Ce mois" icon="ri-trophy-line" iconBg="bg-cyan-50 text-cyan-600" empty={!hasMonthlyData} />
      </div>

      {/* Spending speed indicator */}
      {hasTransactions && currentBudget && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${discipline.active ? 'bg-red-50 text-red-600' : discipline.budgetPct > discipline.timePct ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <i className={`${discipline.active ? 'ri-alarm-warning-line' : 'ri-speed-line'} text-lg`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Vitesse de dépense</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${discipline.active ? 'bg-red-500' : discipline.budgetPct > discipline.timePct ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(discipline.budgetPct, 100)}%` }} />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">Temps : {discipline.timePct}% · Budget : {discipline.budgetPct}%</span>
            </div>
          </div>
          {discipline.dailyAllowance > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">Reste à vivre</p>
              <p className={`text-base font-black ${discipline.active ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(discipline.dailyAllowance)}/j</p>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="font-semibold text-slate-900">Revenus vs Dépenses</p><p className="text-xs text-gray-400">6 derniers mois</p></div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-indigo-100 rounded-sm inline-block" /> Revenus</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-red-100 rounded-sm inline-block" /> Dépenses</span>
            </div>
          </div>
          <BarChart data={monthlyData} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-1">Dépenses par catégorie</p>
          <p className="text-xs text-gray-400 mb-4">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          <DonutChart categoryMap={categoryExpenses} />
        </div>
      </div>

      {/* Transactions + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900">Transactions récentes</p>
            <button onClick={() => navigate('/app/transactions')} className="text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer whitespace-nowrap">Voir tout →</button>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon="ri-exchange-funds-line" title="Aucune transaction" desc="Commencez par ajouter votre première transaction." action="Ajouter" onAction={() => navigate('/app/transactions')} />
          ) : (
            <div className="space-y-3">
              {recent.map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    <i className={`${t.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900">Budgets du mois</p>
            <button onClick={() => navigate('/app/budgets')} className="text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer whitespace-nowrap">Gérer →</button>
          </div>
          {!currentBudget ? (
            <EmptyState icon="ri-pie-chart-line" title="Aucun budget" desc="Définissez votre budget mensuel." action="Créer un budget" onAction={() => navigate('/app/budgets')} />
          ) : (
            <div className="space-y-4">
              {budgetCategories.slice(0, 5).map(b => {
                const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
                const over = pct > 100;
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{b.name}</span>
                      <span className={`text-xs font-semibold ${over ? 'text-red-500' : pct > 80 ? 'text-amber-500' : 'text-gray-400'}`}>{b.spent.toLocaleString('fr')}€/{b.limit.toLocaleString('fr')}€</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"><i className="ri-robot-2-line text-sm" /></div>
            <p className="font-semibold text-slate-900 text-sm">Recommandations IA</p>
            <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">IA</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white/70 rounded-lg p-3">
                <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${ins.color}`}><i className={`${ins.icon} text-sm`} /></div>
                <p className="text-xs text-gray-600 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for new users */}
      {!hasTransactions && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/10 mx-auto mb-4"><i className="ri-rocket-line text-3xl" /></div>
          <h3 className="text-xl font-black mb-2">Bienvenue sur DepenseEasy !</h3>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">Votre tableau de bord est prêt. Commencez par ajouter vos premières transactions pour voir vos finances prendre vie.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/app/transactions')} className="flex items-center gap-2 bg-white text-indigo-700 text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer whitespace-nowrap hover:bg-indigo-50 transition-colors">
              <i className="ri-add-line" />Ajouter une transaction
            </button>
            <button onClick={() => navigate('/app/comptes')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
              <i className="ri-bank-line" />Configurer mes comptes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
