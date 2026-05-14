'use client';

import { useState, useDeferredValue, useEffect, Suspense } from 'react';
import { useDosageForms } from '@/modules/medicines/hooks';
import { PageHeader } from '@/shared/components/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MedicineFormIcon } from '@/modules/medicines/components/form-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/shared/components/app-shell';

function DosageFormsContent() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  
  const { data, isLoading, isFetching } = useDosageForms(deferredQuery, 20, page);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [deferredQuery]);

  const forms = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Clinical Inventory"
        description="Browse medications by their delivery format, from oral solids to specialized injectables."
        eyebrow="Formularies"
        title="Dosage Formats"
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
                placeholder="Search dosage forms (e.g., Tablet, Syrup, Injection)..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-medium">No matching dosage forms found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {forms.map(({ form, count }) => (
                <Link key={form} href={`/medicines/brands?form=${encodeURIComponent(form)}`}>
                  <Card className="group h-full border-primary/5 bg-white/50 backdrop-blur-sm rounded-3xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                        <MedicineFormIcon form={form} className="h-6 w-6" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <h3 className="font-black text-foreground group-hover:text-primary transition-colors truncate">
                        {form}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                          {count} Brands Available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
    </div>
  );
}

export default function DosageFormsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-3xl" />}>
        <DosageFormsContent />
      </Suspense>
    </AppShell>
  );
}
