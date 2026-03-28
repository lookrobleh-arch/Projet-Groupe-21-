export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  label: string;
  date: string;
  account: string;
  status: 'confirmed' | 'pending';
  note?: string;
};

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 3500, category: 'Salaire', label: 'Salaire Mars 2026', date: '2026-03-01', account: 'Compte courant', status: 'confirmed' },
  { id: 't2', type: 'expense', amount: 950, category: 'Logement', label: 'Loyer Mars', date: '2026-03-02', account: 'Compte courant', status: 'confirmed' },
  { id: 't3', type: 'expense', amount: 68.50, category: 'Alimentation', label: 'Courses Carrefour', date: '2026-03-03', account: 'Compte courant', status: 'confirmed' },
  { id: 't4', type: 'expense', amount: 12.99, category: 'Loisirs', label: 'Netflix', date: '2026-03-04', account: 'Compte courant', status: 'confirmed' },
  { id: 't5', type: 'expense', amount: 45, category: 'Transport', label: 'Navigo mensuel', date: '2026-03-05', account: 'Compte courant', status: 'confirmed' },
  { id: 't6', type: 'income', amount: 800, category: 'Freelance', label: 'Mission web design', date: '2026-03-06', account: 'Compte professionnel', status: 'confirmed' },
  { id: 't7', type: 'expense', amount: 23.40, category: 'Alimentation', label: 'Monoprix', date: '2026-03-07', account: 'Compte courant', status: 'confirmed' },
  { id: 't8', type: 'expense', amount: 89, category: 'Santé', label: 'Pharmacie', date: '2026-03-08', account: 'Compte courant', status: 'confirmed' },
  { id: 't9', type: 'expense', amount: 15.99, category: 'Loisirs', label: 'Spotify', date: '2026-03-09', account: 'Compte courant', status: 'confirmed' },
  { id: 't10', type: 'expense', amount: 120, category: 'Vêtements', label: 'Zara', date: '2026-03-10', account: 'Compte courant', status: 'confirmed' },
  { id: 't11', type: 'income', amount: 500, category: 'Remboursement', label: 'Remboursement assurance', date: '2026-03-11', account: 'Compte courant', status: 'confirmed' },
  { id: 't12', type: 'expense', amount: 34.90, category: 'Alimentation', label: 'Restaurant midi', date: '2026-03-12', account: 'Compte courant', status: 'confirmed' },
  { id: 't13', type: 'expense', amount: 199, category: 'Électronique', label: 'Accessoires PC', date: '2026-03-13', account: 'Livret A', status: 'confirmed' },
  { id: 't14', type: 'expense', amount: 8.99, category: 'Loisirs', label: 'Apple Music', date: '2026-03-14', account: 'Compte courant', status: 'confirmed' },
  { id: 't15', type: 'income', amount: 250, category: 'Remboursement', label: 'Remboursement Thomas', date: '2026-03-15', account: 'Compte courant', status: 'confirmed' },
  { id: 't16', type: 'expense', amount: 56.20, category: 'Alimentation', label: 'Lidl courses', date: '2026-03-16', account: 'Compte courant', status: 'confirmed' },
  { id: 't17', type: 'expense', amount: 310, category: 'Électricité', label: 'Facture EDF', date: '2026-03-17', account: 'Compte courant', status: 'confirmed' },
  { id: 't18', type: 'expense', amount: 29.99, category: 'Internet', label: 'Orange Box', date: '2026-03-18', account: 'Compte courant', status: 'confirmed' },
  { id: 't19', type: 'income', amount: 3500, category: 'Salaire', label: 'Salaire Fév 2026', date: '2026-02-01', account: 'Compte courant', status: 'confirmed' },
  { id: 't20', type: 'expense', amount: 950, category: 'Logement', label: 'Loyer Fév', date: '2026-02-02', account: 'Compte courant', status: 'confirmed' },
  { id: 't21', type: 'expense', amount: 78.30, category: 'Alimentation', label: 'Courses E.Leclerc', date: '2026-02-05', account: 'Compte courant', status: 'confirmed' },
  { id: 't22', type: 'income', amount: 1200, category: 'Freelance', label: 'Projet app mobile', date: '2026-02-10', account: 'Compte professionnel', status: 'confirmed' },
  { id: 't23', type: 'expense', amount: 45, category: 'Transport', label: 'Navigo Fév', date: '2026-02-05', account: 'Compte courant', status: 'confirmed' },
  { id: 't24', type: 'expense', amount: 230, category: 'Loisirs', label: 'Concert + resto', date: '2026-02-14', account: 'Compte courant', status: 'confirmed' },
  { id: 't25', type: 'income', amount: 3500, category: 'Salaire', label: 'Salaire Jan 2026', date: '2026-01-01', account: 'Compte courant', status: 'confirmed' },
  { id: 't26', type: 'expense', amount: 950, category: 'Logement', label: 'Loyer Jan', date: '2026-01-02', account: 'Compte courant', status: 'confirmed' },
  { id: 't27', type: 'expense', amount: 890, category: 'Vêtements', label: 'Soldes hiver', date: '2026-01-10', account: 'Compte courant', status: 'confirmed' },
  { id: 't28', type: 'income', amount: 600, category: 'Freelance', label: 'Retouche logo', date: '2026-01-20', account: 'Compte professionnel', status: 'confirmed' },
  { id: 't29', type: 'expense', amount: 45, category: 'Transport', label: 'Navigo Jan', date: '2026-01-05', account: 'Compte courant', status: 'confirmed' },
  { id: 't30', type: 'expense', amount: 149, category: 'Santé', label: 'Dentiste', date: '2026-01-18', account: 'Compte courant', status: 'confirmed' },
  { id: 't31', type: 'income', amount: 3500, category: 'Salaire', label: 'Salaire Déc 2025', date: '2025-12-01', account: 'Compte courant', status: 'confirmed' },
  { id: 't32', type: 'expense', amount: 1200, category: 'Loisirs', label: 'Cadeaux Noël', date: '2025-12-20', account: 'Livret A', status: 'confirmed' },
  { id: 't33', type: 'expense', amount: 350, category: 'Alimentation', label: 'Repas familiaux', date: '2025-12-24', account: 'Compte courant', status: 'confirmed' },
  { id: 't34', type: 'income', amount: 3500, category: 'Salaire', label: 'Salaire Nov 2025', date: '2025-11-01', account: 'Compte courant', status: 'confirmed' },
  { id: 't35', type: 'expense', amount: 980, category: 'Logement', label: 'Loyer Nov', date: '2025-11-02', account: 'Compte courant', status: 'confirmed' },
  { id: 't36', type: 'expense', amount: 25, category: 'Loisirs', label: 'Amazon Prime', date: '2026-03-19', account: 'Compte courant', status: 'pending', note: 'En attente de confirmation' },
  { id: 't37', type: 'expense', amount: 67.80, category: 'Alimentation', label: 'Auchan livraison', date: '2026-03-20', account: 'Compte courant', status: 'pending' },
];

export const mockIncomeCategories = ['Salaire', 'Freelance', 'Remboursement', 'Investissements', 'Location', 'Autres revenus'];
export const mockExpenseCategories = ['Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Vêtements', 'Électronique', 'Électricité', 'Internet', 'Assurance', 'Éducation', 'Autres dépenses'];

export const mockMonthlyData = [
  { month: 'Oct', income: 4100, expense: 2300 },
  { month: 'Nov', income: 3800, expense: 2650 },
  { month: 'Déc', income: 3900, expense: 3800 },
  { month: 'Jan', income: 4600, expense: 2880 },
  { month: 'Fév', income: 5200, expense: 2340 },
  { month: 'Mar', income: 4800, expense: 1960 },
];

export const mockCategoryExpenses = [
  { category: 'Logement', amount: 950, color: '#6366f1', percent: 46 },
  { category: 'Alimentation', amount: 380, color: '#06b6d4', percent: 18 },
  { category: 'Transport', amount: 130, color: '#10b981', percent: 6 },
  { category: 'Loisirs', amount: 210, color: '#f59e0b', percent: 10 },
  { category: 'Santé', amount: 240, color: '#ef4444', percent: 12 },
  { category: 'Autres', amount: 170, color: '#8b5cf6', percent: 8 },
];
