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
        badge="GET /medicines/generics/:genericId/dose-templates"
        description="Clinical dose template fields for one generic medicine."
        eyebrow="Generic Details"
        title="Dose template"
      />
      <GenericDoseTemplateView genericId={genericId} />
    </AppShell>
  );
}
