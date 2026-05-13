'use client';

import { useState } from 'react';
import { X, ListTree, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ClassificationSidebar } from '@/modules/medicines/components/classification-sidebar';
import { Navbar } from '@/shared/components/navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { PropsWithChildren } from 'react';

export default function ClassificationsLayout({ children }: PropsWithChildren) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background/50 flex flex-col">
      <Navbar />

      {/* Mobile Floating Action Header */}
      <div className="lg:hidden sticky top-16 z-30 border-b bg-white/80 backdrop-blur-md px-4 py-2 flex items-center justify-between shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 font-bold text-primary hover:bg-primary/5 px-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <ListTree className="h-4 w-4" />
          Browse Hierarchy
        </Button>
        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Pharmacology <ChevronRight className="h-3 w-3" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 relative">
        {/* Desktop Sidebar Toggle Button (Visible when collapsed) */}
        {!isDesktopSidebarOpen && (
          <div className="hidden lg:block absolute left-4 top-8 z-40">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl bg-white shadow-md border-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsDesktopSidebarOpen(true)}
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden lg:block h-[calc(100vh-64px)] sticky top-16 shrink-0 transition-all duration-300 ease-in-out border-r border-primary/5 overflow-hidden",
            isDesktopSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-none"
          )}
        >
          <div className="h-full flex flex-col w-80">
            <div className="flex items-center justify-between px-6 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Navigation</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                onClick={() => setIsDesktopSidebarOpen(false)}
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ClassificationSidebar />
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform animate-in slide-in-from-left duration-300">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-black tracking-tight text-primary">Classifications</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ClassificationSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-112px)] lg:min-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out",
          !isDesktopSidebarOpen && "lg:pl-16"
        )}>
          <div className={cn(
            "mx-auto px-4 py-6 sm:px-6 lg:p-10 animate-in fade-in slide-in-from-bottom-2 duration-500 break-words",
            isDesktopSidebarOpen ? "max-w-5xl" : "max-w-7xl"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
