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
  const quickSearches = ['Paracetamol', 'Cefixime', 'Napa', 'Omeprazole', 'Beximco', 'Square'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unified medicine search</CardTitle>
          <CardDescription>Search brands, generics, companies and indications together.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="medicine-query">Search term</Label>
          <Input
            id="medicine-query"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Paracetamol, Napa, Beximco..."
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
            Results load automatically as you type. Categorized results for quick navigation.
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
          {/* BRANDS */}
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing...' : `${result.data?.brands.length ?? 0} matches`}
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
                          {brand.generic.name} • {brand.company.name}
                        </p>
                      </div>
                      {brand.isSponsored && <Badge variant="secondary">Sponsored</Badge>}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        {brand.form} • {brand.strength} • {formatNullable(brand.price)}
                      </div>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/brands/${brand.id}`}>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching brands." title="No brands" />
              )}
            </CardContent>
          </Card>

          {/* GENERICS */}
          <Card>
            <CardHeader>
              <CardTitle>Generics</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing...' : `${result.data?.generics.length ?? 0} matches`}
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
                        <p className="text-sm text-muted-foreground italic">
                          {formatNullable(generic.therapeuticClass)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {formatNullable(generic.indication)}
                      </p>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/generics/${generic.id}`}>
                        View Generic
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching generics." title="No generics" />
              )}
            </CardContent>
          </Card>

          {/* COMPANIES */}
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing...' : `${result.data?.companies.length ?? 0} matches`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.data?.companies.length ? (
                result.data.companies.map((company) => (
                  <div className="rounded-2xl border p-4" key={company.id}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{company.name}</h3>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/companies/${company.id}`}>
                        View Portfolio
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching companies." title="No companies" />
              )}
            </CardContent>
          </Card>

          {/* INDICATIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Indications</CardTitle>
              <CardDescription>
                {result.isFetching ? 'Refreshing...' : `${result.data?.indications.length ?? 0} matches`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.data?.indications.length ? (
                result.data.indications.map((indication) => (
                  <div className="rounded-2xl border p-4" key={indication.id}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{indication.name}</h3>
                      <Link className="text-sm font-medium text-primary" href={`/medicines/indications/${indication.id}`}>
                        View Medicines
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState description="No matching indications." title="No indications" />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
