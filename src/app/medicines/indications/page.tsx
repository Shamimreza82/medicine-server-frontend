'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import { Activity, Search, Loader2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/components/ui/button';
import { useIndicationSearch } from '@/modules/medicines/hooks';

export default function IndicationsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const { data, isLoading, isFetching } = useIndicationSearch(deferredQuery, 24, page);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery]);

  const indications = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <AppShell>
      <PageHeader
        badge="Clinical targets"
        description="Search clinical conditions and indications to find relevant therapeutic categories."
        eyebrow="Medicines"
        title="Clinical Indications"
      />

      <div className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-2xl overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </div>
              <Input
                className="h-11 pl-10 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl text-base font-medium"
                placeholder="Search indications (e.g., Fever, Hypertension, Diabetes)..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </CardContent>
        </Card>

        {!query ? (
          <EmptyState
            description="Start typing a condition to explore its recognized clinical indications."
            title="Search Indications"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {indications.map((indication) => (
                <Link key={indication.id} href={`/medicines/indications/${indication.id}`}>
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl group">
                    <CardHeader className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                            {indication.name}
                          </CardTitle>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-all flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
              {indications.length === 0 && !isLoading && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground font-medium">No matching indications found.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 pb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === 1 || isFetching}
                  className="h-9 w-9 rounded-xl p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === totalPages || isFetching}
                  className="h-9 w-9 rounded-xl p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
