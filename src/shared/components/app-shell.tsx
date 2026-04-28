'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, ShieldAlert, Stethoscope } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import type { PropsWithChildren } from 'react';

const navigation = [
  { href: '/', label: 'Overview', icon: Stethoscope },
  { href: '/lab-tests', label: 'Lab Tests', icon: FlaskConical },
  { href: '/medicines', label: 'Medicines', icon: ShieldAlert },
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Doctor Prescription</p>
            <h1 className="text-xl font-semibold">Clinical Search Console</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js frontend</Badge>
            <Badge variant="outline">User-friendly workflow</Badge>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={cn(
                    'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-white text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  className={cn(
                    'hidden items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground lg:flex',
                    isActive ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground',
                  )}
                  href={item.href}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl bg-[length:18px_18px] bg-grid p-4">
            <p className="text-sm font-medium text-foreground">Backend contract</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Uses the live endpoints from `/api/v1`, including medicine warnings and lab test search.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border bg-white/80 p-4">
            <p className="text-sm font-medium text-foreground">Quick routes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="rounded-full bg-muted px-3 py-1 text-xs font-medium" href="/medicines/warnings">
                Safety checker
              </Link>
              <Link className="rounded-full bg-muted px-3 py-1 text-xs font-medium" href="/diseases">
                Disease suggestions
              </Link>
            </div>
          </div>
        </aside>
        <main className="space-y-8">{children}</main>
      </div>
    </div>
  );
}
