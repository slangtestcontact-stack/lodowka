export const CATEGORY_EMOJI: Record<string, string> = {
  'Nabiał': '🥛',
  'Mięso i ryby': '🥩',
  'Warzywa i owoce': '🥦',
  'Pieczywo': '🍞',
  'Makarony i kasze': '🍝',
  'Konserwy': '🥫',
  'Napoje': '🧃',
  'Przyprawy': '🧂',
  'Inne': '🛒',
};

export const CATEGORY_BG: Record<string, string> = {
  'Nabiał': 'bg-blue-50',
  'Mięso i ryby': 'bg-rose-50',
  'Warzywa i owoce': 'bg-lime-50',
  'Pieczywo': 'bg-amber-50',
  'Makarony i kasze': 'bg-yellow-50',
  'Konserwy': 'bg-gray-100',
  'Napoje': 'bg-cyan-50',
  'Przyprawy': 'bg-orange-50',
  'Inne': 'bg-slate-100',
};

export const CATEGORY_PILL: Record<string, string> = {
  'Nabiał': 'bg-blue-100 text-blue-700',
  'Mięso i ryby': 'bg-rose-100 text-rose-700',
  'Warzywa i owoce': 'bg-lime-100 text-lime-700',
  'Pieczywo': 'bg-amber-100 text-amber-700',
  'Makarony i kasze': 'bg-yellow-100 text-yellow-700',
  'Konserwy': 'bg-gray-200 text-gray-700',
  'Napoje': 'bg-cyan-100 text-cyan-700',
  'Przyprawy': 'bg-orange-100 text-orange-700',
  'Inne': 'bg-slate-100 text-slate-700',
};

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '🛒';
}

export function getCategoryBg(category: string): string {
  return CATEGORY_BG[category] ?? 'bg-gray-100';
}

export function getCategoryPill(category: string): string {
  return CATEGORY_PILL[category] ?? 'bg-gray-100 text-gray-700';
}
