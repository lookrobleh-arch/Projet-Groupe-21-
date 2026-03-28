import { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../../store/AppContext';

type Message = { id: number; role: 'user' | 'assistant'; text: string; time: string };

const categories = [
  { label: 'Budget & Dépenses', icon: 'ri-pie-chart-2-line', color: 'bg-indigo-50 text-indigo-600', questions: ['Analyse mes dépenses ce mois', 'Quelles catégories dépassent le budget ?', 'Quel est mon budget restant ?', 'Mes dépenses sont-elles normales ?', 'Comment réduire mes dépenses ?'] },
  { label: 'Épargne & Objectifs', icon: 'ri-trophy-line', color: 'bg-emerald-50 text-emerald-600', questions: ['Quand vais-je atteindre mon objectif ?', 'Quel est mon taux d\'épargne ce mois ?', 'Résume mes objectifs d\'épargne', 'Suis-je en avance sur mes objectifs ?', 'Combien puis-je économiser ce mois ?'] },
  { label: 'Abonnements', icon: 'ri-repeat-line', color: 'bg-cyan-50 text-cyan-600', questions: ['Résume mes abonnements actifs', 'Quels prélèvements arrivent cette semaine ?', 'Combien coûtent mes abonnements par mois ?', 'Y a-t-il des abonnements à supprimer ?', 'Quel est le coût annuel de mes abonnements ?'] },
  { label: 'Comptes & Soldes', icon: 'ri-bank-line', color: 'bg-amber-50 text-amber-600', questions: ['Quel est le solde de mes comptes ?', 'Combien ai-je en tout sur tous mes comptes ?', 'Résume ma situation financière globale', 'Quel compte a le plus de solde ?', 'Ai-je les fonds pour mes prochains paiements ?'] },
  { label: 'Discipline Financière', icon: 'ri-shield-flash-line', color: 'bg-red-50 text-red-500', questions: ['Mon système de discipline est-il actif ?', 'Suis-je en train de trop dépenser ?', 'Quelles sont mes restrictions actuelles ?', 'Comment améliorer ma discipline financière ?', 'Montre-moi mon score de discipline'] },
  { label: 'Prévisions & Rapports', icon: 'ri-line-chart-line', color: 'bg-violet-50 text-violet-600', questions: ['Vais-je finir le mois dans le positif ?', 'Génère un rapport mensuel complet', 'Compare mes revenus et dépenses', 'Quel est mon taux d\'épargne ?', 'Prévision de mon solde fin de mois'] },
];

export default function IaPage() {
  const { transactions, accounts, goals, subscriptions, currentBudget, getCategorySpentWithBudgetFallback, stats, totalBalance, currentMonth, getAccountBalance, discipline, formatCurrency } = useApp();

  const budgetCategoryNames = useMemo(() => currentBudget?.categories.map(c => c.name) ?? [], [currentBudget]);

  const buildContext = useMemo(() => {
    const monthlyTx = transactions.filter(t => t.date.startsWith(currentMonth));
    const income = monthlyTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthlyTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    const topCats: Record<string, number> = {};
    monthlyTx.filter(t => t.type === 'expense').forEach(t => { topCats[t.category] = (topCats[t.category] ?? 0) + t.amount; });
    const sortedCats = Object.entries(topCats).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const monthlySubCost = activeSubs.reduce((s, sub) => s + (sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount), 0);
    const totalGoalTarget = goals.reduce((s, g) => s + g.target, 0);
    const totalGoalCurrent = goals.reduce((s, g) => s + g.current, 0);
    return { income, expense, savingsRate, topCats: sortedCats, activeSubs, monthlySubCost, totalGoalTarget, totalGoalCurrent, totalTx: monthlyTx.length };
  }, [transactions, subscriptions, goals, currentMonth]);

  const getResponse = (msg: string): string => {
    const m = msg.toLowerCase();
    const ctx = buildContext;
    const hasData = transactions.length > 0;

    // Discipline-related
    if (m.includes('discipline') || m.includes('restriction') || m.includes('bloqué') || m.includes('trop dépenser')) {
      if (!currentBudget) return 'Vous n\'avez pas encore défini de budget. Le système de discipline financière s\'active uniquement quand un budget est défini. Allez dans **Coach Budgétaire** pour créer votre budget !';
      if (discipline.active) {
        return `**🚨 DISCIPLINE FINANCIÈRE ACTIVE**\n\nConstat : **${discipline.budgetPct}%** du budget consommé en **${discipline.timePct}%** du mois — rythme trop élevé !\n\nCatégories verrouillées : **${discipline.lockedCategories.join(', ')}**\n\nReste à vivre autorisé : **${formatCurrency(discipline.dailyAllowance)}/jour** (besoins vitaux uniquement)\n\nAction requise : Stopper immédiatement les dépenses non essentielles. Respectez le reste à vivre imposé.`;
      }
      return `**✅ Discipline financière : Non activée**\n\nTemps écoulé : ${discipline.timePct}% du mois\nBudget consommé : ${discipline.budgetPct}%\n\nVous êtes dans les limites normales. La discipline se déclenche automatiquement si vous consommez plus de ${Math.round(discipline.timePct * 1.5)}% du budget (seuil actuel).`;
    }

    if (m.includes('score')) {
      const scoreEstimate = ctx.savingsRate > 20 ? 85 : ctx.savingsRate > 10 ? 70 : 50;
      const disciplineNote = discipline.active ? '\n\n⚠️ -15 points pour dépassement de budget (discipline active)' : '';
      return `**Score financier estimé : ${scoreEstimate}/100**\n\nBasé sur :\n• Taux d'épargne ce mois : ${ctx.savingsRate}%\n• Budget défini : ${currentBudget ? 'Oui' : 'Non'}\n• Objectifs créés : ${goals.length}${disciplineNote}\n\n${scoreEstimate >= 80 ? '🎉 Excellente gestion !' : scoreEstimate >= 60 ? '👍 Bonne gestion, encore des progrès possibles.' : '⚠️ Attention, des ajustements sont nécessaires.'}`;
    }

    if (!hasData) return 'Bonjour ! Je suis votre coach financier IA. Vous n\'avez pas encore de données financières. Commencez par ajouter vos premières transactions pour que je puisse vous analyser et conseiller !';

    if (m.includes('dépens') && (m.includes('analy') || m.includes('ce mois'))) {
      if (ctx.expense === 0) return 'Aucune dépense enregistrée ce mois. Commencez par ajouter vos transactions !';
      const catList = ctx.topCats.length > 0
        ? ctx.topCats.map(([cat, amt]) => `• **${cat}** : ${formatCurrency(amt)}`).join('\n')
        : 'Aucune catégorie de dépenses ce mois.';
      return `**Analyse dépenses — ce mois**\n\nTotal dépenses : **${formatCurrency(ctx.expense)}**\nTotal revenus : **${formatCurrency(ctx.income)}**\n\nTop catégories :\n${catList}\n\nTaux d'épargne : **${ctx.savingsRate}%**\n\n${ctx.savingsRate >= 20 ? '✅ Excellent mois !' : ctx.savingsRate >= 10 ? '⚠️ Taux d\'épargne moyen, vous pouvez faire mieux.' : '🚨 Taux d\'épargne insuffisant ce mois.'}`;
    }

    if (m.includes('catégorie') && m.includes('budget')) {
      if (!currentBudget) return 'Aucun budget défini ce mois. Créez votre budget dans la section **Coach Budgétaire** pour surveiller vos catégories.';
      const catDetails = currentBudget.categories.map(c => {
        const spent = getCategorySpentWithBudgetFallback(c.name, budgetCategoryNames);
        const pct = c.limit > 0 ? Math.round((spent / c.limit) * 100) : 0;
        return `• **${c.name}** : ${formatCurrency(spent)} / ${formatCurrency(c.limit)} (${pct}%)${pct >= 100 ? ' 🔴' : pct >= 80 ? ' 🟡' : ' 🟢'}`;
      }).join('\n');
      const overBudget = currentBudget.categories.filter(c => getCategorySpentWithBudgetFallback(c.name, budgetCategoryNames) > c.limit);
      return `**Budget par catégorie — ce mois**\n\n${catDetails}\n\n${overBudget.length > 0 ? `⚠️ Dépassements : ${overBudget.map(c => c.name).join(', ')}` : '✅ Toutes les catégories sont dans les limites !'}`;
    }

    if (m.includes('budget') && m.includes('restant')) {
      if (!currentBudget) return 'Vous n\'avez pas encore défini de budget pour ce mois. Allez dans **Coach Budgétaire** pour en créer un !';
      const totalSpent = currentBudget.categories.reduce((s, c) => s + getCategorySpentWithBudgetFallback(c.name, budgetCategoryNames), 0);
      const remaining = currentBudget.totalAmount - totalSpent;
      return `**Budget du mois — ${formatCurrency(currentBudget.totalAmount)}**\n\nDépensé : **${formatCurrency(totalSpent)}**\nRestant : **${formatCurrency(Math.max(remaining, 0))}**\n\n${remaining >= 0 ? '✅ Vous êtes dans votre budget !' : `🚨 Dépassement de ${formatCurrency(Math.abs(remaining))}`}`;
    }

    if (m.includes('réduire') || m.includes('économiser') || m.includes('comment économiser')) {
      const tips: string[] = [];
      if (ctx.monthlySubCost > 50) tips.push(`Réduisez vos abonnements (${formatCurrency(ctx.monthlySubCost)}/mois actuellement)`);
      if (ctx.topCats.length > 0) tips.push(`Optimisez votre poste **${ctx.topCats[0][0]}** (${formatCurrency(ctx.topCats[0][1])} ce mois)`);
      if (ctx.savingsRate < 15) tips.push('Visez 15-20% de taux d\'épargne minimum');
      tips.push('Automatisez votre épargne dès réception du salaire');
      tips.push('Faites un bilan de vos abonnements chaque trimestre');
      return `**Conseils d'économies personnalisés :**\n\n${tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nPotentiel d'économie estimé : **50-200€/mois** si appliqués.`;
    }

    if (m.includes('abonnement')) {
      if (ctx.activeSubs.length === 0) return 'Vous n\'avez aucun abonnement actif enregistré. Ajoutez vos abonnements dans la section **Abonnements** pour les suivre !';
      const list = ctx.activeSubs.map(s => `• **${s.name}** : ${formatCurrency(s.amount)}/${s.frequency === 'monthly' ? 'mois' : s.frequency === 'yearly' ? 'an' : 'semaine'}`).join('\n');
      const annualCost = ctx.monthlySubCost * 12;
      return `**Abonnements actifs (${ctx.activeSubs.length})**\n\n${list}\n\n**Coût mensuel : ${formatCurrency(ctx.monthlySubCost)}**\n**Coût annuel estimé : ${formatCurrency(annualCost)}**\n\n${ctx.monthlySubCost > 150 ? '⚠️ Vos abonnements représentent une part importante de vos dépenses. Pensez à en supprimer certains.' : '✅ Vos abonnements semblent raisonnables.'}`;
    }

    if (m.includes('solde') && m.includes('compte') || m.includes('combien ai-je')) {
      if (accounts.length === 0) return 'Aucun compte enregistré. Ajoutez vos comptes dans la section **Comptes** !';
      const list = accounts.map(a => `• **${a.name}** (${a.type}) : ${formatCurrency(getAccountBalance(a))}`).join('\n');
      return `**Solde de vos comptes**\n\n${list}\n\n**Total tous comptes : ${formatCurrency(totalBalance)}**`;
    }

    if (m.includes('objectif') && !m.includes('objectif du mois')) {
      if (goals.length === 0) return 'Vous n\'avez pas encore d\'objectifs d\'épargne. Créez-en un dans la section **Objectifs** pour planifier vos projets !';
      const list = goals.map(g => {
        const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
        const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return `• **${g.name}** : ${formatCurrency(g.current)} / ${formatCurrency(g.target)} (${pct}%) — ${daysLeft > 0 ? `${daysLeft} jours restants` : 'Échéance dépassée'}`;
      }).join('\n');
      return `**Objectifs d'épargne (${goals.length})**\n\n${list}\n\n**Total épargné : ${formatCurrency(buildContext.totalGoalCurrent)}** sur ${formatCurrency(buildContext.totalGoalTarget)} visés.`;
    }

    if (m.includes('taux d\'épargne') || m.includes('taux epargne')) {
      if (!hasData) return 'Aucune donnée disponible. Ajoutez des transactions pour calculer votre taux d\'épargne.';
      const rate = ctx.savingsRate;
      const recommend = rate < 10 ? 'Taux insuffisant, objectif minimum : 10-15%.' : rate < 20 ? 'Bon taux, essayez d\'atteindre 20%.' : 'Excellent taux d\'épargne ! Continuez ainsi.';
      return `**Taux d'épargne ce mois : ${rate}%**\n\nRevenus : ${formatCurrency(ctx.income)}\nDépenses : ${formatCurrency(ctx.expense)}\nÉpargne nette : ${formatCurrency(ctx.income - ctx.expense)}\n\n${recommend}`;
    }

    if (m.includes('rapport') || m.includes('mensuel')) {
      const balance = ctx.income - ctx.expense;
      return `**Rapport ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}**\n\n• Revenus : **${formatCurrency(ctx.income)}**\n• Dépenses : **${formatCurrency(ctx.expense)}**\n• Solde net : **${formatCurrency(balance)}**\n• Taux d'épargne : **${ctx.savingsRate}%**\n• Transactions : **${ctx.totalTx}**\n• Abonnements actifs : **${ctx.activeSubs.length}** (${formatCurrency(ctx.monthlySubCost)}/mois)\n• Objectifs : **${goals.length}** en cours\n\n${ctx.savingsRate >= 20 ? '🎉 Excellent mois !' : ctx.savingsRate >= 10 ? '✅ Bon mois, vous pouvez faire mieux.' : '⚠️ Taux d\'épargne faible ce mois.'}`;
    }

    if (m.includes('positif') || m.includes('fin du mois') || m.includes('prévision')) {
      const now = new Date();
      const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
      const dailyRate = now.getDate() > 0 ? ctx.expense / now.getDate() : 0;
      const projectedTotal = ctx.expense + dailyRate * daysLeft;
      const willBePositive = ctx.income > 0 && ctx.income > projectedTotal;
      return `**Prévision fin de mois**\n\nDépenses actuelles : ${formatCurrency(ctx.expense)}\nTaux journalier : ${formatCurrency(dailyRate)}/jour\nDépenses projetées : ~${formatCurrency(projectedTotal)}\nRevenus ce mois : ${formatCurrency(ctx.income)}\n\n${ctx.income === 0 ? '⚠️ Aucun revenu enregistré ce mois.' : willBePositive ? '✅ Vous devriez terminer le mois dans le positif !' : '🚨 Risque de dépasser vos revenus ce mois. Réduisez vos dépenses.'}`;
    }

    if (m.includes('conseil') || m.includes('améliorer')) {
      const advice: string[] = [];
      if (ctx.savingsRate < 10) advice.push(`Augmentez votre taux d'épargne (actuellement ${ctx.savingsRate}% — objectif : 15%)`);
      if (!currentBudget) advice.push('Définissez un budget mensuel pour mieux contrôler vos dépenses');
      if (goals.length === 0) advice.push('Créez un objectif d\'épargne pour vous motiver');
      if (ctx.monthlySubCost > 100) advice.push(`Réduisez vos abonnements (${formatCurrency(ctx.monthlySubCost)}/mois — potentiel d'économie important)`);
      if (ctx.topCats.length > 0 && ctx.topCats[0][1] > ctx.income * 0.3) advice.push(`Votre poste ${ctx.topCats[0][0]} représente plus de 30% de vos revenus`);
      if (advice.length === 0) advice.push('Votre gestion est bonne ! Continuez à surveiller vos dépenses régulièrement.');
      return `**Conseils personnalisés basés sur vos données :**\n\n${advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    }

    if (m.includes('situation') || m.includes('global') || m.includes('résume')) {
      return `**Situation financière globale**\n\n• Solde total : **${formatCurrency(totalBalance)}**\n• Revenus ce mois : **${formatCurrency(ctx.income)}**\n• Dépenses ce mois : **${formatCurrency(ctx.expense)}**\n• Taux d'épargne : **${ctx.savingsRate}%**\n• Abonnements : **${formatCurrency(ctx.monthlySubCost)}/mois**\n• Objectifs épargne : **${goals.length}** (${formatCurrency(buildContext.totalGoalCurrent)} épargnés)\n• Discipline : **${discipline.active ? '🚨 ACTIVE' : '✅ Inactive'}**`;
    }

    return `Je suis votre coach IA ! Vous avez **${transactions.length} transaction${transactions.length > 1 ? 's' : ''}**, un solde total de **${formatCurrency(totalBalance)}** et un taux d'épargne de **${stats.monthlySavingsRate}%** ce mois. Posez-moi n'importe quelle question sur vos finances !`;
  };

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: 'Bonjour ! Je suis votre coach financier IA. Je suis connecté à toutes vos données en temps réel. Posez-moi n\'importe quelle question sur vos finances !', time: 'maintenant' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: Date.now(), role: 'user', text, time: 'maintenant' }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: getResponse(text), time: 'maintenant' }]);
      setLoading(false);
    }, 600 + Math.random() * 600);
  };

  const currentUser = accounts.length;
  const initials = currentUser > 0 ? 'Moi' : 'U';

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Sujets disponibles</p>
          <p className="text-xs text-gray-400">Basé sur vos données réelles</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-500 font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {transactions.length} transactions · {accounts.length} compte{accounts.length > 1 ? 's' : ''}
            {discipline.active && <span className="ml-1 text-red-500 font-bold">· Discipline active</span>}
          </div>
        </div>
        {categories.map((cat, i) => (
          <div key={cat.label} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button onClick={() => setActiveCategory(activeCategory === i ? null : i)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${cat.color}`}><i className={`${cat.icon} text-sm`} /></div>
              <span className="flex-1 text-left text-sm font-semibold text-slate-700">{cat.label}</span>
              <div className="w-5 h-5 flex items-center justify-center text-gray-400"><i className={`ri-arrow-${activeCategory === i ? 'up' : 'down'}-s-line text-base`} /></div>
            </button>
            {activeCategory === i && (
              <div className="border-t border-gray-100 px-3 py-2 space-y-1">
                {cat.questions.map(q => (
                  <button key={q} onClick={() => send(q)} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg cursor-pointer transition-colors leading-relaxed">{q}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-center gap-4 flex-shrink-0">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0"><i className="ri-robot-2-line text-white text-xl" /></div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">Coach Financier IA</p>
            <p className="text-xs text-gray-400">Connecté à {transactions.length} transactions, {accounts.length} compte{accounts.length > 1 ? 's' : ''}, {goals.length} objectif{goals.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {discipline.active && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full animate-pulse">DISCIPLINE</span>}
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /><span className="text-xs text-gray-400 font-medium">En ligne</span></div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 mt-0.5"><i className="ri-robot-2-line text-white text-xs" /></div>
              )}
              <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-50 text-slate-700 rounded-bl-sm'}`}>
                {m.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>
                    {line.split(/\*\*(.*?)\*\*/g).map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                  </p>
                ))}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{initials.slice(0, 2)}</span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0"><i className="ri-robot-2-line text-white text-xs" /></div>
              <div className="bg-gray-50 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="mt-4 bg-white rounded-xl border border-gray-100 p-3 flex gap-3 flex-shrink-0">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)} placeholder="Posez une question sur vos finances..." className="flex-1 text-sm text-slate-900 focus:outline-none placeholder-gray-300" />
          <button onClick={() => send(input)} disabled={!input.trim() || loading} className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors cursor-pointer flex-shrink-0">
            <i className="ri-send-plane-2-line text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
