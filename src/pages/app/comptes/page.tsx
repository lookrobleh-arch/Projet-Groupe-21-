import { useState } from 'react';
import { useApp } from '../../../store/AppContext';
import type { AccountType } from '../../../store/types';

const ACCOUNT_TYPES: { value: AccountType; label: string; icon: string; color: string }[] = [
  { value: 'checking', label: 'Courant', icon: 'ri-bank-line', color: '#6366f1' },
  { value: 'savings', label: 'Épargne', icon: 'ri-safe-line', color: '#10b981' },
  { value: 'investment', label: 'Investissement', icon: 'ri-line-chart-line', color: '#8b5cf6' },
  { value: 'business', label: 'Professionnel', icon: 'ri-briefcase-line', color: '#f59e0b' },
];

const TYPE_LABELS: Record<AccountType, string> = { checking: 'Courant', savings: 'Épargne', investment: 'Investissement', business: 'Professionnel' };

export default function ComptesPage() {
  const { accounts, addAccount, deleteAccount, getAccountBalance, totalBalance } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', bank: '', type: 'checking' as AccountType, initialBalance: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Nom requis'); return; }
    const bal = parseFloat(form.initialBalance || '0');
    if (isNaN(bal)) { setError('Solde invalide'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const typeInfo = ACCOUNT_TYPES.find(t => t.value === form.type)!;
    addAccount({ name: form.name, bank: form.bank || 'Ma Banque', type: form.type, initialBalance: bal, color: typeInfo.color, icon: typeInfo.icon });
    setLoading(false);
    setShowModal(false);
    setForm({ name: '', bank: '', type: 'checking', initialBalance: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Comptes Financiers</h2>
          {accounts.length > 0 && <p className="text-sm text-gray-400">Patrimoine total : <span className="font-bold text-indigo-600">{totalBalance.toLocaleString('fr', { minimumFractionDigits: 2 })}€</span></p>}
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />Ajouter un compte
        </button>
      </div>

      {accounts.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl p-6 text-white">
          <p className="text-sm font-medium text-white/80 mb-1">Patrimoine total</p>
          <p className="text-4xl font-black">{totalBalance.toLocaleString('fr', { minimumFractionDigits: 2 })}€</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{accounts.length} compte{accounts.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4">
            <i className="ri-bank-line text-3xl" />
          </div>
          <p className="font-semibold text-slate-700 mb-1">Aucun compte configuré</p>
          <p className="text-sm text-gray-400 mb-4">Ajoutez vos comptes bancaires pour commencer à gérer vos finances.</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors mx-auto">
            <i className="ri-add-line" />Ajouter mon premier compte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {accounts.map(a => {
            const balance = getAccountBalance(a);
            const typeInfo = ACCOUNT_TYPES.find(t => t.value === a.type)!;
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-indigo-100 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}>
                      <i className={`${typeInfo.icon} text-lg`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.bank}</p>
                    </div>
                  </div>
                  <button onClick={() => setDeleteId(a.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                <p className="text-2xl font-black text-slate-900 mb-1">{balance.toLocaleString('fr', { minimumFractionDigits: 2 })}€</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full`} style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}>
                    {TYPE_LABELS[a.type]}
                  </span>
                  <span className="text-xs text-gray-400">Solde initial : {a.initialBalance.toLocaleString('fr')}€</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Ajouter un compte</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            {error && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom du compte</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Compte Courant BNP" required
                  className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Banque</label>
                <input value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} placeholder="Ex: BNP Paribas"
                  className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type de compte</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {ACCOUNT_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${form.type === t.value ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <i className={`${t.icon} text-base`} />{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Solde initial (€)</label>
                <input type="number" step="0.01" value={form.initialBalance} onChange={e => setForm({ ...form, initialBalance: e.target.value })} placeholder="0.00"
                  className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><i className="ri-loader-4-line animate-spin" />...</> : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto mb-4">
              <i className="ri-delete-bin-line text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Supprimer ce compte ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Les transactions associées resteront mais ne seront plus liées à ce compte.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
              <button onClick={() => { deleteAccount(deleteId); setDeleteId(null); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
