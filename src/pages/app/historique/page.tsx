import { useState } from 'react';
import { mockTransactions } from '../../../mocks/transactions';

export default function HistoriquePage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const categories = ['all', ...Array.from(new Set(mockTransactions.map(t => t.category)))];

  const filtered = mockTransactions
    .filter(t => {
      const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCat === 'all' || t.category === filterCat;
      const matchFrom = !dateFrom || t.date >= dateFrom;
      const matchTo = !dateTo || t.date <= dateTo;
      return matchSearch && matchType && matchCat && matchFrom && matchTo;
    })
    .sort((a, b) => {
      const factor = sortDir === 'desc' ? -1 : 1;
      if (sortBy === 'date') return factor * a.date.localeCompare(b.date);
      return factor * (a.amount - b.amount);
    });

  const totalIn = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const toggleSort = (col: 'date' | 'amount') => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Historique</h2>
        <p className="text-sm text-gray-400">Recherche et filtrage avancé de toutes vos transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
            <i className="ri-arrow-up-circle-line text-lg" />
          </div>
          <div>
            <p className="text-lg font-black text-emerald-600">+{totalIn.toLocaleString('fr')}€</p>
            <p className="text-xs text-gray-400">Revenus filtrés</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 flex-shrink-0">
            <i className="ri-arrow-down-circle-line text-lg" />
          </div>
          <div>
            <p className="text-lg font-black text-red-500">-{totalOut.toLocaleString('fr')}€</p>
            <p className="text-xs text-gray-400">Dépenses filtrées</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0">
            <i className="ri-list-check text-lg" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{filtered.length}</p>
            <p className="text-xs text-gray-400">Transactions</p>
          </div>
        </div>
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
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer">
            <option value="all">Tous types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer">
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Toutes catégories' : c}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer" placeholder="Du" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer" placeholder="Au" />
          <button onClick={() => { setSearch(''); setFilterType('all'); setFilterCat('all'); setDateFrom(''); setDateTo(''); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Description</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Catégorie</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Compte</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 cursor-pointer hover:text-gray-600 whitespace-nowrap" onClick={() => toggleSort('date')}>
                  Date {sortBy === 'date' && <i className={`ri-arrow-${sortDir === 'desc' ? 'down' : 'up'}-line text-xs`} />}
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 cursor-pointer hover:text-gray-600" onClick={() => toggleSort('amount')}>
                  Montant {sortBy === 'amount' && <i className={`ri-arrow-${sortDir === 'desc' ? 'down' : 'up'}-line text-xs`} />}
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        <i className={`${t.type === 'income' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-sm`} />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{t.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">{t.category}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{t.account}</td>
                  <td className="px-5 py-3 text-sm text-gray-400 whitespace-nowrap">{t.date}</td>
                  <td className={`px-5 py-3 text-sm font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('fr')}€
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${t.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
                      {t.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-300">
            <div className="w-12 h-12 flex items-center justify-center">
              <i className="ri-search-line text-4xl" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucune transaction trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
