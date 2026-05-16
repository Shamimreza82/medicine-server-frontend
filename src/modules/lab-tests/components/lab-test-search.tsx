'use client';

import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';
import { Pagination } from '@/shared/components/pagination';

import { useLabTestsSearch } from '../hooks';

export function LabTestSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [specimen, setSpecimen] = useState('');
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);
  const deferredSpecimen = useDeferredValue(specimen);

  const result = useLabTestsSearch({
    q: deferredQuery,
    category: deferredCategory || undefined,
    specimen: deferredSpecimen || undefined,
    page,
    limit: 10,
  });

  const totalPages = result.data?.meta?.totalPages ?? 0;
  const hasFilters = Boolean(query || category || specimen);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search filters</CardTitle>
          <CardDescription>Search by name, slug, short name, or description.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Blood', 'Urine', 'Serum', 'Stool'].map((item) => (
              <button
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  specimen === item ? 'border-primary bg-primary text-primary-foreground' : 'bg-white hover:bg-muted'
                }`}
                key={item}
                onClick={() => {
                  setPage(1);
                  setSpecimen((current) => (current === item ? '' : item));
                }}
                type="button"
              >
                {item}
              </button>
            ))}
            {hasFilters ? (
              <Button
                onClick={() => {
                  setQuery('');
                  setCategory('');
                  setSpecimen('');
                  setPage(1);
                }}
                size="sm"
                variant="ghost"
              >
                Clear all
              </Button>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lab-query">Search</Label>
              <Input
                id="lab-query"
                onChange={(event) => {
                  setPage(1);
                  setQuery(event.target.value);
                }}
                placeholder="CBC, lipid profile, blood sugar"
                value={query}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lab-category">Category</Label>
              <Input
                id="lab-category"
                onChange={(event) => {
                  setPage(1);
                  setCategory(event.target.value);
                }}
                placeholder="Hematology"
                value={category}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lab-specimen">Specimen</Label>
              <Select
                value={specimen || 'all'}
                onValueChange={(val) => {
                  setPage(1);
                  setSpecimen(val === 'all' ? '' : val);
                }}
              >
                <SelectTrigger id="lab-specimen" className="bg-white rounded-xl">
                  <SelectValue placeholder="All specimens" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All specimens</SelectItem>
                  <SelectItem value="Blood">Blood</SelectItem>
                  <SelectItem value="Urine">Urine</SelectItem>
                  <SelectItem value="Stool">Stool</SelectItem>
                  <SelectItem value="Serum">Serum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {result.data?.meta?.total ?? 0} active lab tests found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {result.isError ? (
            <EmptyState
              actionHref="/lab-tests"
              actionLabel="Reset search"
              description="The lab test results could not be loaded from the backend."
              title="Search unavailable"
            />
          ) : result.isLoading || result.isFetching ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="h-48 animate-pulse rounded-2xl bg-muted" key={index} />
              ))}
            </div>
          ) : result.data?.data.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {result.data.data.map((test) => (
                <article className="rounded-2xl border bg-white p-5" key={test.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{test.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{test.shortName ?? test.slug}</p>
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {formatNullable(test.category)}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="font-medium">Specimen</dt>
                      <dd className="text-muted-foreground">{formatNullable(test.specimen)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Preparation</dt>
                      <dd className="text-muted-foreground">{formatNullable(test.preparation)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Normal Range</dt>
                      <dd className="text-muted-foreground">{formatNullable(test.normalRange)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Description</dt>
                      <dd className="text-muted-foreground">{formatNullable(test.description)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              description={
                hasFilters
                  ? 'Try a broader search term or remove category and specimen filters.'
                  : 'Start with a search term or use one of the specimen shortcuts above.'
              }
              title="No lab tests found"
            />
          )}

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLoading={result.isFetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}
