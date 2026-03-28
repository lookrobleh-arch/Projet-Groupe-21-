import { useMemo } from 'react';
import { adminStore } from '../../../store/dataStore';

export default function AdminSecurite() {
  const users = useMemo(() => adminStore.getAllUsers(), []);
  const logs = useMemo(() => adminStore.getLogs(), []);

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-slate-900">Sécurité</h2><p className="text-sm text-gray-400">Connexions, incidents et audit</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Comptes actifs', value: users.filter(u => u.isActive).length, icon: 'ri-shield-check-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Comptes suspendus', value: users.filter(u => !u.isActive).length, icon: 'ri-user-forbid-line', color: 'bg-red-50 text-red-500' },
          { label: 'Actions admin', value: logs.length, icon: 'ri-history-line', color: 'bg-indigo-50 text-indigo-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div><p className="text-2xl font-black text-slate-900">{k.value}</p><p className="text-sm text-gray-500">{k.label}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><p className="font-semibold text-slate-900">Journal d&apos;audit admin</p></div>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            <i className="ri-history-line text-3xl mb-2" /><p>Aucune action admin enregistrée.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.slice(0, 20).map(l => (
              <div key={l.id} className="px-5 py-3 flex items-start gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0"><i className="ri-admin-line text-sm" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{l.action}</p>
                  <p className="text-xs text-gray-400">{l.details} • IP: {l.ip}</p>
                </div>
                <span className="text-xs text-gray-300 whitespace-nowrap">{new Date(l.timestamp).toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
