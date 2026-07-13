import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Plus_Jakarta_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PantryAI – Twoja spiżarnia',
  description: 'Zarządzaj zapasami, ogranicz marnowanie jedzenia i organizuj zakupy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning className={`${poppins.variable} ${jakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
