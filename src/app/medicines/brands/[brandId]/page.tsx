import { BrandDetailsView } from '@/modules/medicines/components/brand-details';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

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
        badge="GET /medicines/brands/:brandId/products"
        description="Full product list and shared dose information for a selected brand."
        eyebrow="Brand Details"
        title="Brand products"
      />
      <BrandDetailsView brandId={brandId} />
    </AppShell>
  );
}
