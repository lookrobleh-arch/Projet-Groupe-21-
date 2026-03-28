export type Subscription = {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  nextDate: string;
  category: string;
  color: string;
  icon: string;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
};

export const mockSubscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 17.99, frequency: 'monthly', nextDate: '2026-04-04', category: 'Streaming', color: '#ef4444', icon: 'ri-film-line', status: 'active', startDate: '2023-01-01' },
  { id: 's2', name: 'Spotify', amount: 9.99, frequency: 'monthly', nextDate: '2026-04-09', category: 'Musique', color: '#10b981', icon: 'ri-music-line', status: 'active', startDate: '2022-06-15' },
  { id: 's3', name: 'Adobe Creative', amount: 59.99, frequency: 'monthly', nextDate: '2026-04-12', category: 'Logiciels', color: '#ef4444', icon: 'ri-palette-line', status: 'active', startDate: '2024-03-01' },
  { id: 's4', name: 'Amazon Prime', amount: 6.99, frequency: 'monthly', nextDate: '2026-04-19', category: 'Shopping', color: '#f59e0b', icon: 'ri-shopping-bag-line', status: 'active', startDate: '2023-07-20' },
  { id: 's5', name: 'Orange Fibre', amount: 29.99, frequency: 'monthly', nextDate: '2026-04-01', category: 'Internet', color: '#f97316', icon: 'ri-wifi-line', status: 'active', startDate: '2022-01-01' },
  { id: 's6', name: 'Apple iCloud', amount: 2.99, frequency: 'monthly', nextDate: '2026-04-15', category: 'Stockage', color: '#6366f1', icon: 'ri-cloud-line', status: 'active', startDate: '2023-09-10' },
  { id: 's7', name: 'Disney+', amount: 8.99, frequency: 'monthly', nextDate: '2026-04-22', category: 'Streaming', color: '#3b82f6', icon: 'ri-tv-line', status: 'paused', startDate: '2024-12-01' },
  { id: 's8', name: 'Notion Pro', amount: 8, frequency: 'monthly', nextDate: '2026-04-05', category: 'Productivité', color: '#1f2937', icon: 'ri-file-text-line', status: 'active', startDate: '2024-05-01' },
  { id: 's9', name: 'Figma', amount: 15, frequency: 'monthly', nextDate: '2026-04-08', category: 'Design', color: '#a855f7', icon: 'ri-pen-nib-line', status: 'active', startDate: '2025-01-15' },
  { id: 's10', name: 'Apple Music', amount: 10.99, frequency: 'monthly', nextDate: '2026-04-14', category: 'Musique', color: '#ec4899', icon: 'ri-music-2-line', status: 'cancelled', startDate: '2023-01-01' },
];
