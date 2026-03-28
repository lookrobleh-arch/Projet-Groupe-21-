import { useState } from 'react';
import { useApp } from '../../../store/AppContext';
import type { Goal } from '../../../store/types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
const ICONS = ['ri-home-4-line', 'ri-plane-line', 'ri-car-line', 'ri-graduation-cap-line', 'ri-heart-line', 'ri-trophy-line', 'ri-bank-line', 'ri-smartphone-line'];
const CATEGORIES = ['Immobilier', 'Voyage', 'Véhicule', 'Éducation', 'Santé', 'Retraite', 'Épargne', 'Autre'];

function DailySavingsPlan({ goal }: { goal: Goal }) {
  const [showPlan, setShowPlan] = useState(false);
  const today = new Date();
  const deadline = new Date(goal.deadline);
  const totalDays = Math.max(Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)), 1);
  const remaining = goal.target - goal.current;
  const dailyAmount = remaining / totalDays;

  if (remaining <= 0) return null;

  const planDays = Math.min(7, totalDays);

  return (
    <div className="mt-3 border-t border-gray-50 pt-3">
      <button onClick={() => setShowPlan(!showPlan)} className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
        <i className={`ri-calendar-schedule-line`} />
        Plan d&apos;épargne quotidien
        <i className={`ri-arrow-${showPlan ? 'up' : 'down'}-s-line`} />
      </button>
      {showPlan && (
        <div className="mt-2 space-y-1.5">
          <div className="bg-indigo-50 rounded-lg px-3 py-2 text-xs text-indigo-700 font-medium">
            Épargner <span className="font-black">{dailyAmount.toLocaleString('fr', { minimumFractionDigits: 2 })}€/jour</span> pendant {totalDays} jours
          </div>
          {Array.from({ length: planDays }, (_, i) => {
            const cumulative = dailyAmount * (i + 1);
            return (
              <div key={i} className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                <span className="font-medium">Jour {i + 1}</span>
                <span className="text-gray-400">Total cumulé :</span>
                <span className="font-bold text-slate-900">{cumulative.toLocaleString('fr', { minimumFractionDigits: 2 })}€</span>
              </div>
            );
          })}
          {totalDays > 7 && (
            <p className="text-[10px] text-gray-400 px-1">… jusqu&apos;au jour {totalDays} = <strong>{remaining.toLocaleString('fr', { minimumFractionDigits: 2 })}€</strong> atteint</p>
          )}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, accounts, onDelete, onAddSavings }: {
  goal: Goal;
  accounts: { id: string; name: string; balance: number }[];
  onDelete: () => void;
  onAddSavings: (amount: number, accountId: string) => { success: boolean; error?: string };
}) {
  const pct = goal.target > 0 ? Math.min(Math.round((goal.current / goal.target) * 100), 100) : 0;
  const remaining = goal.target - goal.current;
  const deadline = new Date(goal.deadline).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? '');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const v = parseFloat(amount);
    if (isNaN(v) || v <= 0) { setError('Montant invalide'); return; }
    if (!selectedAccountId) { setError('Choisissez un compte'); return; }
    const result = onAddSavings(v, selectedAccountId);
    if (!result.success) { setError(result.error ?? 'Erreur'); return; }
    setAmount('');
    setAdding(false);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: `${goal.color}18`, color: goal.color }}>
            <i className={`${goal.icon} text-xl`} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{goal.name}</p>
            <p className="text-xs text-gray-400">{goal.category}</p>
          </div>
        </div>
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"><i className="ri-delete-bin-line text-sm" /></button>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-black text-slate-900">{goal.current.toLocaleString('fr')}€</span>
          <span className="text-sm text-gray-400 self-end">/ {goal.target.toLocaleString('fr')}€</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>{pct}% atteint</span>
          <span>{remaining.toLocaleString('fr')}€ restants</span>
        </div>
      </div>
      <div className="border-t border-gray-50 pt-3 grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wide">Mensualité</p>
          <p className="text-sm font-bold text-slate-900">{goal.monthlyContribution > 0 ? `${goal.monthlyContribution}€/mois` : '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wide">Échéance</p>
          <p className="text-sm font-bold text-slate-900">{deadline}</p>
        </div>
        {pct >= 100 && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-emerald-600">Objectif atteint !</p>
          </div>
        )}
      </div>

      <DailySavingsPlan goal={goal} />

      {pct < 100 && (
        adding ? (
          <div className="mt-3 space-y-2">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <i className="ri-error-warning-line flex-shrink-0" />{error}
              </div>
            )}
            {accounts.length > 1 && (
              <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {a.balance.toFixed(2)}€</option>)}
              </select>
            )}
            {accounts.length === 1 && (
              <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                Compte : <strong>{accounts[0]?.name}</strong> — Solde : <strong>{accounts[0]?.balance.toFixed(2)}€</strong>
              </p>
            )}
            <div className="flex gap-2">
              <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Montant (€)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              <button onClick={handleAdd} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg cursor-pointer whitespace-nowrap">OK</button>
              <button onClick={() => { setAdding(false); setError(''); }} className="px-3 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg cursor-pointer whitespace-nowrap">✕</button>
            </div>
            <p className="text-[10px] text-gray-400">Le montant sera déduit du compte sélectionné. Un solde insuffisant sera refusé.</p>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="mt-3 w-full py-2 border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-lg cursor-pointer whitespace-nowrap hover:bg-indigo-50 transition-colors">
            <i className="ri-add-line mr-1" />Ajouter des économies
          </button>
        )
      )}
    </div>
  );
}

export default function ObjectifsPage() {
  const { goals, accounts, addGoal, updateGoal, deleteGoal, addTransaction, getAccountBalance, formatCurrency } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', target: '', monthly: '', deadline: '', category: 'Épargne', color: COLORS[0], icon: ICONS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const totalMonthly = goals.reduce((s, g) => s + g.monthlyContribution, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(form.target);
    const monthly = parseFloat(form.monthly || '0');
    if (!form.name.trim()) { setError('Nom requis'); return; }
    if (isNaN(target) || target <= 0) { setError('Montant cible invalide'); return; }
    if (!form.deadline) { setError('Date limite requise'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    addGoal({ name: form.name, target, current: 0, monthlyContribution: monthly, deadline: form.deadline, category: form.category, color: form.color, icon: form.icon });
    setLoading(false);
    setShowModal(false);
    setForm({ name: '', target: '', monthly: '', deadline: '', category: 'Épargne', color: COLORS[0], icon: ICONS[0] });
    setError('');
  };

  const handleAddSavings = (goal: Goal, amount: number, accountId: string): { success: boolean; error?: string } => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return { success: false, error: 'Compte introuvable' };
    const balance = getAccountBalance(account);
    if (balance < amount) {
      return { success: false, error: 'Solde insuffisant. Veuillez recharger votre compte.' };
    }
    updateGoal(goal.id, { current: goal.current + amount });
    addTransaction({
      accountId, type: 'expense', amount, category: 'Épargne',
      label: `Épargne — ${goal.name}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'validated', source: 'goal',
    });
    return { success: true };
  };

  const accountsWithBalance = accounts.map(a => ({ id: a.id, name: a.name, balance: getAccountBalance(a) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Objectifs d&apos;Épargne</h2>
          <p className="text-sm text-gray-400">Suivez vos projets — épargne déduite automatiquement de votre compte</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-add-line" />Nouvel objectif
        </button>
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Épargne totale', value: `${formatCurrency(totalCurrent)}`, sub: `sur ${formatCurrency(totalTarget)}`, icon: 'ri-safe-line', color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Contribution mensuelle', value: `${formatCurrency(totalMonthly)}/mois`, sub: 'planifiée', icon: 'ri-calendar-line', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Objectifs actifs', value: `${goals.length}`, sub: 'en cours', icon: 'ri-trophy-line', color: 'bg-amber-50 text-amber-600' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${k.color}`}><i className={`${k.icon} text-lg`} /></div>
              <div><p className="text-lg font-black text-slate-900">{k.value}</p><p className="text-xs text-gray-400">{k.label}</p><p className="text-[10px] text-gray-300">{k.sub}</p></div>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-trophy-line text-3xl" /></div>
          <p className="font-semibold text-slate-700 mb-1">Aucun objectif d&apos;épargne</p>
          <p className="text-sm text-gray-400 mb-4">Créez votre premier objectif.</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors mx-auto"><i className="ri-add-line" />Créer mon premier objectif</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map(g => (
            <GoalCard
              key={g.id} goal={g} accounts={accountsWithBalance}
              onDelete={() => setDeleteId(g.id)}
              onAddSavings={(amount, accountId) => handleAddSavings(g, amount, accountId)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Nouvel objectif</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"><i className="ri-close-line" /></button>
            </div>
            {error && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Voyage au Japon" required className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant cible (€)</label>
                  <input type="number" min="0" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="5000" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contribution/mois (€)</label>
                  <input type="number" min="0" value={form.monthly} onChange={e => setForm({ ...form, monthly: e.target.value })} placeholder="300" className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date limite</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Couleur &amp; Icône</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COLORS.map(c => <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(ic => <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })} className={`w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer transition-all ${form.icon === ic ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}><i className={`${ic} text-base`} /></button>)}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><i className="ri-loader-4-line animate-spin" />...</> : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Supprimer cet objectif ?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 cursor-pointer whitespace-nowrap">Annuler</button>
              <button onClick={() => { deleteGoal(deleteId); setDeleteId(null); }} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
