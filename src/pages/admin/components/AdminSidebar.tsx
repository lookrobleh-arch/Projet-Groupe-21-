import { NavLink } from 'react-router-dom';

const LOGO_URL = 'https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png';

const adminNav = [
  { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
  { label: 'Utilisateurs', icon: 'ri-team-line', path: '/admin/utilisateurs' },
  { label: 'Statistiques', icon: 'ri-bar-chart-2-line', path: '/admin/statistiques' },
];

const systemNav = [
  { label: 'Sécurité', icon: 'ri-lock-line', path: '/admin/securite' },
  { label: 'Sauvegardes', icon: 'ri-server-line', path: '/admin/sauvegardes' },
  { label: 'IA & OCR', icon: 'ri-robot-2-line', path: '/admin/ia-ocr' },
];

type Props = { collapsed: boolean; onToggle: () => void };

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  return (
    <div className={`flex flex-col h-full bg-slate-950 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
      <div className={`flex items-center h-16 border-b border-slate-800 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <img src={LOGO_URL} alt="DepenseEasy" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        {!collapsed && (
          <div>
            <span className="font-bold text-white text-sm block">DepenseEasy</span>
            <span className="text-[10px] text-amber-400 font-semibold">ADMIN</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        <AdminNavGroup label="Principal" collapsed={collapsed} items={adminNav} />
        <AdminNavGroup label="Système" collapsed={collapsed} items={systemNav} />
      </div>

      <div className="border-t border-slate-800 p-3">
        <button onClick={onToggle} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-sm`} />
          </div>
          {!collapsed && 'Réduire'}
        </button>
      </div>
    </div>
  );
}

function AdminNavGroup({ label, collapsed, items }: { label: string; collapsed: boolean; items: typeof adminNav }) {
  return (
    <div>
      {!collapsed && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">{label}</p>}
      <div className="space-y-0.5">
        {items.map(item => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}>
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className={`${item.icon} text-base`} /></div>
            {!collapsed && <span className="flex-1">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
