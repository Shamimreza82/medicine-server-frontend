import Link from 'next/link';
import { Activity, FlaskConical, SearchCheck, ShieldAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

const cards = [
  {
    href: '/lab-tests',
    title: 'Lab test search',
    description: 'Browse and filter active lab tests from PostgreSQL.',
    icon: FlaskConical,
  },
  {
    href: '/medicines',
    title: 'Medicine explorer',
    description: 'Search brands, generics, dose templates, and product details.',
    icon: SearchCheck,
  },
  {
    href: '/medicines/warnings',
    title: 'Warning checker',
    description: 'Check interactions, contraindications, pregnancy, and lactation risk.',
    icon: ShieldAlert,
  },
  {
    href: '/diseases',
    title: 'Disease suggestions',
    description: 'Load medicine suggestions for a known disease ID.',
    icon: Activity,
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader
        badge="Improved usability"
        description="A cleaner frontend around the current backend modules. The main workflows are separated by task so users can search, inspect, and validate prescriptions with less friction."
        eyebrow="Overview"
        title="Clinical workflow frontend"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>1. Search</CardTitle>
            <CardDescription>Find medicines or lab tests quickly with guided entry points.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Review</CardTitle>
            <CardDescription>Open product details, dose templates, and disease suggestions.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3. Validate</CardTitle>
            <CardDescription>Run warning checks before finalizing a prescription decision.</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link href={card.href} key={card.href}>
              <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline">Open workflow</Badge>
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Built around the current API contract and optimized for task-based navigation.
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
