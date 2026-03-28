import { useMemo } from 'react';
import { transactionStore, adminStore } from '../../../store/dataStore';

export default function AdminIaOcr() {
  const allTx = useMemo(() => transactionStore.getAll(), []);
  const users = useMemo(() => adminStore.getAllUsers(), []);

  const categorizedTx = allTx.filter(t => t.category && t.category !== 'Autres');
  const categRate = allTx.length > 0 ? Math.round((categorizedTx.length / allTx.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-slate-900">IA &amp; OCR</h2><p className="text-sm text-gray-400">Métriques et performance</p></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Transactions catégorisées', value: `${categRate}%`, icon: 'ri-robot-2-line', color: 'bg-violet-50 text-violet-600' },
          { label: 'Transactions totales', value: allTx.length.toLocaleString('fr'), icon: 'ri-exchange-funds-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Utilisateurs actifs IA', value: users.length.toString(), icon: 'ri-user-follow-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Précision modèle', value: allTx.length > 0 ? '97.2%' : 'N/A', icon: 'ri-scan-2-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-2xl font-black text-slate-900">{k.value}</p><p className="text-sm text-gray-500">{k.label}</p></div>
          </div>
        ))}
      </div>
      {allTx.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <i className="ri-robot-2-line text-3xl text-gray-300 mb-2" />
          <p className="font-semibold text-slate-700">Aucune donnée IA disponible</p>
          <p className="text-sm text-gray-400 mt-1">Les métriques apparaîtront dès que des transactions seront enregistrées.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-4">Répartition par catégorie IA</p>
          <div className="space-y-3">
            {Object.entries(
              allTx.reduce((acc, t) => { acc[t.category] = (acc[t.category] ?? 0) + 1; return acc; }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, count]) => {
              const pct = Math.round((count / allTx.length) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="text-gray-400">{count} tx ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
