'use client';

import { AppShell } from '@/shared/components/app-shell';
import { HeroSearch } from '@/modules/medicines/components/hero-search';

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <HeroSearch />
        </div>
      </section>
    </AppShell>
  );
}
