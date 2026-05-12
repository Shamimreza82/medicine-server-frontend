'use client';

import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';
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
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary border shadow-sm">
            <MedicineFormIcon form={brand.form} className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{brand.name}</CardTitle>
            <CardDescription>
              {brand.generic.name} • {brand.company.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold">
                  {brand.strength} • {brand.form}
                </h4>
                <p className="text-sm text-muted-foreground">{formatNullable(brand.packSize)}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{formatNullable(brand.price)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium text-primary">{brand.generic.name}</p>
            <Link className="inline-block mt-2 font-medium text-primary hover:underline" href={`/medicines/generics/${brand.generic.id}`}>
              Open clinical dose template
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
             <p>Manufacturer: {brand.company.name}</p>
             <p>Form: {formatNullable(brand.form)}</p>
             <p>Strength: {formatNullable(brand.strength)}</p>
             <p>Price: {formatNullable(brand.price)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
