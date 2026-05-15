'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setInputPage(value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) pages.push('ellipsis1');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('ellipsis2');
      
      pages.push(totalPages);
    }

    return pages.map((page) => {
      if (typeof page === 'string') {
        return (
          <div key={page} className="flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground/30" />
          </div>
        );
      }
      
      return (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            "h-8 w-8 rounded-lg font-bold text-xs transition-all",
            currentPage === page 
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
        >
          {page}
        </Button>
      );
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 pb-8 flex-wrap">
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-primary/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="hidden sm:flex items-center gap-1">
          {renderPageButtons()}
        </div>

        <div className="flex sm:hidden items-center px-2 text-xs font-bold text-muted-foreground">
          <span className="text-primary">{currentPage}</span>
          <span className="mx-1 opacity-30">/</span>
          <span>{totalPages}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden sm:block h-4 w-px bg-primary/10" />

      <form onSubmit={handleInputSubmit} className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-xl border border-primary/5">
        <Input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          className="h-8 w-12 text-center bg-white border-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded-lg font-bold text-[10px]"
          placeholder="#"
        />
        <Button 
          type="submit" 
          variant="default" 
          size="sm" 
          className="h-8 rounded-lg px-2 font-black text-[10px] uppercase tracking-tighter"
        >
          Go
        </Button>
      </form>
    </div>
  );
}
