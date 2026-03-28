const RULES: Record<string, string[]> = {
  Alimentation: ['carrefour', 'lidl', 'aldi', 'leclerc', 'monoprix', 'intermarché', 'franprix', 'casino', 'picard', 'biocoop', 'naturalia', 'courses', 'épicerie', 'supermarché', 'marché', 'fruits', 'légumes'],
  Restaurants: ['mcdonald', 'burger king', 'restaurant', 'brasserie', 'café', 'sushi', 'pizza', 'uber eats', 'deliveroo', 'just eat', 'domino', 'kebab', 'bistrot', 'boulangerie', 'déjeuner', 'dîner'],
  Transport: ['uber', 'sncf', 'ratp', 'navigo', 'transilien', 'metro', 'bus', 'taxi', 'blablacar', 'ouigo', 'tgv', 'eurostar', 'station', 'parking', 'péage', 'essence', 'total', 'bp', 'shell', 'carburant'],
  Abonnements: ['netflix', 'spotify', 'disney', 'amazon prime', 'apple', 'youtube premium', 'deezer', 'canal+', 'xbox', 'playstation', 'abonnement', 'prime video'],
  Santé: ['pharmacie', 'médecin', 'docteur', 'dentiste', 'hopital', 'clinique', 'ophtalmo', 'kiné', 'ordonnance', 'mutuelle', 'vitamine', 'laboratoire'],
  Logement: ['loyer', 'edf', 'engie', 'gaz', 'électricité', 'eau', 'syndic', 'charges', 'assurance habitation', 'bouygues', 'sfr', 'orange', 'free', 'internet', 'fibre'],
  Shopping: ['amazon', 'fnac', 'darty', 'decathlon', 'zara', 'h&m', 'primark', 'asos', 'vêtements', 'chaussures', 'shein', 'zalando'],
  Culture: ['cinéma', 'théatre', 'musée', 'concert', 'livre', 'kindle', 'spotify', 'arte', 'spectacle'],
  Sport: ['salle', 'gym', 'fitness', 'basic fit', 'club sportif', 'natation', 'tennis'],
  Factures: ['edf', 'engie', 'orange', 'sfr', 'bouygues', 'free', 'eau', 'assurance', 'impôt', 'taxe'],
  Salaire: ['salaire', 'paie', 'virement employeur', 'remuneration', 'rémunération', 'smic', 'traitement'],
  Freelance: ['freelance', 'facturation', 'prestation', 'mission', 'honoraires', 'client', 'facture'],
  Investissements: ['bourse', 'etf', 'action', 'crypto', 'pea', 'dividende', 'investissement', 'cto'],
  Épargne: ['livret', 'épargne', 'ldds', 'pel', 'cel', 'assurance vie'],
};

const CORRECTIONS_KEY = 'de_cat_corrections';
type Corrections = Record<string, string>;

function loadCorrections(): Corrections {
  try {
    const raw = localStorage.getItem(CORRECTIONS_KEY);
    return raw ? (JSON.parse(raw) as Corrections) : {};
  } catch {
    return {};
  }
}

function saveCorrections(corrections: Corrections): void {
  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(corrections));
}

export function normalizeLabel(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, ' ');
}

function matchRules(label: string): string {
  const lower = label.toLowerCase();
  for (const [category, keywords] of Object.entries(RULES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return 'Autres';
}

export const categorizationEngine = {
  categorize(label: string): string {
    const corrections = loadCorrections();
    const normalized = normalizeLabel(label);
    if (corrections[normalized]) return corrections[normalized];
    // partial match on corrections
    for (const [key, cat] of Object.entries(corrections)) {
      if (normalized.includes(key) || key.includes(normalized)) return cat;
    }
    return matchRules(label);
  },

  saveCorrection(label: string, category: string): void {
    const corrections = loadCorrections();
    corrections[normalizeLabel(label)] = category;
    saveCorrections(corrections);
  },

  learnFromTransactions(transactions: Array<{ label: string; category: string }>): void {
    const corrections = loadCorrections();
    for (const tx of transactions) {
      const key = normalizeLabel(tx.label);
      if (tx.category && tx.category !== 'Autres' && !corrections[key]) {
        corrections[key] = tx.category;
      }
    }
    saveCorrections(corrections);
  },
};

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Alimentation', icon: 'ri-restaurant-line', color: '#06b6d4' },
  { name: 'Restaurants', icon: 'ri-fork-line', color: '#f97316' },
  { name: 'Transport', icon: 'ri-bus-line', color: '#8b5cf6' },
  { name: 'Logement', icon: 'ri-building-line', color: '#f59e0b' },
  { name: 'Santé', icon: 'ri-heart-pulse-line', color: '#ef4444' },
  { name: 'Abonnements', icon: 'ri-repeat-line', color: '#6366f1' },
  { name: 'Shopping', icon: 'ri-shopping-bag-line', color: '#ec4899' },
  { name: 'Culture', icon: 'ri-film-line', color: '#0ea5e9' },
  { name: 'Sport', icon: 'ri-run-line', color: '#22c55e' },
  { name: 'Factures', icon: 'ri-file-text-line', color: '#64748b' },
  { name: 'Loisirs', icon: 'ri-gamepad-line', color: '#d946ef' },
  { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salaire', icon: 'ri-briefcase-line', color: '#10b981' },
  { name: 'Freelance', icon: 'ri-computer-line', color: '#6366f1' },
  { name: 'Investissements', icon: 'ri-line-chart-line', color: '#22c55e' },
  { name: 'Épargne', icon: 'ri-safe-line', color: '#f59e0b' },
  { name: 'Remboursement', icon: 'ri-refund-2-line', color: '#14b8a6' },
  { name: 'Autres', icon: 'ri-more-line', color: '#94a3b8' },
];
