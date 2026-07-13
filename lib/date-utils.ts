import { differenceInCalendarDays, parseISO } from 'date-fns';
import { ExpirationStatus } from './types';

export function getExpirationStatus(dateStr: string): ExpirationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiration = parseISO(dateStr);
  expiration.setHours(0, 0, 0, 0);
  const diff = differenceInCalendarDays(expiration, today);

  if (diff < 0) return 'expired';
  if (diff === 0) return 'today';
  if (diff <= 3) return 'soon';
  return 'valid';
}

export function getDaysUntilExpiration(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiration = parseISO(dateStr);
  expiration.setHours(0, 0, 0, 0);
  return differenceInCalendarDays(expiration, today);
}

export function formatExpirationDate(dateStr: string): string {
  const expiration = parseISO(dateStr);
  return expiration.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getExpirationBadgeLabel(dateStr: string): string {
  const days = getDaysUntilExpiration(dateStr);
  if (days < 0) return 'Po terminie';
  if (days === 0) return 'Dzisiaj';
  if (days === 1) return '1 dzień';
  return `${days} dni`;
}

export function formatExpirationLabel(dateStr: string): string {
  const days = getDaysUntilExpiration(dateStr);
  if (days < 0) return `Przeterminowany ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dzień' : 'dni'} temu`;
  if (days === 0) return 'Wygasa dzisiaj';
  if (days === 1) return 'Wygasa jutro';
  return `Wygasa za ${days} dni`;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
