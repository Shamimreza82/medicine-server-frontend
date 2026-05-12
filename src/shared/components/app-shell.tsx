'use client';

import { Navbar } from '@/shared/components/navbar';
import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background/50">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        {/* Main Content */}
        <main className="px-4 py-8 sm:px-6 lg:p-10 min-h-[calc(100vh-64px)]">
          <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
