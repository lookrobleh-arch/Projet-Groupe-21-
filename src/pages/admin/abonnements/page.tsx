import { adminPlanDistribution, adminKPIs } from '../../../mocks/adminMetrics';

const plans = [
  { name: 'Free', price: 0, users: adminPlanDistribution[0].users, color: '#94a3b8', features: ['Dashboard', 'Transactions', 'Budget basique'] },
  { name: 'Pro', price: 4.99, users: adminPlanDistribution[1].users, color: '#6366f1', features: ['Tout Free', 'Assistant IA', 'OCR Scan', 'Prévisions', 'Export PDF'] },
  { name: 'Premium', price: 9.99, users: adminPlanDistribution[2].users, color: '#06b6d4', features: ['Tout Pro', 'API Access', 'Règles auto', 'Support prioritaire'] },
];

export default function AdminAbonnements() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Plans &amp; Abonnements</h2>
        <p className="text-sm text-gray-400">Revenus, distribution des plans et métriques SaaS</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'MRR', value: `${adminKPIs.mrr.toLocaleString('fr')}€`, sub: 'Revenus mensuels récurrents', icon: 'ri-money-euro-circle-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'ARR', value: `${(adminKPIs.arr / 1000).toFixed(0)}k€`, sub: 'Revenus annuels récurrents', icon: 'ri-calendar-2-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'ARPU', value: `${adminKPIs.avgRevenuePerUser}€`, sub: 'Revenu moyen par utilisateur', icon: 'ri-user-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-xl font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p><p className="text-[10px] text-gray-300">{k.sub}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.name} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-slate-900 text-lg">{plan.name}</span>
              <span className="text-sm font-bold text-slate-700">{plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}</span>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-black text-slate-900">{plan.users.toLocaleString('fr')}</p>
              <p className="text-xs text-gray-400">utilisateurs actifs</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full" style={{ width: `${Math.round((plan.users / adminKPIs.totalUsers) * 100)}%`, backgroundColor: plan.color }} />
            </div>
            <div className="space-y-1">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3 h-3 flex items-center justify-center flex-shrink-0" style={{ color: plan.color }}><i className="ri-check-line text-xs" /></div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-4">Évolution MRR mensuelle</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {['Mois', 'Free', 'Pro', 'Premium', 'MRR Total', 'Variation'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { m: 'Oct 25', free: 5120, pro: 4200, premium: 1880, mrr: 35600 },
                { m: 'Nov 25', free: 5480, pro: 4680, premium: 1940, mrr: 38900 },
                { m: 'Déc 25', free: 5820, pro: 4920, premium: 2060, mrr: 41200 },
                { m: 'Jan 26', free: 6100, pro: 5200, premium: 2300, mrr: 43800 },
                { m: 'Fév 26', free: 6450, pro: 5420, premium: 2830, mrr: 46500 },
                { m: 'Mar 26', free: 6814, pro: 5612, premium: 3421, mrr: 48920 },
              ].map((row, i, arr) => {
                const prev = i > 0 ? arr[i-1].mrr : row.mrr;
                const variation = i > 0 ? ((row.mrr - prev) / prev * 100).toFixed(1) : '—';
                return (
                  <tr key={row.m} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.m}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.free.toLocaleString('fr')}</td>
                    <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{row.pro.toLocaleString('fr')}</td>
                    <td className="px-4 py-3 text-sm text-cyan-600 font-medium">{row.premium.toLocaleString('fr')}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600">{row.mrr.toLocaleString('fr')}€</td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{variation !== '—' ? `+${variation}%` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
