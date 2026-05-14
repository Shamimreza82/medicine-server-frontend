'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, Tag, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicineFormIcon } from './form-icon';

import { useCompanyDetails, useBrandSearch } from '../hooks';

interface CompanyDetailsProps {
  companyId: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const companyResult = useCompanyDetails(Number(companyId));
  const brandsResult = useBrandSearch(deferredQuery, 21, page, { companyId: Number(companyId) });

  // Reset to first page when search query changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery]);

  if (companyResult.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!companyResult.data) {
    return <EmptyState description="The company was not found or is no longer active." title="No company data" />;
  }

  const company = companyResult.data;
  const brands = brandsResult.data?.data || [];
  const meta = brandsResult.data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-8">
      <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/[0.02] shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-6 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">{company.name}</CardTitle>
            <CardDescription className="text-base font-medium">Pharmaceutical Manufacturer</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
              Product Portfolio {meta && meta.total !== undefined && `(${meta.total})`}
            </h3>
          </div>
          {brandsResult.isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </div>

        <div className="relative group/search max-w-md">
          <div className="absolute inset-0 bg-primary/5 rounded-xl scale-[0.98] group-focus-within/search:scale-100 transition-all duration-300 -z-10" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <Input
            className="h-12 pl-11 pr-4 bg-white/50 border-2 border-primary/5 focus:border-primary/20 rounded-xl text-base font-semibold placeholder:text-muted-foreground/40 transition-all"
            placeholder="Search by brand or generic name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {brandsResult.isError ? (
          <EmptyState
            description="There was an error loading the product portfolio. Please try again later."
            title="Error loading products"
            actionLabel="Retry"
            actionHref="#"
          />
        ) : brands.length > 0 ? (
          <>
            <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${brandsResult.isFetching ? 'opacity-50' : ''} transition-opacity`}>
              {brands.map((brand) => (
                <Link key={brand.id} href={`/medicines/brands/${brand.id}`} className="group">
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl">
                    <CardHeader className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                            <MedicineFormIcon form={brand.form} className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">{brand.name}</CardTitle>
                            <p className="text-xs font-medium text-muted-foreground truncate">{brand.generic?.name || 'Unknown Generic'}</p>
                          </div>
                        </div>
                        <Tag className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                          {brand.form} • {brand.strength}
                        </div>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || brandsResult.isFetching}
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || brandsResult.isFetching}
                  className="h-9 w-9 rounded-xl p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : brandsResult.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <EmptyState description="No products found for this manufacturer." title="Empty portfolio" />
        )}
      </div>
    </div>
  );
}
