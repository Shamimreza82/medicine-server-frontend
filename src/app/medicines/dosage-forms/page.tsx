'use client';

import { useState, useDeferredValue, useEffect, Suspense } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MedicineFormIcon } from '@/modules/medicines/components/form-icon';
import { useDosageForms } from '@/modules/medicines/hooks';
import { cn } from '@/shared/lib/utils';
import { Pagination } from '@/shared/components/pagination';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function DosageFormsContent() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useDosageForms(
    deferredQuery, 
    20, 
    page, 
    { letter: selectedLetter }
  );

  // Reset page when search or letter changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery, selectedLetter]);

  const forms = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const showSkeleton = isLoading && forms.length === 0;

  const handleLetterSelect = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(undefined);
    } else {
      setSelectedLetter(letter);
      setQuery(''); // Clear search when selecting a letter
    }
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (val) setSelectedLetter(undefined); // Clear letter when typing search
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Clinical Inventory"
        description="Browse medications by their delivery format, from oral solids to specialized injectables."
        eyebrow="Formularies"
        title="Dosage Formats"
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
                  placeholder="Search dosage forms (e.g., Tablet, Syrup, Injection)..."
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
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {showSkeleton ? (
              Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="h-32 rounded-3xl border-primary/5 overflow-hidden">
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </Card>
              ))
            ) : forms.length > 0 ? (
              forms.map(({ form, count }) => (
                <Link key={form} href={`/medicines/brands?form=${encodeURIComponent(form)}`}>
                  <Card className="group h-full border-primary/5 bg-white/50 backdrop-blur-sm rounded-3xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                        <MedicineFormIcon form={form} className="h-6 w-6" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <h3 className="font-black text-foreground group-hover:text-primary transition-colors truncate">
                        {form}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                          {count} Brands Available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : !isLoading && (
              <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                <p className="text-muted-foreground font-medium">No dosage forms found matching your criteria.</p>
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
    </div>
  );
}

export default function DosageFormsPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        </div>
      }>
        <DosageFormsContent />
      </Suspense>
    </AppShell>
  );
}
