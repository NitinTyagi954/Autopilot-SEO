import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteProvider } from '@/context/SiteContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Autopilot SEO — Open-Source SEO & Content Platform',
  description: 'Scalable modular monolith for automated SEO and content management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
