import { BrandAlternativesView } from '@/modules/medicines/components/brand-alternatives';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BrandAlternativesPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function BrandAlternativesPage({ params }: BrandAlternativesPageProps) {
  const { brandId } = await params;

  return (
    <AppShell>
      <PageHeader
        description="List of other brands for the same generic medicine."
        eyebrow="Alternate Brands"
        title="Commercial Alternatives"
        actions={
          <Button asChild variant="ghost" className="rounded-xl hover:bg-muted font-bold transition-all">
            <Link href={`/medicines/brands/${brandId}`} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Brand
            </Link>
          </Button>
        }
      />
      <BrandAlternativesView brandId={brandId} />
    </AppShell>
  );
}
