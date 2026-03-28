import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { User, Account, Transaction, Budget, BudgetCategory, Goal, Subscription, Category, UserSettings, AppNotification } from './types';
import {
  authStore, accountStore, transactionStore, budgetStore, goalStore,
  subscriptionStore, categoryStore, userSettingsStore, initAdminUser,
} from './dataStore';
import { categorizationEngine } from './categorizationEngine';

export const CURRENCY_INFO: Record<string, { rate: number; symbol: string; label: string }> = {
  EUR: { rate: 1, symbol: '€', label: 'Euro (€)' },
  USD: { rate: 1.08, symbol: '$', label: 'Dollar US ($)' },
  GBP: { rate: 0.85, symbol: '£', label: 'Livre Sterling (£)' },
  CHF: { rate: 0.97, symbol: 'CHF', label: 'Franc Suisse (CHF)' },
  MAD: { rate: 10.78, symbol: 'MAD', label: 'Dirham Marocain (MAD)' },
  TND: { rate: 3.33, symbol: 'TND', label: 'Dinar Tunisien (TND)' },
  DJF: { rate: 192.28, symbol: 'Fdj', label: 'Franc Djibouti (Fdj)' },
};

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    dashboard: 'Tableau de bord', transactions: 'Transactions', comptes: 'Comptes',
    budgets: 'Coach Budgétaire', objectifs: 'Objectifs', abonnements: 'Abonnements',
    previsions: 'Prévisions', sante: 'Santé Financière', calendrier: 'Calendrier',
    ia: 'Assistant IA', ocr: 'Scan Reçu', categories: 'Catégories', parametres: 'Paramètres',
    balance: 'Solde', income: 'Revenus', expenses: 'Dépenses',
    insufficient_balance: 'Solde insuffisant. Veuillez recharger votre compte.',
    add: 'Ajouter', cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer',
    hello: 'Bonjour',
  },
  en: {
    dashboard: 'Dashboard', transactions: 'Transactions', comptes: 'Accounts',
    budgets: 'Budget Coach', objectifs: 'Goals', abonnements: 'Subscriptions',
    previsions: 'Forecasts', sante: 'Financial Health', calendrier: 'Calendar',
    ia: 'AI Assistant', ocr: 'Receipt Scan', categories: 'Categories', parametres: 'Settings',
    balance: 'Balance', income: 'Income', expenses: 'Expenses',
    insufficient_balance: 'Insufficient balance. Please top up your account.',
    add: 'Add', cancel: 'Cancel', save: 'Save', delete: 'Delete',
    hello: 'Hello',
  },
};

export interface DisciplineState {
  active: boolean;
  timePct: number;
  budgetPct: number;
  lockedCategories: string[];
  dailyAllowance: number;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role: string; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email'>>) => void;
  updatePassword: (newPassword: string) => void;

  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'userId' | 'createdAt'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getAccountBalance: (account: Account) => number;
  totalBalance: number;

  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => { success: boolean; error?: string };
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  categorizeTransaction: (label: string) => string;
  saveCategorizationCorrection: (label: string, category: string) => void;

  currentBudget: Budget | null;
  setBudget: (totalAmount: number, categories: Omit<BudgetCategory, 'id'>[]) => void;
  getCategorySpent: (categoryName: string) => number;
  getCategorySpentWithBudgetFallback: (categoryName: string, budgetCategoryNames: string[]) => number;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id' | 'userId' | 'createdAt'>, createTransaction?: boolean) => { success: boolean; error?: string };
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;

  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'userId'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  expenseCategories: Category[];
  incomeCategories: Category[];

  userSettings: UserSettings | null;
  saveUserSettings: (settings: UserSettings) => void;
  currency: string;
  language: string;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
  t: (key: string) => string;

  notifications: AppNotification[];
  unreadCount: number;
  markNotificationsRead: () => void;

  discipline: DisciplineState;

  stats: {
    monthlyIncome: number;
    monthlyExpense: number;
    monthlySavingsRate: number;
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
  };

  currentMonth: string;
}

const AppContext = createContext<AppContextType | null>(null);

const NON_ESSENTIAL_CATEGORIES = ['Loisirs', 'Shopping', 'Restaurants', 'Gaming', 'Divertissement', 'Voyages', 'Achats', 'Leisure'];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const loadUserData = useCallback((userId: string) => {
    setAccounts(accountStore.getByUser(userId));
    const txs = transactionStore.getByUser(userId);
    setTransactions(txs);
    setBudgets(budgetStore.getByUser(userId));
    setGoals(goalStore.getByUser(userId));
    setSubscriptions(subscriptionStore.getByUser(userId));
    const cats = categoryStore.getByUser(userId);
    setCategories(cats.length > 0 ? cats : categoryStore.initDefaults(userId));
    setUserSettings(userSettingsStore.get(userId));
    categorizationEngine.learnFromTransactions(txs);
  }, []);

  useEffect(() => {
    initAdminUser();
    const user = authStore.getCurrentUser();
    if (user) { setCurrentUser(user); loadUserData(user.id); }
    setIsLoading(false);
  }, [loadUserData]);

  const login = useCallback(async (email: string, password: string) => {
    const result = authStore.login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      loadUserData(result.user.id);
      return { success: true, role: result.user.role };
    }
    return { success: false, role: '', error: result.error };
  }, [loadUserData]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = authStore.register(name, email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      loadUserData(result.user.id);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [loadUserData]);

  const logout = useCallback(() => {
    authStore.logout();
    setCurrentUser(null);
    setAccounts([]); setTransactions([]); setBudgets([]);
    setGoals([]); setSubscriptions([]); setCategories([]);
    setUserSettings(null); setReadNotifIds(new Set());
  }, []);

  const updateProfile = useCallback((data: Partial<Pick<User, 'name' | 'email'>>) => {
    if (!currentUser) return;
    authStore.updateProfile(currentUser.id, data);
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  }, [currentUser]);

  const updatePassword = useCallback((newPassword: string) => {
    if (!currentUser) return;
    authStore.updatePassword(currentUser.id, newPassword);
  }, [currentUser]);

  const addAccount = useCallback((account: Omit<Account, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newAcc = accountStore.add({ ...account, userId: currentUser.id });
    setAccounts(prev => [...prev, newAcc]);
  }, [currentUser]);

  const updateAccount = useCallback((id: string, data: Partial<Account>) => {
    accountStore.update(id, data);
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    accountStore.delete(id);
    setAccounts(prev => prev.filter(a => a.id !== id));
  }, []);

  const getAccountBalance = useCallback((account: Account): number => {
    return accountStore.computeBalance(account, transactions);
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + accountStore.computeBalance(acc, transactions), 0);
  }, [accounts, transactions]);

  const categorizeTransaction = useCallback((label: string): string => {
    return categorizationEngine.categorize(label);
  }, []);

  const saveCategorizationCorrection = useCallback((label: string, category: string) => {
    categorizationEngine.saveCorrection(label, category);
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Non connecté' };
    if (transaction.type === 'expense') {
      const account = accounts.find(a => a.id === transaction.accountId);
      if (account) {
        const balance = accountStore.computeBalance(account, transactions);
        if (balance < transaction.amount) {
          return { success: false, error: 'Solde insuffisant. Veuillez recharger votre compte.' };
        }
      }
    }
    const newTx = transactionStore.add({ ...transaction, userId: currentUser.id });
    setTransactions(prev => [newTx, ...prev]);
    categorizationEngine.saveCorrection(transaction.label, transaction.category);
    return { success: true };
  }, [currentUser, accounts, transactions]);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    transactionStore.update(id, data);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    if (data.category && data.label) {
      categorizationEngine.saveCorrection(data.label, data.category);
    }
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    transactionStore.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const currentBudget = useMemo(() => {
    return budgets.find(b => b.month === currentMonth) ?? null;
  }, [budgets, currentMonth]);

  const setCurrBudget = useCallback((totalAmount: number, cats: Omit<BudgetCategory, 'id'>[]) => {
    if (!currentUser) return;
    const budgetCats: BudgetCategory[] = cats.map(c => ({ ...c, id: c.name.toLowerCase().replace(/\s/g, '_') }));
    const saved = budgetStore.save({ userId: currentUser.id, totalAmount, month: currentMonth, categories: budgetCats });
    setBudgets(prev => [...prev.filter(b => b.month !== currentMonth), saved]);
  }, [currentUser, currentMonth]);

  const getCategorySpent = useCallback((categoryName: string): number => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === categoryName && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);
  }, [transactions, currentMonth]);

  // Smart budget fallback: if transaction category not in budget → assign to "Autres"
  const getCategorySpentWithBudgetFallback = useCallback((categoryName: string, budgetCategoryNames: string[]): number => {
    if (categoryName === 'Autres') {
      return transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth) && !budgetCategoryNames.filter(n => n !== 'Autres').includes(t.category))
        .reduce((s, t) => s + t.amount, 0);
    }
    return transactions
      .filter(t => t.type === 'expense' && t.category === categoryName && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);
  }, [transactions, currentMonth]);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newGoal = goalStore.add({ ...goal, userId: currentUser.id });
    setGoals(prev => [...prev, newGoal]);
  }, [currentUser]);

  const updateGoal = useCallback((id: string, data: Partial<Goal>) => {
    goalStore.update(id, data);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    goalStore.delete(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const addSubscription = useCallback((sub: Omit<Subscription, 'id' | 'userId' | 'createdAt'>, createTransaction = false): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Non connecté' };
    if (createTransaction && sub.accountId) {
      const account = accounts.find(a => a.id === sub.accountId);
      if (account) {
        const balance = accountStore.computeBalance(account, transactions);
        if (balance < sub.amount) {
          return { success: false, error: 'Solde insuffisant. Veuillez recharger votre compte.' };
        }
      }
      const newSub = subscriptionStore.add({ ...sub, userId: currentUser.id });
      setSubscriptions(prev => [...prev, newSub]);
      const newTx = transactionStore.add({
        userId: currentUser.id, accountId: sub.accountId!, type: 'expense',
        amount: sub.amount, category: sub.category ?? 'Abonnements',
        label: `Abonnement — ${sub.name}`,
        date: new Date().toISOString().slice(0, 10),
        status: 'validated', source: 'subscription',
      });
      setTransactions(prev => [newTx, ...prev]);
      return { success: true };
    }
    const newSub = subscriptionStore.add({ ...sub, userId: currentUser.id });
    setSubscriptions(prev => [...prev, newSub]);
    return { success: true };
  }, [currentUser, accounts, transactions]);

  const updateSubscription = useCallback((id: string, data: Partial<Subscription>) => {
    subscriptionStore.update(id, data);
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    subscriptionStore.delete(id);
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  const addCategory = useCallback((cat: Omit<Category, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newCat: Category = { ...cat, id: `${currentUser.id}_${Date.now()}`, userId: currentUser.id };
    categoryStore.add(newCat);
    setCategories(prev => [...prev, newCat]);
  }, [currentUser]);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    categoryStore.update(id, data);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    categoryStore.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const saveUserSettings = useCallback((settings: UserSettings) => {
    userSettingsStore.save(settings);
    setUserSettings(settings);
  }, []);

  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense' || c.type === 'both'), [categories]);
  const incomeCategories = useMemo(() => categories.filter(c => c.type === 'income' || c.type === 'both'), [categories]);

  const currency = useMemo(() => userSettings?.currency ?? 'EUR', [userSettings]);
  const language = useMemo(() => userSettings?.language ?? 'fr', [userSettings]);

  const formatCurrency = useCallback((amount: number): string => {
    const info = CURRENCY_INFO[currency] ?? CURRENCY_INFO.EUR;
    const converted = amount * info.rate;
    const sym = info.symbol;
    const formatted = converted.toLocaleString('fr', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (['€', '$', '£'].includes(sym)) return `${formatted}${sym}`;
    return `${formatted} ${sym}`;
  }, [currency]);

  const currencySymbol = useMemo(() => (CURRENCY_INFO[currency] ?? CURRENCY_INFO.EUR).symbol, [currency]);

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.fr[key] ?? key;
  }, [language]);

  const notifications = useMemo((): AppNotification[] => {
    const notifs: AppNotification[] = [];
    if (currentBudget) {
      currentBudget.categories.forEach(cat => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === cat.name && t.date.startsWith(currentMonth))
          .reduce((s, t) => s + t.amount, 0);
        const pct = cat.limit > 0 ? (spent / cat.limit) * 100 : 0;
        if (pct >= 100) {
          notifs.push({ id: `bgt_over_${cat.id}`, type: 'budget', title: `Budget ${cat.name} dépassé !`, desc: `+${(spent - cat.limit).toFixed(2)} de dépassement`, time: 'maintenant', read: false, icon: 'ri-error-warning-line', color: 'text-red-500 bg-red-50' });
        } else if (pct >= 80) {
          notifs.push({ id: `bgt_warn_${cat.id}`, type: 'budget', title: `Budget ${cat.name} à ${Math.round(pct)}%`, desc: `${spent.toFixed(2)} / ${cat.limit.toFixed(2)}`, time: 'maintenant', read: false, icon: 'ri-alert-line', color: 'text-amber-500 bg-amber-50' });
        }
      });
    }
    subscriptions.filter(s => s.status === 'active').forEach(s => {
      const days = Math.ceil((new Date(s.nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days >= 0 && days <= 7) {
        notifs.push({ id: `sub_${s.id}`, type: 'subscription', title: `Prélèvement ${s.name}`, desc: `${s.amount.toFixed(2)} dans ${days} jour${days > 1 ? 's' : ''}`, time: `dans ${days}j`, read: false, icon: 'ri-calendar-check-line', color: 'text-cyan-500 bg-cyan-50' });
      }
    });
    transactions.slice(0, 2).forEach(tx => {
      notifs.push({ id: `tx_${tx.id}`, type: 'transaction', title: tx.label, desc: `${tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)} · ${tx.category}`, time: new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), read: false, icon: tx.type === 'income' ? 'ri-arrow-up-circle-line' : 'ri-arrow-down-circle-line', color: tx.type === 'income' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50' });
    });
    return notifs.slice(0, 6);
  }, [currentBudget, transactions, subscriptions, currentMonth]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readNotifIds.has(n.id)).length;
  }, [notifications, readNotifIds]);

  const markNotificationsRead = useCallback(() => {
    setReadNotifIds(new Set(notifications.map(n => n.id)));
  }, [notifications]);

  // Smart Financial Discipline System
  const discipline = useMemo((): DisciplineState => {
    if (!currentBudget || currentBudget.totalAmount === 0) {
      return { active: false, timePct: 0, budgetPct: 0, lockedCategories: [], dailyAllowance: 0, message: '' };
    }
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayPassed = now.getDate();
    const timePct = Math.round((dayPassed / daysInMonth) * 100);
    const totalSpent = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);
    const budgetPct = Math.round((totalSpent / currentBudget.totalAmount) * 100);
    const daysLeft = daysInMonth - dayPassed;
    const remainingBudget = currentBudget.totalAmount - totalSpent;
    const dailyAllowance = daysLeft > 0 ? remainingBudget / daysLeft : 0;
    const active = budgetPct > timePct * 1.5;
    const lockedCategories = active ? NON_ESSENTIAL_CATEGORIES : [];
    let message = '';
    if (active) {
      message = `🚨 Discipline activée : ${budgetPct}% du budget consommé en ${timePct}% du mois. Catégories non-essentielles bloquées. Reste à vivre : ${dailyAllowance.toFixed(2)}/jour.`;
    }
    return { active, timePct, budgetPct, lockedCategories, dailyAllowance, message };
  }, [currentBudget, transactions, currentMonth]);

  const stats = useMemo(() => {
    const monthly = transactionStore.computeStats(transactions, currentMonth);
    const total = transactionStore.computeStats(transactions);
    return { monthlyIncome: monthly.income, monthlyExpense: monthly.expense, monthlySavingsRate: monthly.savingsRate, totalIncome: total.income, totalExpense: total.expense, totalBalance };
  }, [transactions, currentMonth, totalBalance]);

  const value: AppContextType = {
    currentUser, isLoading, login, register, logout, updateProfile, updatePassword,
    accounts, addAccount, updateAccount, deleteAccount, getAccountBalance, totalBalance,
    transactions, addTransaction, updateTransaction, deleteTransaction, categorizeTransaction, saveCategorizationCorrection,
    currentBudget, setBudget: setCurrBudget, getCategorySpent, getCategorySpentWithBudgetFallback,
    goals, addGoal, updateGoal, deleteGoal,
    subscriptions, addSubscription, updateSubscription, deleteSubscription,
    categories, addCategory, updateCategory, deleteCategory, expenseCategories, incomeCategories,
    userSettings, saveUserSettings, currency, language, formatCurrency, currencySymbol, t,
    notifications, unreadCount, markNotificationsRead,
    discipline, stats, currentMonth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
