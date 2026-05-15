'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  X,
  Check
} from 'lucide-react';
import { 
  useGenericSearch, 
  useCreateGeneric, 
  useUpdateGeneric,
  usePregnancyCategories
} from '@/modules/medicines/hooks';
import type { GenericDetails } from '@/modules/medicines/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { cn } from '@/shared/lib/utils';

export default function AdminGenericsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGeneric, setEditingGeneric] = useState<GenericDetails | null>(null);

  const { data: genericsData, isLoading, error } = useGenericSearch(query, 10, page);
  const { data: pregnancyCategories } = usePregnancyCategories();
  
  const createMutation = useCreateGeneric();
  const updateMutation = useUpdateGeneric();

  if (error) {
    return (
      <div className="p-12 border-2 border-dashed border-destructive/20 rounded-3xl bg-destructive/5 text-center">
        <h2 className="text-xl font-bold text-destructive">Failed to load generics</h2>
        <p className="text-muted-foreground mt-2">Please check if the backend server is running and try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10">
          Retry
        </Button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingGeneric(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (generic: any) => {
    setEditingGeneric(generic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGeneric(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get('name') as string,
      indication: formData.get('indication') as string,
      administration: formData.get('administration') as string,
      adultDose: formData.get('adultDose') as string,
      childDose: formData.get('childDose') as string,
      renalDose: formData.get('renalDose') as string,
      contraIndication: formData.get('contraIndication') as string,
      precaution: formData.get('precaution') as string,
      sideEffect: formData.get('sideEffect') as string,
      interaction: formData.get('interaction') as string,
      modeOfAction: formData.get('modeOfAction') as string,
      pregnancyCategoryId: formData.get('pregnancyCategoryId') ? Number(formData.get('pregnancyCategoryId')) : null,
      pregnancyCategoryNote: formData.get('pregnancyCategoryNote') as string,
    };

    try {
      if (editingGeneric) {
        await updateMutation.mutateAsync({ id: editingGeneric.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save generic:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Generic Formulations</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage core medicine formulations and clinical data.</p>
        </div>
        <Button 
          onClick={handleOpenAddModal}
          className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Generic
        </Button>
      </div>

      <Card className="p-2 border-primary/5 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl">
        <div className="p-4 border-b border-primary/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by generic name..." 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="pl-11 bg-muted/30 border-none rounded-2xl focus-visible:ring-primary/20 h-12 text-base"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Indication</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Therapeutic Class</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : genericsData?.data?.map((generic: any) => (
                <tr key={generic.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary group-hover:text-primary/80 transition-colors">{generic.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{generic.indication || 'No indication provided'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {generic.therapeuticGenerics?.length > 0 ? (
                        generic.therapeuticGenerics.map((tg: any) => (
                          <Badge key={tg.therapeutic.id} variant="secondary" className="bg-primary/5 text-primary border-none text-[10px]">
                            {tg.therapeutic.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground/50">Unclassified</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEditModal(generic)}
                      className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {genericsData?.meta && (
          <div className="p-4 border-t border-primary/5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-primary font-bold">{(page - 1) * 10 + 1}</span> to <span className="text-primary font-bold">{Math.min(page * 10, genericsData.meta.total)}</span> of <span className="text-primary font-bold">{genericsData.meta.total}</span> generics
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl border-primary/10 hover:bg-primary/5 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page * 10 >= (genericsData?.meta?.total ?? 0)}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border-primary/10 hover:bg-primary/5 active:scale-95"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal - Since Dialog UI component is missing, we use a simple state-based modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 border border-primary/5 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-primary/[0.02]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {editingGeneric ? 'Edit Generic' : 'Add New Generic'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {editingGeneric ? `Updating ${editingGeneric.name}` : 'Fill in the details to create a new formulation.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/40">Basic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Generic Name</Label>
                    <Input id="name" name="name" defaultValue={editingGeneric?.name} placeholder="e.g. Paracetamol" required className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indication" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Indication</Label>
                    <Textarea id="indication" name="indication" defaultValue={editingGeneric?.indication || ''} placeholder="Describe the primary indications..." className="rounded-xl border-primary/10 focus-visible:ring-primary/20 min-h-[100px]" />
                  </div>
                </div>

                {/* Dosage */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/40">Dosage & Administration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="administration" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Administration</Label>
                    <Input id="administration" name="administration" defaultValue={editingGeneric?.administration || ''} placeholder="e.g. Oral" className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adultDose" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Adult Dose</Label>
                      <Input id="adultDose" name="adultDose" defaultValue={editingGeneric?.adultDose || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childDose" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Child Dose</Label>
                      <Input id="childDose" name="childDose" defaultValue={editingGeneric?.childDose || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renalDose" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Renal Dose Adjustment</Label>
                    <Input id="renalDose" name="renalDose" defaultValue={editingGeneric?.renalDose || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                </div>

                {/* Safety & Clinical */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/40">Safety & Clinical Data</h3>
                  <div className="space-y-2">
                    <Label htmlFor="contraIndication" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Contraindications</Label>
                    <Textarea id="contraIndication" name="contraIndication" defaultValue={editingGeneric?.contraIndication || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precaution" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Precautions</Label>
                    <Textarea id="precaution" name="precaution" defaultValue={editingGeneric?.precaution || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                </div>

                {/* Side Effects & Interactions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/40">Adverse Effects</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sideEffect" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Side Effects</Label>
                    <Textarea id="sideEffect" name="sideEffect" defaultValue={editingGeneric?.sideEffect || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interaction" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Drug Interactions</Label>
                    <Textarea id="interaction" name="interaction" defaultValue={editingGeneric?.interaction || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                  </div>
                </div>

                {/* Pregnancy Category */}
                <div className="md:col-span-2 space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/40">Pregnancy & Lactation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pregnancyCategoryId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Pregnancy Category</Label>
                      <Select 
                        id="pregnancyCategoryId" 
                        name="pregnancyCategoryId" 
                        defaultValue={editingGeneric?.pregnancyCategory?.id || ''}
                      >
                        <option value="">Select Category</option>
                        {pregnancyCategories?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="pregnancyCategoryNote" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Pregnancy/Lactation Note</Label>
                      <Input id="pregnancyCategoryNote" name="pregnancyCategoryNote" defaultValue={editingGeneric?.pregnancyCategoryNote || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20" />
                    </div>
                  </div>
                </div>

                {/* Mechanism */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="modeOfAction" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mode of Action</Label>
                  <Textarea id="modeOfAction" name="modeOfAction" defaultValue={editingGeneric?.modeOfAction || ''} className="rounded-xl border-primary/10 focus-visible:ring-primary/20 min-h-[100px]" />
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-full px-6">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingGeneric ? (
                    <><Check className="w-4 h-4 mr-2" /> Update Generic</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Create Generic</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
