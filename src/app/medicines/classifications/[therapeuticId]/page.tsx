'use client';

import { use } from 'react';
import Link from 'next/link';
import { Pill, ArrowRight, Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';
import { EmptyState } from '@/shared/components/empty-state';
import { useGenericSearch, useClassificationTree } from '@/modules/medicines/hooks';

interface TherapeuticDetailsPageProps {
  params: Promise<{
    therapeuticId: string;
  }>;
}

export default function TherapeuticDetailsPage({ params }: TherapeuticDetailsPageProps) {
  const { therapeuticId } = use(params);
  const { data: tree } = useClassificationTree();
  
  const { data: result, isLoading, isError } = useGenericSearch('', 50, 1, {
    therapeuticId: Number(therapeuticId)
  });

  const generics = result?.data || [];

  // Find the therapeutic class name from the tree for the header
  let therapeuticName = 'Classification Details';
  if (tree) {
    const findTherapeutic = (nodes: any[]): string | null => {
      for (const node of nodes) {
        const found = node.therapeutics.find((t: any) => t.id === Number(therapeuticId));
        if (found) return found.name;
        if (node.children) {
          const childFound = findTherapeutic(node.children);
          if (childFound) return childFound;
        }
      }
      return null;
    };
    therapeuticName = findTherapeutic(tree) || therapeuticName;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Therapeutic Class"
        description={`Displaying all pharmaceutical generics classified under ${therapeuticName}.`}
        eyebrow="Products in Class"
        title={therapeuticName}
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive/20 bg-destructive/5 rounded-2xl">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <Info className="h-10 w-10 text-destructive/50" />
                <p className="text-destructive font-medium">Failed to load generics for this class.</p>
              </div>
            </CardContent>
          </Card>
        ) : generics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {generics.map((generic) => (
              <Link key={generic.id} href={`/medicines/generics/${generic.id}`} className="group">
                <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-5 pb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 mt-1">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors leading-snug">
                          {generic.name}
                        </CardTitle>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                          Generic Formulation
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {generic.indication || 'No indication provided for this formulation.'}
                    </p>
                    <div className="flex items-center justify-end mt-4">
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
            description="No generics are currently associated with this specific therapeutic class in our database."
            actionLabel="Browse all generics"
            actionHref="/medicines/generics"
          />
        )}
      </div>
    </div>
  );
}
