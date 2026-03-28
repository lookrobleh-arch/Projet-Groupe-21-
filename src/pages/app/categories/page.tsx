import { useState } from 'react';
import { useApp } from '../../../store/AppContext';

const iconOptions = ['ri-briefcase-line','ri-restaurant-line','ri-bus-line','ri-gamepad-line','ri-heart-pulse-line','ri-building-line','ri-computer-line','ri-smartphone-line','ri-wifi-line','ri-plane-line','ri-car-line','ri-shopping-bag-line','ri-book-open-line','ri-music-line','ri-film-line','ri-gift-line','ri-tools-line','ri-trophy-line','ri-run-line','ri-repeat-line'];
const colorOptions = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#f97316','#0ea5e9','#22c55e','#14b8a6','#64748b'];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [form, setForm] = useState({ name: '', icon: iconOptions[0], color: colorOptions[0], type: 'expense' as 'income' | 'expense' | 'both' });
  const [error, setError] = useState('');

  const filtered = categories.filter(c => filter === 'all' || c.type === filter || c.type === 'both');

  const openNew = () => { setEditId(null); setForm({ name: '', icon: iconOptions[0], color: colorOptions[0], type: 'expense' }); setError(''); setShowModal(true); };
  const openEdit = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    setEditId(id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type });
    setError('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { setError('Nom requis'); return; }
    if (editId) {
      updateCategory(editId, form);
    } else {
      addCategory(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => deleteCategory(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Catégories</h2>
          <p className="text-sm text-gray-400">Personnalisez vos catégories — synchronisées avec toute l&apos;app</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />Nouvelle catégorie
        </button>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        {(['all', 'income', 'expense'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${filter === f ? 'bg-white text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {f === 'all' ? 'Toutes' : f === 'income' ? 'Revenus' : 'Dépenses'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-price-tag-3-line text-2xl" /></div>
          <p className="font-semibold text-slate-700 mb-1">Aucune catégorie</p>
          <p className="text-sm text-gray-400 mb-4">Créez des catégories personnalisées.</p>
          <button onClick={openNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors mx-auto"><i className="ri-add-line" />Créer</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 group hover:border-indigo-100 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                <i className={`${c.icon} text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.type === 'income' ? 'bg-emerald-50 text-emerald-600' : c.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                  {c.type === 'income' ? 'Revenu' : c.type === 'expense' ? 'Dépense' : 'Les deux'}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c.id)} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 cursor-pointer"><i className="ri-edit-line text-sm" /></button>
                <button onClick={() => handleDelete(c.id)} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"><i className="ri-delete-bin-line text-sm" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">{editId ? 'Modifier' : 'Nouvelle catégorie'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            {error && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Sport" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'income' | 'expense' | 'both'})} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer">
                  <option value="expense">Dépense</option>
                  <option value="income">Revenu</option>
                  <option value="both">Les deux</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Icône</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(ic => (
                    <button key={ic} onClick={() => setForm({...form, icon: ic})} className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${form.icon === ic ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                      <i className={`${ic} text-sm`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(col => (
                    <button key={col} onClick={() => setForm({...form, color: col})} className={`w-8 h-8 rounded-lg border-2 transition-all cursor-pointer ${form.color === col ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: col }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">{editId ? 'Modifier' : 'Créer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
