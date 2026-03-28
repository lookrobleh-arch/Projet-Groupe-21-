import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../store/AppContext';
import type { Transaction, TransactionType } from '../../../store/types';

function AddModal({ accounts, expenseCats, incomeCats, onAdd, categorize, saveCorrection, onClose, getAccountBalance }: {
  accounts: { id: string; name: string }[];
  expenseCats: { name: string }[];
  incomeCats: { name: string }[];
  onAdd: (tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => { success: boolean; error?: string };
  categorize: (label: string) => string;
  saveCorrection: (label: string, category: string) => void;
  getAccountBalance: (accountId: string) => number;
  onClose: () => void;
}) {
  const firstAccountId = accounts[0]?.id ?? '';
  const [form, setForm] = useState({
    type: 'expense' as TransactionType,
    label: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: expenseCats[0]?.name ?? 'Autres',
    accountId: firstAccountId,
    status: 'validated' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryManuallySet, setCategoryManuallySet] = useState(false);

  const currentCats = form.type === 'expense' ? expenseCats : incomeCats;
  const selectedBalance = form.accountId ? getAccountBalance(form.accountId) : 0;

  useEffect(() => {
    if (!categoryManuallySet && form.label.length >= 3) {
      const suggested = categorize(form.label);
      const exists = currentCats.some(c => c.name === suggested);
      setForm(prev => ({ ...prev, category: exists ? suggested : (currentCats[0]?.name ?? 'Autres') }));
    }
  }, [form.label, form.type, categoryManuallySet, categorize, currentCats]);

  useEffect(() => {
    setCategoryManuallySet(false);
    const defaultCat = form.type === 'expense' ? expenseCats[0]?.name : incomeCats[0]?.name;
    setForm(prev => ({ ...prev, category: defaultCat ?? 'Autres' }));
  }, [form.type]);  // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) { setError('Libellé requis'); return; }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) { setError('Montant invalide'); return; }
    if (!form.accountId) { setError('Veuillez sélectionner un compte'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    saveCorrection(form.label, form.category);
    const result = onAdd({ ...form, amount: amt, source: 'manual' });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Erreur lors de l\'ajout');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Nouvelle transaction</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"><i className="ri-close-line text-gray-400" /></button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            <i className="ri-error-warning-line flex-shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
            <div className="flex gap-2 mt-1.5">
              {[{ v: 'expense' as const, l: 'Dépense' }, { v: 'income' as const, l: 'Revenu' }].map(t => (
                <button key={t.v} type="button" onClick={() => setForm({ ...form, type: t.v })}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all ${form.type === t.v ? (t.v === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white') : 'bg-gray-100 text-gray-600'}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Libellé</label>
            <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Ex: Courses Carrefour"
              className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            {form.label.length >= 3 && !categoryManuallySet && (
              <p className="text-[10px] text-indigo-500 mt-1">
                <i className="ri-robot-2-line mr-0.5" />Catégorie suggérée : <strong>{form.category}</strong>
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant (€)</label>
            <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00"
              className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
              <select value={form.category} onChange={e => { setForm({ ...form, category: e.target.value }); setCategoryManuallySet(true); }}
                className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                {currentCats.map(c => <option key={c.name}>{c.name}</option>)}
                {!currentCats.some(c => c.name === 'Autres') && <option>Autres</option>}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte</label>
            {accounts.length === 0 ? (
              <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-3 py-2 rounded-lg">Aucun compte. Créez-en un d&apos;abord.</p>
            ) : (
              <>
                <select value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })}
                  className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {form.type === 'expense' && form.accountId && (
                  <p className={`text-[10px] mt-1 font-medium ${selectedBalance < parseFloat(form.amount || '0') ? 'text-red-500' : 'text-gray-400'}`}>
                    Solde disponible : <strong>{selectedBalance.toFixed(2)}€</strong>
                    {selectedBalance < parseFloat(form.amount || '0') && ' — Insuffisant !'}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><i className="ri-loader-4-line animate-spin" />...</> : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { transactions, accounts, addTransaction, deleteTransaction, updateTransaction, expenseCategories, incomeCategories, categorizeTransaction, saveCategorizationCorrection, getAccountBalance, formatCurrency } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [catFilter, setCatFilter] = useState('Toutes');
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCatValue, setEditCatValue] = useState('');

  const allCategories = useMemo(() => {
    const names = new Set([...expenseCategories.map(c => c.name), ...incomeCategories.map(c => c.name), 'Autres']);
    return Array.from(names);
  }, [expenseCategories, incomeCategories]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.label.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter);
    if (catFilter !== 'Toutes') list = list.filter(t => t.category === catFilter);
    list.sort((a, b) => {
      const av = sortKey === 'date' ? a.date : a.amount;
      const bv = sortKey === 'date' ? b.date : b.amount;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [transactions, search, typeFilter, catFilter, sortKey, sortDir]);

  const monthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const monthlyTx = transactions.filter(t => t.date.startsWith(monthKey));
  const totalRevenus = monthlyTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalDepenses = monthlyTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const solde = totalRevenus - totalDepenses;

  const toggleSort = (key: 'date' | 'amount') => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const accountMap = useMemo(() => Object.fromEntries(accounts.map(a => [a.id, a.name])), [accounts]);

  const handleCategoryEdit = (txId: string, current: string) => {
    setEditingCategory(txId);
    setEditCatValue(current);
  };

  const handleCategorySave = (txId: string, label: string) => {
    updateTransaction(txId, { category: editCatValue });
    saveCategorizationCorrection(label, editCatValue);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Transactions</h2>
          <p className="text-sm text-gray-400">Tous vos revenus et dépenses — catégorisation automatique</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />Nouvelle transaction
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Revenus (mois)', val: totalRevenus, icon: 'ri-arrow-up-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50', prefix: '+' },
          { label: 'Dépenses (mois)', val: totalDepenses, icon: 'ri-arrow-down-circle-line', color: 'text-red-500', bg: 'bg-red-50', prefix: '-' },
          { label: 'Solde (mois)', val: solde, icon: 'ri-scales-3-line', color: solde >= 0 ? 'text-indigo-600' : 'text-red-500', bg: solde >= 0 ? 'bg-indigo-50' : 'bg-red-50', prefix: solde >= 0 ? '+' : '' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 ${k.bg} ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
            <div>
              <p className="text-xs text-gray-400">{k.label}</p>
              {transactions.length === 0 ? <p className="text-sm text-gray-300">Aucune donnée</p>
                : <p className={`text-xl font-black ${k.color}`}>{k.prefix}{k.val.toLocaleString('fr', { minimumFractionDigits: 2 })}€</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {[{ val: 'all', l: 'Tout' }, { val: 'income', l: 'Revenus' }, { val: 'expense', l: 'Dépenses' }].map(t => (
            <button key={t.val} onClick={() => setTypeFilter(t.val as typeof typeFilter)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${typeFilter === t.val ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500'}`}>{t.l}</button>
          ))}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white cursor-pointer">
          {['Toutes', ...allCategories].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4">
              <i className="ri-exchange-funds-line text-2xl" />
            </div>
            {transactions.length === 0 ? (
              <>
                <p className="font-semibold text-slate-700 mb-1">Aucune transaction</p>
                <p className="text-sm text-gray-400 mb-4">Ajoutez votre première transaction pour commencer.</p>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors mx-auto">
                  <i className="ri-add-line" />Ajouter ma première transaction
                </button>
              </>
            ) : <p className="text-sm text-gray-400">Aucun résultat pour ces filtres.</p>}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Libellé</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Catégorie</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Compte</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 whitespace-nowrap" onClick={() => toggleSort('date')}>
                    Date {sortKey === 'date' && <i className={`ri-arrow-${sortDir === 'desc' ? 'down' : 'up'}-line`} />}
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 whitespace-nowrap" onClick={() => toggleSort('amount')}>
                    Montant {sortKey === 'amount' && <i className={`ri-arrow-${sortDir === 'desc' ? 'down' : 'up'}-line`} />}
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          <i className={`${t.source === 'ocr' ? 'ri-scan-2-line' : t.source === 'subscription' ? 'ri-repeat-line' : t.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-sm`} />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{t.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {editingCategory === t.id ? (
                        <div className="flex gap-1 items-center">
                          <select value={editCatValue} onChange={e => setEditCatValue(e.target.value)} className="text-xs border border-indigo-300 rounded px-2 py-1 bg-white focus:outline-none">
                            {allCategories.map(c => <option key={c}>{c}</option>)}
                          </select>
                          <button onClick={() => handleCategorySave(t.id, t.label)} className="w-6 h-6 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"><i className="ri-check-line text-xs" /></button>
                          <button onClick={() => setEditingCategory(null)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded cursor-pointer"><i className="ri-close-line text-xs" /></button>
                        </div>
                      ) : (
                        <button onClick={() => handleCategoryEdit(t.id, t.category)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors whitespace-nowrap group">
                          {t.category} <i className="ri-edit-line opacity-0 group-hover:opacity-100 ml-0.5" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{accountMap[t.accountId] ?? '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('fr', { minimumFractionDigits: 2 })}€
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setDeleteId(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</span>
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-500 font-medium">
                <i className="ri-robot-2-line" />Catégorisation automatique active
              </div>
            </div>
          </>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto mb-4"><i className="ri-delete-bin-line text-xl" /></div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Supprimer la transaction ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
              <button onClick={() => { deleteTransaction(deleteId); setDeleteId(null); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddModal
          accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
          expenseCats={expenseCategories}
          incomeCats={incomeCategories}
          onAdd={addTransaction}
          categorize={categorizeTransaction}
          saveCorrection={saveCategorizationCorrection}
          getAccountBalance={(accountId: string) => {
            const acc = accounts.find(a => a.id === accountId);
            return acc ? getAccountBalance(acc) : 0;
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
