import { WarningChecker } from '@/modules/medicines/components/warning-checker';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

export default function MedicineWarningsPage() {
  return (
    <AppShell>
      <PageHeader
        badge="POST /medicines/check-warnings"
        description="Select a candidate generic, add current medications, and inspect risk results."
        eyebrow="Warnings"
        title="Prescription safety check"
      />
      <WarningChecker />
    </AppShell>
  );
}
