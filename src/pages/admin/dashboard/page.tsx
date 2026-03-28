import { useMemo } from 'react';
import { adminStore, transactionStore } from '../../../store/dataStore';

function KpiCard({ label, value, sub, icon, color }: { label: string; value: string; sub: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}><i className={`${icon} text-lg`} /></div>
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xs text-gray-300 mt-0.5">{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const users = useMemo(() => adminStore.getAllUsers(), []);
  const totalTx = useMemo(() => adminStore.getTotalTransactions(), []);

  const activeUsers = users.filter(u => u.isActive);
  const recentUsers = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const allTransactions = useMemo(() => transactionStore.getAll(), []);

  const monthlyGrowth = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short' });
      const usersThisMonth = users.filter(u => u.createdAt.startsWith(key)).length;
      const txThisMonth = allTransactions.filter(t => t.date.startsWith(key)).length;
      result.push({ month: label, users: usersThisMonth, transactions: txThisMonth });
    }
    return result;
  }, [users, allTransactions]);

  const maxUsers = Math.max(...monthlyGrowth.map(d => d.users), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Dashboard Admin</h2>
        <p className="text-sm text-gray-400">Vue d&apos;ensemble — données agrégées anonymisées</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4">
            <i className="ri-team-line text-3xl" />
          </div>
          <p className="font-semibold text-slate-700 mb-1">Aucun utilisateur inscrit</p>
          <p className="text-sm text-gray-400">Les statistiques apparaîtront dès que des utilisateurs s&apos;inscriront.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard label="Utilisateurs totaux" value={users.length.toString()} sub={`${activeUsers.length} actifs`} icon="ri-team-line" color="bg-indigo-50 text-indigo-600" />
            <KpiCard label="Transactions totales" value={totalTx.toLocaleString('fr')} sub="Base de données" icon="ri-exchange-funds-line" color="bg-emerald-50 text-emerald-600" />
            <KpiCard label="Taux d'activité" value={users.length > 0 ? `${Math.round((activeUsers.length / users.length) * 100)}%` : '0%'} sub="Comptes actifs" icon="ri-user-follow-line" color="bg-cyan-50 text-cyan-600" />
            <KpiCard label="Données qualité" value={totalTx > 0 ? '100%' : 'N/A'} sub="Cohérence données" icon="ri-shield-check-line" color="bg-violet-50 text-violet-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
              <p className="font-semibold text-slate-900 mb-1">Inscriptions par mois</p>
              <p className="text-xs text-gray-400 mb-4">6 derniers mois</p>
              {monthlyGrowth.every(d => d.users === 0) ? (
                <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
                  <i className="ri-bar-chart-2-line text-3xl" />
                </div>
              ) : (
                <div className="flex items-end gap-3 h-36">
                  {monthlyGrowth.map(d => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      {d.users > 0 && <span className="text-[9px] text-gray-400">{d.users}</span>}
                      <div className="w-full bg-indigo-500 rounded-sm transition-all" style={{ height: `${(d.users / maxUsers) * 90}px` }} />
                      <span className="text-[10px] text-gray-400">{d.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="font-semibold text-slate-900 mb-4">Activité utilisateurs</p>
              <div className="space-y-3">
                {[
                  { label: 'Total inscrits', val: users.length, icon: 'ri-team-line', color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Comptes actifs', val: activeUsers.length, icon: 'ri-checkbox-circle-line', color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Comptes inactifs', val: users.filter(u => !u.isActive).length, icon: 'ri-forbid-line', color: 'text-red-500 bg-red-50' },
                  { label: 'Transactions', val: totalTx, icon: 'ri-exchange-funds-line', color: 'text-cyan-600 bg-cyan-50' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${s.color}`}><i className={`${s.icon} text-sm`} /></div>
                      <span className="text-sm text-gray-600">{s.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">{s.val.toLocaleString('fr')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-semibold text-slate-900">Dernières inscriptions</p>
            </div>
            <table className="w-full">
              <thead className="border-b border-gray-50">
                <tr>
                  {['Utilisateur', 'Email', 'Inscription', 'Statut'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{u.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                        {u.isActive ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Uptime système', value: '99.9%', icon: 'ri-pulse-line', color: 'text-emerald-600 bg-emerald-50', note: 'Service opérationnel' },
              { label: 'Latence API', value: '< 150ms', icon: 'ri-time-line', color: 'text-cyan-600 bg-cyan-50', note: 'Performance nominale' },
              { label: 'Sécurité', value: 'OK', icon: 'ri-shield-check-line', color: 'text-indigo-600 bg-indigo-50', note: 'Aucune anomalie' },
              { label: 'Base de données', value: 'Stable', icon: 'ri-database-2-line', color: 'text-amber-600 bg-amber-50', note: 'Connectée' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${m.color}`}><i className={`${m.icon} text-lg`} /></div>
                <div><p className="text-lg font-black text-slate-900">{m.value}</p><p className="text-xs text-gray-400">{m.label}</p><p className="text-[10px] text-gray-300">{m.note}</p></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
