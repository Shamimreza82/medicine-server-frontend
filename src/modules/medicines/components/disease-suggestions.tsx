'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useDiseaseSuggestions } from '../hooks';

export function DiseaseSuggestions() {
  const [draftId, setDraftId] = useState('');
  const [diseaseId, setDiseaseId] = useState('');
  const result = useDiseaseSuggestions(diseaseId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Disease suggestion lookup</CardTitle>
          <CardDescription>
            The backend currently requires a disease ID. Paste a known `diseaseId` to retrieve medicine suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground">
            Best use: paste a known disease UUID from backend data, then review the primary and alternative medicine
            suggestions below.
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="disease-id">Disease ID</Label>
              <Input
                id="disease-id"
                onChange={(event) => setDraftId(event.target.value)}
                placeholder="Paste disease UUID"
                value={draftId}
              />
            </div>
            <Button className="self-end" onClick={() => setDiseaseId(draftId.trim())} type="button">
              Load suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {!diseaseId ? (
        <EmptyState description="Provide a disease ID to call the suggestions endpoint." title="Disease ID required" />
      ) : result.isError ? (
        <EmptyState
          description="Suggestions could not be loaded. Confirm the disease ID exists and the backend is running."
          title="Lookup failed"
        />
      ) : result.data ? (
        <Card>
          <CardHeader>
            <CardTitle>{result.data.disease.name}</CardTitle>
            <CardDescription>{result.data.disease.slug}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.data.medicines.map((medicine) => (
              <div className="rounded-2xl border p-4" key={medicine.genericId}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{medicine.genericName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {medicine.isPrimary ? 'Primary suggestion' : 'Alternative'} • {formatNullable(medicine.note)}
                    </p>
                  </div>
                  <Badge variant={medicine.isPrimary ? 'default' : 'outline'}>
                    {medicine.isPrimary ? 'Primary' : 'Alternative'}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>Adult dose: {formatNullable(medicine.commonDoseTemplate.adultDose)}</p>
                  <p>Brands: {medicine.brands.map((brand) => brand.name).join(', ') || 'Not available'}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState description="No suggestions loaded yet or the ID is invalid." title="No disease suggestions" />
      )}
    </div>
  );
}
