'use client';

import { useState, useDeferredValue } from 'react';
import { Search, Pill, Tag, Activity, Building2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { MedicineFormIcon } from './form-icon';

import { 
  useBrandSearch, 
  useGenericSearch, 
  useIndicationSearch, 
  useCompanySearch 
} from '../hooks';

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState('brands');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const brands = useBrandSearch(deferredQuery, 5);
  const generics = useGenericSearch(deferredQuery, 5);
  const indications = useIndicationSearch(deferredQuery, 5);
  const companies = useCompanySearch(deferredQuery, 5);

  const isFetching = (
    (activeTab === 'brands' && brands.isFetching) ||
    (activeTab === 'generics' && generics.isFetching) ||
    (activeTab === 'indications' && indications.isFetching) ||
    (activeTab === 'companies' && companies.isFetching)
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative border-primary/10 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
          <CardContent className="p-2 sm:p-4">
            <Tabs defaultValue="brands" onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto p-1 bg-muted/50 rounded-2xl">
                  <TabsTrigger value="brands" className="rounded-xl py-2 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">Brands</span>
                  </TabsTrigger>
                  <TabsTrigger value="generics" className="rounded-xl py-2 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Pill className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">Generics</span>
                  </TabsTrigger>
                  <TabsTrigger value="indications" className="rounded-xl py-2 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Activity className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">Indications</span>
                  </TabsTrigger>
                  <TabsTrigger value="companies" className="rounded-xl py-2 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">Companies</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative flex-1 w-full group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                    {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </div>
                  <Input
                    className="h-14 pl-12 pr-4 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl text-lg font-medium placeholder:text-muted-foreground/60 transition-all"
                    placeholder={`Search ${activeTab}...`}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                  />
                </div>
              </div>

              <div className="mt-2 min-h-[100px]">
                {!query ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 opacity-60">
                    <div className="p-4 bg-muted rounded-full">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Awaiting clinical input...</h3>
                      <p className="text-xs text-muted-foreground">Type a {activeTab.slice(0, -1)} name above to explore clinical data.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <TabsContent value="brands" className="mt-0 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {brands.data?.data?.map((brand) => (
                        <SearchResultItem 
                          key={brand.id}
                          title={brand.name}
                          subtitle={`${brand.generic.name} • ${brand.company.name}`}
                          href={`/medicines/brands/${brand.id}`}
                          badge={brand.isSponsored ? "Sponsored" : undefined}
                          meta={`${brand.form} • ${brand.strength}`}
                          form={brand.form}
                        />
                      ))}
                      {brands.data?.data?.length === 0 && !brands.isLoading && <NoResults tab="brands" />}
                    </TabsContent>
                    
                    <TabsContent value="generics" className="mt-0 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {generics.data?.data?.map((generic) => (
                        <SearchResultItem 
                          key={generic.id}
                          title={generic.name}
                          subtitle={generic.therapeuticClass || "Generic Formulation"}
                          href={`/medicines/generics/${generic.id}`}
                          meta={generic.indication || ""}
                        />
                      ))}
                      {generics.data?.data?.length === 0 && !generics.isLoading && <NoResults tab="generics" />}
                    </TabsContent>
                    
                    <TabsContent value="indications" className="mt-0 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {indications.data?.data?.map((indication) => (
                        <SearchResultItem 
                          key={indication.id}
                          title={indication.name}
                          subtitle="Clinical Indication"
                          href={`/medicines/indications/${indication.id}`}
                        />
                      ))}
                      {indications.data?.data?.length === 0 && !indications.isLoading && <NoResults tab="indications" />}
                    </TabsContent>
                    
                    <TabsContent value="companies" className="mt-0 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {companies.data?.data?.map((company) => (
                        <SearchResultItem 
                          key={company.id}
                          title={company.name}
                          subtitle="Pharmaceutical Manufacturer"
                          href={`/medicines/companies/${company.id}`}
                        />
                      ))}
                      {companies.data?.data?.length === 0 && !companies.isLoading && <NoResults tab="companies" />}
                    </TabsContent>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SearchResultItem({ title, subtitle, href, badge, meta, form }: { title: string; subtitle: string; href: string; badge?: string; meta?: string; form?: string | null }) {
  return (
    <Link href={href} className="group/item block">
      <div className="flex items-center justify-between p-4 bg-muted/20 hover:bg-primary/[0.03] border border-transparent hover:border-primary/10 rounded-2xl transition-all duration-200">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border shadow-sm group-hover/item:border-primary/20 transition-colors">
            <MedicineFormIcon form={form} className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors truncate">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/10">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1 truncate">{subtitle}</p>
            {meta && <p className="text-[10px] text-muted-foreground/60 mt-1 line-clamp-1 italic">{meta}</p>}
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm border opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </Link>
  );
}

function NoResults({ tab }: { tab: string }) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm font-medium text-muted-foreground">No matching {tab} found.</p>
    </div>
  );
}
