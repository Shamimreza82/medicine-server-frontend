'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useMedicineSearch } from '../hooks';

export function MedicineSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const result = useMedicineSearch(deferredQuery);
  const quickSearches = ['Paracetamol', 'Cefixime', 'Napa', 'Omeprazole'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unified medicine search</CardTitle>
          <CardDescription>Search brands and generics together from the current backend API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="medicine-query">Search term</Label>
          <Input
            id="medicine-query"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Paracetamol, Napa, cefixime"
            value={query}
          />
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <button
                className="rounded-full border bg-white px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
                key={item}
                onClick={() => setQuery(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Results load automatically as you type. Open a brand for products or a generic for dose guidance.
          </p>
        </CardContent>
      </Card>

      {!query ? (
        <EmptyState
          actionHref="/medicines/warnings"
          actionLabel="Go to warning checker"
          description="Start typing a medicine or brand name to load autosuggest-style results."
          title="Search medicines"
        />
      ) : result.isError ? (
        <EmptyState
          actionHref="/medicines"
          actionLabel="Try again"
          description="Medicine search failed. Check the backend connection and retry."
          title="Search unavailable"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing results...' : `${result.data?.brands.length ?? 0} matches`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.isLoading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : null}
              {result.data?.brands.length ? (
                result.data.brands.map((brand) => (
                  <div className="rounded-2xl border p-4" key={brand.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {brand.generic.name} • {brand.manufacturer.name}
                        </p>
                      </div>
                      <Badge variant="secondary">{brand.products.length} products</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">Open full brand details and strengths.</p>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/brands/${brand.id}`}>
                        View products
                      </Link>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      {brand.products.slice(0, 3).map((product) => (
                        <div className="rounded-xl bg-muted/60 px-3 py-2" key={product.id}>
                          {product.strength} • {product.dosageForm} • {formatNullable(product.price)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching brands for this query." title="No brands" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generics</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing results...' : `${result.data?.generics.length ?? 0} matches`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.isLoading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : null}
              {result.data?.generics.length ? (
                result.data.generics.map((generic) => (
                  <div className="rounded-2xl border p-4" key={generic.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{generic.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNullable(generic.therapeuticClass)}
                        </p>
                      </div>
                      <Badge variant="outline">{generic.availableBrands.length} brands</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">Open clinical dosing guidance for this generic.</p>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/generics/${generic.id}`}>
                        Dose template
                      </Link>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p>Adult dose: {formatNullable(generic.commonDoseTemplate.adultDose)}</p>
                      <p>Administration: {formatNullable(generic.commonDoseTemplate.administration)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching generics for this query." title="No generics" />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
