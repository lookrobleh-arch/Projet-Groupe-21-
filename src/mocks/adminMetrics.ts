export const adminKPIs = {
  totalUsers: 15847,
  activeUsers: 11234,
  newUsersThisMonth: 847,
  churnRate: 2.3,
  mrr: 48920,
  arr: 587040,
  avgRevenuePerUser: 4.35,
  premiumUsers: 3421,
  proUsers: 5612,
  freeUsers: 6814,
  totalTransactionsProcessed: 2847503,
  totalOcrScans: 142830,
  aiQueriesThisMonth: 89420,
  avgOcrAccuracy: 97.3,
  avgAiSatisfaction: 4.8,
  platformUptime: 99.97,
  avgApiLatency: 142,
  dailyActiveUsers: 4230,
  weeklyActiveUsers: 8920,
};

export const adminGrowthData = [
  { month: 'Oct 25', users: 11200, mrr: 38400, transactions: 1820000 },
  { month: 'Nov 25', users: 12100, mrr: 41200, transactions: 1970000 },
  { month: 'Déc 25', users: 12800, mrr: 43100, transactions: 2150000 },
  { month: 'Jan 26', users: 13600, mrr: 44800, transactions: 2340000 },
  { month: 'Fév 26', users: 14700, mrr: 46500, transactions: 2580000 },
  { month: 'Mar 26', users: 15847, mrr: 48920, transactions: 2847503 },
];

export const adminSecurityLogs = [
  { id: 'sl1', type: 'login', userId: 'u1', ip: '192.168.1.45', location: 'Paris, FR', timestamp: '2026-03-24 09:14:32', status: 'success', device: 'Chrome / macOS' },
  { id: 'sl2', type: 'login_failed', userId: 'u3', ip: '185.23.45.78', location: 'Unknown', timestamp: '2026-03-24 08:56:11', status: 'failed', device: 'Firefox / Windows' },
  { id: 'sl3', type: 'password_reset', userId: 'u7', ip: '10.0.0.12', location: 'Lyon, FR', timestamp: '2026-03-24 08:30:05', status: 'success', device: 'Safari / iOS' },
  { id: 'sl4', type: 'login', userId: 'u12', ip: '212.45.123.89', location: 'Dijon, FR', timestamp: '2026-03-23 23:45:00', status: 'success', device: 'Chrome / Android' },
  { id: 'sl5', type: 'suspicious', userId: 'u15', ip: '194.45.78.23', location: 'Bucharest, RO', timestamp: '2026-03-23 22:10:45', status: 'blocked', device: 'Unknown' },
  { id: 'sl6', type: 'login', userId: 'u2', ip: '78.56.12.34', location: 'Lyon, FR', timestamp: '2026-03-23 21:30:00', status: 'success', device: 'Chrome / macOS' },
  { id: 'sl7', type: 'login_failed', userId: 'u8', ip: '176.34.56.78', location: 'Berlin, DE', timestamp: '2026-03-23 20:15:33', status: 'failed', device: 'Edge / Windows' },
  { id: 'sl8', type: 'login', userId: 'u5', ip: '90.12.34.56', location: 'Toulouse, FR', timestamp: '2026-03-23 19:45:22', status: 'success', device: 'Chrome / Windows' },
];

export const adminLogs = [
  { id: 'l1', level: 'info', service: 'auth', message: 'User login successful', userId: 'u1', timestamp: '2026-03-24 09:14:32' },
  { id: 'l2', level: 'error', service: 'ocr', message: 'OCR processing timeout for receipt ID r_4521', userId: 'u9', timestamp: '2026-03-24 09:10:15' },
  { id: 'l3', level: 'warn', service: 'ai', message: 'AI model response latency above threshold (2.4s)', userId: null, timestamp: '2026-03-24 09:05:00' },
  { id: 'l4', level: 'info', service: 'api', message: 'Transaction batch processed: 142 items', userId: null, timestamp: '2026-03-24 09:00:00' },
  { id: 'l5', level: 'error', service: 'email', message: 'SMTP connection failed, retry attempt 1/3', userId: null, timestamp: '2026-03-24 08:55:12' },
  { id: 'l6', level: 'info', service: 'auth', message: 'Password reset email sent', userId: 'u7', timestamp: '2026-03-24 08:30:05' },
  { id: 'l7', level: 'warn', service: 'database', message: 'Slow query detected (850ms) on transactions table', userId: null, timestamp: '2026-03-24 08:12:33' },
  { id: 'l8', level: 'info', service: 'ocr', message: 'OCR scan completed successfully, accuracy: 98.2%', userId: 'u2', timestamp: '2026-03-24 08:05:20' },
  { id: 'l9', level: 'error', service: 'auth', message: 'Multiple failed login attempts detected for u3', userId: 'u3', timestamp: '2026-03-24 07:56:11' },
  { id: 'l10', level: 'info', service: 'backup', message: 'Automated backup completed successfully: 4.2GB', userId: null, timestamp: '2026-03-24 03:00:00' },
];

export const adminIaOcrMetrics = {
  ocrDailyScans: 4820,
  ocrAccuracy: 97.3,
  ocrAvgTime: 1.8,
  ocrErrors: 127,
  aiQueryCount: 89420,
  aiAvgSatisfaction: 4.8,
  aiResponseTime: 1.2,
  aiCategorisationRate: 94.7,
  aiAnomaliesDetected: 342,
  ocrWeeklyData: [
    { day: 'Lun', scans: 4200, accuracy: 97.1 },
    { day: 'Mar', scans: 4580, accuracy: 97.5 },
    { day: 'Mer', scans: 5100, accuracy: 98.0 },
    { day: 'Jeu', scans: 4820, accuracy: 96.8 },
    { day: 'Ven', scans: 5300, accuracy: 97.4 },
    { day: 'Sam', scans: 2100, accuracy: 97.9 },
    { day: 'Dim', scans: 1850, accuracy: 98.1 },
  ],
};

export const adminPlanDistribution = [
  { plan: 'Free', users: 6814, color: '#94a3b8', percent: 43 },
  { plan: 'Pro', users: 5612, color: '#6366f1', percent: 35 },
  { plan: 'Premium', users: 3421, color: '#06b6d4', percent: 22 },
];

export const adminFeatureAdoption = [
  { feature: 'Dashboard', users: 15847, percent: 100 },
  { feature: 'Dépenses CRUD', users: 14203, percent: 89.6 },
  { feature: 'Budgets', users: 11234, percent: 70.9 },
  { feature: 'Assistant IA', users: 8920, percent: 56.3 },
  { feature: 'OCR Scan', users: 6341, percent: 40.0 },
  { feature: 'Prévisions', users: 5876, percent: 37.1 },
  { feature: 'Abonnements', users: 4521, percent: 28.5 },
  { feature: 'Objectifs', users: 7234, percent: 45.6 },
  { feature: 'Calendrier', users: 3120, percent: 19.7 },
];
