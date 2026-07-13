'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductForm } from '@/components/products/ProductForm';
import { Product } from '@/lib/types';
import {
  getProducts,
  updateProduct,
  deleteProduct,
  addShoppingItem,
  isOnShoppingList,
  generateId,
} from '@/lib/storage';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [onList, setOnList] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const load = useCallback(() => {
    const all = getProducts();
    const found = all.find((p) => p.id === id) ?? null;
    setProduct(found);
    if (found) setOnList(isOnShoppingList(found.name));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <p className="text-gray-400 text-sm">Produkt nie został znaleziony.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold"
          style={{ color: '#10B881' }}
        >
          Wróć
        </button>
      </div>
    );
  }

  function handleEdit(values: {
    name: string; quantity: number; unit: string; category: string; expirationDate: string;
  }) {
    if (!product) return;
    const updated: Product = { ...product, ...values };
    updateProduct(updated);
    setProduct(updated);
    setShowEditSheet(false);
  }

  function handleDelete() {
    deleteProduct(product!.id);
    router.push('/zapasy');
  }

  function handleMarkUsed() {
    deleteProduct(product!.id);
    router.push('/zapasy');
  }

  function handleAddToShoppingList() {
    if (!product || isOnShoppingList(product.name)) return;
    addShoppingItem({
      id: generateId(),
      name: product.name,
      quantity: `${product.quantity}`,
      unit: product.unit,
      purchased: false,
      createdAt: new Date().toISOString(),
    });
    setOnList(true);
  }

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Back bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors -ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Powrót
        </button>
        <span className="text-sm font-semibold text-gray-400">Szczegóły produktu</span>
      </div>

      <ProductDetail
        product={product}
        isOnShoppingList={onList}
        onEdit={() => setShowEditSheet(true)}
        onDelete={handleDelete}
        onMarkUsed={handleMarkUsed}
        onAddToShoppingList={handleAddToShoppingList}
      />

      {/* Edit Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] overflow-y-auto px-5 pt-5">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-bold font-poppins">Edytuj produkt</SheetTitle>
          </SheetHeader>
          <ProductForm
            initial={product}
            onSave={handleEdit}
            onCancel={() => setShowEditSheet(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
