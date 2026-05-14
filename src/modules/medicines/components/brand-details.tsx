'use client';

import Link from 'next/link';
import { 
  Stethoscope, 
  ShieldAlert, 
  Info, 
  Zap,
  Activity,
  ArrowRightLeft,
  Pill
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable, cn } from '@/shared/lib/utils';
import { MedicineFormIcon } from './form-icon';

import { useBrandDetails } from '../hooks';

interface BrandDetailsProps {
  brandId: string;
}

export function BrandDetailsView({ brandId }: BrandDetailsProps) {
  const result = useBrandDetails(Number(brandId));

  if (result.isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          <div className="space-y-4">
             {[1, 2, 3, 4].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!result.data) {
    return <EmptyState description="The brand was not found or is no longer active." title="No brand data" />;
  }

  const brand = result.data;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
      <div className="flex-1 w-full space-y-8">
        {/* Product Identity Header */}
        <div className="space-y-6 pb-8 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-primary/10 shrink-0">
              <MedicineFormIcon form={brand.form} className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="space-y-2 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">{brand.name}</h2>
                {brand.isSponsored && (
                  <Badge className="bg-amber-500 text-white border-none px-2 py-0.5 text-[12px] font-black uppercase tracking-tighter shadow-sm">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-base sm:text-lg font-bold">
                <Link href={`/medicines/generics/${brand.generic.id}`} className="text-primary hover:underline underline-offset-4 decoration-primary/40">
                  {brand.generic.name}
                </Link>
                <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                <Link href={`/medicines/companies/${brand.company.id}`} className="text-muted-foreground/80 hover:text-primary transition-colors">
                  {brand.company.name}
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-black px-2 py-0.5 text-[10px] uppercase">
                  {brand.strength}
                </Badge>
                <Badge variant="outline" className="bg-muted/50 font-black px-2 py-0.5 text-[10px] uppercase">
                  {brand.form}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Layered Clinical View */}
        <div className="space-y-10 py-2">
          {/* Layer: Safety */}
          <section className="space-y-8">
            <div className="flex items-center gap-2 text-red-600/70">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Safety & Contraindications</h3>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-red-600/50">Absolute Contraindications:</p>
                <p className="text-base leading-relaxed text-red-950 font-bold">{formatNullable(brand.generic.contraIndication)}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] font-black uppercase text-pink-600/50">Pregnancy & Obstetric Safety</p>
                <div className="flex items-start gap-4">
                  <Badge className="bg-pink-600 text-white font-black px-2 py-0.5 text-xs shadow-sm shrink-0">CAT {brand.generic.pregnancyCategory?.name || 'N/A'}</Badge>
                  <div className="space-y-3 min-w-0">
                    <p className="text-sm leading-relaxed text-pink-950 font-bold">{brand.generic.pregnancyCategory?.description || 'Safety data not available.'}</p>
                    {brand.generic.pregnancyCategoryNote && (
                      <div className="flex gap-2 p-3 rounded-lg bg-pink-50 border border-pink-100/50">
                        <Info className="h-3.5 w-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] italic text-pink-800 font-bold leading-relaxed">Note: {brand.generic.pregnancyCategoryNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-amber-600/50">Precautions & Warnings</p>
                <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(brand.generic.precaution)}</p>
              </div>
            </div>
          </section>

          {/* Layer: Dosing */}
          <section className="space-y-6 pt-8 border-t border-dashed">
            <div className="flex items-center gap-2 text-blue-600/70">
              <Pill className="h-5 w-5" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Dose Registry</h3>
            </div>
            <div className="grid gap-8">
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-blue-600/50">Adult Population</p>
                <p className="text-sm leading-relaxed text-foreground/80 font-semibold">{formatNullable(brand.generic.adultDose)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-emerald-600/50">Pediatric Population</p>
                <p className="text-sm leading-relaxed text-foreground/80 font-semibold">{formatNullable(brand.generic.childDose)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-orange-600/50">Administration Protocol</p>
                <p className="text-sm leading-relaxed text-foreground/80 font-semibold">{formatNullable(brand.generic.administration)}</p>
              </div>
            </div>
          </section>

          {/* Layer: Indications */}
          <section className="space-y-3 pt-8 border-t border-dashed">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Stethoscope className="h-5 w-5" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Indications & Clinical Usage</h3>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-foreground/90 font-medium  border-l-4 border-primary/20 pl-6">
              {formatNullable(brand.generic.indication)}
            </p>
          </section>

          {/* Layer: Pharmacology */}
          <section className="space-y-6 pt-8 border-t border-dashed pb-10">
            <div className="flex items-center gap-2 text-indigo-600/70">
              <Zap className="h-5 w-5" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Pharmacological Summary</h3>
            </div>
            <div className="grid gap-8">
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-indigo-600/50">Adverse Effects</p>
                <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(brand.generic.sideEffect)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-cyan-600/50">Mode of Action</p>
                <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(brand.generic.modeOfAction)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase text-emerald-600/50">Drug Interactions</p>
                <p className="text-sm leading-relaxed text-foreground/80">{formatNullable(brand.generic.interaction)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:pt-4">
        {brand.otherForms && brand.otherForms.length > 0 && (
          <SidebarCard title="Dose Formats" icon={<Activity className="h-4 w-4" />} color="primary">
            <div className="grid gap-1.5">
              {brand.otherForms.map((form) => (
                <Link 
                  key={form.id} 
                  href={`/medicines/brands/${form.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-primary/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 shrink-0 group-hover:bg-primary/5 transition-colors">
                    <MedicineFormIcon form={form.form} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors leading-tight">{form.strength}</p>
                    <p className="text-[12px] uppercase font-black text-muted-foreground/40 tracking-tighter leading-tight mt-0.5">{form.form}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SidebarCard>
        )}

        {brand.genericAlternatives && brand.genericAlternatives.length > 0 && (
          <SidebarCard title="Generic Peer Group" icon={<ArrowRightLeft className="h-4 w-4" />} color="blue">
            <div className="grid gap-1">
              {brand.genericAlternatives.map((alt) => (
                <Link 
                  key={alt.id} 
                  href={`/medicines/brands/${alt.id}`}
                  className="group flex flex-col gap-0.5 rounded-xl border border-transparent p-3 transition-all hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-blue-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-xs text-foreground/80 group-hover:text-blue-600 transition-colors leading-snug">{alt.name}</p>
                    <span className="text-[12px] font-black opacity-40 shrink-0 mt-0.5">{alt.price}</span>
                  </div>
                  <p className="text-[12px] font-bold text-muted-foreground/50 uppercase tracking-tight leading-normal">{alt.company.name}</p>
                </Link>
              ))}
            </div>
          </SidebarCard>
        )}

        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Therapeutic Identity</p>
          <div className="flex flex-wrap gap-2">
            {brand.generic.therapeuticGenerics.map((tg) => (
              <Badge key={tg.therapeutic.id} variant="outline" className="bg-white/5 border-white/10 text-white py-1 px-2 text-[10px] font-bold whitespace-normal text-left h-auto leading-tight">
                {tg.therapeutic.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarCard({ title, icon, color, children }: { title: string, icon: React.ReactNode, color: string, children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    primary: "text-primary",
    blue: "text-blue-600"
  };

  return (
    <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl">
      <CardHeader className="bg-muted/20 border-b border-border/50 p-4">
        <CardTitle className={cn("text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2", colorMap[color])}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {children}
      </CardContent>
    </Card>
  );
}
