import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LoginPage from "../pages/login/page";
import ContactPage from "../pages/contact/page";
import SecuritePage from "../pages/securite/page";
import AProposPage from "../pages/apropos/page";

import AppLayout from "../pages/app/layout";
import DashboardPage from "../pages/app/dashboard/page";
import TransactionsPage from "../pages/app/transactions/page";
import ComptesPage from "../pages/app/comptes/page";
import BudgetsPage from "../pages/app/budgets/page";
import IaPage from "../pages/app/ia/page";
import OcrPage from "../pages/app/ocr/page";
import PrevisionsPage from "../pages/app/previsions/page";
import AbonnementsPage from "../pages/app/abonnements/page";
import ObjectifsPage from "../pages/app/objectifs/page";
import SantePage from "../pages/app/sante/page";
import CalendrierPage from "../pages/app/calendrier/page";
import CategoriesPage from "../pages/app/categories/page";
import ParametresPage from "../pages/app/parametres/page";

import AdminLayout from "../pages/admin/layout";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminUtilisateurs from "../pages/admin/utilisateurs/page";
import AdminStatistiques from "../pages/admin/statistiques/page";
import AdminSecurite from "../pages/admin/securite/page";
import AdminSauvegardes from "../pages/admin/sauvegardes/page";
import AdminIaOcr from "../pages/admin/ia-ocr/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/securite", element: <SecuritePage /> },
  { path: "/apropos", element: <AProposPage /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "comptes", element: <ComptesPage /> },
      { path: "budgets", element: <BudgetsPage /> },
      { path: "ia", element: <IaPage /> },
      { path: "ocr", element: <OcrPage /> },
      { path: "previsions", element: <PrevisionsPage /> },
      { path: "abonnements", element: <AbonnementsPage /> },
      { path: "objectifs", element: <ObjectifsPage /> },
      { path: "sante", element: <SantePage /> },
      { path: "calendrier", element: <CalendrierPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "parametres", element: <ParametresPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "utilisateurs", element: <AdminUtilisateurs /> },
      { path: "statistiques", element: <AdminStatistiques /> },
      { path: "securite", element: <AdminSecurite /> },
      { path: "sauvegardes", element: <AdminSauvegardes /> },
      { path: "ia-ocr", element: <AdminIaOcr /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
