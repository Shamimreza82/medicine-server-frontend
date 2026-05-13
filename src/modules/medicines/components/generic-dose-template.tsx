'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable, cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { MedicineFormIcon } from './form-icon';

import { useGenericDetails, useBrandSearch } from '../hooks';

interface GenericDoseTemplateProps {
  genericId: string;
}

export function GenericDoseTemplateView({ genericId }: GenericDoseTemplateProps) {
  const [page, setPage] = useState(1);
  const genericResult = useGenericDetails(Number(genericId));
  const brandsResult = useBrandSearch('', 21, page, { genericId: Number(genericId) });

  if (genericResult.isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 h-[600px] animate-pulse rounded-3xl bg-muted" />
        <div className="w-full lg:w-[400px] h-[600px] animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!genericResult.data) {
    return <EmptyState description="The generic record was not found." title="No generic data" />;
  }

  const generic = genericResult.data;
  const brands = brandsResult.data?.data || [];
  const meta = brandsResult.data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* Main Content: Clinical Profile */}
      <div className="flex-1 w-full space-y-8">
        <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-white to-primary/[0.02] p-6 sm:p-8 border-b border-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tight leading-tight">{generic.name}</CardTitle>
                <p className="text-sm font-bold uppercase tracking-widest text-primary/70">Clinical Generic Profile</p>
              </div>
              {generic.therapeuticClass && (
                <Badge variant="secondary" className="w-fit h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                  {generic.therapeuticClass}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 sm:p-8">
            <div className="rounded-2xl border bg-muted/5 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Clinical Indication</p>
              <p className="mt-3 text-sm leading-relaxed font-medium text-foreground/80 whitespace-normal">{formatNullable(generic.indication)}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/70">Adult dose</p>
                <p className="mt-2 text-sm font-bold text-slate-700 whitespace-normal leading-relaxed">{formatNullable(generic.adultDose)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Child dose</p>
                <p className="mt-2 text-sm font-bold text-slate-700 whitespace-normal leading-relaxed">{formatNullable(generic.childDose)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/70">Administration</p>
                <p className="mt-2 text-sm font-bold text-slate-700 whitespace-normal leading-relaxed">{formatNullable(generic.administration)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600/70">Pregnancy Category</p>
                <p className="mt-2 text-sm font-bold text-slate-700 whitespace-normal leading-relaxed">
                  {generic.pregnancyCategory 
                    ? `${generic.pregnancyCategory.name}: ${generic.pregnancyCategory.description}` 
                    : 'Not assigned'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/70">Pharmacological Summary</p>
              <div className="grid gap-6 mt-4">
                 <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Side Effects</p>
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-normal">{formatNullable(generic.sideEffect)}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Contraindications</p>
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-normal">{formatNullable(generic.contraIndication)}</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Content: Hierarchy & Brands */}
      <div className="w-full lg:w-[400px] space-y-8 shrink-0">
        {/* Therapeutic Classes */}
        {generic.therapeuticGenerics && generic.therapeuticGenerics.length > 0 && (
          <Card className="border-primary/5 shadow-md rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Therapeutic Classes</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex flex-wrap gap-2">
                {generic.therapeuticGenerics.map((tg) => (
                  <Badge key={tg.therapeutic.id} variant="secondary" className="rounded-xl px-4 py-1.5 font-bold text-[10px] bg-muted/50 border-none shadow-sm whitespace-normal text-left leading-tight">
                    {tg.therapeutic.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commercial Brands */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
                Commercial Brands {meta && meta.total !== undefined && `(${meta.total})`}
              </h3>
            </div>
            {brandsResult.isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>

          {brands.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {brands.map((brand) => (
                  <Link key={brand.id} href={`/medicines/brands/${brand.id}`} className="group">
                    <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl bg-white/80">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0 mt-1">
                              <MedicineFormIcon form={brand.form} className="h-5 w-5" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <CardTitle className="text-base group-hover:text-primary transition-colors leading-snug whitespace-normal">{brand.name}</CardTitle>
                              <p className="text-[11px] font-semibold text-muted-foreground leading-normal whitespace-normal">{brand.company.name}</p>
                            </div>
                          </div>
                          <Tag className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            {brand.form} • {brand.strength}
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || brandsResult.isFetching}
                    className="h-8 w-8 rounded-xl p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-[10px] font-black uppercase tracking-tighter">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || brandsResult.isFetching}
                    className="h-8 w-8 rounded-xl p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : brandsResult.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <EmptyState description="No commercial products found." title="No related products" />
          )}
        </div>
      </div>
    </div>
  );
}
