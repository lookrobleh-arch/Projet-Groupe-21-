import { useState, useMemo } from 'react';
import { adminStore } from '../../../store/adminStore';
import type { User } from '../../../store/types';

export default function AdminUtilisateurs() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>(() => adminStore.getAllUsers());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshUsers = () => setUsers(adminStore.getAllUsers());

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? u.isActive : !u.isActive);
    return matchSearch && matchStatus;
  }), [users, search, filterStatus]);

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(u => u.id));

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    await new Promise(r => setTimeout(r, 400));
    adminStore.updateUser(id, { isActive: false });
    refreshUsers();
    setActionLoading(null);
  };

  const handleActivate = async (id: string) => {
    setActionLoading(id);
    await new Promise(r => setTimeout(r, 400));
    adminStore.updateUser(id, { isActive: true });
    refreshUsers();
    setActionLoading(null);
  };

  const handleBulkSuspend = async () => {
    for (const id of selectedIds) adminStore.updateUser(id, { isActive: false });
    refreshUsers();
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Utilisateurs</h2>
          <p className="text-sm text-gray-400">{users.length} comptes inscrits — données anonymisées</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: users.length, color: 'bg-indigo-50 text-indigo-600', icon: 'ri-team-line' },
          { label: 'Actifs', value: users.filter(u => u.isActive).length, color: 'bg-emerald-50 text-emerald-600', icon: 'ri-checkbox-circle-line' },
          { label: 'Suspendus', value: users.filter(u => !u.isActive).length, color: 'bg-red-50 text-red-500', icon: 'ri-user-forbid-line' },
          { label: 'Aujourd\'hui', value: users.filter(u => u.createdAt.startsWith(new Date().toISOString().slice(0, 10))).length, color: 'bg-cyan-50 text-cyan-600', icon: 'ri-user-add-line' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${s.color}`}><i className={`${s.icon} text-base`} /></div>
            <div><p className="text-xl font-black text-slate-900">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400"><i className="ri-search-line text-sm" /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {[{ v: 'all', l: 'Tous' }, { v: 'active', l: 'Actifs' }, { v: 'inactive', l: 'Suspendus' }].map(f => (
              <button key={f.v} onClick={() => setFilterStatus(f.v as typeof filterStatus)} className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${filterStatus === f.v ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500'}`}>{f.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">{filtered.length} utilisateurs</p>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{selectedIds.length} sélectionnés</span>
              <button onClick={handleBulkSuspend} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 cursor-pointer whitespace-nowrap transition-colors">Suspendre tout</button>
            </div>
          )}
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4">
              <i className="ri-team-line text-2xl" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">Aucun utilisateur inscrit</p>
            <p className="text-sm text-gray-400">Les utilisateurs apparaîtront ici dès qu&apos;ils s&apos;inscriront.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left">
                    <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="cursor-pointer" />
                  </th>
                  {['Utilisateur', 'Email', 'Inscription', 'Dernière connexion', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} className="cursor-pointer" />
                    </td>
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
                    <td className="px-5 py-3 text-sm text-gray-400 whitespace-nowrap">{new Date(u.lastLogin).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                        {u.isActive ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {u.isActive ? (
                          <button onClick={() => handleSuspend(u.id)} disabled={actionLoading === u.id}
                            className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg hover:bg-amber-100 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                            {actionLoading === u.id ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-forbid-line" />}
                            Suspendre
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(u.id)} disabled={actionLoading === u.id}
                            className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-100 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                            {actionLoading === u.id ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-checkbox-circle-line" />}
                            Activer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
