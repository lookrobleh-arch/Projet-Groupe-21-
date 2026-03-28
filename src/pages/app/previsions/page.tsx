import { useMemo } from 'react';
import { useApp } from '../../../store/AppContext';

export default function PrevisionsPage() {
  const { transactions, subscriptions, totalBalance, accounts, getAccountBalance, currentMonth } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const daysLeft = daysInMonth - daysPassed;

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);

    const dailyRate = daysPassed > 0 ? monthlyExpenses / daysPassed : 0;
    const projectedExpenses = dailyRate * daysLeft;

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const subsCostNext7 = activeSubs.reduce((sum, s) => {
      const days = Math.ceil((new Date(s.nextDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7 ? sum + s.amount : sum;
    }, 0);
    const subsCostNext30 = activeSubs.reduce((sum, s) => {
      const days = Math.ceil((new Date(s.nextDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 30 ? sum + s.amount : sum;
    }, 0);

    const balance7 = totalBalance - dailyRate * 7 - subsCostNext7;
    const balance30 = totalBalance - projectedExpenses - subsCostNext30 + (monthlyIncome > 0 ? monthlyIncome : 0);

    return { dailyRate, daysLeft, projectedExpenses, subsCostNext7, subsCostNext30, balance7, balance30, monthlyExpenses, monthlyIncome };
  }, [transactions, subscriptions, totalBalance, currentMonth]);

  const hasData = transactions.length > 0;

  const cashflow7 = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const label = i === 0 ? 'Auj.' : d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3);
      const projBal = totalBalance - stats.dailyRate * i;
      return { day: label, balance: Math.max(projBal, 0) };
    });
  }, [totalBalance, stats.dailyRate]);

  const maxBal = Math.max(...cashflow7.map(d => d.balance), 1);

  const risks = useMemo(() => {
    const items: { level: string; icon: string; color: string; title: string; desc: string }[] = [];
    if (stats.balance30 < 0) {
      items.push({ level: 'high', icon: 'ri-alarm-warning-line', color: 'text-red-500 bg-red-50 border-red-100', title: 'Risque de découvert', desc: `À ce rythme, votre solde pourrait être négatif d'ici la fin du mois.` });
    }
    subscriptions.filter(s => s.status === 'active').forEach(s => {
      const days = Math.ceil((new Date(s.nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days >= 0 && days <= 3) {
        items.push({ level: 'high', icon: 'ri-alert-line', color: 'text-red-500 bg-red-50 border-red-100', title: `${s.name} dû dans ${days} jour${days > 1 ? 's' : ''}`, desc: `Prélèvement automatique de ${s.amount.toFixed(2)}€` });
      } else if (days >= 0 && days <= 7) {
        items.push({ level: 'medium', icon: 'ri-information-line', color: 'text-amber-600 bg-amber-50 border-amber-100', title: `${s.name} dans ${days} jours`, desc: `${s.amount.toFixed(2)}€ à venir` });
      }
    });
    if (stats.balance30 > 0 && items.length === 0) {
      items.push({ level: 'low', icon: 'ri-checkbox-circle-line', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', title: 'Bonne trajectoire', desc: 'Vos dépenses sont sous contrôle ce mois-ci.' });
    }
    return items;
  }, [stats.balance30, subscriptions]);

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Prévisions Cashflow</h2>
          <p className="text-sm text-gray-400">Projections intelligentes basées sur vos habitudes financières</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-line-chart-line text-3xl" /></div>
          <p className="font-semibold text-slate-700 mb-2">Aucune donnée disponible</p>
          <p className="text-sm text-gray-400">Ajoutez des transactions pour voir vos prévisions de cashflow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Prévisions Cashflow</h2>
        <p className="text-sm text-gray-400">Projections basées sur vos données réelles</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Solde actuel', value: totalBalance > 0 || accounts.length > 0 ? `${totalBalance.toLocaleString('fr', { minimumFractionDigits: 0 })}€` : '0€', icon: 'ri-wallet-3-line', color: 'bg-indigo-50 text-indigo-600', sub: `${accounts.length} compte${accounts.length > 1 ? 's' : ''}` },
          { label: 'Solde dans 7j', value: `${Math.max(stats.balance7, 0).toLocaleString('fr', { minimumFractionDigits: 0 })}€`, icon: 'ri-calendar-line', color: stats.balance7 >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500', sub: `${stats.balance7 >= 0 ? '-' : ''}${Math.abs(stats.balance7 - totalBalance).toLocaleString('fr', { minimumFractionDigits: 0 })}€ prévu` },
          { label: 'Solde dans 30j', value: `${Math.max(stats.balance30, 0).toLocaleString('fr', { minimumFractionDigits: 0 })}€`, icon: 'ri-calendar-2-line', color: stats.balance30 >= 0 ? 'bg-cyan-50 text-cyan-600' : 'bg-red-50 text-red-500', sub: stats.balance30 < 0 ? 'Risque découvert' : 'Estimé' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-lg font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p><p className="text-[10px] text-gray-300">{k.sub}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-1">Prévision 7 jours</p>
        <p className="text-xs text-gray-400 mb-5">Taux journalier : {stats.dailyRate.toFixed(2)}€/jour basé sur vos {transactions.filter(t => t.date.startsWith(currentMonth)).length} transactions ce mois</p>
        <div className="flex items-end gap-3 h-32">
          {cashflow7.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 font-medium">{Math.round(d.balance).toLocaleString('fr')}€</span>
              <div className="w-full rounded-sm transition-all" style={{ height: `${(d.balance / maxBal) * 80}px`, backgroundColor: i === 0 ? '#6366f1' : '#c7d2fe', opacity: i === 0 ? 1 : 0.7 + i * 0.05 }} />
              <span className="text-[10px] text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {risks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-4">Alertes &amp; Risques</p>
          <div className="space-y-3">
            {risks.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${r.color}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${r.color}`}><i className={`${r.icon} text-sm`} /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-2">Résumé du mois en cours</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { label: 'Dépenses ce mois', val: stats.monthlyExpenses, color: 'text-red-500', prefix: '' },
            { label: 'Revenus ce mois', val: stats.monthlyIncome, color: 'text-emerald-600', prefix: '+' },
            { label: 'Dépenses projetées restantes', val: stats.projectedExpenses, color: 'text-amber-600', prefix: '~' },
            { label: 'Abonnements à venir (30j)', val: stats.subsCostNext30, color: 'text-indigo-600', prefix: '' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className={`text-lg font-black ${item.color}`}>{item.prefix}{item.val.toLocaleString('fr', { minimumFractionDigits: 2 })}€</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
