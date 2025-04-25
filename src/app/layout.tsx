import type { Metadata } from 'next';
import './globals.css';
import NavigationMenu from '@/components/NavigationMenu';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A comprehensive Todo application built with Next.js, React, and Radix UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationMenu />
        <main className="min-h-screen pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
