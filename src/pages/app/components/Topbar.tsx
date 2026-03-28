import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppContext';

type Props = { title: string; onMenuToggle: () => void };

export default function Topbar({ title, onMenuToggle }: Props) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout, notifications, unreadCount, markNotificationsRead } = useApp();

  const handleOpenNotifs = () => {
    setShowNotifs(!showNotifs);
    setShowUser(false);
  };

  const handleMarkAllRead = () => {
    markNotificationsRead();
    setShowNotifs(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <button onClick={onMenuToggle} className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
        <i className="ri-menu-line text-lg" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900 flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={handleOpenNotifs}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer relative"
          >
            <i className="ri-notification-3-line text-base" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-xl z-50 overflow-hidden shadow-lg">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="font-semibold text-slate-900 text-sm">Notifications</p>
                <span className="text-xs text-gray-400">{unreadCount} non lu{unreadCount > 1 ? 'e' : 'e'}</span>
              </div>
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 flex items-center justify-center mx-auto text-gray-200 mb-2">
                    <i className="ri-notification-3-line text-3xl" />
                  </div>
                  <p className="text-xs text-gray-300">Aucune notification</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${n.color}`}>
                      <i className={`${n.icon} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{n.desc}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer whitespace-nowrap"
                  >
                    Marquer tout comme lu →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{currentUser?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 whitespace-nowrap">{currentUser?.name ?? 'Utilisateur'}</p>
              <p className="text-[11px] text-gray-400 whitespace-nowrap">Mon compte</p>
            </div>
            <div className="w-4 h-4 flex items-center justify-center text-gray-400">
              <i className="ri-arrow-down-s-line text-sm" />
            </div>
          </button>

          {showUser && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-xl z-50 overflow-hidden shadow-lg">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-slate-900 text-sm">{currentUser?.name ?? 'Utilisateur'}</p>
                <p className="text-xs text-gray-400">{currentUser?.email ?? ''}</p>
              </div>
              {[
                { icon: 'ri-user-line', label: 'Mon profil', path: '/app/parametres' },
                { icon: 'ri-settings-3-line', label: 'Paramètres', path: '/app/parametres' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.path); setShowUser(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className={`${item.icon} text-sm`} /></div>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-logout-box-line text-sm" /></div>
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotifs || showUser) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifs(false); setShowUser(false); }} />
      )}
    </header>
  );
}
