export default function AdminSauvegardes() {
  const backups = [
    { id: 'bk1', type: 'Automatique', date: '2026-03-24 03:00:00', size: '4.2 GB', status: 'success', tables: 12 },
    { id: 'bk2', type: 'Automatique', date: '2026-03-23 03:00:00', size: '4.1 GB', status: 'success', tables: 12 },
    { id: 'bk3', type: 'Manuel', date: '2026-03-22 14:32:00', size: '4.1 GB', status: 'success', tables: 12 },
    { id: 'bk4', type: 'Automatique', date: '2026-03-22 03:00:00', size: '4.0 GB', status: 'success', tables: 12 },
    { id: 'bk5', type: 'Automatique', date: '2026-03-21 03:00:00', size: '3.9 GB', status: 'failed', tables: 0 },
    { id: 'bk6', type: 'Automatique', date: '2026-03-20 03:00:00', size: '3.8 GB', status: 'success', tables: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Sauvegardes</h2>
          <p className="text-sm text-gray-400">Gestion des backups automatiques et manuels</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
          Créer une sauvegarde
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Dernière sauvegarde', value: 'Il y a 1h', icon: 'ri-time-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Taille totale', value: '24.2 GB', icon: 'ri-database-2-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Sauvegardes ce mois', value: backups.filter(b => b.status === 'success').length.toString(), icon: 'ri-server-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-xl font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-slate-900">Historique des sauvegardes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-50">
              <tr>
                {['Type', 'Date', 'Taille', 'Tables', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.type === 'Manuel' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{b.type}</span></td>
                  <td className="px-5 py-3 text-sm text-slate-700 whitespace-nowrap">{b.date}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{b.size}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{b.tables > 0 ? b.tables : '—'}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{b.status === 'success' ? 'Réussi' : 'Échoué'}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {b.status === 'success' && <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer" title="Restaurer"><i className="ri-restart-line text-sm" /></button>}
                      <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 cursor-pointer" title="Télécharger"><i className="ri-download-line text-sm" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 flex items-center justify-center text-indigo-600"><i className="ri-settings-3-line" /></div>
          <p className="font-semibold text-slate-900 text-sm">Configuration automatique</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { label: 'Fréquence', value: 'Quotidienne à 03:00' },
            { label: 'Rétention', value: '30 jours' },
            { label: 'Stockage', value: 'AWS S3 EU-West' },
          ].map(c => (
            <div key={c.label}>
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className="font-semibold text-slate-900 mt-0.5">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
