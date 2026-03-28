import { useState } from 'react';
import { useApp } from '../../../store/AppContext';
import type { SubscriptionFrequency, SubscriptionStatus } from '../../../store/types';

const ICONS_SUBS = ['ri-netflix-fill', 'ri-spotify-fill', 'ri-amazon-fill', 'ri-google-fill', 'ri-apple-fill', 'ri-youtube-fill', 'ri-slack-line', 'ri-discord-line', 'ri-repeat-line'];
const COLORS_SUBS = ['#e50914', '#1db954', '#ff9900', '#4285f4', '#555555', '#ff0000', '#611f69', '#5865f2', '#6366f1'];
const CATEGORIES_SUBS = ['Streaming', 'Musique', 'Cloud', 'Sport', 'Presse', 'Logiciels', 'Gaming', 'Autre'];

export default function AbonnementsPage() {
  const { subscriptions, accounts, addSubscription, updateSubscription, deleteSubscription, getAccountBalance, formatCurrency } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', amount: '', frequency: 'monthly' as SubscriptionFrequency,
    nextDate: '', category: 'Streaming', color: COLORS_SUBS[0], icon: ICONS_SUBS[0],
    accountId: accounts[0]?.id ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filtered = subscriptions.filter(s => filter === 'all' || s.status === filter);
  const active = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = active.reduce((s, sub) => s + (sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount), 0);

  const upcoming = active.filter(s => {
    const days = Math.ceil((new Date(s.nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  }).sort((a, b) => a.nextDate.localeCompare(b.nextDate));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.name.trim()) { setError('Nom requis'); return; }
    if (isNaN(amt) || amt <= 0) { setError('Montant invalide'); return; }
    if (!form.nextDate) { setError('Date de prélèvement requise'); return; }
    if (!form.accountId) { setError('Veuillez sélectionner un compte'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    const result = addSubscription({
      name: form.name, amount: amt, frequency: form.frequency,
      nextDate: form.nextDate, category: form.category,
      color: form.color, icon: form.icon,
      accountId: form.accountId, status: 'active',
    }, true);

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Erreur');
      return;
    }

    setShowModal(false);
    setForm({ name: '', amount: '', frequency: 'monthly', nextDate: '', category: 'Streaming', color: COLORS_SUBS[0], icon: ICONS_SUBS[0], accountId: accounts[0]?.id ?? '' });
    setError('');
  };

  const toggleStatus = (s: typeof subscriptions[0]) => {
    const newStatus: SubscriptionStatus = s.status === 'active' ? 'paused' : 'active';
    updateSubscription(s.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Abonnements</h2>
          <p className="text-sm text-gray-400">Charges récurrentes — déduit automatiquement de votre compte</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />Ajouter
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-repeat-line text-3xl" /></div>
          <p className="font-semibold text-slate-700 mb-1">Aucun abonnement</p>
          <p className="text-sm text-gray-400 mb-4">Ajoutez vos abonnements pour suivre vos charges récurrentes.</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors mx-auto">
            <i className="ri-add-line" />Ajouter mon premier abonnement
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Charges mensuelles', value: formatCurrency(totalMonthly), icon: 'ri-repeat-line', color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Abonnements actifs', value: `${active.length}`, icon: 'ri-checkbox-circle-line', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Charges annuelles', value: formatCurrency(totalMonthly * 12), icon: 'ri-calendar-2-line', color: 'bg-amber-50 text-amber-600' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
                <div><p className="text-lg font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p></div>
              </div>
            ))}
          </div>

          {upcoming.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 flex items-center justify-center text-amber-600"><i className="ri-alarm-warning-line" /></div>
                <p className="font-semibold text-slate-900 text-sm">Prélèvements dans les 7 jours</p>
              </div>
              <div className="space-y-2">
                {upcoming.map(s => {
                  const days = Math.ceil((new Date(s.nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={s.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center" style={{ color: s.color }}><i className={`${s.icon} text-sm`} /></div>
                        <span className="text-sm font-medium text-slate-900">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Dans {days}j</span>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(s.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
            {(['all', 'active', 'paused', 'cancelled'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${filter === f ? 'bg-white text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'paused' ? 'Pausés' : 'Annulés'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(s => {
              const linkedAccount = accounts.find(a => a.id === s.accountId);
              return (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                    <i className={`${s.icon} text-xl`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.category} • {s.frequency === 'monthly' ? 'mensuel' : s.frequency === 'yearly' ? 'annuel' : 'hebdo'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-300">Prochain : {new Date(s.nextDate).toLocaleDateString('fr-FR')}</p>
                      {linkedAccount && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                          <i className="ri-bank-line mr-0.5" />{linkedAccount.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-900">{formatCurrency(s.amount)}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s.status === 'active' ? 'bg-emerald-50 text-emerald-600' : s.status === 'paused' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                      {s.status === 'active' ? 'Actif' : s.status === 'paused' ? 'Pausé' : 'Annulé'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleStatus(s)} className={`w-7 h-7 flex items-center justify-center rounded text-gray-400 cursor-pointer ${s.status === 'active' ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}`} title={s.status === 'active' ? 'Mettre en pause' : 'Réactiver'}>
                      <i className={`${s.status === 'active' ? 'ri-pause-line' : 'ri-play-line'} text-sm`} />
                    </button>
                    <button onClick={() => setDeleteId(s.id)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 hover:text-red-500 text-gray-400 cursor-pointer">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Nouvel abonnement</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <i className="ri-error-warning-line flex-shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Netflix" required className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant (€)</label>
                  <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="9.99" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fréquence</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as SubscriptionFrequency })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    <option value="monthly">Mensuel</option>
                    <option value="yearly">Annuel</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prochain prélèvement</label>
                  <input type="date" value={form.nextDate} onChange={e => setForm({ ...form, nextDate: e.target.value })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    {CATEGORIES_SUBS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte à débiter</label>
                {accounts.length === 0 ? (
                  <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-3 py-2 rounded-lg">Aucun compte disponible. Créez d&apos;abord un compte dans la section Comptes.</p>
                ) : (
                  <select value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    {accounts.map(a => {
                      const bal = getAccountBalance(a);
                      return <option key={a.id} value={a.id}>{a.name} — {formatCurrency(bal)}</option>;
                    })}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Couleur &amp; Icône</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COLORS_SUBS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ICONS_SUBS.map(ic => (
                    <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })} className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-all ${form.icon === ic ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}>
                      <i className={`${ic} text-base`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-xs text-indigo-700">
                <i className="ri-information-line mr-1" />
                Le montant sera <strong>immédiatement déduit</strong> du compte sélectionné et apparaîtra dans vos transactions.
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
                <button type="submit" disabled={loading || accounts.length === 0} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><i className="ri-loader-4-line animate-spin" />...</> : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-6">Supprimer cet abonnement ?</h3>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 cursor-pointer whitespace-nowrap">Annuler</button>
              <button onClick={() => { deleteSubscription(deleteId); setDeleteId(null); }} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
