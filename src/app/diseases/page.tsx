import { DiseaseSuggestions } from '@/modules/medicines/components/disease-suggestions';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

export default function DiseasesPage() {
  return (
    <AppShell>
      <PageHeader
        badge="GET /medicines/diseases/:diseaseId/suggestions"
        description="The backend does not expose a disease search endpoint yet, so this page works from a known disease ID."
        eyebrow="Diseases"
        title="Disease-wise suggestions"
      />
      <DiseaseSuggestions />
    </AppShell>
  );
}
