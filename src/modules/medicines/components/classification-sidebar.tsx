'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Network, BookOpen, ArrowRight, ListTree, Search, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { useClassificationTree } from '@/modules/medicines/hooks';
import type { SystemicNode, TherapeuticNode } from '@/modules/medicines/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ClassificationSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function ClassificationSidebar({ onItemClick, className }: ClassificationSidebarProps) {
  const { data: tree, isLoading, isError } = useClassificationTree();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTree = useMemo(() => {
    if (!tree || !searchQuery.trim()) return tree;

    const query = searchQuery.toLowerCase();

    const filterNode = (node: SystemicNode): SystemicNode | null => {
      const matchInSelf = node.name.toLowerCase().includes(query);
      
      const filteredTherapeutics = node.therapeutics.filter(t => 
        t.name.toLowerCase().includes(query)
      );

      const filteredChildren = node.children
        .map(child => filterNode(child))
        .filter((child): child is SystemicNode => child !== null);

      if (matchInSelf || filteredTherapeutics.length > 0 || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
          therapeutics: filteredTherapeutics
        };
      }

      return null;
    };

    return tree.map(node => filterNode(node)).filter((node): node is SystemicNode => node !== null);
  }, [tree, searchQuery]);

  if (isLoading) {
    return (
      <div className={cn("space-y-6 p-6", className)}>
        <div className="h-10 animate-pulse rounded-xl bg-muted/60" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !tree) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ListTree className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-destructive">Failed to load hierarchy</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white/50 backdrop-blur-sm lg:bg-transparent", className)}>
      <div className="px-4 pt-6 pb-2 space-y-4">
        <div className="px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-primary/70">
              Medical Hierarchy
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Browse drugs by therapeutic class</p>
        </div>

        <div className="relative group px-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search classes..."
            className="pl-9 pr-8 h-10 bg-white/50 border-primary/5 focus-visible:ring-primary/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-4 space-y-1">
        {filteredTree && filteredTree.length > 0 ? (
          filteredTree.map((node) => (
            <SidebarItem 
              key={node.id} 
              node={node} 
              level={0} 
              onItemClick={onItemClick} 
              forceOpen={!!searchQuery}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <div className="py-12 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto">
              <Search className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ 
  node, 
  level, 
  onItemClick,
  forceOpen,
  searchQuery
}: { 
  node: SystemicNode; 
  level: number; 
  onItemClick?: () => void;
  forceOpen?: boolean;
  searchQuery?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(level === 0 || forceOpen);
  const hasChildren = node.children.length > 0 || node.therapeutics.length > 0;

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Auto-expand parents of active item
  useEffect(() => {
    const isChildActive = (n: SystemicNode): boolean => {
      if (n.therapeutics.some(t => pathname === `/medicines/classifications/${t.id}`)) return true;
      return n.children.some(child => isChildActive(child));
    };
    if (isChildActive(node)) {
      setIsOpen(true);
    }
  }, [pathname, node]);

  const isLevel0 = level === 0;

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200 group",
          isLevel0 
            ? "font-bold text-foreground hover:bg-white hover:shadow-sm" 
            : "text-sm font-semibold text-muted-foreground/80 hover:text-foreground hover:bg-muted/50",
          isOpen && isLevel0 && "text-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary/5"
        )}
      >
        <div className="flex items-start gap-3 min-w-0">
          {isLevel0 ? (
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5",
              isOpen ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            )}>
              <Network className="h-4 w-4" />
            </div>
          ) : (
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30 ml-1.5 mt-2 group-hover:bg-primary/50" />
          )}
          <span className="leading-tight py-0.5">
            <HighlightedText text={node.name} query={searchQuery} />
          </span>
        </div>
        {hasChildren && (
          <div className={cn(
            "shrink-0 transition-transform duration-300 mt-1.5",
            isOpen ? "rotate-90" : "opacity-40"
          )}>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className={cn(
          "relative mt-0.5 space-y-0.5",
          isLevel0 ? "ml-4 border-l-2 border-primary/5 pl-2" : "ml-3 border-l border-muted-foreground/10 pl-3"
        )}>
          {node.children.map((child) => (
            <SidebarItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              onItemClick={onItemClick} 
              forceOpen={forceOpen}
              searchQuery={searchQuery}
            />
          ))}
          {node.therapeutics.map((t) => {
            const isActive = pathname === `/medicines/classifications/${t.id}`;
            return (
              <Link
                key={t.id}
                href={`/medicines/classifications/${t.id}`}
                onClick={onItemClick}
                className={cn(
                  "flex items-start justify-between gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 group/link",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-1" 
                    : "text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="leading-tight">
                  <HighlightedText text={t.name} query={searchQuery} />
                </span>
                <ArrowRight className={cn(
                  "h-3 w-3 shrink-0 transition-all mt-0.5",
                  isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/link:opacity-50 group-hover/link:translate-x-0"
                )} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HighlightedText({ text, query }: { text: string; query?: string }) {
  if (!query || !query.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (
        <span 
          key={i} 
          className={part.toLowerCase() === query.toLowerCase() ? "bg-yellow-200 text-black px-0.5 rounded" : ""}
        >
          {part}
        </span>
      ))}
    </>
  );
}
