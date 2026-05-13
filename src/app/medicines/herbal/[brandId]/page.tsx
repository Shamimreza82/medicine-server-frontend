import { HerbalBrandDetailsView } from '@/modules/medicines/components/herbal-brand-details';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

interface HerbalBrandDetailsPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export default async function HerbalBrandDetailsPage({ params }: HerbalBrandDetailsPageProps) {
  const { brandId } = await params;

  return (
    <AppShell>
      <PageHeader
        description="Detailed information about herbal medicine formulations and natural brands."
        eyebrow="Herbal Details"
        title="Herbal product"
      />
      <HerbalBrandDetailsView brandId={brandId} />
    </AppShell>
  );
}
