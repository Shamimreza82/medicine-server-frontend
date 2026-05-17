import { GenericDoseTemplateView } from '@/modules/medicines/components/generic-dose-template';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

interface GenericDetailsPageProps {
  params: Promise<{
    genericId: string;
  }>;
}

export default async function GenericDetailsPage({ params }: GenericDetailsPageProps) {
  const { genericId } = await params;

  return (
    <AppShell>
      <PageHeader
        description="Clinical dose template fields for one generic medicine."
        eyebrow="Generic Details"
        title="Dose template"
      />
      <div className="px-4 sm:px-6">
        <GenericDoseTemplateView genericId={genericId} />
      </div>
    </AppShell>
  );
}
