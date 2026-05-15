'use client';

import { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Pill
} from 'lucide-react';
import { useDosageForms } from '@/modules/medicines/hooks';
import type { DosageFormResponse } from '@/modules/medicines/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDosageFormsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: formsData, isLoading, error } = useDosageForms(query, 10, page);

  if (error) {
    return (
      <div className="p-12 border-2 border-dashed border-destructive/20 rounded-3xl bg-destructive/5 text-center">
        <h2 className="text-xl font-bold text-destructive">Failed to load dosage forms</h2>
        <p className="text-muted-foreground mt-2">Please check if the backend server is running and try again.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-primary">Dosage Forms</h1>
        <p className="text-muted-foreground font-medium mt-1">Directory of medicine forms automatically derived from brand entries.</p>
      </div>

      <Card className="p-2 border-primary/5 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl">
        <div className="p-4 border-b border-primary/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search dosage forms..." 
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
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Form Icon</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Usage Frequency</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-10 bg-muted rounded-xl" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : (formsData?.data as DosageFormResponse[])?.map((item) => (
                <tr key={item.form} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Pill className="w-5 h-5" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary group-hover:text-primary/80 transition-colors uppercase tracking-tight">{item.form}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min((item.count / (formsData?.meta?.total || 100)) * 100, 100)}%` }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">{item.count} Brands</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">ACTIVE</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formsData?.meta && (formsData.meta.total ?? 0) > 0 && (
          <div className="p-4 border-t border-primary/5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-primary font-bold">{(page - 1) * 10 + 1}</span> to <span className="text-primary font-bold">{Math.min(page * 10, formsData.meta.total ?? 0)}</span> of <span className="text-primary font-bold">{formsData.meta.total}</span> forms
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
                disabled={page * 10 >= (formsData?.meta?.total ?? 0)}
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
    </div>
  );
}
