'use client';

import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useBrandProducts } from '../hooks';

interface BrandDetailsProps {
  brandId: string;
}

export function BrandDetailsView({ brandId }: BrandDetailsProps) {
  const result = useBrandProducts(brandId);

  if (result.isLoading) {
    return <div className="h-72 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!result.data) {
    return <EmptyState description="The brand was not found or is no longer active." title="No brand data" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{result.data.brand.name}</CardTitle>
          <CardDescription>
            {result.data.generic.name} • {result.data.manufacturer.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.data.products.map((product) => (
            <div className="rounded-2xl border p-4" key={product.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">
                    {product.strength} • {product.dosageForm}
                  </h4>
                  <p className="text-sm text-muted-foreground">{formatNullable(product.route)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{formatNullable(product.price)}</p>
                  <p className="text-muted-foreground">{formatNullable(product.packSize)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Common dose template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Adult dose: {formatNullable(result.data.commonDoseTemplate.adultDose)}</p>
            <p>Child dose: {formatNullable(result.data.commonDoseTemplate.childDose)}</p>
            <p>Guideline: {formatNullable(result.data.commonDoseTemplate.dosageGuideline)}</p>
            <p>Administration: {formatNullable(result.data.commonDoseTemplate.administration)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Strengths: {result.data.strengths.join(', ') || 'Not available'}</p>
            <p>Dosage forms: {result.data.dosageForms.join(', ') || 'Not available'}</p>
            <Link className="font-medium text-primary" href={`/medicines/generics/${result.data.generic.id}`}>
              Open generic dose template
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
