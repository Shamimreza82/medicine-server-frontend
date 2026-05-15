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
  Check,
  Building2,
  Stethoscope
} from 'lucide-react';
import { 
  useBrandSearch, 
  useCreateBrand, 
  useUpdateBrand,
  useCompanySearch,
  useGenericSearch
} from '@/modules/medicines/hooks';
import type { BrandResponse, BrandRequest, CompanyResponse, GenericResponse } from '@/modules/medicines/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export default function AdminBrandsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandResponse | null>(null);

  // Search for Companies and Generics in the modal
  const [companyQuery, setCompanyQuery] = useState('');
  const [genericQuery, setGenericQuery] = useState('');

  const { data: brandsData, isLoading, error } = useBrandSearch(query, 10, page, undefined, true);
  const { data: companiesData } = useCompanySearch(companyQuery, 5);
  const { data: genericsData } = useGenericSearch(genericQuery, 5);
  
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  if (error) {
    return (
      <div className="p-12 border-2 border-dashed border-destructive/20 rounded-3xl bg-destructive/5 text-center">
        <h2 className="text-xl font-bold text-destructive">Failed to load brands</h2>
        <p className="text-muted-foreground mt-2">Please check if the backend server is running and try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10">
          Retry
        </Button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setCompanyQuery('');
    setGenericQuery('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: BrandResponse) => {
    setEditingBrand(brand);
    setCompanyQuery(brand.company.name);
    setGenericQuery(brand.generic.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: BrandRequest = {
      name: formData.get('name') as string,
      companyId: Number(formData.get('companyId')),
      genericId: Number(formData.get('genericId')),
      form: formData.get('form') as string,
      strength: formData.get('strength') as string,
      price: formData.get('price') as string,
      packSize: formData.get('packSize') as string,
      isSponsored: formData.get('isSponsored') === 'on',
    };

    try {
      if (editingBrand) {
        await updateMutation.mutateAsync({ id: editingBrand.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Medicine Brands</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage commercial medicine brands and their specifications.</p>
        </div>
        <Button 
          onClick={handleOpenAddModal}
          className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Brand
        </Button>
      </div>

      <Card className="p-2 border-primary/5 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl">
        <div className="p-4 border-b border-primary/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by brand name..." 
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
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Generic</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Form & Strength</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : (brandsData?.data as BrandResponse[])?.map((brand) => (
                <tr key={brand.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary group-hover:text-primary/80 transition-colors">
                        {brand.name}
                        {brand.isSponsored && (
                          <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 border-none text-[9px] py-0 px-1">SPONSORED</Badge>
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {brand.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground line-clamp-1">{brand.generic.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground line-clamp-1">{brand.company.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-lg text-[10px] py-0 px-2 font-bold border-primary/10 text-primary/60 bg-white">
                        {brand.form}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground">{brand.strength}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEditModal(brand)}
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

        {brandsData?.meta && (brandsData.meta.total ?? 0) > 0 && (
          <div className="p-4 border-t border-primary/5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-primary font-bold">{(page - 1) * 10 + 1}</span> to <span className="text-primary font-bold">{Math.min(page * 10, brandsData.meta.total ?? 0)}</span> of <span className="text-primary font-bold">{brandsData.meta.total}</span> brands
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
                disabled={page * 10 >= (brandsData?.meta?.total ?? 0)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 border border-primary/5 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-primary/[0.02]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {editingBrand ? `Updating ${editingBrand.name}` : 'Create a new commercial brand listing.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Brand Name</Label>
                  <Input id="name" name="name" defaultValue={editingBrand?.name} placeholder="e.g. Napa" required className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                </div>

                {/* Company Searchable Dropdown */}
                <div className="space-y-2 relative">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Manufacturing Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search company..." 
                      value={companyQuery}
                      onChange={(e) => setCompanyQuery(e.target.value)}
                      className="pl-10 rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11"
                    />
                  </div>
                  <input type="hidden" name="companyId" value={
                    (companiesData?.data as CompanyResponse[])?.find((c) => c.name === companyQuery)?.id || editingBrand?.company.id || ''
                  } required />
                  {companyQuery && companiesData?.data && companiesData.data.length > 0 && !(companiesData.data as CompanyResponse[]).some((c) => c.name === companyQuery) && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-primary/5 rounded-2xl shadow-xl p-1 max-h-40 overflow-y-auto">
                      {(companiesData.data as CompanyResponse[]).map((company) => (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => setCompanyQuery(company.name)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-primary/5 rounded-xl transition-colors font-medium text-muted-foreground hover:text-primary"
                        >
                          {company.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generic Searchable Dropdown */}
                <div className="space-y-2 relative">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Generic Formulation</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search generic..." 
                      value={genericQuery}
                      onChange={(e) => setGenericQuery(e.target.value)}
                      className="pl-10 rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11"
                    />
                  </div>
                  <input type="hidden" name="genericId" value={
                    (genericsData?.data as GenericResponse[])?.find((g) => g.name === genericQuery)?.id || editingBrand?.generic.id || ''
                  } required />
                  {genericQuery && genericsData?.data && genericsData.data.length > 0 && !(genericsData.data as GenericResponse[]).some((g) => g.name === genericQuery) && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-primary/5 rounded-2xl shadow-xl p-1 max-h-40 overflow-y-auto">
                      {(genericsData.data as GenericResponse[]).map((generic) => (
                        <button
                          key={generic.id}
                          type="button"
                          onClick={() => setGenericQuery(generic.name)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-primary/5 rounded-xl transition-colors font-medium text-muted-foreground hover:text-primary"
                        >
                          {generic.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Dosage Form</Label>
                  <Input id="form" name="form" defaultValue={editingBrand?.form || ''} placeholder="e.g. Tablet" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strength" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Strength</Label>
                  <Input id="strength" name="strength" defaultValue={editingBrand?.strength || ''} placeholder="e.g. 500 mg" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Price (Unit/Pack)</Label>
                  <Input id="price" name="price" defaultValue={editingBrand?.price || ''} placeholder="e.g. 10.00" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packSize" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Pack Size</Label>
                  <Input id="packSize" name="packSize" defaultValue={editingBrand?.packSize || ''} placeholder="e.g. 10's Pack" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-11" />
                </div>

                <div className="md:col-span-2 flex items-center space-x-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                  <input 
                    type="checkbox" 
                    id="isSponsored" 
                    name="isSponsored" 
                    defaultChecked={editingBrand?.isSponsored}
                    className="w-4 h-4 text-amber-600 rounded-lg border-amber-200 focus:ring-amber-500"
                  />
                  <Label htmlFor="isSponsored" className="text-sm font-bold text-amber-900 cursor-pointer">
                    Promote as Sponsored Brand
                  </Label>
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
                  {editingBrand ? (
                    <><Check className="w-4 h-4 mr-2" /> Update Brand</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Create Brand</>
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
