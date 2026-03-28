import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/revenus': 'Revenus',
  '/app/depenses': 'Dépenses',
  '/app/comptes': 'Comptes Financiers',
  '/app/budgets': 'Budgets',
  '/app/historique': 'Historique',
  '/app/ia': 'Assistant IA Financier',
  '/app/ocr': 'Scan OCR',
  '/app/previsions': 'Prévisions Cashflow',
  '/app/abonnements': 'Abonnements',
  '/app/objectifs': 'Objectifs d\'Épargne',
  '/app/sante': 'Santé Financière',
  '/app/calendrier': 'Calendrier Financier',
  '/app/categories': 'Catégories',
  '/app/parametres': 'Paramètres',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'DepenseEasy';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
            <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
