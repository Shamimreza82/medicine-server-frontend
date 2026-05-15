'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Pill, 
  TestTube, 
  Settings
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AdminSidebar } from '@/modules/admin/components/admin-sidebar';
import { AdminHeader } from '@/modules/admin/components/admin-header';
import { NavItem } from '@/modules/admin/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Home', icon: Home, href: '/' },
    { 
      label: 'Medicines', 
      icon: Pill, 
      href: '/admin/medicines',
      children: [
        { label: 'Brands', href: '/admin/medicines/brands' },
        { label: 'Generics', href: '/admin/medicines/generics' },
        { label: 'Indications', href: '/admin/medicines/indications' },
        { label: 'Companies', href: '/admin/medicines/companies' },
        { label: 'Dosage Forms', href: '/admin/medicines/dosage-forms' },
      ]
    },
    { label: 'Lab Tests', icon: TestTube, href: '/admin/lab-tests' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        navItems={navItems}
      />

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        "lg:ml-72"
      )}>
        {/* Mobile Header Component */}
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="px-4 py-6 sm:px-6 lg:px-10 border-t border-primary/5 bg-white/50">
          <p className="text-center text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
            Medicine Hub Administrative Panel v1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}
