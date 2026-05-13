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
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          <div className="grid gap-4 grid-cols-3">
             {[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
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
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div className="space-y-6">
        {/* Main Product Header - Optimized for Density & Full Visibility */}
        <Card className="overflow-hidden border-none shadow-lg ring-1 ring-border/50">
          <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none hidden sm:block">
              <Stethoscope className="h-32 w-32 rotate-12" />
            </div>
            
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white shadow-xl border border-primary/10 shrink-0 z-10">
              <MedicineFormIcon form={brand.form} className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            
            <div className="space-y-2 z-10 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">{brand.name}</CardTitle>
                {brand.isSponsored && (
                  <Badge variant="secondary" className="bg-amber-500 text-white border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter shadow-sm">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-sm sm:text-base font-bold">
                <Link href={`/medicines/generics/${brand.generic.id}`} className="text-primary hover:underline underline-offset-4 decoration-primary/40">
                  {brand.generic.name}
                </Link>
                <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                <Link href={`/medicines/companies/${brand.company.id}`} className="text-muted-foreground/80 hover:text-primary transition-colors">
                  {brand.company.name}
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold px-2 py-0.5 text-[11px]">
                  {brand.strength}
                </Badge>
                <Badge variant="outline" className="bg-muted/50 font-bold px-2 py-0.5 text-[11px]">
                  {brand.form}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 bg-white/80 backdrop-blur-md border-t border-border/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/5 w-fit">
              <Zap className="h-4 w-4 text-indigo-600/70 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600/50 leading-none mb-1">Bio-Form</p>
                <p className="text-lg font-black text-indigo-900 leading-tight">{brand.form}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinician's Critical Alerts - Paragraph Style with Large Text */}
        <div className="space-y-6">
          <div className="border-l-4 border-red-500 bg-red-50/10 p-5 rounded-r-2xl">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contraindications</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-red-950 leading-relaxed whitespace-normal">
              {brand.generic.contraIndication || 'No absolute contraindications reported.'}
            </p>
          </div>

          <div className="border-l-4 border-pink-500 bg-pink-50/10 p-5 rounded-r-2xl">
            <div className="flex items-center gap-2 mb-3 text-pink-600">
              <Baby className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pregnancy & Obstetric Safety</span>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-pink-600 text-white font-black px-3 py-1 text-sm shadow-md ring-4 ring-pink-100/50">
                  CATEGORY {brand.generic.pregnancyCategory?.name || 'N/A'}
                </Badge>
                {brand.generic.pregnancyCategoryNote && (
                  <Badge variant="outline" className="border-pink-200 text-pink-700 font-bold px-2 py-0.5 text-[10px] uppercase">
                    Special Notes Available
                  </Badge>
                )}
              </div>
              <p className="text-base sm:text-lg font-bold text-pink-950 leading-relaxed whitespace-normal">
                {brand.generic.pregnancyCategory?.description || 'Reproductive safety data not available.'}
              </p>
              {brand.generic.pregnancyCategoryNote && (
                <div className="pt-3 border-t border-pink-200/30 flex gap-3">
                  <Info className="h-4 w-4 text-pink-400 shrink-0 mt-1" />
                  <p className="italic text-xs text-pink-800/80 font-bold leading-relaxed">
                    Clinician Note: {brand.generic.pregnancyCategoryNote}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-l-4 border-amber-500 bg-amber-50/10 p-5 rounded-r-2xl">
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Renal Clearance & Dosage Adjustment</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-950 leading-relaxed whitespace-normal">
              {brand.generic.renalDose || 'No specific dose adjustment required for renal impairment.'}
            </p>
          </div>
        </div>

        {/* Clinical Tabs - Data Intensive */}
        <Tabs defaultValue="clinical" className="w-full">
          <TabsList className="w-full justify-start rounded-2xl bg-muted/40 p-1 h-auto flex sm:flex-nowrap overflow-x-auto no-scrollbar border border-border/50">
            <TabTrigger value="clinical" label="Clinical Guidelines" />
            <TabTrigger value="safety" label="Safety & Toxicity" color="red" />
            <TabTrigger value="pharmacology" label="Pharmacology" color="indigo" />
          </TabsList>
          
          <div className="mt-4 space-y-6">
            <TabsContent value="clinical" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ClinicalSection 
                icon={<Stethoscope className="h-5 w-5" />} 
                title="Indications & Usage" 
                content={brand.generic.indication} 
                primary
              />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <DoseCard title="Adult Dosage Registry" content={brand.generic.adultDose} color="blue" />
                <DoseCard title="Pediatric Dosage Protocol" content={brand.generic.childDose} color="emerald" />
              </div>
              <DoseCard title="Administration Instructions" content={brand.generic.administration} color="orange" />
            </TabsContent>

            <TabsContent value="safety" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ClinicalSection icon={<ShieldAlert className="h-5 w-5" />} title="Contraindications" content={brand.generic.contraIndication} color="red" />
              <ClinicalSection icon={<AlertCircle className="h-5 w-5" />} title="Precautions & Warnings" content={brand.generic.precaution} color="amber" />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <DoseCard title="Adverse Events" content={brand.generic.sideEffect} color="purple" />
                <div className="rounded-2xl border border-pink-100 bg-pink-50/10 p-5 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-600 mb-4">Reproductive Safety</h3>
                  {brand.generic.pregnancyCategory ? (
                    <div className="space-y-4 text-xs">
                      <Badge className="bg-pink-600 text-white font-black px-3 py-1 text-sm shadow-md">CAT {brand.generic.pregnancyCategory.name}</Badge>
                      <p className="leading-relaxed text-pink-950/80 font-medium">{brand.generic.pregnancyCategory.description}</p>
                      {brand.generic.pregnancyCategoryNote && (
                         <p className="italic text-[10px] text-pink-800/70 border-t border-pink-200/50 pt-2 font-bold">
                           Clinician Note: {brand.generic.pregnancyCategoryNote}
                         </p>
                      )}
                    </div>
                  ) : <p className="text-[10px] text-muted-foreground italic">Safety data not available.</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pharmacology" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ClinicalSection icon={<Zap className="h-5 w-5" />} title="Mechanism & PK/PD" content={brand.generic.modeOfAction} color="cyan" />
              <ClinicalSection icon={<ArrowRightLeft className="h-5 w-5" />} title="Drug Interactions" content={brand.generic.interaction} color="emerald" />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Sidebar - Optimized for full data visibility */}
      <div className="space-y-6">
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
                    <p className="text-[9px] uppercase font-black text-muted-foreground/40 tracking-tighter leading-tight mt-0.5">{form.form}</p>
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
                    <span className="text-[9px] font-black opacity-40 shrink-0 mt-0.5">{alt.price}</span>
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tight leading-normal">{alt.company.name}</p>
                </Link>
              ))}
            </div>
          </SidebarCard>
        )}

        <Card className="bg-slate-950 border-none shadow-xl text-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <CardHeader className="relative p-5 pb-2">
            <CardTitle className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Clinical Identity</CardTitle>
          </CardHeader>
          <CardContent className="relative p-5 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {brand.generic.therapeuticGenerics.map((tg) => (
                <Badge key={tg.therapeutic.id} variant="outline" className="bg-white/5 border-white/10 text-white py-1 px-2 text-[10px] font-bold whitespace-normal text-left h-auto leading-tight">
                  {tg.therapeutic.name}
                </Badge>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Verified Clinical Data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Helper Components for Density ---

function AlertCard({ icon, title, content, color, description }: { icon: React.ReactNode, title: string, content: React.ReactNode, color: string, description?: string }) {
  const colorMap: Record<string, string> = {
    red: "border-l-red-500 text-red-600 text-red-950",
    pink: "border-l-pink-500 text-pink-600 text-pink-950",
    amber: "border-l-amber-500 text-amber-600 text-amber-950"
  };
  
  const [lColor, iconColor, textColor] = colorMap[color].split(' ');

  return (
    <Card className={cn("bg-white border-l-4 shadow-sm hover:shadow-md transition-all overflow-hidden", lColor)}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <div className={iconColor}>{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">{title}</span>
        </div>
        <div className={cn("text-xs font-bold leading-relaxed whitespace-normal", textColor)}>
          {content}
        </div>
        {description && <p className="text-[10px] opacity-40 mt-1 font-medium leading-normal">{description}</p>}
      </div>
    </Card>
  );
}

function TabTrigger({ value, label, color = 'primary' }: { value: string, label: string, color?: string }) {
  const activeColors: Record<string, string> = {
    primary: "data-[state=active]:text-primary",
    red: "data-[state=active]:text-red-600",
    indigo: "data-[state=active]:text-indigo-600"
  };

  return (
    <TabsTrigger 
      value={value} 
      className={cn(
        "rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-wider transition-all shrink-0",
        activeColors[color]
      )}
    >
      {label}
    </TabsTrigger>
  );
}

function ClinicalSection({ icon, title, content, color = 'primary', primary = false }: { icon: React.ReactNode, title: string, content: string | null, color?: string, primary?: boolean }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/10",
    red: "bg-red-100 text-red-600 border-red-100",
    amber: "bg-amber-100 text-amber-600 border-amber-100",
    cyan: "bg-cyan-100 text-cyan-600 border-cyan-100",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-100"
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm", colorMap[color])}>
          {icon}
        </div>
        <h3 className={cn("text-lg font-black tracking-tight", primary ? "text-foreground" : "text-slate-800")}>{title}</h3>
      </div>
      <div className={cn(
        "rounded-2xl border p-5 sm:p-6 text-[13px] leading-relaxed whitespace-pre-wrap font-medium shadow-sm relative overflow-hidden",
        primary ? "bg-white border-border/60" : "bg-muted/5 border-transparent"
      )}>
        {primary && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />}
        {formatNullable(content)}
      </div>
    </section>
  );
}

function DoseCard({ title, content, color }: { title: string, content: string | null, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50/20 border-blue-100 text-blue-950",
    emerald: "text-emerald-600 bg-emerald-50/20 border-emerald-100 text-emerald-950",
    orange: "text-orange-600 bg-orange-50/20 border-orange-100 text-orange-950",
    purple: "text-purple-600 bg-purple-50/20 border-purple-100 text-purple-950"
  };
  
  const [labelColor, bgColor, borderColor, textColor] = colorMap[color].split(' ');

  return (
    <div className={cn("rounded-2xl border-2 p-5 shadow-sm", bgColor, borderColor)}>
      <h3 className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-3", labelColor)}>{title}</h3>
      <div className={cn("text-xs leading-relaxed whitespace-pre-wrap font-bold", textColor)}>
        {formatNullable(content)}
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
    <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden bg-white/50 backdrop-blur-sm">
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
