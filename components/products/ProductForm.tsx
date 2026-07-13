'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, PRODUCT_CATEGORIES, PRODUCT_UNITS } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  name:           z.string().min(1, 'Nazwa produktu jest wymagana'),
  quantity:       z.coerce.number().min(0.01, 'Ilość musi być większa od 0'),
  unit:           z.string().min(1, 'Jednostka jest wymagana'),
  category:       z.string().min(1, 'Kategoria jest wymagana'),
  expirationDate: z.string().min(1, 'Data ważności jest wymagana'),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  initial?: Product;
  onSave:   (values: FormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({ initial, onSave, onCancel, loading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { name: initial.name, quantity: initial.quantity, unit: initial.unit, category: initial.category, expirationDate: initial.expirationDate }
      : { unit: 'szt.', category: '', expirationDate: '', quantity: 1 },
  });

  const selectedUnit     = watch('unit');
  const selectedCategory = watch('category');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 pb-4">

      {/* Nazwa */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Nazwa produktu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="np. Mleko, Chleb, Jabłka..."
          className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white text-sm px-4 transition-colors"
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Ilość + Jednostka */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
            Ilość <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="1"
            className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white text-sm px-4 transition-colors"
            {...register('quantity')}
          />
          {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-gray-700">
            Jednostka <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedUnit} onValueChange={v => setValue('unit', v)}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-gray-50 text-sm">
              <SelectValue placeholder="Wybierz..." />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kategoria */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700">
          Kategoria <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedCategory} onValueChange={v => setValue('category', v)}>
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-gray-50 text-sm">
            <SelectValue placeholder="Wybierz kategorię..." />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>

      {/* Data ważności */}
      <div className="space-y-1.5">
        <Label htmlFor="expirationDate" className="text-sm font-semibold text-gray-700">
          Data ważności <span className="text-red-500">*</span>
        </Label>
        <Input
          id="expirationDate"
          type="date"
          className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white text-sm px-4 transition-colors"
          {...register('expirationDate')}
        />
        {errors.expirationDate && <p className="text-xs text-red-500">{errors.expirationDate.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-12 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm transition-all active:scale-[0.98] hover:bg-gray-100"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 rounded-2xl bg-green-500 text-white font-semibold text-sm transition-all active:scale-[0.98] hover:bg-green-600"
          style={{ boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}
        >
          {initial ? 'Zapisz zmiany' : 'Zapisz produkt'}
        </button>
      </div>
    </form>
  );
}
