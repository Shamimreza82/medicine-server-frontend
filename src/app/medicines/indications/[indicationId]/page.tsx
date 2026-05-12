import { IndicationDetailsView } from '@/modules/medicines/components/indication-details';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

interface IndicationDetailsPageProps {
  params: Promise<{
    indicationId: string;
  }>;
}

export default async function IndicationDetailsPage({ params }: IndicationDetailsPageProps) {
  const { indicationId } = await params;

  return (
    <AppShell>
      <PageHeader
        badge="Clinical condition"
        description="Detailed information and associated medical data for this clinical indication."
        eyebrow="Indication Details"
        title="Clinical Indication"
      />
      <IndicationDetailsView indicationId={indicationId} />
    </AppShell>
  );
}
