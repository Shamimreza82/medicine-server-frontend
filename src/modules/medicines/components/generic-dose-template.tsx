'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useGenericDetails } from '../hooks';

interface GenericDoseTemplateProps {
  genericId: string;
}

export function GenericDoseTemplateView({ genericId }: GenericDoseTemplateProps) {
  const result = useGenericDetails(Number(genericId));

  if (result.isLoading) {
    return <div className="h-72 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!result.data) {
    return <EmptyState description="The generic record was not found." title="No generic data" />;
  }

  const generic = result.data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{generic.name}</CardTitle>
            <Badge variant="outline">{generic.therapeuticClass}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Indication</p>
            <p className="mt-2 text-sm">{formatNullable(generic.indication)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Adult dose</p>
            <p className="mt-2 text-sm">{formatNullable(generic.adultDose)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Child dose</p>
            <p className="mt-2 text-sm">{formatNullable(generic.childDose)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Administration</p>
            <p className="mt-2 text-sm">{formatNullable(generic.administration)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Pregnancy Category</p>
            <p className="mt-2 text-sm">
              {generic.pregnancyCategory 
                ? `${generic.pregnancyCategory.name}: ${generic.pregnancyCategory.description}` 
                : 'Not assigned'}
            </p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Side Effect</p>
            <p className="mt-2 text-sm">{formatNullable(generic.sideEffect)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Contra Indication</p>
            <p className="mt-2 text-sm">{formatNullable(generic.contraIndication)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Precaution</p>
            <p className="mt-2 text-sm">{formatNullable(generic.precaution)}</p>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mode of Action</p>
            <p className="mt-2 text-sm">{formatNullable(generic.modeOfAction)}</p>
          </div>
        </CardContent>
      </Card>
      
      {generic.therapeuticGenerics && generic.therapeuticGenerics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generic.therapeuticGenerics.map((tg) => (
                <Badge key={tg.therapeutic.id} variant="secondary">
                  {tg.therapeutic.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
