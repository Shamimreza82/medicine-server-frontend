'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
        <HeartPulse className="h-5 w-5" />
      </div>
      <div className="hidden sm:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 leading-none">
          Health Intelligence
        </p>
        <h1 className="text-base font-bold tracking-tight">Medicine Hub</h1>
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
          ? "bg-primary text-primary-foreground lg:bg-primary/5 lg:text-primary" 
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
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/60 shadow-inner" />
      <div>
        <p className="text-sm font-bold">Clinical Staff</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
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

  const checkIsActive = (href: string) => 
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <Logo />

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-6">
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

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 overflow-hidden border border-primary/10">
                  <div className="h-full w-full bg-gradient-to-tr from-primary to-primary/60" />
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden h-9 w-9 p-0" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
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
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={checkIsActive(item.href)}
                onClick={() => setIsOpen(false)}
                showIcon
                className="py-3"
              />
            ))}
          </div>
          
          <div className="border-t p-4 bg-muted/20">
            <UserProfile />
          </div>
        </div>
      )}
    </nav>
  );
}
