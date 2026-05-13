'use client';

import { use } from 'react';
import Link from 'next/link';
import { Pill, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { useGenericSearch } from '@/modules/medicines/hooks';

interface TherapeuticDetailsPageProps {
  params: Promise<{
    therapeuticId: string;
  }>;
}

export default function TherapeuticDetailsPage({ params }: TherapeuticDetailsPageProps) {
  const { therapeuticId } = use(params);
  
  const { data: result, isLoading, isError } = useGenericSearch('', 50, 1, {
    therapeuticId: Number(therapeuticId)
  });

  const generics = result?.data || [];

  return (
    <AppShell>
      <div className="container py-6">
        <Link href="/medicines/classifications">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Classifications
          </Button>
        </Link>

        <PageHeader
          badge="Therapeutic Class"
          description="Generics belonging to this therapeutic classification."
          eyebrow="Classification Details"
          title="Class Products"
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="py-8 text-center text-destructive">
                Failed to load generics for this class.
              </CardContent>
            </Card>
          ) : generics.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generics.map((generic) => (
                <Link key={generic.id} href={`/medicines/generics/${generic.id}`} className="group">
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Pill className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{generic.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {generic.indication || 'No indication provided.'}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                          Generic Formulation
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Generics Found"
              description="No generics are currently associated with this therapeutic class."
              actionLabel="Browse all generics"
              actionHref="/medicines/generics"
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
