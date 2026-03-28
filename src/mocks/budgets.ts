export type Budget = {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  period: 'monthly' | 'weekly';
};

export const mockBudgets: Budget[] = [
  { id: 'b1', category: 'Alimentation', limit: 500, spent: 380, color: '#06b6d4', icon: 'ri-restaurant-line', period: 'monthly' },
  { id: 'b2', category: 'Loisirs', limit: 300, spent: 267, color: '#f59e0b', icon: 'ri-gamepad-line', period: 'monthly' },
  { id: 'b3', category: 'Transport', limit: 150, spent: 130, color: '#10b981', icon: 'ri-bus-line', period: 'monthly' },
  { id: 'b4', category: 'Vêtements', limit: 200, spent: 120, color: '#8b5cf6', icon: 'ri-t-shirt-line', period: 'monthly' },
  { id: 'b5', category: 'Santé', limit: 250, spent: 89, color: '#ef4444', icon: 'ri-heart-pulse-line', period: 'monthly' },
  { id: 'b6', category: 'Électronique', limit: 100, spent: 199, color: '#6366f1', icon: 'ri-computer-line', period: 'monthly' },
  { id: 'b7', category: 'Éducation', limit: 200, spent: 45, color: '#0ea5e9', icon: 'ri-book-open-line', period: 'monthly' },
  { id: 'b8', category: 'Restaurants', limit: 200, spent: 156, color: '#f97316', icon: 'ri-store-line', period: 'monthly' },
];
