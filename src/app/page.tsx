import Link from 'next/link';
import { Activity, FlaskConical, SearchCheck, ShieldAlert, ArrowRight, Sprout } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { HeroSearch } from '@/modules/medicines/components/hero-search';

const cards = [
  {
    href: '/lab-tests',
    title: 'Lab Test Explorer',
    description: 'Browse and filter active lab tests with real-time PostgreSQL integration.',
    icon: FlaskConical,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    href: '/medicines',
    title: 'Medicine Intelligence',
    description: 'Deep search across brands, generics, and specialized dose templates.',
    icon: SearchCheck,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    href: '/medicines/herbal',
    title: 'Herbal Repository',
    description: 'Explore natural remedies and herbal medicine formulations.',
    icon: Sprout,
    color: 'bg-lime-500/10 text-lime-600',
  },
  {
    href: '/medicines/warnings',
    title: 'Safety Validator',
    description: 'Advanced check for drug interactions, pregnancy, and lactation risks.',
    icon: ShieldAlert,
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    href: '/diseases',
    title: 'Clinical Guide',
    description: 'Contextual medicine suggestions based on validated disease profiles.',
    icon: Activity,
    color: 'bg-rose-500/10 text-rose-600',
  },
];

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

      <div className="grid gap-6">
        <section>
          <div className="mb-6 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Core Clinical Modules</h3>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Link href={card.href} key={card.href} className="group">
                  <Card className="h-full overflow-hidden border-primary/5 bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                      <CardTitle className="mt-4 text-xl">{card.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100 uppercase tracking-widest">
                        Launch Module
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
