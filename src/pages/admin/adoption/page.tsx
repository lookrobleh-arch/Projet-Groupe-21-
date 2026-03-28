import { adminFeatureAdoption, adminKPIs, adminGrowthData } from '../../../mocks/adminMetrics';

export default function AdminAdoption() {
  const maxUsers = Math.max(...adminGrowthData.map(d => d.users));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Adoption Produit</h2>
        <p className="text-sm text-gray-400">Usage des fonctionnalités, engagement et rétention des utilisateurs</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'DAU', value: adminKPIs.dailyActiveUsers.toLocaleString('fr'), sub: 'Actifs quotidiens', icon: 'ri-user-follow-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'WAU', value: adminKPIs.weeklyActiveUsers.toLocaleString('fr'), sub: 'Actifs hebdo', icon: 'ri-calendar-week-line', color: 'bg-cyan-50 text-cyan-600' },
          { label: 'DAU/MAU', value: `${Math.round((adminKPIs.dailyActiveUsers / adminKPIs.activeUsers) * 100)}%`, sub: 'Rétention', icon: 'ri-repeat-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Churn Rate', value: `${adminKPIs.churnRate}%`, sub: 'Ce mois', icon: 'ri-user-unfollow-line', color: 'bg-amber-50 text-amber-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-xl font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p><p className="text-[10px] text-gray-300">{k.sub}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-1">Croissance utilisateurs</p>
          <p className="text-xs text-gray-400 mb-4">6 derniers mois</p>
          <div className="flex items-end gap-3 h-28">
            {adminGrowthData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-400">{(d.users / 1000).toFixed(1)}k</span>
                <div className="w-full bg-indigo-400 rounded-sm" style={{ height: `${(d.users / maxUsers) * 80}px` }} />
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-1">Nouveaux utilisateurs</p>
          <p className="text-xs text-gray-400 mb-4">Ce mois : <span className="font-bold text-emerald-600">{adminKPIs.newUsersThisMonth} inscrits</span></p>
          <div className="space-y-3 mt-2">
            {[
              { source: 'Organique (SEO)', users: 340, pct: 40, color: '#6366f1' },
              { source: 'Réseaux sociaux', users: 212, pct: 25, color: '#06b6d4' },
              { source: 'Recommandations', users: 169, pct: 20, color: '#10b981' },
              { source: 'Publicité', users: 126, pct: 15, color: '#f59e0b' },
            ].map(s => (
              <div key={s.source}>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-slate-600">{s.source}</span>
                  <span className="font-bold text-slate-900">{s.users} ({s.pct}%)</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-4">Adoption des fonctionnalités</p>
        <div className="space-y-4">
          {adminFeatureAdoption.map(f => (
            <div key={f.feature} className="flex items-center gap-4">
              <span className="text-sm text-slate-700 w-40 flex-shrink-0">{f.feature}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${f.percent}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-900 w-16 text-right flex-shrink-0">{f.percent}%</span>
              <span className="text-xs text-gray-400 w-20 flex-shrink-0 text-right">{f.users.toLocaleString('fr')} users</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
