import { CompanyDetailsView } from '@/modules/medicines/components/company-details';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

interface CompanyDetailsPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const { companyId } = await params;

  return (
    <AppShell>
      <PageHeader
        badge="Pharmaceutical manufacturer"
        description="Explore the full product portfolio and brand list for this company."
        eyebrow="Company Details"
        title="Manufacturer Portfolio"
      />
      <CompanyDetailsView companyId={companyId} />
    </AppShell>
  );
}
