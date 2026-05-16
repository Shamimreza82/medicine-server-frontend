'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Building2, 
  LayoutGrid, 
  Table as TableIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Filter,
  X
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/shared/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MedicineFormIcon } from './form-icon';

import { useBrandDetails, useBrandSearch, useDosageForms } from '../hooks';
import { cn } from '@/shared/lib/utils';
import { useDebounce } from '@/shared/lib/use-debounce';

interface BrandAlternativesProps {
  brandId: string;
}

type SortConfig = {
  key: 'price' | 'name' | 'company';
  direction: 'asc' | 'desc';
};

export function BrandAlternativesView({ brandId }: BrandAlternativesProps) {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [strengthFilter, setStrengthFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const brandResult = useBrandDetails(Number(brandId));
  const genericId = brandResult.data?.generic.id;

  // Fetch dosage forms for the filter
  const dosageFormsResult = useDosageForms('', 100);
  const dosageForms = dosageFormsResult.data?.data || [];

  const brandsResult = useBrandSearch(
    debouncedSearch, 
    50, 
    page, 
    { 
      genericId,
      form: formFilter === 'all' ? undefined : formFilter,
      strength: strengthFilter === 'all' ? undefined : strengthFilter,
      sortBy: sortConfig.key === 'company' ? 'name' : sortConfig.key,
      sortOrder: sortConfig.direction
    }, 
    !!genericId
  );

  const brand = brandResult.data;
  const rawBrands = useMemo(() => brandsResult.data?.data || [], [brandsResult.data?.data]);
  const meta = brandsResult.data?.meta;
  const totalPages = meta?.totalPages || 1;

  const alternativeBrands = useMemo(() => {
    let filtered = rawBrands.filter(b => b.id !== Number(brandId));
    
    // Explicit numeric sort for price
    if (sortConfig.key === 'price') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseFloat(a.price || '0');
        const priceB = parseFloat(b.price || '0');
        return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else if (sortConfig.key === 'company') {
       filtered = [...filtered].sort((a, b) => {
        return sortConfig.direction === 'asc' 
          ? a.company.name.localeCompare(b.company.name) 
          : b.company.name.localeCompare(a.company.name);
      });
    }
    
    return filtered;
  }, [rawBrands, brandId, sortConfig]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStrengthFilter('all');
    setFormFilter('all');
    setSortConfig({ key: 'name', direction: 'asc' });
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, strengthFilter, formFilter, sortConfig]);

  if (brandResult.isLoading || (brandsResult.isLoading && page === 1)) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!brand) {
    return <EmptyState description="The brand record was not found." title="No brand data" />;
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <Card className="border-primary/5 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search brand or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-primary/10 focus:border-primary/30 focus:ring-primary/5 bg-white transition-all shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Select value={formFilter} onValueChange={setFormFilter}>
                  <SelectTrigger className="w-[140px] h-11 rounded-xl border-primary/10 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Form" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    <SelectItem value="all">All Forms</SelectItem>
                    {dosageForms.map(f => (
                      <SelectItem key={f.form} value={f.form}>{f.form}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Select value={strengthFilter} onValueChange={setStrengthFilter}>
                  <SelectTrigger className="w-[140px] h-11 rounded-xl border-primary/10 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Strength" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    <SelectItem value="all">All Strengths</SelectItem>
                    {Array.from(new Set(rawBrands.map(b => b.strength).filter(Boolean))).sort().map(s => (
                      <SelectItem key={s} value={s!}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Select 
                  value={`${sortConfig.key}-${sortConfig.direction}`} 
                  onValueChange={(val) => {
                    const [key, dir] = val.split('-') as [SortConfig['key'], SortConfig['direction']];
                    setSortConfig({ key, direction: dir });
                  }}
                >
                  <SelectTrigger className="w-[180px] h-11 rounded-xl border-primary/10 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Sort By" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="company-asc">Company (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || strengthFilter !== 'all' || formFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetFilters}
                  className="h-11 w-11 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header & View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
            Alternatives for {brand.generic.name} {meta && meta.total !== undefined && `(${meta.total - 1})`}
          </h3>
          {brandsResult.isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
        </div>

        <div className="flex items-center bg-muted/50 p-1 rounded-xl self-start sm:self-auto">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={cn("rounded-lg h-8 px-3 font-bold text-[10px] uppercase tracking-wider", viewMode === 'table' && "bg-white shadow-sm")}
          >
            <TableIcon className="h-3.5 w-3.5 mr-1.5" />
            Table
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn("rounded-lg h-8 px-3 font-bold text-[10px] uppercase tracking-wider", viewMode === 'grid' && "bg-white shadow-sm")}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Grid
          </Button>
        </div>
      </div>

      {alternativeBrands.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${brandsResult.isFetching ? 'opacity-50' : ''} transition-opacity`}>
              {alternativeBrands.map((b) => (
                <Link key={b.id} href={`/medicines/brands/${b.id}`} className="group">
                  <Card className="h-full border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0 shadow-inner">
                            <MedicineFormIcon form={b.form} className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">{b.name}</CardTitle>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground truncate">
                              <Building2 className="h-3 w-3 shrink-0" />
                              {b.company.name}
                            </div>
                          </div>
                        </div>
                        <Tag className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-[10px] bg-primary/5 border-none px-2 py-0.5">{b.form}</Badge>
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-none px-2 py-0.5 font-black">{b.strength}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-black text-emerald-600">
                           {b.price ? `৳ ${b.price}` : 'N/A'}
                           <span className="text-[10px] font-normal text-muted-foreground ml-1">/{b.packSize || 'unit'}</span>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-primary/5 bg-white/80 backdrop-blur-md shadow-xl shadow-primary/5 overflow-hidden transition-all">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-primary/5">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Brand Name</th>
                      <th 
                        className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort('company')}
                      >
                        <div className="flex items-center gap-2">
                          Manufacturer
                          {sortConfig.key === 'company' ? (
                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          ) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                        </div>
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Form & Strength</th>
                      <th 
                        className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center gap-2">
                          Unit Price
                          {sortConfig.key === 'price' ? (
                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          ) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                        </div>
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {alternativeBrands.map((b) => (
                      <tr key={b.id} className="group hover:bg-primary/[0.03] transition-colors">
                        <td className="p-4">
                          <Link href={`/medicines/brands/${b.id}`} className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                              <MedicineFormIcon form={b.form} className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{b.name}</span>
                              <span className="text-[10px] font-medium text-muted-foreground/60">{b.packSize}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-muted-foreground/80">{b.company.name}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black bg-primary/5 border-none uppercase px-2 py-0.5">
                              {b.form}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-black bg-emerald-50 text-emerald-700 border-none uppercase px-2 py-0.5">
                              {b.strength}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-emerald-600">৳ {b.price || 'N/A'}</span>
                            <span className="text-[10px] font-medium text-muted-foreground/60">per unit</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button asChild variant="ghost" size="sm" className="rounded-xl h-9 w-9 p-0 hover:bg-primary hover:text-white transition-all shadow-sm">
                            <Link href={`/medicines/brands/${b.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || brandsResult.isFetching}
                className="h-10 w-10 rounded-xl p-0 shadow-sm hover:border-primary/30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-muted/50 border border-primary/5 font-black text-xs uppercase tracking-tighter">
                <span className="text-primary">{page}</span>
                <span className="text-muted-foreground/40">/</span>
                <span>{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || brandsResult.isFetching}
                className="h-10 w-10 rounded-xl p-0 shadow-sm hover:border-primary/30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      ) : brandsResult.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <EmptyState 
          description={
            searchQuery || strengthFilter !== 'all' || formFilter !== 'all' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "No alternate commercial brands found."
          } 
          title={searchQuery || strengthFilter !== 'all' || formFilter !== 'all' ? "No results found" : "No alternatives"}
          actions={
            (searchQuery || strengthFilter !== 'all' || formFilter !== 'all') && (
              <Button variant="outline" onClick={resetFilters} className="rounded-xl">
                Clear all filters
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
