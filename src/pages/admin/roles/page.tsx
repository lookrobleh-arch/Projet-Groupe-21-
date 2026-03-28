export default function AdminRoles() {
  const roles = [
    { name: 'Super Admin', users: 1, color: 'bg-red-50 text-red-700', desc: 'Accès complet à toutes les fonctionnalités admin' },
    { name: 'Admin', users: 3, color: 'bg-amber-50 text-amber-700', desc: 'Gestion utilisateurs, logs, statistiques' },
    { name: 'Support', users: 8, color: 'bg-indigo-50 text-indigo-700', desc: 'Lecture des logs, consultation utilisateurs' },
    { name: 'Analyste', users: 5, color: 'bg-cyan-50 text-cyan-700', desc: 'Accès aux statistiques et métriques uniquement' },
  ];

  const permissions = [
    { perm: 'Voir dashboard', superAdmin: true, admin: true, support: true, analyste: true },
    { perm: 'Gestion utilisateurs', superAdmin: true, admin: true, support: false, analyste: false },
    { perm: 'Suspendre utilisateur', superAdmin: true, admin: true, support: false, analyste: false },
    { perm: 'Voir logs', superAdmin: true, admin: true, support: true, analyste: false },
    { perm: 'Exporter données', superAdmin: true, admin: true, support: false, analyste: true },
    { perm: 'Voir statistiques', superAdmin: true, admin: true, support: false, analyste: true },
    { perm: 'Gérer plans', superAdmin: true, admin: false, support: false, analyste: false },
    { perm: 'Gérer sauvegardes', superAdmin: true, admin: false, support: false, analyste: false },
    { perm: 'Voir métriques IA', superAdmin: true, admin: true, support: false, analyste: true },
    { perm: 'Conformité audit', superAdmin: true, admin: true, support: false, analyste: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Rôles &amp; Permissions</h2>
        <p className="text-sm text-gray-400">Contrôle d&apos;accès basé sur les rôles (RBAC)</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {roles.map(r => (
          <div key={r.name} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.color}`}>{r.name}</span>
              <span className="text-xs text-gray-400">{r.users} utilisateur{r.users > 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-slate-900">Matrice des permissions</p>
          <p className="text-xs text-gray-400 mt-0.5">Vue d&apos;ensemble des droits par rôle</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-48">Permission</th>
                {roles.map(r => (
                  <th key={r.name} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p.perm} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-slate-700">{p.perm}</td>
                  {(['superAdmin', 'admin', 'support', 'analyste'] as const).map(role => (
                    <td key={role} className="px-5 py-3 text-center">
                      <div className={`w-5 h-5 flex items-center justify-center mx-auto rounded-full ${p[role] ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                        <i className={`${p[role] ? 'ri-check-line text-emerald-600' : 'ri-close-line text-gray-300'} text-xs`} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
