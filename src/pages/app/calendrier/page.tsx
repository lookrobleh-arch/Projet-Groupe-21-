import { useState, useMemo } from 'react';
import { useApp } from '../../../store/AppContext';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const BIG_BILL_KEYWORDS = ['loyer', 'rent', 'assurance', 'insurance', 'impôt', 'taxe', 'credit', 'crédit', 'hypothèque', 'emprunt', 'mensualité', 'mutuelle', 'cotisation'];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }

export default function CalendrierPage() {
  const { transactions, subscriptions, formatCurrency } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  type CalEvent = {
    date: string; type: 'income' | 'expense' | 'subscription' | 'big_bill';
    label: string; amount: number; color: string; isBigBill?: boolean;
  };

  const allEvents = useMemo((): CalEvent[] => {
    const events: CalEvent[] = [];
    transactions.forEach(t => {
      const isBigBill = t.type === 'expense' && (t.amount >= 200 || BIG_BILL_KEYWORDS.some(k => t.label.toLowerCase().includes(k)));
      events.push({ date: t.date, type: isBigBill ? 'big_bill' : t.type, label: t.label, amount: t.amount, color: isBigBill ? '#f59e0b' : (t.type === 'income' ? '#10b981' : '#ef4444'), isBigBill });
    });
    subscriptions.filter(s => s.status === 'active').forEach(s => {
      const isBigBill = s.amount >= 100 || BIG_BILL_KEYWORDS.some(k => s.name.toLowerCase().includes(k));
      events.push({ date: s.nextDate, type: isBigBill ? 'big_bill' : 'subscription', label: s.name, amount: s.amount, color: isBigBill ? '#f59e0b' : (s.color || '#6366f1'), isBigBill });
    });
    return events;
  }, [transactions, subscriptions]);

  // Upcoming big bills (next 30 days)
  const upcomingBigBills = useMemo(() => {
    const now = new Date();
    return allEvents.filter(e => {
      if (!e.isBigBill) return false;
      const d = new Date(e.date);
      const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    }).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [allEvents]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(e => e.date === dateStr);
  };

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];
  const hasAnyEvent = allEvents.length > 0;

  const monthTotal = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthTx = transactions.filter(t => t.date.startsWith(prefix));
    return {
      income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions, year, month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Calendrier Financier</h2>
          <p className="text-sm text-gray-400">Transactions, prélèvements et échéances importantes</p>
        </div>
        {hasAnyEvent && (
          <div className="flex items-center gap-4 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2">
            <span className="text-emerald-600 font-semibold">+{formatCurrency(monthTotal.income)}</span>
            <span className="text-red-500 font-semibold">-{formatCurrency(monthTotal.expense)}</span>
          </div>
        )}
      </div>

      {/* Upcoming big bills section */}
      {upcomingBigBills.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600"><i className="ri-calendar-event-line text-sm" /></div>
            <p className="font-bold text-amber-800 text-sm">Échéances importantes (30 prochains jours)</p>
            <span className="text-xs bg-amber-200 text-amber-800 font-semibold px-2 py-0.5 rounded-full">{upcomingBigBills.length}</span>
          </div>
          <div className="space-y-2">
            {upcomingBigBills.map((bill, i) => {
              const daysLeft = Math.ceil((new Date(bill.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                      <i className="ri-money-euro-circle-line text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{bill.label}</p>
                      <p className="text-[10px] text-gray-400">{new Date(bill.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${daysLeft <= 3 ? 'bg-red-100 text-red-600' : daysLeft <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {daysLeft === 0 ? "Aujourd'hui" : `Dans ${daysLeft}j`}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(bill.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasAnyEvent ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mx-auto mb-4"><i className="ri-calendar-line text-3xl" /></div>
          <p className="font-semibold text-slate-700 mb-2">Aucun événement financier</p>
          <p className="text-sm text-gray-400">Ajoutez des transactions ou des abonnements pour les voir ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"><i className="ri-arrow-left-s-line" /></button>
              <p className="font-bold text-slate-900">{MONTHS[month]} {year}</p>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"><i className="ri-arrow-right-s-line" /></button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const events = getEventsForDay(day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selectedDay;
                const hasIncome = events.some(e => e.type === 'income');
                const hasExpense = events.some(e => e.type === 'expense');
                const hasSub = events.some(e => e.type === 'subscription');
                const hasBigBill = events.some(e => e.type === 'big_bill');
                return (
                  <button key={i} onClick={() => setSelectedDay(day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer ${isSelected ? 'bg-indigo-600 text-white' : hasBigBill ? 'bg-amber-50 text-amber-800' : isToday ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-slate-700'}`}>
                    {day}
                    {events.length > 0 && (
                      <div className="absolute bottom-0.5 flex gap-0.5">
                        {hasIncome && <span className="w-1 h-1 bg-emerald-400 rounded-full" />}
                        {hasExpense && <span className="w-1 h-1 bg-red-400 rounded-full" />}
                        {hasSub && <span className="w-1 h-1 bg-indigo-400 rounded-full" />}
                        {hasBigBill && <span className="w-1 h-1 bg-amber-400 rounded-full" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" /> Revenu</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> Dépense</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-400 rounded-full" /> Abonnement</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" /> Grosse facture</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="font-semibold text-slate-900 mb-1">
              {selectedDay ? `${selectedDay} ${MONTHS[month]}` : 'Sélectionnez un jour'}
            </p>
            <p className="text-xs text-gray-400 mb-4">{selectedEvents.length} événement{selectedEvents.length > 1 ? 's' : ''}</p>
            {selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-gray-200">
                <div className="w-10 h-10 flex items-center justify-center"><i className="ri-calendar-line text-3xl" /></div>
                <p className="text-sm text-gray-300">Aucun événement ce jour</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((e, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${e.isBigBill ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: `${e.color}20`, color: e.color }}>
                      <i className={`${e.type === 'income' ? 'ri-arrow-up-line' : e.type === 'subscription' ? 'ri-repeat-line' : e.isBigBill ? 'ri-money-euro-circle-line' : 'ri-arrow-down-line'} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.label}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] text-gray-400 capitalize">{e.isBigBill ? '⚠️ Grosse facture' : e.type === 'subscription' ? 'Abonnement' : e.type === 'income' ? 'Revenu' : 'Dépense'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: e.color }}>{e.type === 'income' ? '+' : '-'}{formatCurrency(e.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
