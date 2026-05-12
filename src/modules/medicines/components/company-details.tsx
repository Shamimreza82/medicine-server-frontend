'use client';

import Link from 'next/link';
import { Building2, ArrowRight, Tag } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MedicineFormIcon } from './form-icon';

import { useCompanyDetails } from '../hooks';

interface CompanyDetailsProps {
  companyId: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsProps) {
  const result = useCompanyDetails(Number(companyId));

  if (result.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!result.data) {
    return <EmptyState description="The company was not found or is no longer active." title="No company data" />;
  }

  const company = result.data;

  return (
    <div className="space-y-8">
      <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/[0.02] shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-6 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight">{company.name}</CardTitle>
            <CardDescription className="text-base font-medium">Pharmaceutical Manufacturer</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Product Portfolio ({company.brands.length})</h3>
        </div>

        {company.brands.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {company.brands.map((brand) => (
              <Link key={brand.id} href={`/medicines/brands/${brand.id}`} className="group">
                <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                          <MedicineFormIcon form={brand.form} className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">{brand.name}</CardTitle>
                          <p className="text-xs font-medium text-muted-foreground truncate">{brand.generic.name}</p>
                        </div>
                      </div>
                      <Tag className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                        {brand.form} • {brand.strength}
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState description="No products found for this manufacturer." title="Empty portfolio" />
        )}
      </div>
    </div>
  );
}
