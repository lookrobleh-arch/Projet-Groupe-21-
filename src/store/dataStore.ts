import type { User, Account, Transaction, Budget, Goal, Subscription, AdminLog, Category, UserSettings } from './types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from './categorizationEngine';

const KEYS = {
  users: 'de_users',
  accounts: 'de_accounts',
  transactions: 'de_transactions',
  budgets: 'de_budgets',
  goals: 'de_goals',
  subscriptions: 'de_subscriptions',
  adminLogs: 'de_admin_logs',
  categories: 'de_categories',
  userSettings: 'de_user_settings',
  currentUserId: 'de_current_user_id',
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function hashPassword(pwd: string): string {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hashed_${Math.abs(hash)}`;
}

export function initAdminUser(): void {
  const users = load<User>(KEYS.users);
  const adminExists = users.find(u => u.email === 'admin@depenseeasy.fr');
  if (!adminExists) {
    const admin: User = {
      id: 'admin_001',
      name: 'Administrateur',
      email: 'admin@depenseeasy.fr',
      password: hashPassword('Admin1234!'),
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
    };
    users.push(admin);
    save(KEYS.users, users);
  }
}

export const authStore = {
  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = load<User>(KEYS.users);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'Aucun compte trouvé avec cet email.' };
    if (user.password !== hashPassword(password)) return { success: false, error: 'Mot de passe incorrect.' };
    if (!user.isActive) return { success: false, error: 'Ce compte est suspendu.' };
    const updated = users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
    save(KEYS.users, updated);
    localStorage.setItem(KEYS.currentUserId, user.id);
    return { success: true, user: { ...user, lastLogin: new Date().toISOString() } };
  },

  register(name: string, email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = load<User>(KEYS.users);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }
    const user: User = {
      id: generateId(),
      name,
      email,
      password: hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
    };
    users.push(user);
    save(KEYS.users, users);
    const defaultAccount: Account = {
      id: generateId(),
      userId: user.id,
      name: 'Compte principal',
      type: 'checking',
      initialBalance: 0,
      bank: 'Ma Banque',
      color: '#6366f1',
      icon: 'ri-bank-line',
      createdAt: new Date().toISOString(),
    };
    const accounts = load<Account>(KEYS.accounts);
    accounts.push(defaultAccount);
    save(KEYS.accounts, accounts);
    localStorage.setItem(KEYS.currentUserId, user.id);
    return { success: true, user };
  },

  logout(): void {
    localStorage.removeItem(KEYS.currentUserId);
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem(KEYS.currentUserId);
  },

  getCurrentUser(): User | null {
    const id = localStorage.getItem(KEYS.currentUserId);
    if (!id) return null;
    const users = load<User>(KEYS.users);
    return users.find(u => u.id === id) ?? null;
  },

  updatePassword(userId: string, newPassword: string): void {
    const users = load<User>(KEYS.users);
    save(KEYS.users, users.map(u => u.id === userId ? { ...u, password: hashPassword(newPassword) } : u));
  },

  updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email'>>): void {
    const users = load<User>(KEYS.users);
    save(KEYS.users, users.map(u => u.id === userId ? { ...u, ...data } : u));
  },
};

export const accountStore = {
  getByUser(userId: string): Account[] {
    return load<Account>(KEYS.accounts).filter(a => a.userId === userId);
  },

  add(account: Omit<Account, 'id' | 'createdAt'>): Account {
    const accounts = load<Account>(KEYS.accounts);
    const newAccount: Account = { ...account, id: generateId(), createdAt: new Date().toISOString() };
    accounts.push(newAccount);
    save(KEYS.accounts, accounts);
    return newAccount;
  },

  update(id: string, data: Partial<Account>): void {
    const accounts = load<Account>(KEYS.accounts);
    save(KEYS.accounts, accounts.map(a => a.id === id ? { ...a, ...data } : a));
  },

  delete(id: string): void {
    const accounts = load<Account>(KEYS.accounts);
    save(KEYS.accounts, accounts.filter(a => a.id !== id));
  },

  computeBalance(account: Account, transactions: Transaction[]): number {
    const txForAccount = transactions.filter(t => t.accountId === account.id);
    const income = txForAccount.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txForAccount.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return account.initialBalance + income - expense;
  },
};

export const transactionStore = {
  getByUser(userId: string): Transaction[] {
    return load<Transaction>(KEYS.transactions)
      .filter(t => t.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  getAll(): Transaction[] {
    return load<Transaction>(KEYS.transactions);
  },

  add(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = load<Transaction>(KEYS.transactions);
    const newTx: Transaction = { ...transaction, id: generateId(), createdAt: new Date().toISOString() };
    transactions.push(newTx);
    save(KEYS.transactions, transactions);
    return newTx;
  },

  update(id: string, data: Partial<Transaction>): void {
    const transactions = load<Transaction>(KEYS.transactions);
    save(KEYS.transactions, transactions.map(t => t.id === id ? { ...t, ...data } : t));
  },

  delete(id: string): void {
    const transactions = load<Transaction>(KEYS.transactions);
    save(KEYS.transactions, transactions.filter(t => t.id !== id));
  },

  computeStats(transactions: Transaction[], month?: string) {
    const filtered = month ? transactions.filter(t => t.date.startsWith(month)) : transactions;
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    return { income, expense, balance: income - expense, savingsRate };
  },

  computeCategoryExpenses(transactions: Transaction[], month: string): Record<string, number> {
    const result: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(month))
      .forEach(t => { result[t.category] = (result[t.category] ?? 0) + t.amount; });
    return result;
  },

  getMonthlyData(transactions: Transaction[], months = 6): Array<{ month: string; income: number; expense: number }> {
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short' });
      const { income, expense } = transactionStore.computeStats(transactions, key);
      result.push({ month: label, income, expense });
    }
    return result;
  },
};

export const budgetStore = {
  getByUserAndMonth(userId: string, month: string): Budget | null {
    const budgets = load<Budget>(KEYS.budgets);
    return budgets.find(b => b.userId === userId && b.month === month) ?? null;
  },

  getByUser(userId: string): Budget[] {
    return load<Budget>(KEYS.budgets).filter(b => b.userId === userId);
  },

  save(budget: Omit<Budget, 'id' | 'createdAt'>): Budget {
    const budgets = load<Budget>(KEYS.budgets);
    const existing = budgets.findIndex(b => b.userId === budget.userId && b.month === budget.month);
    if (existing >= 0) {
      const updated = { ...budgets[existing], ...budget };
      budgets[existing] = updated;
      save(KEYS.budgets, budgets);
      return updated;
    }
    const newBudget: Budget = { ...budget, id: generateId(), createdAt: new Date().toISOString() };
    budgets.push(newBudget);
    save(KEYS.budgets, budgets);
    return newBudget;
  },
};

export const goalStore = {
  getByUser(userId: string): Goal[] {
    return load<Goal>(KEYS.goals).filter(g => g.userId === userId);
  },

  add(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
    const goals = load<Goal>(KEYS.goals);
    const newGoal: Goal = { ...goal, id: generateId(), createdAt: new Date().toISOString() };
    goals.push(newGoal);
    save(KEYS.goals, goals);
    return newGoal;
  },

  update(id: string, data: Partial<Goal>): void {
    const goals = load<Goal>(KEYS.goals);
    save(KEYS.goals, goals.map(g => g.id === id ? { ...g, ...data } : g));
  },

  delete(id: string): void {
    save(KEYS.goals, load<Goal>(KEYS.goals).filter(g => g.id !== id));
  },
};

export const subscriptionStore = {
  getByUser(userId: string): Subscription[] {
    return load<Subscription>(KEYS.subscriptions).filter(s => s.userId === userId);
  },

  add(sub: Omit<Subscription, 'id' | 'createdAt'>): Subscription {
    const subs = load<Subscription>(KEYS.subscriptions);
    const newSub: Subscription = { ...sub, id: generateId(), createdAt: new Date().toISOString() };
    subs.push(newSub);
    save(KEYS.subscriptions, subs);
    return newSub;
  },

  update(id: string, data: Partial<Subscription>): void {
    const subs = load<Subscription>(KEYS.subscriptions);
    save(KEYS.subscriptions, subs.map(s => s.id === id ? { ...s, ...data } : s));
  },

  delete(id: string): void {
    save(KEYS.subscriptions, load<Subscription>(KEYS.subscriptions).filter(s => s.id !== id));
  },
};

export const categoryStore = {
  getByUser(userId: string): Category[] {
    return load<Category>(KEYS.categories).filter(c => c.userId === userId);
  },

  initDefaults(userId: string): Category[] {
    const expenseCats: Category[] = DEFAULT_EXPENSE_CATEGORIES.map((c, i) => ({
      id: `${userId}_exp_${i}`,
      userId,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: 'expense' as const,
    }));
    const incomeCats: Category[] = DEFAULT_INCOME_CATEGORIES.map((c, i) => ({
      id: `${userId}_inc_${i}`,
      userId,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: 'income' as const,
    }));
    const all = [...expenseCats, ...incomeCats];
    const existing = load<Category>(KEYS.categories);
    all.forEach(cat => existing.push(cat));
    save(KEYS.categories, existing);
    return all;
  },

  add(cat: Category): Category {
    const cats = load<Category>(KEYS.categories);
    cats.push(cat);
    save(KEYS.categories, cats);
    return cat;
  },

  update(id: string, data: Partial<Category>): void {
    const cats = load<Category>(KEYS.categories);
    save(KEYS.categories, cats.map(c => c.id === id ? { ...c, ...data } : c));
  },

  delete(id: string): void {
    save(KEYS.categories, load<Category>(KEYS.categories).filter(c => c.id !== id));
  },
};

export const userSettingsStore = {
  get(userId: string): UserSettings {
    try {
      const raw = localStorage.getItem(`${KEYS.userSettings}_${userId}`);
      if (raw) return JSON.parse(raw) as UserSettings;
    } catch { /* empty */ }
    return {
      userId,
      currency: 'EUR',
      language: 'fr',
      timezone: 'Europe/Paris',
      phone: '',
      notifications: {
        budgetAlerts: true,
        paymentReminders: true,
        aiInsights: true,
        weeklyReport: true,
        securityAlerts: true,
        newsletter: false,
      },
    };
  },

  save(settings: UserSettings): void {
    localStorage.setItem(`${KEYS.userSettings}_${settings.userId}`, JSON.stringify(settings));
  },
};

export const adminStore = {
  getAllUsers(): User[] {
    return load<User>(KEYS.users).filter(u => u.role !== 'admin');
  },

  updateUser(id: string, data: Partial<User>): void {
    const users = load<User>(KEYS.users);
    save(KEYS.users, users.map(u => u.id === id ? { ...u, ...data } : u));
  },

  getTotalTransactions(): number {
    return load<Transaction>(KEYS.transactions).length;
  },

  addLog(log: Omit<AdminLog, 'id' | 'timestamp'>): void {
    const logs = load<AdminLog>(KEYS.adminLogs);
    const newLog: AdminLog = { ...log, id: generateId(), timestamp: new Date().toISOString() };
    logs.push(newLog);
    save(KEYS.adminLogs, logs);
  },

  getLogs(): AdminLog[] {
    return load<AdminLog>(KEYS.adminLogs).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
};
