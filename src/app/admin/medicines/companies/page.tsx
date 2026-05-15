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
  Building2
} from 'lucide-react';
import { 
  useCompanySearch, 
  useCreateCompany, 
  useUpdateCompany 
} from '@/modules/medicines/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AdminCompaniesPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  const { data: companiesData, isLoading, error } = useCompanySearch(query, 10, page);
  
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  if (error) {
    return (
      <div className="p-12 border-2 border-dashed border-destructive/20 rounded-3xl bg-destructive/5 text-center">
        <h2 className="text-xl font-bold text-destructive">Failed to load companies</h2>
        <p className="text-muted-foreground mt-2">Please check if the backend server is running and try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10">
          Retry
        </Button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: any) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      order: Number(formData.get('order')) || 0,
    };

    try {
      if (editingCompany) {
        await updateMutation.mutateAsync({ id: editingCompany.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save company:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Pharmaceutical Companies</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage medicine manufacturers and display order.</p>
        </div>
        <Button 
          onClick={handleOpenAddModal}
          className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Company
        </Button>
      </div>

      <Card className="p-2 border-primary/5 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl">
        <div className="p-4 border-b border-primary/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies..." 
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
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Display Order</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-12" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : companiesData?.data?.map((company: any) => (
                <tr key={company.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-muted-foreground">#{company.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-primary group-hover:text-primary/80 transition-colors">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    {company.order || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEditModal(company)}
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

        {companiesData?.meta && (
          <div className="p-4 border-t border-primary/5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-primary font-bold">{(page - 1) * 10 + 1}</span> to <span className="text-primary font-bold">{Math.min(page * 10, companiesData.meta.total)}</span> of <span className="text-primary font-bold">{companiesData.meta.total}</span> companies
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
                disabled={page * 10 >= (companiesData?.meta?.total ?? 0)}
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-primary/5 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-primary/[0.02]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {editingCompany ? 'Edit Company' : 'Add New Company'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {editingCompany ? `Updating manufacturer #${editingCompany.id}` : 'Register a new pharmaceutical company.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-primary/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Company Name</Label>
                <Input id="name" name="name" defaultValue={editingCompany?.name} placeholder="e.g. Square Pharmaceuticals" required className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-12 text-base font-medium" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Display Order (optional)</Label>
                <Input id="order" name="order" type="number" defaultValue={editingCompany?.order || 0} placeholder="0" className="rounded-xl border-primary/10 focus-visible:ring-primary/20 h-12 text-base font-medium" />
              </div>

              <div className="pt-6 border-t border-primary/5 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-full px-6">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingCompany ? (
                    <><Check className="w-4 h-4 mr-2" /> Update Company</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Create Company</>
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
