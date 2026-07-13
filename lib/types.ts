export type ExpirationStatus = 'expired' | 'today' | 'soon' | 'valid';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  purchased: boolean;
  createdAt: string;
}

export type ProductCategory =
  | 'Nabiał'
  | 'Mięso i ryby'
  | 'Warzywa i owoce'
  | 'Pieczywo'
  | 'Makarony i kasze'
  | 'Konserwy'
  | 'Napoje'
  | 'Przyprawy'
  | 'Inne';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Nabiał',
  'Mięso i ryby',
  'Warzywa i owoce',
  'Pieczywo',
  'Makarony i kasze',
  'Konserwy',
  'Napoje',
  'Przyprawy',
  'Inne',
];

export const PRODUCT_UNITS = [
  'szt.',
  'kg',
  'g',
  'l',
  'ml',
  'opak.',
  'butelka',
  'puszka',
];
