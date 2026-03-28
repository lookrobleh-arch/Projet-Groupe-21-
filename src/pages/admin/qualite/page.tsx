export default function AdminQualite() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Qualité des Données</h2>
        <p className="text-sm text-gray-400">Taux de catégorisation, cohérence et détection de doublons</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Taux catégorisation', value: '94.7%', icon: 'ri-price-tag-3-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Doublons détectés', value: '142', icon: 'ri-file-copy-line', color: 'bg-amber-50 text-amber-600' },
          { label: 'Transactions non catégorisées', value: '0.8%', icon: 'ri-question-line', color: 'bg-red-50 text-red-500' },
          { label: 'Score cohérence global', value: '98.2%', icon: 'ri-checkbox-circle-line', color: 'bg-indigo-50 text-indigo-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-xl font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-4">Taux de catégorisation par source</p>
          <div className="space-y-4">
            {[
              { source: 'Catégorisation IA', rate: 94.7, total: '2.1M tx', color: '#6366f1' },
              { source: 'OCR + IA', rate: 97.3, total: '142k scans', color: '#06b6d4' },
              { source: 'Manuelle utilisateur', rate: 100, total: '340k tx', color: '#10b981' },
              { source: 'Import CSV', rate: 88.2, total: '12k tx', color: '#f59e0b' },
            ].map(s => (
              <div key={s.source}>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-slate-600">{s.source}</span>
                  <span className="font-bold text-slate-900">{s.rate}% <span className="text-gray-300 font-normal">({s.total})</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.rate}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-semibold text-slate-900 mb-4">Problèmes de qualité détectés</p>
          <div className="space-y-3">
            {[
              { type: 'Doublons potentiels', count: 142, severity: 'medium', action: 'Fusionner' },
              { type: 'Montants aberrants', count: 23, severity: 'high', action: 'Vérifier' },
              { type: 'Catégorie manquante', count: 1847, severity: 'low', action: 'Auto-catégoriser' },
              { type: 'Date invalide', count: 8, severity: 'high', action: 'Corriger' },
              { type: 'Devise non reconnue', count: 3, severity: 'medium', action: 'Traiter' },
            ].map(issue => (
              <div key={issue.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-amber-400' : 'bg-gray-300'}`} />
                  <span className="text-sm text-slate-700">{issue.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">{issue.count}</span>
                  <button className={`text-xs font-medium px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap transition-colors ${issue.severity === 'high' ? 'bg-red-50 text-red-600 hover:bg-red-100' : issue.severity === 'medium' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                    {issue.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="font-semibold text-slate-900 mb-4">Évolution de la qualité (6 mois)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {['Mois', 'Catégorisation', 'Cohérence', 'Doublons', 'Erreurs', 'Score global'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { m: 'Oct 25', cat: 91.2, coh: 97.1, dup: 289, err: 45, score: 93 },
                { m: 'Nov 25', cat: 92.4, coh: 97.5, dup: 256, err: 38, score: 94 },
                { m: 'Déc 25', cat: 93.1, coh: 97.8, dup: 210, err: 31, score: 95 },
                { m: 'Jan 26', cat: 93.8, coh: 98.0, dup: 189, err: 27, score: 96 },
                { m: 'Fév 26', cat: 94.2, coh: 98.1, dup: 162, err: 21, score: 97 },
                { m: 'Mar 26', cat: 94.7, coh: 98.2, dup: 142, err: 15, score: 98 },
              ].map(row => (
                <tr key={row.m} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.m}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{row.cat}%</td>
                  <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{row.coh}%</td>
                  <td className="px-4 py-3 text-sm text-amber-600">{row.dup}</td>
                  <td className="px-4 py-3 text-sm text-red-500">{row.err}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.score >= 97 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{row.score}/100</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
