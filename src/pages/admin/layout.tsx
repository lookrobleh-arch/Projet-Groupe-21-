import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/utilisateurs': 'Gestion Utilisateurs',
  '/admin/roles': 'Rôles & Permissions',
  '/admin/abonnements': 'Plans & Abonnements',
  '/admin/statistiques': 'Statistiques Globales',
  '/admin/securite': 'Sécurité',
  '/admin/logs': 'Logs Système',
  '/admin/sauvegardes': 'Sauvegardes',
  '/admin/ia-ocr': 'IA & OCR',
  '/admin/conformite': 'Conformité & Audit',
  '/admin/sante': 'Santé Plateforme',
  '/admin/qualite': 'Qualité des Données',
  '/admin/adoption': 'Adoption Produit',
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden lg:flex">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
            <AdminSidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar title={title} onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
