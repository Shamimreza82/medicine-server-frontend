import Link from 'next/link';
import { Activity, FlaskConical, SearchCheck, ShieldAlert, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

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
      <PageHeader
        badge="System v1.2"
        description="A specialized clinical interface built for speed and precision. Navigate through modular workflows to search, review, and validate medical prescriptions with confidence."
        eyebrow="Clinical Workspace"
        title="Overview"
      />

      <div className="grid gap-6">
        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <div className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Standard Workflow</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { step: '01', title: 'Intake & Search', desc: 'Identify clinical targets using high-performance search modules.' },
              { step: '02', title: 'Clinical Review', desc: 'Analyze product details and verify dose template alignment.' },
              { step: '03', title: 'Risk Validation', desc: 'Execute safety checks against the live contraindication engine.' },
            ].map((item) => (
              <Card key={item.step} className="group relative overflow-hidden border-primary/5 bg-white transition-all hover:border-primary/20 hover:shadow-md">
                <CardHeader>
                  <span className="text-4xl font-black text-primary/5 transition-colors group-hover:text-primary/10">{item.step}</span>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 px-1 mt-4">
            <div className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Core Modules</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
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
