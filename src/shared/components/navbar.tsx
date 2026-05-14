'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Menu, 
  X, 
  LayoutDashboard,
  Pill,
  Activity,
  Tag,
  Building2,
  Network,
  LucideIcon,
  Shapes
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

// --- Types ---

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// --- Configuration ---

const navigation: NavItem[] = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/medicines/classifications', label: 'Classifications', icon: Network },
  { href: '/medicines/indications', label: 'Indications', icon: Activity },
  { href: '/medicines/generics', label: 'Generics', icon: Pill },
  { href: '/medicines/dosage-forms', label: 'Dosage Forms', icon: Shapes },
  { href: '/medicines/brands', label: 'Brands', icon: Tag },
  { href: '/medicines/companies', label: 'Companies', icon: Building2 },
];

// --- Sub-components ---

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group shrink-0", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
        <HeartPulse className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70 leading-none mb-0.5">
          Health Intelligence
        </p>
        <h1 className="text-sm font-bold tracking-tight leading-none">Medicine Hub</h1>
      </div>
    </Link>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

function NavLink({ item, isActive, onClick, className, showIcon = false }: NavLinkProps) {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl",
        isActive 
          ? "bg-primary text-primary-foreground lg:bg-primary/10 lg:text-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      {item.label}
    </Link>
  );
}

function UserProfile() {
  return (
    <div className="flex items-center gap-3 px-4">
      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary/60 shadow-inner flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-bold truncate">Clinical Staff</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
          Access Level: High
        </p>
      </div>
    </div>
  );
}

// --- Main Component ---

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const checkIsActive = (href: string) => 
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left: Logo */}
            <Logo />

            {/* Right: Navigation & Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => (
                  <NavLink 
                    key={item.href} 
                    item={item} 
                    isActive={checkIsActive(item.href)} 
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0 overflow-hidden border border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="h-full w-full bg-gradient-to-tr from-primary to-primary/60" />
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden h-10 w-10 p-0 hover:bg-muted/80" 
                  onClick={() => setIsOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] lg:hidden transition-all duration-300 ease-in-out",
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div 
          className={cn(
            "absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b bg-muted/5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Navigation</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 w-10 p-0 rounded-full hover:bg-muted" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={checkIsActive(item.href)}
                onClick={() => setIsOpen(false)}
                showIcon
                className="py-3.5 px-5 text-base"
              />
            ))}
          </div>
          
          {/* Drawer Footer */}
          <div className="border-t p-6 bg-muted/30">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
}
