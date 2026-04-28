'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useGenericDoseTemplate } from '../hooks';

interface GenericDoseTemplateProps {
  genericId: string;
}

export function GenericDoseTemplateView({ genericId }: GenericDoseTemplateProps) {
  const result = useGenericDoseTemplate(genericId);

  if (result.isLoading) {
    return <div className="h-72 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!result.data) {
    return <EmptyState description="The generic record was not found." title="No generic data" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.data.genericName}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Adult dose</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.adultDose)}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Child dose</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.childDose)}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Guideline</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.dosageGuideline)}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Administration</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.administration)}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Monitoring</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.monitoring)}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Precaution</p>
          <p className="mt-2 text-sm">{formatNullable(result.data.precaution)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
