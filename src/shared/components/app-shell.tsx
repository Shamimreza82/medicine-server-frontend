'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FlaskConical, 
  ShieldAlert, 
  Stethoscope, 
  LayoutDashboard, 
  Search, 
  HeartPulse,
  ChevronRight,
  Activity
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import type { PropsWithChildren } from 'react';

const navigation = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/lab-tests', label: 'Lab Tests', icon: FlaskConical },
  { href: '/medicines', label: 'Medicines', icon: ShieldAlert },
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background/50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 leading-none">Clinical Console</p>
              <h1 className="text-base font-bold tracking-tight">Prescription.ai</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:bg-muted md:flex">
              <Search className="h-3.5 w-3.5" />
              <span className="pr-8 text-xs">Search knowledge base...</span>
              <kbd className="rounded bg-white px-1.5 font-mono text-[10px] border shadow-sm text-muted-foreground/60">K</kbd>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:inline-flex bg-accent/50 text-accent-foreground border-accent/20 font-bold text-[10px]">
                v1.2.0
              </Badge>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/60 shadow-inner border border-white/20" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] overflow-y-auto border-r bg-white/40 px-6 py-8 backdrop-blur-sm lg:block">
          <nav className="space-y-1">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Main Menu</p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' 
                      : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm'
                  )}
                  href={item.href}
                >
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "text-white" : "text-primary/60 group-hover:text-primary")} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-50 text-white" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 space-y-6">
            <div>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Connectivity</p>
              <div className="rounded-2xl border border-primary/10 bg-white/60 p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-bold text-foreground/80">API Status Live</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Secure connection to <code className="rounded bg-muted px-1 text-[10px] text-primary font-medium">/api/v1</code> verified.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Quick Actions</p>
              <div className="grid gap-2">
                <Link 
                  href="/medicines/warnings"
                  className="flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2 text-[11px] font-bold text-foreground transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Safety Checker
                </Link>
                <Link 
                  href="/diseases"
                  className="flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2 text-[11px] font-bold text-foreground transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <Stethoscope className="h-3.5 w-3.5 text-primary" />
                  Disease Guide
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10 px-3">
            <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              © 2026 Clinical AI Inc.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="sticky top-16 z-40 border-b bg-white/60 p-4 backdrop-blur-md lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={cn(
                    'whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-white border text-muted-foreground hover:bg-muted',
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

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
