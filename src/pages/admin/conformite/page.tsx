export default function AdminConformite() {
  const auditLogs = [
    { id: 'a1', admin: 'Super Admin', action: 'Suspension compte', target: 'u12 (Maxime Garnier)', timestamp: '2026-03-24 09:30:00', ip: '192.168.1.1' },
    { id: 'a2', admin: 'Admin', action: 'Export données utilisateurs', target: 'Liste complète CSV', timestamp: '2026-03-24 09:00:00', ip: '10.0.0.5' },
    { id: 'a3', admin: 'Super Admin', action: 'Modification rôle', target: 'Support → Analyste (Claire B.)', timestamp: '2026-03-23 16:45:00', ip: '192.168.1.1' },
    { id: 'a4', admin: 'Admin', action: 'Reset mot de passe admin', target: 'Admin (Pierre R.)', timestamp: '2026-03-23 14:20:00', ip: '10.0.0.8' },
    { id: 'a5', admin: 'Super Admin', action: 'Modification plan', target: 'u5 (Julie Leroy) Free → Pro', timestamp: '2026-03-22 11:00:00', ip: '192.168.1.1' },
    { id: 'a6', admin: 'Analyste', action: 'Consultation statistiques', target: 'Dashboard global', timestamp: '2026-03-22 09:30:00', ip: '10.0.0.12' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Conformité &amp; Audit</h2>
        <p className="text-sm text-gray-400">Traçabilité complète des actions administratives — RGPD</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Actions ce mois', value: '847', icon: 'ri-file-shield-2-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Admins actifs', value: '4', icon: 'ri-user-settings-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Alertes RGPD', value: '0', icon: 'ri-shield-check-line', color: 'bg-cyan-50 text-cyan-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-xl font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 flex items-center justify-center text-emerald-600"><i className="ri-shield-check-line" /></div>
          <p className="font-semibold text-slate-900 text-sm">Conformité RGPD — Statut</p>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {['Consentement collecté', 'Chiffrement données', 'Droit à l\'oubli', 'Portabilité données'].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-emerald-700">
              <div className="w-4 h-4 flex items-center justify-center text-emerald-500"><i className="ri-check-line text-xs" /></div>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-slate-900">Journal d&apos;audit administrateur</p>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors text-gray-600">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line text-sm" /></div>
            Exporter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-50">
              <tr>
                {['Admin', 'Action', 'Cible', 'Date/Heure', 'IP'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3"><span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">{log.admin}</span></td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">{log.action}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{log.target}</td>
                  <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-400 whitespace-nowrap">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
