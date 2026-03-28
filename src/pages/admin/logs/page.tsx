import { useState } from 'react';
import { adminLogs } from '../../../mocks/adminMetrics';

const levelConfig: Record<string, { color: string; bg: string }> = {
  info: { color: 'text-indigo-700', bg: 'bg-indigo-50' },
  warn: { color: 'text-amber-700', bg: 'bg-amber-50' },
  error: { color: 'text-red-700', bg: 'bg-red-50' },
};

const serviceColors: Record<string, string> = {
  auth: 'bg-indigo-50 text-indigo-700',
  ocr: 'bg-cyan-50 text-cyan-700',
  ai: 'bg-violet-50 text-violet-700',
  api: 'bg-slate-100 text-slate-600',
  email: 'bg-amber-50 text-amber-700',
  database: 'bg-emerald-50 text-emerald-700',
  backup: 'bg-teal-50 text-teal-700',
};

export default function AdminLogs() {
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [search, setSearch] = useState('');

  const services = ['all', ...Array.from(new Set(adminLogs.map(l => l.service)))];

  const filtered = adminLogs.filter(l => {
    const matchLevel = filterLevel === 'all' || l.level === filterLevel;
    const matchService = filterService === 'all' || l.service === filterService;
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchService && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Logs Système</h2>
          <p className="text-sm text-gray-400">Journaux filtrables et exportables en temps réel</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-download-line" /></div>
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Infos', value: adminLogs.filter(l => l.level === 'info').length, color: 'bg-indigo-50 text-indigo-600', icon: 'ri-information-line' },
          { label: 'Avertissements', value: adminLogs.filter(l => l.level === 'warn').length, color: 'bg-amber-50 text-amber-600', icon: 'ri-alert-line' },
          { label: 'Erreurs', value: adminLogs.filter(l => l.level === 'error').length, color: 'bg-red-50 text-red-500', icon: 'ri-close-circle-line' },
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans les logs..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
          </div>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            <option value="all">Tous niveaux</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <select value={filterService} onChange={e => setFilterService(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            {services.map(s => <option key={s} value={s}>{s === 'all' ? 'Tous services' : s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <p className="text-xs text-slate-400 font-mono">{filtered.length} entrées</p>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Live</span>
        </div>
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {filtered.map(log => {
            const lvl = levelConfig[log.level] || { color: 'text-gray-400', bg: 'bg-gray-800' };
            return (
              <div key={log.id} className="flex items-start gap-3 font-mono text-xs">
                <span className="text-slate-500 whitespace-nowrap flex-shrink-0">{log.timestamp}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${lvl.bg} ${lvl.color}`}>{log.level}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${serviceColors[log.service] || 'bg-slate-800 text-slate-400'}`}>{log.service}</span>
                <span className="text-slate-300 flex-1">{log.message}</span>
                {log.userId && <span className="text-slate-600 flex-shrink-0">[{log.userId}]</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
