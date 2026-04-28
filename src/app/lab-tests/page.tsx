import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

import { LabTestSearch } from '@/modules/lab-tests/components/lab-test-search';

export default function LabTestsPage() {
  return (
    <AppShell>
      <PageHeader
        badge="GET /lab-tests/search"
        description="Search active lab tests by name, short name, category, specimen, and description."
        eyebrow="Lab Tests"
        title="Lab test directory"
      />
      <LabTestSearch />
    </AppShell>
  );
}
