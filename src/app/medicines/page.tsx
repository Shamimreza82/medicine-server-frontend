import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineSearch } from '@/modules/medicines/components/medicine-search';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';

export default function MedicinesPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Medicine module"
        description="Search brands and generics, then move into product details, dose templates, disease suggestions, or warning checks."
        eyebrow="Medicines"
        title="Medicine explorer"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/medicines/warnings">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Warning checker</CardTitle>
              <CardDescription>POST /medicines/check-warnings</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/diseases">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Disease suggestions</CardTitle>
              <CardDescription>GET /medicines/diseases/:diseaseId/suggestions</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Detail pages</CardTitle>
            <CardDescription>Open brand products or generic dose templates directly from results.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Search below to navigate into detail pages.</CardContent>
        </Card>
      </div>
      <MedicineSearch />
    </AppShell>
  );
}
