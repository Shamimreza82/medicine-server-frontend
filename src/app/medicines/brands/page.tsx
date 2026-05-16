'use client';

import { useState, useDeferredValue, useEffect, Suspense } from 'react';
import { Search, Loader2, ArrowRight, X, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrandSearch } from '@/modules/medicines/hooks';
import { MedicineFormIcon } from '@/modules/medicines/components/form-icon';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/shared/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function BrandsContent() {
  const searchParams = useSearchParams();
  const formFilter = searchParams.get('form') || undefined;

  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useBrandSearch(deferredQuery, 20, page, { 
    form: formFilter,
    letter: selectedLetter 
  });

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [deferredQuery, selectedLetter]);

  const brands = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const title = formFilter ? `${formFilter} Brands` : "Medicine Brands";
  const description = formFilter 
    ? `Browse all available brands formulated as ${formFilter}.`
    : "Search across thousands of pharmaceutical brands and their specific formulations.";

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

  const showSkeleton = isLoading && brands.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Commercial products"
        description={description}
        eyebrow="Medicines"
        title={title}
      />

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
                  placeholder="Search brands (e.g., Napa, Ace, Sergel)..."
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
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-6 w-6 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              )
            ))}
          </div>
        ) : brands.length > 0 ? (
          view === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/medicines/brands/${brand.id}`}>
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl group">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                            <MedicineFormIcon form={brand.form} className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base font-bold group-hover:text-primary transition-colors truncate">{brand.name}</CardTitle>
                              {brand.isSponsored && (
                                <Badge variant="secondary" className="h-4 px-1 text-[7px] uppercase tracking-tighter bg-primary/5 text-primary border-primary/10">
                                  Ads
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-[10px] font-medium truncate flex items-center gap-1 text-muted-foreground/80">
                              <span className="truncate">{brand.generic.name}</span>
                              <span className="text-primary/30">•</span>
                              <span className="truncate">{brand.company.name}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest truncate">
                          {brand.form} • {brand.strength}
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight className="h-3.5 w-3.5" />
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
                      <th className="px-6 py-4">Brand & Form</th>
                      <th className="px-6 py-4">Generic</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Strength</th>
                      <th className="px-6 py-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/medicines/brands/${brand.id}`} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                              <MedicineFormIcon form={brand.form} className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold group-hover:text-primary transition-colors">{brand.name}</div>
                              <div className="text-[10px] text-muted-foreground/80 font-medium">{brand.form}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground font-medium">{brand.generic.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground font-medium">{brand.company.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground font-bold">{brand.strength}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-bold text-primary">
                            {brand.price ? `৳ ${brand.price}` : '—'}
                          </div>
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
            <p className="text-muted-foreground font-medium">No matching brands found.</p>
            {(query || selectedLetter) && (
              <Button 
                variant="ghost" 
                onClick={() => { setQuery(''); setSelectedLetter(undefined); }}
                className="mt-2 text-primary"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {brands.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLoading={isFetching}
          />
        )}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-3xl" />}>
        <BrandsContent />
      </Suspense>
    </AppShell>
  );
}
