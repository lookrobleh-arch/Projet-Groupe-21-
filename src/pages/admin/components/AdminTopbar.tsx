import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppContext';

type Props = { title: string; onMenuToggle: () => void };

export default function AdminTopbar({ title, onMenuToggle }: Props) {
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const { logout } = useApp();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <button onClick={onMenuToggle} className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 cursor-pointer">
        <i className="ri-menu-line text-lg" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900 flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Système opérationnel
        </span>

        <div className="relative">
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 whitespace-nowrap">Admin</p>
              <p className="text-[11px] text-amber-500 whitespace-nowrap font-semibold">Super Admin</p>
            </div>
            <div className="w-4 h-4 flex items-center justify-center text-gray-400"><i className="ri-arrow-down-s-line text-sm" /></div>
          </button>
          {showUser && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-slate-900 text-sm">Super Admin</p>
                <p className="text-xs text-gray-400">admin@depenseeasy.fr</p>
              </div>
              <div className="border-t border-gray-100">
                <button onClick={() => { logout(); navigate('/login'); setShowUser(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer whitespace-nowrap">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-logout-box-line text-sm" /></div>
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUser && <div className="fixed inset-0 z-40" onClick={() => setShowUser(false)} />}
    </header>
  );
}
