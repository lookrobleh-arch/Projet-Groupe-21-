import { useMemo } from 'react';
import { adminStore, transactionStore } from '../../../store/dataStore';

export default function AdminStatistiques() {
  const users = useMemo(() => adminStore.getAllUsers(), []);
  const allTx = useMemo(() => transactionStore.getAll(), []);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const newUsers = users.filter(u => u.createdAt.startsWith(key)).length;
      const txCount = allTx.filter(t => t.date.startsWith(key)).length;
      result.push({ month: label, users: newUsers, transactions: txCount });
    }
    return result;
  }, [users, allTx]);

  const maxVal = Math.max(...monthlyData.map(d => d.users), 1);

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        <div><h2 className="text-xl font-black text-slate-900">Statistiques</h2><p className="text-sm text-gray-400">Croissance et engagement</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-bar-chart-2-line text-2xl" /></div>
          <p className="font-semibold text-slate-700 mb-1">Aucune donnée disponible</p>
          <p className="text-sm text-gray-400">Les statistiques apparaîtront dès que des utilisateurs s&apos;inscriront.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-slate-900">Statistiques</h2><p className="text-sm text-gray-400">Croissance et engagement — données réelles</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Utilisateurs totaux', value: users.length, icon: 'ri-team-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Transactions totales', value: allTx.length, icon: 'ri-exchange-funds-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Taux d\'activation', value: `${users.length > 0 ? Math.round((users.filter(u => u.isActive).length / users.length) * 100) : 0}%`, icon: 'ri-user-follow-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-2xl font-black text-slate-900">{k.value}</p><p className="text-sm text-gray-500">{k.label}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-1">Nouvelles inscriptions par mois</p>
        <p className="text-xs text-gray-400 mb-4">6 derniers mois</p>
        <div className="flex items-end gap-3 h-36">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              {d.users > 0 && <span className="text-[9px] text-gray-400">{d.users}</span>}
              <div className="w-full bg-indigo-400 rounded-sm transition-all" style={{ height: `${Math.max((d.users / maxVal) * 90, d.users > 0 ? 8 : 2)}px` }} />
              <span className="text-[10px] text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><p className="font-semibold text-slate-900">Détail mensuel</p></div>
        <table className="w-full">
          <thead className="border-b border-gray-50">
            <tr>{['Mois', 'Nouvelles inscriptions', 'Transactions'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {monthlyData.map(d => (
              <tr key={d.month} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-slate-900">{d.month}</td>
                <td className="px-5 py-3 text-sm text-emerald-600 font-bold">{d.users > 0 ? `+${d.users}` : '0'}</td>
                <td className="px-5 py-3 text-sm text-slate-700">{d.transactions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
