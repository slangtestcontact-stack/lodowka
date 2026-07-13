import { Product, ShoppingItem } from './types';
import { SAMPLE_PRODUCTS } from './sample-data';

const PRODUCTS_KEY = 'pantryai_products';
const SHOPPING_KEY = 'pantryai_shopping';
const INITIALIZED_KEY = 'pantryai_initialized';

// Products
export function getProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(updated: Product): void {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
    saveProducts(products);
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

// Shopping list
export function getShoppingItems(): ShoppingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SHOPPING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShoppingItems(items: ShoppingItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
}

export function addShoppingItem(item: ShoppingItem): void {
  const items = getShoppingItems();
  items.push(item);
  saveShoppingItems(items);
}

export function updateShoppingItem(updated: ShoppingItem): void {
  const items = getShoppingItems();
  const index = items.findIndex((i) => i.id === updated.id);
  if (index !== -1) {
    items[index] = updated;
    saveShoppingItems(items);
  }
}

export function deleteShoppingItem(id: string): void {
  const items = getShoppingItems().filter((i) => i.id !== id);
  saveShoppingItems(items);
}

export function isOnShoppingList(productName: string): boolean {
  const items = getShoppingItems();
  return items.some(
    (i) => i.name.toLowerCase() === productName.toLowerCase()
  );
}

// Initialization
export function initializeSampleData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(INITIALIZED_KEY)) return;
  saveProducts(SAMPLE_PRODUCTS);
  localStorage.setItem(INITIALIZED_KEY, 'true');
}

export function generateId(): string {
  return crypto.randomUUID();
}
