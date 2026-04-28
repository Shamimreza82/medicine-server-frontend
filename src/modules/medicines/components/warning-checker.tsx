'use client';

import { useDeferredValue, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';

import { useGenericSearch, useWarningCheck } from '../hooks';

interface SelectedGeneric {
  id: string;
  name: string;
}

export function WarningChecker() {
  const [candidateQuery, setCandidateQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [candidateGenericId, setCandidateGenericId] = useState('');
  const [currentGenerics, setCurrentGenerics] = useState<SelectedGeneric[]>([]);
  const [pregnancy, setPregnancy] = useState(false);
  const [lactation, setLactation] = useState(false);
  const [allergyText, setAllergyText] = useState('');
  const deferredCandidateQuery = useDeferredValue(candidateQuery);
  const deferredCurrentQuery = useDeferredValue(currentQuery);

  const candidateSearch = useGenericSearch(deferredCandidateQuery);
  const currentSearch = useGenericSearch(deferredCurrentQuery);
  const warningCheck = useWarningCheck();
  const selectedCandidate = candidateSearch.data?.find((item) => item.id === candidateGenericId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prescription warning checker</CardTitle>
          <CardDescription>Build a candidate prescription and check warnings before prescribing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-query">Candidate generic</Label>
              <Input
                id="candidate-query"
                onChange={(event) => setCandidateQuery(event.target.value)}
                placeholder="Search candidate generic"
                value={candidateQuery}
              />
              {candidateGenericId ? (
                <div className="rounded-2xl bg-accent/60 p-3 text-sm">
                  Selected candidate: <span className="font-semibold">{selectedCandidate?.name ?? candidateQuery}</span>
                </div>
              ) : null}
              <div className="space-y-2">
                {candidateSearch.data?.slice(0, 5).map((generic) => (
                  <button
                    className="block w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-muted"
                    key={generic.id}
                    onClick={() => {
                      setCandidateGenericId(generic.id);
                      setCandidateQuery(generic.name);
                    }}
                    type="button"
                  >
                    {generic.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-query">Current generics</Label>
              <Input
                id="current-query"
                onChange={(event) => setCurrentQuery(event.target.value)}
                placeholder="Search current generic medicines"
                value={currentQuery}
              />
              <p className="text-xs text-muted-foreground">Select one or more currently used medicines to check interactions.</p>
              <div className="space-y-2">
                {currentSearch.data?.slice(0, 5).map((generic) => (
                  <button
                    className="block w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-muted"
                    key={generic.id}
                    onClick={() => {
                      setCurrentGenerics((current) =>
                        current.some((item) => item.id === generic.id)
                          ? current
                          : [...current, { id: generic.id, name: generic.name }],
                      );
                      setCurrentQuery('');
                    }}
                    type="button"
                  >
                    {generic.name}
                  </button>
                ))}
              </div>
              {currentGenerics.length ? (
                <div className="flex flex-wrap gap-2">
                  {currentGenerics.map((generic) => (
                    <button
                      className="rounded-full border bg-secondary px-3 py-1 text-xs"
                      key={generic.id}
                      onClick={() =>
                        setCurrentGenerics((current) => current.filter((item) => item.id !== generic.id))
                      }
                      type="button"
                    >
                      {generic.name} remove
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergy-notes">Allergy notes</Label>
              <Textarea
                id="allergy-notes"
                onChange={(event) => setAllergyText(event.target.value)}
                placeholder="One allergy per line"
                value={allergyText}
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm">
              <input checked={pregnancy} onChange={(event) => setPregnancy(event.target.checked)} type="checkbox" />
              Pregnancy check
            </label>
            <label className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm">
              <input checked={lactation} onChange={(event) => setLactation(event.target.checked)} type="checkbox" />
              Lactation check
            </label>
            <Button
              className="w-full"
              onClick={async () => {
                if (!candidateGenericId) {
                  toast.error('Select a candidate generic first.');
                  return;
                }

                try {
                  await warningCheck.mutateAsync({
                    candidateGenericId,
                    currentGenericIds: currentGenerics.map((item) => item.id),
                    pregnancy,
                    lactation,
                    allergyNotes: allergyText
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  });
                  toast.success('Warning check completed.');
                } catch {
                  toast.error('Warning check failed.');
                }
              }}
              disabled={warningCheck.isPending}
              type="button"
            >
              {warningCheck.isPending ? 'Checking...' : 'Check warnings'}
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setCandidateQuery('');
                setCurrentQuery('');
                setCandidateGenericId('');
                setCurrentGenerics([]);
                setPregnancy(false);
                setLactation(false);
                setAllergyText('');
              }}
              type="button"
              variant="ghost"
            >
              Clear form
            </Button>
          </div>
        </CardContent>
      </Card>

      {warningCheck.isError ? (
        <EmptyState
          description="The warning check failed. Confirm the backend is running and the selected generic IDs are valid."
          title="Safety check failed"
        />
      ) : warningCheck.data ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Interaction summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warningCheck.data.interactions.length ? (
                warningCheck.data.interactions.map((interaction) => (
                  <div className="rounded-2xl border p-4" key={`${interaction.withGenericId}-${interaction.severity}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{interaction.withGenericName}</p>
                      <Badge variant={interaction.severity === 'HIGH' ? 'default' : 'outline'}>
                        {interaction.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Effect: {formatNullable(interaction.effect)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Management: {formatNullable(interaction.management)}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState description="No known interactions were returned." title="No interactions" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border p-4">
                <p className="font-semibold">Pregnancy</p>
                <p className="mt-2 text-muted-foreground">
                  {warningCheck.data.pregnancy
                    ? `${warningCheck.data.pregnancy.category} • ${formatNullable(warningCheck.data.pregnancy.warning)}`
                    : 'No pregnancy warning returned'}
                </p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-semibold">Lactation</p>
                <p className="mt-2 text-muted-foreground">
                  {warningCheck.data.lactation
                    ? `${warningCheck.data.lactation.riskLevel} • ${formatNullable(warningCheck.data.lactation.warning)}`
                    : 'No lactation warning returned'}
                </p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-semibold">Contraindications</p>
                <p className="mt-2 text-muted-foreground">
                  {warningCheck.data.contraindications.length
                    ? warningCheck.data.contraindications.map((item) => item.condition).join(', ')
                    : 'No contraindications returned'}
                </p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-semibold">Allergy advisory</p>
                <p className="mt-2 text-muted-foreground">{formatNullable(warningCheck.data.allergyAdvisory)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          description="Run a warning check to see contraindications, interactions, and pregnancy or lactation risk."
          title="No warning report yet"
        />
      )}
    </div>
  );
}
