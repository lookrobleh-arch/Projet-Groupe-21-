import { NavLink } from 'react-router-dom';

const LOGO_URL = 'https://public.readdy.ai/ai/img_res/4a9ad0c1-5b27-4ad7-a2c5-8ce8bbd51100.png';

type NavItem = {
  label: string;
  icon: string;
  path: string;
  badge?: string;
  badgeColor?: string;
};

const coreNav: NavItem[] = [
  { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/app/dashboard' },
  { label: 'Transactions', icon: 'ri-exchange-line', path: '/app/transactions' },
  { label: 'Comptes', icon: 'ri-bank-line', path: '/app/comptes' },
  { label: 'Budgets', icon: 'ri-pie-chart-2-line', path: '/app/budgets' },
];

const advancedNav: NavItem[] = [
  { label: 'Assistant IA', icon: 'ri-robot-2-line', path: '/app/ia', badge: 'IA', badgeColor: 'bg-violet-100 text-violet-700' },
  { label: 'Scan de Reçu', icon: 'ri-scan-2-line', path: '/app/ocr' },
  { label: 'Prévisions', icon: 'ri-line-chart-line', path: '/app/previsions' },
  { label: 'Abonnements', icon: 'ri-repeat-line', path: '/app/abonnements' },
  { label: 'Objectifs', icon: 'ri-trophy-line', path: '/app/objectifs' },
  { label: 'Santé Financière', icon: 'ri-heart-pulse-line', path: '/app/sante' },
  { label: 'Calendrier', icon: 'ri-calendar-line', path: '/app/calendrier' },
];

const settingsNav: NavItem[] = [
  { label: 'Catégories', icon: 'ri-price-tag-3-line', path: '/app/categories' },
  { label: 'Paramètres', icon: 'ri-settings-3-line', path: '/app/parametres' },
];

type Props = { collapsed: boolean; onToggle: () => void };

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-100 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <img src={LOGO_URL} alt="DepenseEasy" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        {!collapsed && <span className="font-bold text-slate-900 text-base truncate">DepenseEasy</span>}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <NavGroup label="Principal" collapsed={collapsed} items={coreNav} />
        <NavGroup label="Intelligence" collapsed={collapsed} items={advancedNav} />
        <NavGroup label="Paramètres" collapsed={collapsed} items={settingsNav} />
      </div>

      {/* Bottom - toggle only */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-sm`} />
          </div>
          {!collapsed && 'Réduire'}
        </button>
      </div>
    </div>
  );
}

function NavGroup({ label, collapsed, items }: { label: string; collapsed: boolean; items: NavItem[] }) {
  return (
    <div>
      {!collapsed && (
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">{label}</p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className={`${item.icon} text-base`} />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
