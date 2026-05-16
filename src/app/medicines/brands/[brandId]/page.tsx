import { BrandDetailsView } from '@/modules/medicines/components/brand-details';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';

interface BrandDetailsPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function BrandDetailsPage({ params }: BrandDetailsPageProps) {
  const { brandId } = await params;

  return (
    <AppShell>
      <PageHeader
        description="Full product list and shared dose information for a selected brand."
        eyebrow="Brand Details"
        title="Brand products"
        actions={
          <Button asChild variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary font-bold transition-all">
            <Link href={`/medicines/brands/${brandId}/alternatives`} className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Alternate Brands
            </Link>
          </Button>
        }
      />
      <BrandDetailsView brandId={brandId} />
    </AppShell>
  );
}
