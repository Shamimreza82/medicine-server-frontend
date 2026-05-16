'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { Pill, Tag, Building2, Activity, Search, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/shared/components/empty-state';
import { formatNullable } from '@/shared/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import { useMedicineSearch, useMedicinePrefetch } from '../hooks';
import { cn } from '@/shared/lib/utils';

export function MedicineSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const result = useMedicineSearch(deferredQuery);
  const prefetch = useMedicinePrefetch();
  const quickSearches = ['Paracetamol', 'Cefixime', 'Napa', 'Omeprazole', 'Beximco', 'Square'];

  const brandsCount = result.data?.brands?.length ?? 0;
  const genericsCount = result.data?.generics?.length ?? 0;
  const companiesCount = result.data?.companies?.length ?? 0;
  const indicationsCount = result.data?.indications?.length ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-primary/10 shadow-lg shadow-primary/5 rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-black">Unified Search</CardTitle>
          <CardDescription className="text-sm font-medium">Search brands, generics, companies and indications together.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              {result.isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </div>
            <Input
              id="medicine-query"
              className="h-14 pl-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl text-lg font-semibold"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search (e.g. Paracetamol, Square, Napa)..."
              value={query}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Quick clinical queries</Label>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((item) => (
                <button
                  className="rounded-xl border border-primary/5 bg-white px-4 py-2 text-xs font-bold transition-all hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
                  key={item}
                  onClick={() => setQuery(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {!query ? (
        <EmptyState
          actionHref="/medicines/warnings"
          actionLabel="Go to warning checker"
          description="Start typing a medicine or brand name to load autosuggest-style results."
          title="Search medicines"
        />
      ) : result.isError ? (
        <EmptyState
          actionHref="/medicines"
          actionLabel="Try again"
          description="Medicine search failed. Check the backend connection and retry."
          title="Search unavailable"
        />
      ) : (
        <Tabs defaultValue="brands" className="w-full space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto w-full flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="brands" className="flex-1 rounded-xl py-3 data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-black text-[10px] uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5 mr-2 hidden sm:inline" />
              Brands ({brandsCount})
            </TabsTrigger>
            <TabsTrigger value="generics" className="flex-1 rounded-xl py-3 data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-black text-[10px] uppercase tracking-wider">
              <Pill className="h-3.5 w-3.5 mr-2 hidden sm:inline" />
              Generics ({genericsCount})
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex-1 rounded-xl py-3 data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-black text-[10px] uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5 mr-2 hidden sm:inline" />
              Companies ({companiesCount})
            </TabsTrigger>
            <TabsTrigger value="indications" className="flex-1 rounded-xl py-3 data-[state=active]:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-black text-[10px] uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 mr-2 hidden sm:inline" />
              Indications ({indicationsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="mt-0 space-y-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 grid gap-4 md:grid-cols-2">
                {result.isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <ResultSkeleton key={i} />)
                ) : result.data?.brands?.length ? (
                  result.data.brands.map((brand) => (
                    <Link 
                      key={brand.id} 
                      href={`/medicines/brands/${brand.id}`} 
                      className="group"
                      onMouseEnter={() => prefetch.prefetchBrand(brand.id)}
                    >
                      <div className="rounded-[1.5rem] border border-primary/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors truncate">{brand.name}</h3>
                            <p className="text-xs font-bold text-muted-foreground/60 mt-1 uppercase tracking-tight truncate">
                              {brand.generic.name} • {brand.company.name}
                            </p>
                          </div>
                          {brand.isSponsored && (
                            <Badge className="bg-primary text-white border-none text-[9px] font-black px-2 h-5 uppercase tracking-widest shadow-sm shadow-primary/20 shrink-0">
                              Sponsored
                            </Badge>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-[10px] font-bold text-muted-foreground/50 bg-muted/50 px-3 py-1.5 rounded-lg border border-primary/5 uppercase tracking-tighter">
                            {brand.form} • {brand.strength} • {brand.price ? `৳ ${brand.price}` : 'N/A'} {brand.packSize && `• ${brand.packSize}`}
                          </div>
                          <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                            View details
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No brands found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generics" className="mt-0 space-y-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 grid gap-4 md:grid-cols-2">
                {result.isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <ResultSkeleton key={i} />)
                ) : result.data?.generics?.length ? (
                  result.data.generics.map((generic) => (
                    <Link 
                      key={generic.id} 
                      href={`/medicines/generics/${generic.id}`} 
                      className="group"
                      onMouseEnter={() => prefetch.prefetchGeneric(generic.id)}
                    >
                      <div className="rounded-[1.5rem] border border-primary/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors truncate">{generic.name}</h3>
                          <p className="text-xs font-bold text-primary/60 mt-1 uppercase tracking-tighter italic">
                            {formatNullable(generic.therapeuticClass)}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                            {formatNullable(generic.indication)}
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-primary/5 flex justify-end">
                          <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                            View generic
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No generics found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-0 space-y-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {result.isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <ResultSkeleton small key={i} />)
                ) : result.data?.companies?.length ? (
                  result.data.companies.map((company) => (
                    <Link 
                      key={company.id} 
                      href={`/medicines/companies/${company.id}`} 
                      className="group"
                      onMouseEnter={() => prefetch.prefetchCompany(company.id)}
                    >
                      <div className="rounded-2xl border border-primary/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate pr-4">{company.name}</h3>
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No companies found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indications" className="mt-0 space-y-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {result.isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <ResultSkeleton small key={i} />)
                ) : result.data?.indications?.length ? (
                  result.data.indications.map((indication) => (
                    <Link 
                      key={indication.id} 
                      href={`/medicines/indications/${indication.id}`} 
                      className="group"
                      onMouseEnter={() => prefetch.prefetchIndication(indication.id)}
                    >
                      <div className="rounded-2xl border border-primary/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate pr-4">{indication.name}</h3>
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No indications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ResultSkeleton({ small }: { small?: boolean }) {
  return (
    <div className={cn(
      "rounded-[1.5rem] border border-primary/5 bg-white p-5",
      small ? "h-20" : "h-32"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      {!small && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-1/3 rounded-lg" />
          <Skeleton className="h-4 w-1/4 rounded-lg" />
        </div>
      )}
    </div>
  );
}
