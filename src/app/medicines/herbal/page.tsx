import { HerbalSearch } from '@/modules/medicines/components/herbal-search';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

export default function HerbalPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Herbal module"
        description="Explore natural remedies and herbal medicine formulations. Search through natural brands and ingredients."
        eyebrow="Medicines"
        title="Herbal repository"
      />
      <HerbalSearch />
    </AppShell>
  );
}
