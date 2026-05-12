'use client';

import Link from 'next/link';
import { 
  AlertCircle, 
  Stethoscope, 
  Baby, 
  ShieldAlert, 
  Info, 
  Zap,
  Activity,
  ArrowRightLeft,
  DollarSign,
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    return <div className="h-72 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!result.data) {
    return <EmptyState description="The brand was not found or is no longer active." title="No brand data" />;
  }

  const brand = result.data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Main Product Header - Highly Visible & Responsive */}
        <Card className="overflow-hidden border-none shadow-xl ring-1 ring-border/50">
          <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden sm:block">
              <Stethoscope className="h-40 w-40 rotate-12" />
            </div>
            
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[2rem] bg-white shadow-2xl border border-primary/10 shrink-0 z-10">
              <MedicineFormIcon form={brand.form} className="h-12 w-12 sm:h-14 sm:w-14" />
            </div>
            
            <div className="space-y-3 z-10 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">{brand.name}</CardTitle>
                {brand.isSponsored && (
                  <Badge variant="secondary" className="bg-amber-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-sm">
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base sm:text-lg md:text-xl font-bold flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
                <Link href={`/medicines/generics/${brand.generic.id}`} className="text-primary hover:underline underline-offset-4 decoration-primary/40 decoration-2">
                  {brand.generic.name}
                </Link>
                <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                <Link href={`/medicines/companies/${brand.company.id}`} className="text-muted-foreground/80 hover:text-primary transition-colors">
                  {brand.company.name}
                </Link>
              </CardDescription>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold px-3 py-1 text-xs sm:text-sm">
                  {brand.strength}
                </Badge>
                <Badge variant="outline" className="bg-muted/50 font-bold px-3 py-1 text-xs sm:text-sm">
                  {brand.form}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:gap-6 p-6 sm:p-8 grid-cols-1 sm:grid-cols-3 bg-white/80 backdrop-blur-md border-t border-border/50">
            <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-1 p-4 rounded-2xl bg-primary/[0.03] border border-primary/5">
              <div className="flex items-center gap-2 text-primary/70 mb-0 sm:mb-1">
                <DollarSign className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Price Point</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xl sm:text-2xl font-black text-primary leading-none">{formatNullable(brand.price)}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-1">MRP in Bangladesh</p>
              </div>
            </div>
            
            <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-1 p-4 rounded-2xl bg-blue-500/[0.03] border border-blue-500/5">
              <div className="flex items-center gap-2 text-blue-600/70 mb-0 sm:mb-1">
                <Activity className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Unit Spec</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xl sm:text-2xl font-black text-blue-900 leading-none">{formatNullable(brand.packSize)}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-1">Commercial Packaging</p>
              </div>
            </div>
            
            <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-1 p-4 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/5">
              <div className="flex items-center gap-2 text-indigo-600/70 mb-0 sm:mb-1">
                <Zap className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Bio-Form</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xl sm:text-2xl font-black text-indigo-900 leading-none truncate max-w-[150px] sm:max-w-none">{brand.form}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-1">Route of Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinician's Critical Alerts - Stacked on Mobile */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="bg-white border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-all overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldAlert className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Contraindications</span>
                </div>
                <ChevronRight className="h-4 w-4 text-red-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[13px] line-clamp-3 sm:line-clamp-4 text-red-950 font-bold leading-relaxed">
                {brand.generic.contraIndication || 'No absolute contraindications reported.'}
              </p>
            </div>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-pink-500 shadow-md hover:shadow-lg transition-all overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-pink-600">
                  <Baby className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Pregnancy/OB</span>
                </div>
                <ChevronRight className="h-4 w-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-pink-600 hover:bg-pink-700 text-white font-black px-2 py-1 text-xs shadow-sm ring-2 ring-pink-100 ring-offset-1 shrink-0">
                  CAT {brand.generic.pregnancyCategory?.name || 'N/A'}
                </Badge>
                <p className="text-[13px] font-black text-pink-900 truncate">
                   {brand.generic.pregnancyCategoryNote ? 'Notes Available' : 'Standard Protocol'}
                </p>
              </div>
              <p className="text-[11px] text-pink-800/60 mt-2 font-bold line-clamp-1">
                {brand.generic.pregnancyCategory?.description}
              </p>
            </div>
          </Card>

          <Card className="bg-white border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-all overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Renal Clearance</span>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[13px] line-clamp-3 sm:line-clamp-4 text-amber-950 font-bold leading-relaxed">
                {brand.generic.renalDose || 'No specific dose adjustment required for renal impairment.'}
              </p>
            </div>
          </Card>
        </div>

        {/* Clinical Tabs - Scrollable on Mobile */}
        <Tabs defaultValue="clinical" className="w-full">
          <TabsList className="w-full justify-start rounded-3xl bg-muted/40 p-1.5 h-auto flex sm:flex-nowrap overflow-x-auto no-scrollbar shadow-inner border border-border/50">
            <TabsTrigger value="clinical" className="rounded-2xl px-6 sm:px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shrink-0">
              Clinical Guidelines
            </TabsTrigger>
            <TabsTrigger value="safety" className="rounded-2xl px-6 sm:px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-lg font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shrink-0">
              Safety/Tox
            </TabsTrigger>
            <TabsTrigger value="pharmacology" className="rounded-2xl px-6 sm:px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shrink-0">
              Pharmacodynamics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clinical" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 sm:gap-8">
              <section className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                    <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Indications & Usage</h3>
                </div>
                <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-border/60 bg-white p-6 sm:p-8 text-[14px] sm:text-[15px] leading-[1.8] whitespace-pre-wrap text-foreground/80 shadow-sm relative overflow-hidden ring-1 ring-primary/5">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
                  {formatNullable(brand.generic.indication)}
                </div>
              </section>

              <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-blue-600" />
                     <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-blue-600">Adult Dosage Registry</h3>
                  </div>
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] border-2 border-blue-100 bg-blue-50/10 p-6 sm:p-8 text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap font-bold text-blue-950 shadow-sm relative">
                    {formatNullable(brand.generic.adultDose)}
                  </div>
                </section>
                
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-emerald-600" />
                     <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Pediatric Dosage Protocol</h3>
                  </div>
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] border-2 border-emerald-100 bg-emerald-50/10 p-6 sm:p-8 text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap font-bold text-emerald-950 shadow-sm relative">
                    {formatNullable(brand.generic.childDose)}
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-orange-600 flex items-center gap-3 ml-1">
                  <div className="h-1.5 w-6 rounded-full bg-orange-600/30" />
                  Administration Instructions
                </h3>
                <div className="rounded-[1.5rem] sm:rounded-[2rem] border-2 border-orange-100 bg-orange-50/10 p-6 sm:p-8 text-[13px] sm:text-[14px] leading-relaxed font-bold text-orange-950 shadow-sm">
                  {formatNullable(brand.generic.administration)}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                  <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-red-700">Contraindications</h3>
              </div>
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border-2 border-red-200 bg-red-50/20 p-6 sm:p-8 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-red-950 font-bold shadow-sm">
                {formatNullable(brand.generic.contraIndication)}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-amber-700">Precautions & Warnings</h3>
              </div>
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border-2 border-amber-200 bg-amber-50/20 p-6 sm:p-8 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-amber-950 font-bold shadow-sm">
                {formatNullable(brand.generic.precaution)}
              </div>
            </section>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
              <section className="space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-purple-600 ml-1">Adverse Events</h3>
                <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-purple-100 bg-purple-50/10 p-6 sm:p-8 text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap font-bold text-purple-950 shadow-sm">
                  {formatNullable(brand.generic.sideEffect)}
                </div>
              </section>
              
              <section className="space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-pink-600 ml-1">Reproductive Safety</h3>
                <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-pink-100 bg-pink-50/10 p-6 sm:p-8 text-[13px] sm:text-[14px] font-bold text-pink-950 shadow-sm">
                  {brand.generic.pregnancyCategory ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-pink-600 text-white font-black px-4 py-2 text-base sm:text-lg shadow-lg ring-4 ring-pink-100">CAT {brand.generic.pregnancyCategory.name}</Badge>
                      </div>
                      <p className="leading-relaxed text-sm sm:text-[15px] text-pink-950/80">{brand.generic.pregnancyCategory.description}</p>
                      {brand.generic.pregnancyCategoryNote && (
                         <div className="mt-4 pt-4 border-t border-pink-200/50 flex gap-3">
                           <div className="mt-1 shrink-0"><Info className="h-4 w-4 text-pink-400" /></div>
                           <p className="italic text-[11px] text-pink-800/70 leading-relaxed font-bold">
                             Clinician Note: {brand.generic.pregnancyCategoryNote}
                           </p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground italic py-4">
                      <AlertCircle className="h-5 w-5 opacity-50" />
                      <span className="text-xs">Safety data not available.</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="pharmacology" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-cyan-900">Mechanism & PK/PD</h3>
              </div>
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border-2 border-cyan-200 bg-cyan-50/20 p-6 sm:p-8 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-cyan-950 font-bold shadow-sm">
                {formatNullable(brand.generic.modeOfAction)}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                  <ArrowRightLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900">Drug Interactions</h3>
              </div>
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border-2 border-emerald-200 bg-emerald-50/20 p-6 sm:p-8 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap text-emerald-950 font-bold shadow-sm">
                {formatNullable(brand.generic.interaction)}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar - Stacks below main content on mobile */}
      <div className="space-y-6">
        {brand.otherForms && brand.otherForms.length > 0 && (
          <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                Dose Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-4">
              {brand.otherForms.map((form) => (
                <Link 
                  key={form.id} 
                  href={`/medicines/brands/${form.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-primary/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 group-hover:bg-primary/5 transition-colors border border-transparent group-hover:border-primary/5 shrink-0">
                    <MedicineFormIcon form={form.form} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-black text-[14px] text-foreground/80 truncate group-hover:text-primary transition-colors">{form.strength}</p>
                    <p className="text-[10px] uppercase font-black text-muted-foreground/50 tracking-tighter">{form.form}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {brand.genericAlternatives && brand.genericAlternatives.length > 0 && (
          <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-blue-600">
                <ArrowRightLeft className="h-4 w-4" />
                Generic Peer Group
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-4">
              {brand.genericAlternatives.map((alt) => (
                <Link 
                  key={alt.id} 
                  href={`/medicines/brands/${alt.id}`}
                  className="group flex flex-col gap-1 rounded-2xl border border-transparent p-4 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-blue-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-[14px] text-foreground/80 group-hover:text-blue-600 transition-colors truncate">{alt.name}</p>
                    <Badge variant="outline" className="text-[9px] font-black h-4 px-1 opacity-50 group-hover:opacity-100 group-hover:bg-blue-50 transition-all">{alt.price}</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight truncate">{alt.company.name}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Clinical Evidence Label - Compact on Mobile */}
        <Card className="bg-slate-950 border-none shadow-2xl text-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700 hidden sm:block">
             <Stethoscope className="h-48 w-48" />
          </div>
          <CardHeader className="relative pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Clinical Identity</CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="flex flex-wrap gap-2">
              {brand.generic.therapeuticGenerics.map((tg) => (
                <Badge key={tg.therapeutic.id} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors py-1.5 px-3 font-bold text-[11px] rounded-lg">
                  {tg.therapeutic.name}
                </Badge>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 space-y-4">
               <div className="flex items-center justify-between">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Medical Accuracy</p>
                 <ClipboardCheck className="h-4 w-4 text-emerald-500" />
               </div>
               <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 ring-1 ring-white/10">
                 <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                 <div className="space-y-0.5">
                   <p className="text-[11px] font-black text-slate-200 uppercase tracking-tight">Verified Clinical Data</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Powered by DIMS Clinical Engine</p>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
