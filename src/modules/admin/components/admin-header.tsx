'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="lg:hidden h-16 bg-white border-b border-primary/5 flex items-center px-4 sticky top-0 z-30">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-10 w-10 p-0 rounded-xl mr-3"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <span className="font-bold tracking-tight">Admin Dashboard</span>
    </header>
  );
}
