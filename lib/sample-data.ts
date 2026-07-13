import { Product } from './types';

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().split('T')[0];
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'sample-1',
    name: 'Mleko',
    quantity: 2,
    unit: 'l',
    category: 'Nabiał',
    expirationDate: addDays(today, 2),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Jogurt naturalny',
    quantity: 3,
    unit: 'szt.',
    category: 'Nabiał',
    expirationDate: addDays(today, 5),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Pomidory',
    quantity: 6,
    unit: 'szt.',
    category: 'Warzywa i owoce',
    expirationDate: addDays(today, -1),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    name: 'Makaron',
    quantity: 1,
    unit: 'opak.',
    category: 'Makarony i kasze',
    expirationDate: addDays(today, 180),
    createdAt: new Date().toISOString(),
  },
];
