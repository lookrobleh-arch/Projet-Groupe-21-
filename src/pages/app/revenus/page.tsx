import { useState } from 'react';
import { mockTransactions, mockIncomeCategories, type Transaction } from '../../../mocks/transactions';
import { mockAccounts } from '../../../mocks/goals';

const incomes = mockTransactions.filter(t => t.type === 'income');
const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

function Modal({ onClose, initial }: { onClose: () => void; initial?: Transaction }) {
  const [form, setForm] = useState({ label: initial?.label || '', amount: initial?.amount?.toString() || '', category: initial?.category || mockIncomeCategories[0], account: initial?.account || mockAccounts[0].name, date: initial?.date || new Date().toISOString().split('T')[0], note: initial?.note || '' });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">{initial ? 'Modifier le revenu' : 'Nouveau revenu'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Ex: Salaire avril" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant (€)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400">
              {mockIncomeCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte</label>
            <select value={form.account} onChange={e => setForm({...form, account: e.target.value})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400">
              {mockAccounts.map(a => <option key={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Note (optionnel)</label>
            <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Remarque..." className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">
            {initial ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RevenusPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Transaction | undefined>();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Toutes');

  const filtered = incomes.filter(t => {
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Toutes' || t.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {showModal && <Modal onClose={() => { setShowModal(false); setEditItem(undefined); }} initial={editItem} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Revenus</h2>
          <p className="text-sm text-gray-400">Total ce mois : <span className="font-bold text-emerald-600">{totalIncome.toLocaleString('fr')}€</span></p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
          Ajouter un revenu
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total ce mois', value: `${totalIncome.toLocaleString('fr')}€`, icon: 'ri-money-euro-circle-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Salaire', value: '3 500€', icon: 'ri-briefcase-line', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Revenus extra', value: '1 300€', icon: 'ri-star-line', color: 'bg-amber-50 text-amber-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}>
              <i className={`${k.icon} text-lg`} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">{k.value}</p>
              <p className="text-xs text-gray-400">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
              <i className="ri-search-line text-sm" />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer">
            <option value="Toutes">Toutes catégories</option>
            {mockIncomeCategories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {['Description', 'Catégorie', 'Compte', 'Date', 'Montant', 'Statut', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
                        <i className="ri-arrow-up-line text-sm" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{t.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">{t.category}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{t.account}</td>
                  <td className="px-5 py-3 text-sm text-gray-400 whitespace-nowrap">{t.date}</td>
                  <td className="px-5 py-3 text-sm font-bold text-emerald-600 whitespace-nowrap">+{t.amount.toLocaleString('fr')}€</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${t.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>{t.status === 'confirmed' ? 'Confirmé' : 'En attente'}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditItem(t); setShowModal(true); }} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 cursor-pointer"><i className="ri-edit-line text-sm" /></button>
                      <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"><i className="ri-delete-bin-line text-sm" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
