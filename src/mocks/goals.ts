export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
  category: string;
  monthlyContribution: number;
};

export const mockGoals: Goal[] = [
  { id: 'g1', name: 'Voyage au Japon', target: 5000, current: 3250, deadline: '2026-09-01', color: '#ef4444', icon: 'ri-plane-line', category: 'Voyage', monthlyContribution: 300 },
  { id: 'g2', name: 'Fond d\'urgence', target: 10000, current: 6800, deadline: '2026-12-31', color: '#10b981', icon: 'ri-shield-line', category: 'Sécurité', monthlyContribution: 500 },
  { id: 'g3', name: 'Nouveau MacBook Pro', target: 3000, current: 1200, deadline: '2026-07-01', color: '#6366f1', icon: 'ri-computer-line', category: 'Électronique', monthlyContribution: 250 },
  { id: 'g4', name: 'Apport maison', target: 40000, current: 12500, deadline: '2028-01-01', color: '#f59e0b', icon: 'ri-home-line', category: 'Immobilier', monthlyContribution: 1000 },
  { id: 'g5', name: 'Formation UX Design', target: 2500, current: 2100, deadline: '2026-05-01', color: '#8b5cf6', icon: 'ri-graduation-cap-line', category: 'Formation', monthlyContribution: 200 },
];

export const mockAccounts = [
  { id: 'a1', name: 'Compte courant', type: 'checking', balance: 4820.50, bank: 'BNP Paribas', iban: 'FR76 3000 4000 0100 0000', color: '#6366f1', icon: 'ri-bank-line' },
  { id: 'a2', name: 'Livret A', type: 'savings', balance: 12500, bank: 'Caisse d\'Épargne', iban: 'FR76 1845 5000 0100 0000', color: '#10b981', icon: 'ri-safe-line' },
  { id: 'a3', name: 'Compte professionnel', type: 'business', balance: 8350, bank: 'Shine', iban: 'FR76 4000 1000 0100 0000', color: '#f59e0b', icon: 'ri-briefcase-line' },
  { id: 'a4', name: 'PEA', type: 'investment', balance: 22800, bank: 'Boursorama', iban: 'FR76 1360 6000 0100 0000', color: '#8b5cf6', icon: 'ri-line-chart-line' },
];
