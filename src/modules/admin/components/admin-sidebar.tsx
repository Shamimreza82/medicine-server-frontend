'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  X,
  User,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { logout } from '@/app/login/actions';
import { NavItem } from '../types';
import { toast } from 'sonner';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function AdminSidebar({ isOpen, onClose, navItems }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Medicines']); // Medicine expanded by default
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(i => i !== label) 
        : [...prev, label]
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-primary/5 shadow-2xl shadow-primary/5 transition-transform duration-300 lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight">Admin Hub</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Medicine CMS</span>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-9 w-9 p-0 rounded-xl"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

 

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-4 mt-2">Main Menu</p>
          {navItems.map((item) => {
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;
            const isActive = pathname === item.href || (hasChildren && item.children?.some(c => pathname === c.href));

            return (
              <div key={item.label} className="space-y-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group",
                      isActive 
                        ? "bg-primary/5 text-primary" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-primary")} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                ) : (
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-primary")} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                )}

                {/* Children / Sub-menu */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 pl-4 border-l border-primary/10 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                            isChildActive
                              ? "bg-primary text-white shadow-md shadow-primary/10"
                              : "text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                          )}
                        >
                          <div className={cn("h-1.5 w-1.5 rounded-full", isChildActive ? "bg-white" : "bg-primary/20")} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto border-t border-primary/5 bg-muted/10">
          <Button 
            onClick={() => setIsLogoutModalOpen(true)}
            variant="ghost" 
            className="w-full flex items-center justify-start gap-3 px-4 py-6 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-bold"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout Session</span>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 border border-primary/5 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive animate-pulse">
                <AlertTriangle className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-black tracking-tight text-primary">Confirm Logout</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Are you sure you want to end your administrative session?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full h-12 rounded-2xl text-black bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 font-bold transition-all active:scale-95"
                >
                  {isLoggingOut ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Logging out...</>
                  ) : (
                    "Yes, Logout"
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full h-12 rounded-2xl font-bold hover:bg-primary/5 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
