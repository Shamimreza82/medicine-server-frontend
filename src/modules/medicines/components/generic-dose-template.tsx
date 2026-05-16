'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';
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
      <div className="flex-1 w-full space-y-6">
        <div className="space-y-1 pb-6 border-b">
          <h2 className="text-3xl font-black tracking-tight text-green-900 leading-tight">{generic.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded">Clinical Generic Profile</span>
            {generic.therapeuticClass && (
              <Badge variant="secondary" className="h-5 px-2 text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border-none">
                {generic.therapeuticClass}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-8 py-2">
          {/* Layer: Clinical Indication */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Clinical Indication</h3>
            <p className="text-base leading-relaxed text-foreground/90 font-medium">{formatNullable(generic.indication)}</p>
          </section>

          {/* Layer: Adult Dose */}
          <section className="space-y-2 pt-6 border-t border-dashed">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/70">Adult Dose</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(generic.adultDose)}</p>
          </section>

          {/* Layer: Child Dose */}
          <section className="space-y-2 pt-6 border-t border-dashed">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Child Dose</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(generic.childDose)}</p>
          </section>

          {/* Layer: Administration */}
          <section className="space-y-2 pt-6 border-t border-dashed">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/70">Administration</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(generic.administration)}</p>
          </section>

          {/* Layer: Pregnancy Category */}
          <section className="space-y-2 pt-6 border-t border-dashed">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600/70">Pregnancy Category</h3>
            <p className="text-sm leading-relaxed text-foreground/80 font-semibold">
              {generic.pregnancyCategory 
                ? `${generic.pregnancyCategory.name}: ${generic.pregnancyCategory.description}` 
                : 'Not assigned'}
            </p>
          </section>

          {/* Layer: Pharmacological Summary */}
          <section className="space-y-4 pt-6 border-t border-dashed">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/70">Pharmacological Summary</h3>
            <div className="grid gap-6">
               <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground/80 mb-1">Side Effects</p>
                  <p className="text-xs leading-relaxed text-slate-600">{formatNullable(generic.sideEffect)}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground/80 mb-1">Contraindications</p>
                  <p className="text-xs leading-relaxed text-slate-600">{formatNullable(generic.contraIndication)}</p>
               </div>
            </div>
          </section>
        </div>
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
              <div className="grid grid-cols-1 gap-2">
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
                          <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                            {brand.strength} {brand.packSize ? `• ${brand.packSize}` : ''} {brand.price ? `• ৳${brand.price}` : ''}
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-hite transition-colors">
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
