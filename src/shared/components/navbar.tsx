'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  HeartPulse, 
  Menu, 
  X, 
  Search,
  LayoutDashboard,
  FlaskConical,
  Pill,
  Activity,
  Tag,
  Building2
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

export const navigation = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/lab-tests', label: 'Lab Tests', icon: FlaskConical },
  { href: '/medicines/generics', label: 'Generics', icon: Pill },
  { href: '/medicines/indications', label: 'Indications', icon: Activity },
  { href: '/medicines/brands', label: 'Brands', icon: Tag },
  { href: '/medicines/companies', label: 'Companies', icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 leading-none">Clinical Console</p>
                <h1 className="text-base font-bold tracking-tight">Prescription.ai</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary/5 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section: Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:bg-muted/50 cursor-pointer group">
              <Search className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
              <span className="pr-8 text-xs">Search...</span>
              <kbd className="rounded bg-white px-1.5 font-mono text-[10px] border shadow-sm text-muted-foreground/60">K</kbd>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:inline-flex bg-accent/50 text-accent-foreground border-accent/20 font-bold text-[10px]">
                v1.2.0
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 overflow-hidden border border-primary/10">
                <div className="h-full w-full bg-gradient-to-tr from-primary to-primary/60" />
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden h-9 w-9 p-0" 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t p-4 bg-muted/20">
            <div className="flex items-center gap-3 px-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/60 shadow-inner" />
              <div>
                <p className="text-sm font-bold">Clinical Staff</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Access Level: High</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
