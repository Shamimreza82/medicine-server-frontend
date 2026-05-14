'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import { Search, Loader2, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGenericSearch } from '@/modules/medicines/hooks';
import { cn } from '@/shared/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GenericsPage() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useGenericSearch(
    deferredQuery, 
    15, 
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
          <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {showSkeleton ? (
              Array.from({ length: 9 }).map((_, i) => (
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
              ))
            ) : generics.length > 0 ? (
              generics.map((generic) => (
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
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                        {generic.indication || "No indication data available for this generic."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
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
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 pb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1 || isFetching}
                className="h-10 w-10 rounded-xl p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-semibold bg-muted/50 px-4 py-2 rounded-xl border border-primary/5">
                Page {page} <span className="text-muted-foreground font-normal">of</span> {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === totalPages || isFetching}
                className="h-10 w-10 rounded-xl p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
