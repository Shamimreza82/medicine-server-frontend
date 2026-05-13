'use client';

import Link from 'next/link';
import { 
  AlertCircle, 
  Stethoscope, 
  ShieldAlert, 
  Zap,
  Building2,
  Info,
  ChevronRight,
  Sprout
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable, cn } from '@/shared/lib/utils';
import { MedicineFormIcon } from './form-icon';

import { useHerbalBrandDetails } from '../hooks';

interface HerbalBrandDetailsProps {
  brandId: string;
}

export function HerbalBrandDetailsView({ brandId }: HerbalBrandDetailsProps) {
  const result = useHerbalBrandDetails(Number(brandId));

  if (result.isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          <div className="grid gap-4 grid-cols-2">
             {[1, 2].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!result.data) {
    return <EmptyState description="The herbal brand was not found." title="No data found" />;
  }

  const brand = result.data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div className="space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-none shadow-lg ring-1 ring-border/50">
          <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-br from-lime-500/10 via-background to-background p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none hidden sm:block">
              <Sprout className="h-32 w-32 rotate-12 text-lime-600" />
            </div>
            
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white shadow-xl border border-lime-500/10 shrink-0 z-10">
              <MedicineFormIcon form={brand.form} className="h-10 w-10 sm:h-12 sm:w-12 text-lime-600" />
            </div>
            
            <div className="space-y-2 z-10 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">{brand.name}</CardTitle>
                <Badge className="bg-lime-600 text-white border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter shadow-sm">
                  Herbal
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-sm sm:text-base font-bold">
                <span className="text-lime-700">{brand.generic.name}</span>
                <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                <span className="text-muted-foreground/80">{brand.company.name}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="outline" className="bg-lime-500/5 border-lime-500/20 text-lime-700 font-bold px-2 py-0.5 text-[11px]">
                  {brand.strength || 'Standard Strength'}
                </Badge>
                <Badge variant="outline" className="bg-muted/50 font-bold px-2 py-0.5 text-[11px]">
                  {brand.form}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Clinical Info */}
        <div className="space-y-6">
          <div className="border-l-4 border-lime-500 bg-lime-50/10 p-5 rounded-r-2xl">
            <div className="flex items-center gap-2 mb-3 text-lime-600">
              <Stethoscope className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Therapeutic Indication</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-lime-950 leading-relaxed whitespace-normal">
              {brand.generic.indication || 'No specific indications reported.'}
            </p>
          </div>

          {brand.generic.contraindication && (
            <div className="border-l-4 border-red-500 bg-red-50/10 p-5 rounded-r-2xl">
              <div className="flex items-center gap-2 mb-3 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contraindications</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-red-950 leading-relaxed whitespace-normal">
                {brand.generic.contraindication}
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="clinical" className="w-full">
          <TabsList className="w-full justify-start rounded-2xl bg-muted/40 p-1 h-auto flex border border-border/50">
            <TabsTrigger value="clinical" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-wider transition-all">Clinical Guidelines</TabsTrigger>
            <TabsTrigger value="pharmacology" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-wider transition-all">Pharmacology</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-6">
            <TabsContent value="clinical" className="space-y-6">
              <ClinicalSection title="Composition" content={brand.generic.composition} icon={<Zap className="h-5 w-5" />} />
              <ClinicalSection title="Dosage & Administration" content={brand.generic.dosage} icon={<Info className="h-5 w-5" />} primary />
              <ClinicalSection title="Precautions" content={brand.generic.precaution} icon={<AlertCircle className="h-5 w-5" />} color="amber" />
            </TabsContent>

            <TabsContent value="pharmacology" className="space-y-6">
              <ClinicalSection title="Mode of Action" content={brand.generic.modeOfActions} icon={<Zap className="h-5 w-5" />} color="cyan" />
              <ClinicalSection title="Drug Interactions" content={brand.generic.drugInteraction} icon={<Info className="h-5 w-5" />} color="emerald" />
              <ClinicalSection title="Side Effects" content={brand.generic.sideEffects} icon={<AlertCircle className="h-5 w-5" />} color="red" />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-950 border-none shadow-xl text-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 to-transparent opacity-50" />
          <CardHeader className="relative p-5 pb-2">
            <CardTitle className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Manufacturer</CardTitle>
          </CardHeader>
          <CardContent className="relative p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Building2 className="h-5 w-5 text-lime-400" />
              </div>
              <div>
                <p className="text-sm font-bold">{brand.company.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Verified Herbal Producer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClinicalSection({ icon, title, content, color = 'primary', primary = false }: { icon: React.ReactNode, title: string, content: string | null, color?: string, primary?: boolean }) {
  const colorMap: Record<string, string> = {
    primary: "bg-lime-100 text-lime-600 border-lime-100",
    red: "bg-red-100 text-red-600 border-red-100",
    amber: "bg-amber-100 text-amber-600 border-amber-100",
    cyan: "bg-cyan-100 text-cyan-600 border-cyan-100",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-100"
  };

  if (!content) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm", colorMap[color] || colorMap.primary)}>
          {icon}
        </div>
        <h3 className={cn("text-lg font-black tracking-tight", primary ? "text-foreground" : "text-slate-800")}>{title}</h3>
      </div>
      <div className={cn(
        "rounded-2xl border p-5 sm:p-6 text-[13px] leading-relaxed whitespace-pre-wrap font-medium shadow-sm relative overflow-hidden",
        primary ? "bg-white border-border/60" : "bg-muted/5 border-transparent"
      )}>
        {primary && <div className="absolute top-0 left-0 w-1.5 h-full bg-lime-500/20" />}
        {content}
      </div>
    </section>
  );
}
