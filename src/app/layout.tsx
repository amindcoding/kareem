import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Kareem — Pelacak Ibadah Ramadan',
  description:
    'Aplikasi pelacak ibadah harian Ramadan dengan sistem XP, streak, dan Al-Quran lengkap.',
  manifest: '/manifest.json',
  icons: {
    icon: '/kareem-logo.png',
    apple: '/kareem-logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <QueryProvider>
          <main className="mx-auto min-h-dvh max-w-md pb-36 pt-2">
            {children}
          </main>
          <BottomNav />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '16px',
                background: '#333',
                color: '#fff',
                fontSize: '14px',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
