'use client';

import { useState, useDeferredValue } from 'react';
import { Pill, Search, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { useGenericSearch } from '@/modules/medicines/hooks';

export default function GenericsPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data, isLoading, isFetching } = useGenericSearch(deferredQuery, 20);

  return (
    <AppShell>
      <PageHeader
        badge="Pharmacology"
        description="Search and explore clinical generic formulations and therapeutic classes."
        eyebrow="Medicines"
        title="Generic Formulations"
      />

      <div className="space-y-6">
        <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </div>
              <Input
                className="h-14 pl-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl text-lg font-medium"
                placeholder="Search generics (e.g., Paracetamol, Omeprazole)..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </CardContent>
        </Card>

        {!query ? (
          <EmptyState
            description="Start typing a generic name to explore therapeutic classes and dose templates."
            title="Search Generics"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data?.data?.map((generic) => (
              <Link key={generic.id} href={`/medicines/generics/${generic.id}`}>
                <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl group">
                  <CardHeader className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{generic.name}</CardTitle>
                        <CardDescription className="text-xs font-medium italic">
                          {generic.therapeuticClass || "Clinical Generic"}
                        </CardDescription>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {generic.indication || "No indication data available for this generic."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {data?.data?.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground font-medium">No matching generics found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
