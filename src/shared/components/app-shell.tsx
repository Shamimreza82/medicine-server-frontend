'use client';

import { Navbar } from '@/shared/components/navbar';
import { Footer } from '@/shared/components/footer';
import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background/50">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-grow">
        {/* Main Content */}
        <main className="px-4 py-8 sm:px-6 lg:p-10">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
