export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

export type AccountType = 'checking' | 'savings' | 'investment' | 'business';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  bank: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'validated' | 'pending';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  category: string;
  label: string;
  date: string;
  status: TransactionStatus;
  createdAt: string;
  source?: 'manual' | 'ocr' | 'subscription' | 'goal';
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  limit: number;
  pct: number;
}

export interface Budget {
  id: string;
  userId: string;
  totalAmount: number;
  month: string;
  categories: BudgetCategory[];
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  monthlyContribution: number;
  deadline: string;
  category: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type SubscriptionFrequency = 'monthly' | 'yearly' | 'weekly';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  frequency: SubscriptionFrequency;
  nextDate: string;
  category: string;
  color: string;
  icon: string;
  status: SubscriptionStatus;
  accountId?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export interface UserSettings {
  userId: string;
  currency: string;
  language: string;
  timezone: string;
  phone: string;
  notifications: {
    budgetAlerts: boolean;
    paymentReminders: boolean;
    aiInsights: boolean;
    weeklyReport: boolean;
    securityAlerts: boolean;
    newsletter: boolean;
  };
}

export interface AppNotification {
  id: string;
  type: 'budget' | 'subscription' | 'goal' | 'transaction' | 'ai';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetUserId?: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalBalance: number;
}
