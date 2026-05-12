'use client';

import { useState, useDeferredValue } from 'react';
import { Building2, Search, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { useCompanySearch } from '@/modules/medicines/hooks';

export default function CompaniesPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data, isLoading, isFetching } = useCompanySearch(deferredQuery, 20);

  return (
    <AppShell>
      <PageHeader
        badge="Manufacturers"
        description="Browse pharmaceutical companies and explore their complete clinical portfolios."
        eyebrow="Medicines"
        title="Pharmaceutical Companies"
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
                placeholder="Search companies (e.g., Beximco, Square, Incepta)..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </CardContent>
        </Card>

        {!query ? (
          <EmptyState
            description="Start typing a manufacturer name to view their commercial product lineup."
            title="Search Companies"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((company) => (
              <Link key={company.id} href={`/medicines/companies/${company.id}`}>
                <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl group">
                  <CardHeader className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                          {company.name}
                        </CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-all flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            {data?.data?.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground font-medium">No matching companies found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
