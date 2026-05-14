'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import { Tag, Search, Loader2, ArrowRight, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBrandSearch } from '@/modules/medicines/hooks';
import { MedicineFormIcon } from '@/modules/medicines/components/form-icon';

export default function BrandsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useBrandSearch(deferredQuery, 24, page);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery]);

  const brands = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <AppShell>
      <PageHeader
        badge="Commercial products"
        description="Search across thousands of pharmaceutical brands and their specific formulations."
        eyebrow="Medicines"
        title="Medicine Brands"
      />

      <div className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </div>
              <Input
                className="h-11 pl-10 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl text-base font-medium"
                placeholder="Search brands (e.g., Napa, Ace, Sergel)..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </CardContent>
        </Card>

        {!query ? (
          <EmptyState
            description="Start typing a brand name to find products, strengths, and pricing data."
            title="Search Brands"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/medicines/brands/${brand.id}`}>
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-xl group">
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
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {brands.length === 0 && !isLoading && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground font-medium">No matching brands found.</p>
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
                  className="h-9 w-9 rounded-xl p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === totalPages || isFetching}
                  className="h-9 w-9 rounded-xl p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
