'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Tag, ChevronLeft, ChevronRight, Loader2, Stethoscope, ChevronRight as ChevronRightIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MedicineFormIcon } from './form-icon';

import { useIndicationDetails, useBrandSearch, useGenericSearch } from '../hooks';

interface IndicationDetailsProps {
  indicationId: string;
}

export function IndicationDetailsView({ indicationId }: IndicationDetailsProps) {
  const [page, setPage] = useState(1);
  const indicationResult = useIndicationDetails(Number(indicationId));
  const genericsResult = useGenericSearch('', 50, 1, { indicationId: Number(indicationId) });
  const brandsResult = useBrandSearch('', 20, page, { indicationId: Number(indicationId) });

  if (indicationResult.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!indicationResult.data) {
    return <EmptyState description="The indication was not found or is no longer active." title="No indication data" />;
  }

  const indication = indicationResult.data;
  const generics = genericsResult.data?.data || [];
  const brands = brandsResult.data?.data || [];
  const meta = brandsResult.data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/[0.02] shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-6 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">{indication.name}</CardTitle>
            <CardDescription className="text-base font-medium">Clinical Indication</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Sidebar: Therapeutics & Generics */}
        <div className="lg:col-span-5 space-y-8">
          {/* Therapeutics Sidebar Section */}
          {indication.therapeutics && indication.therapeutics.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  Therapeutic Classes
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {indication.therapeutics.map((therapeutic) => (
                  <Badge key={therapeutic.id} variant="secondary" className="px-3 py-1.5 rounded-full bg-primary/5 text-primary border-primary/5 text-[11px] font-bold">
                    <Stethoscope className="h-3 w-3 mr-1.5 opacity-70" />
                    {therapeutic.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Generics Sidebar Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  Medical Generics
                </h3>
              </div>
              {genericsResult.isFetching && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </div>

            <div className="space-y-2">
              {generics.length > 0 ? (
                generics.map((generic) => (
                  <Link key={generic.id} href={`/medicines/generics/${generic.id}`} className="block group">
                    <div className="p-3 rounded-xl border border-primary/5 bg-white/50 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold group-hover:text-primary transition-colors whitespace-normal break-words leading-tight">
                            {generic.name}
                          </p>
                          {generic.therapeuticGenerics && generic.therapeuticGenerics.length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                              {generic.therapeuticGenerics[0].therapeutic.name}
                            </p>
                          )}
                        </div>
                        <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : genericsResult.isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic px-1">No generics linked.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Brands List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
                Available Brands {meta && meta.total !== undefined && `(${meta.total})`}
              </h3>
            </div>
            {brandsResult.isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>

          {brands.length > 0 ? (
            <div className="space-y-2.5">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/medicines/brands/${brand.id}`} className="group block">
                  <Card className="border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 px-4">
                        {/* Brand Icon & Basic Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                            <MedicineFormIcon form={brand.form} className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-bold group-hover:text-primary transition-colors truncate">
                              {brand.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-[11px] font-bold text-muted-foreground truncate max-w-[150px]">
                                {brand.generic.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Details & Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="text-left sm:text-right min-w-[80px]">
                            <p className="text-[11px] font-bold text-foreground leading-none">{brand.strength}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 leading-none">{brand.form}</p>
                          </div>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || brandsResult.isFetching}
                    className="h-8 w-8 rounded-lg p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-xs font-medium">
                    {page} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || brandsResult.isFetching}
                    className="h-8 w-8 rounded-lg p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : brandsResult.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <EmptyState description="No brands found for this clinical indication." title="No related products" />
          )}
        </div>
      </div>
    </div>
  );
}
