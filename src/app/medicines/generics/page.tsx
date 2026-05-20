'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import { Search, Loader2, ArrowRight, X, LayoutGrid, List, Pill } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGenericSearch } from '@/modules/medicines/hooks';
import { cn } from '@/shared/lib/utils';
import { Pagination } from '@/shared/components/pagination';
import { Badge } from '@/components/ui/badge';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GenericsPage() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useGenericSearch(
    deferredQuery, 
    20, 
    page, 
    { letter: selectedLetter }
  );

  // Reset page when search or letter changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery, selectedLetter]);

  const generics = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const showSkeleton = isLoading && generics.length === 0;

  const handleLetterSelect = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(undefined);
    } else {
      setSelectedLetter(letter);
      setQuery(''); // Clear search when selecting a letter for better UX
    }
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (val) setSelectedLetter(undefined); // Clear letter when typing search
  };

  return (
    <AppShell>
      <PageHeader
        badge="Pharmacology"
        description="Search and explore clinical generic formulations and therapeutic classes."
        eyebrow="Medicines"
        title="Generic Formulations"
      />

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Card className="flex-1 border-primary/10 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden w-full">
              <CardContent className="p-3 sm:p-4">
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </div>
                  <Input
                    className="h-11 pl-10 pr-10 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl text-base font-medium"
                    placeholder="Search generics (e.g., Paracetamol, Omeprazole)..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={query}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl self-end md:self-center">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className={cn("h-11 w-11 rounded-lg", view === 'grid' && "bg-white shadow-sm")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('table')}
                className={cn("h-11 w-11 rounded-lg", view === 'table' && "bg-white shadow-sm")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1">
            <Button
              variant={!selectedLetter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(undefined)}
              className={cn(
                "h-9 min-w-[36px] rounded-xl text-xs font-bold transition-all shrink-0",
                !selectedLetter && "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              )}
            >
              ALL
            </Button>
            {ALPHABET.map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                onClick={() => handleLetterSelect(letter)}
                className={cn(
                  "h-9 w-9 rounded-xl text-xs font-bold transition-all shrink-0",
                  selectedLetter === letter && "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                )}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {showSkeleton ? (
            <div className={cn(
              view === 'grid' 
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-2"
            )}>
              {Array.from({ length: 9 }).map((_, i) => (
                view === 'grid' ? (
                  <Card key={i} className="h-full border-primary/5 rounded-2xl overflow-hidden">
                    <CardHeader className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-xl ml-4" />
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                )
              ))}
            </div>
          ) : generics.length > 0 ? (
            view === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {generics.map((generic) => (
                  <Link key={generic.id} href={`/medicines/generics/${generic.id}`}>
                    <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl group">
                      <CardHeader className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-1">{generic.name}</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-tight text-primary/60">
                              {generic.therapeuticClass || "Clinical Generic"}
                            </CardDescription>
                          </div>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 ml-2">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5 mt-auto">
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                            {generic.indication || "No indication data available for this generic."}
                          </p>
                          <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                              <Pill className="h-3 w-3" />
                              {generic._count?.brands || 0} BRANDS
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-primary/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-primary/5">
                        <th className="px-6 py-4">Generic Name</th>
                        <th className="px-6 py-4">Therapeutic Class</th>
                        <th className="px-6 py-4">Brands</th>
                        <th className="px-6 py-4">Common Indications</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {generics.map((generic) => (
                        <tr key={generic.id} className="hover:bg-primary/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <Link href={`/medicines/generics/${generic.id}`}>
                              <div className="text-sm font-bold group-hover:text-primary transition-colors">{generic.name}</div>
                              <div className="text-[10px] text-muted-foreground/80 font-medium">Pharmacology</div>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-primary/70 uppercase tracking-tight">
                              {generic.therapeuticClass || "General"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none hover:bg-primary/10 text-[10px] font-bold">
                              {generic._count?.brands || 0} BRANDS
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-muted-foreground line-clamp-1 italic max-w-xs">
                              {generic.indication || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              href={`/medicines/generics/${generic.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )
          ) : !isLoading && (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <p className="text-muted-foreground font-medium">No generics found matching your criteria.</p>
              <Button 
                variant="ghost" 
                onClick={() => { setQuery(''); setSelectedLetter(undefined); }}
                className="mt-2 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          )}

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLoading={isFetching}
          />
        </div>
      </div>
    </AppShell>
  );
}
