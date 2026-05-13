'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useHerbalBrandSearch } from '../hooks';

export function HerbalSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const result = useHerbalBrandSearch(deferredQuery);
  const quickSearches = ['Aloe Vera', 'Honey', 'Tulsi', 'Garlic', 'Ginseng'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Herbal medicine search</CardTitle>
          <CardDescription>Explore natural remedies and herbal formulations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="herbal-query">Search term</Label>
          <Input
            id="herbal-query"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Aloe, Tulsi, Honey..."
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
        </CardContent>
      </Card>

      {!query ? (
        <EmptyState
          description="Start typing an herbal brand or ingredient to load results."
          title="Search herbal medicines"
        />
      ) : result.isError ? (
        <EmptyState
          actionHref="/medicines/herbal"
          actionLabel="Try again"
          description="Herbal search failed. Check the backend connection and retry."
          title="Search unavailable"
        />
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Herbal Brands</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing...' : `${result.data?.data?.length ?? 0} matches`}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {result.isLoading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : null}
              {result.data?.data?.length ? (
                result.data.data.map((brand) => (
                  <div className="rounded-2xl border p-4" key={brand.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {brand.generic.name} • {brand.company.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        {brand.form} • {brand.strength} • {formatNullable(brand.price)}
                      </div>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/herbal/${brand.id}`}>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState description="No matching herbal brands." title="No results" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
