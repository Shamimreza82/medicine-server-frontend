'use client';

import { Activity, Stethoscope } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';

import { useIndicationDetails } from '../hooks';

interface IndicationDetailsProps {
  indicationId: string;
}

export function IndicationDetailsView({ indicationId }: IndicationDetailsProps) {
  const result = useIndicationDetails(Number(indicationId));

  if (result.isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!result.data) {
    return <EmptyState description="The indication was not found or is no longer active." title="No indication data" />;
  }

  const indication = result.data;

  return (
    <div className="space-y-8">
      <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/[0.02] shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-6 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight">{indication.name}</CardTitle>
            <CardDescription className="text-base font-medium">Clinical Indication</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-primary/5 rounded-3xl overflow-hidden bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <CardTitle>About Indication</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          This condition is a recognized clinical indication for several therapeutic agents. 
          Use the global search to find specific generics or brands that address <span className="text-foreground font-bold">{indication.name}</span>.
        </CardContent>
      </Card>
    </div>
  );
}
