'use client';

import { useState, useDeferredValue } from 'react';
import { Search, Pill, Tag, Activity, Building2, ArrowRight, Loader2, ChevronDown, Sprout, Globe } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { MedicineFormIcon } from './form-icon';

import { 
  useBrandSearch, 
  useGenericSearch, 
  useIndicationSearch, 
  useCompanySearch,
  useMedicineSearch,
  useHerbalBrandSearch
} from '../hooks';

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const allResults = useMedicineSearch(deferredQuery, 10);
  const brands = useBrandSearch(deferredQuery, 20);
  const generics = useGenericSearch(deferredQuery, 20);
  const indications = useIndicationSearch(deferredQuery, 20);
  const companies = useCompanySearch(deferredQuery, 20);
  const herbalBrands = useHerbalBrandSearch(deferredQuery, 20);

  const isFetching = (
    (activeTab === 'all' && allResults.isFetching) ||
    (activeTab === 'brands' && brands.isFetching) ||
    (activeTab === 'generics' && generics.isFetching) ||
    (activeTab === 'indications' && indications.isFetching) ||
    (activeTab === 'companies' && companies.isFetching) ||
    (activeTab === 'herbal' && herbalBrands.isFetching)
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Context */}
      <div className="text-center space-y-3 mb-2 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          What are you <span className="text-primary">looking for?</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-xs md:text-base font-medium">
          Access the national pharmaceutical database with semantic precision. Search through thousands of brands and clinical generics.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-500"></div>
        
        <Card className="relative border-primary/10 bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[1.5rem] overflow-hidden border-t-white/40 border-l-white/40">
          <CardContent className="p-2 sm:p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="relative w-full md:w-64 group/select">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl scale-[0.98] group-hover/select:scale-100 transition-transform duration-300 -z-10" />
                  <Select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="h-12 pl-12 bg-transparent border-2 border-transparent focus:border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer transition-all"
                  >
                    <option value="all">Default Search</option>
                    <option value="brands">Brand Library</option>
                    <option value="generics">Generic Catalog</option>
                    <option value="herbal">Herbal Medicine</option>
                    <option value="indications">Clinical Indications</option>
                    <option value="companies">Manufacturers</option>
                  </Select>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary p-1.5 bg-white rounded-lg shadow-sm border border-primary/10 transition-transform group-hover/select:scale-110 pointer-events-none">
                    {activeTab === 'all' && <Globe className="h-4 w-4" />}
                    {activeTab === 'brands' && <Tag className="h-4 w-4" />}
                    {activeTab === 'generics' && <Pill className="h-4 w-4" />}
                    {activeTab === 'herbal' && <Sprout className="h-4 w-4" />}
                    {activeTab === 'indications' && <Activity className="h-4 w-4" />}
                    {activeTab === 'companies' && <Building2 className="h-4 w-4" />}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover/select:text-primary transition-colors">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="relative flex-1 group/input">
                  <div className="absolute inset-0 bg-muted/30 rounded-xl scale-[0.98] group-focus-within/input:scale-100 group-focus-within/input:bg-muted/50 transition-all duration-300 -z-10" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                    {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </div>
                  <Input
                    className="h-12 pl-11 pr-4 bg-transparent border-2 border-transparent focus-visible:ring-0 focus:border-primary/20 rounded-xl text-base font-semibold placeholder:text-muted-foreground/40 placeholder:font-medium transition-all"
                    placeholder={activeTab === 'all' ? "Search brands, generics, indications..." : `Type ${activeTab.slice(0, -1)} name...`}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                  />
                  {query && (
                    <button 
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground hover:text-primary transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className={cn(
                "mt-6 transition-all duration-500 overflow-hidden",
                query ? "opacity-100 max-h-[600px]" : "opacity-100 max-h-[300px]"
              )}>
                {!query ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <div className="relative p-6 bg-white rounded-[2rem] border border-primary/10 shadow-xl">
                        <Search className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-foreground">Awaiting input...</h3>
                      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                        Specify a medical identifier above to retrieve detailed medical profiles.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pb-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                        {activeTab === 'all' ? "Global Results" : "Search Results"}
                      </span>
                      {isFetching && <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">Updating...</span>}
                    </div>
                    
                    <div className="space-y-3 custom-scrollbar max-h-[450px] overflow-y-auto pr-2">
                      <TabsContent value="all" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {allResults.data?.brands?.map((brand) => (
                          <SearchResultItem 
                            key={`all-brand-${brand.id}`}
                            title={brand.name}
                            subtitle={`${brand.generic.name} • ${brand.company.name}`}
                            href={`/medicines/brands/${brand.id}`}
                            badge={brand.isSponsored ? "Sponsored" : undefined}
                            meta={`${brand.form} • ${brand.strength}`}
                            form={brand.form}
                          />
                        ))}
                        {allResults.data?.herbalBrands?.map((brand) => (
                          <SearchResultItem 
                            key={`all-herbal-${brand.id}`}
                            title={brand.name}
                            subtitle={`${brand.generic.name} • ${brand.company.name}`}
                            href={`/medicines/herbal/${brand.id}`}
                            badge="Herbal"
                            meta={`${brand.form} • ${brand.strength}`}
                            form={brand.form}
                          />
                        ))}
                        {allResults.data?.generics?.map((generic) => (
                          <SearchResultItem 
                            key={`all-generic-${generic.id}`}
                            title={generic.name}
                            subtitle={generic.therapeuticClass || "Generic Formulation"}
                            href={`/medicines/generics/${generic.id}`}
                            meta={generic.indication || ""}
                          />
                        ))}
                        {allResults.data?.indications?.map((indication) => (
                          <SearchResultItem 
                            key={`all-indication-${indication.id}`}
                            title={indication.name}
                            subtitle="Clinical Indication"
                            href={`/medicines/indications/${indication.id}`}
                          />
                        ))}
                        {allResults.data?.companies?.map((company) => (
                          <SearchResultItem 
                            key={`all-company-${company.id}`}
                            title={company.name}
                            subtitle="Manufacturer"
                            href={`/medicines/companies/${company.id}`}
                          />
                        ))}
                        {(!allResults.data?.brands?.length && !allResults.data?.herbalBrands?.length && !allResults.data?.generics?.length && !allResults.data?.indications?.length && !allResults.data?.companies?.length && !allResults.isLoading) && <NoResults tab="everything" />}
                      </TabsContent>

                      <TabsContent value="brands" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                      <TabsContent value="herbal" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {herbalBrands.data?.data?.map((brand) => (
                          <SearchResultItem 
                            key={brand.id}
                            title={brand.name}
                            subtitle={`${brand.generic.name} • ${brand.company.name}`}
                            href={`/medicines/herbal/${brand.id}`}
                            meta={`${brand.form} • ${brand.strength}`}
                            form={brand.form}
                          />
                        ))}
                        {herbalBrands.data?.data?.length === 0 && !herbalBrands.isLoading && <NoResults tab="herbal medicines" />}
                      </TabsContent>
                      
                      <TabsContent value="generics" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                      
                      <TabsContent value="indications" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                      
                      <TabsContent value="companies" className="mt-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
      <div className="flex items-center justify-between p-5 bg-muted/10 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent hover:border-primary/10 rounded-2xl transition-all duration-300">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-muted shadow-sm group-hover/item:border-primary/20 group-hover/item:scale-110 transition-all duration-300">
            <MedicineFormIcon form={form} className="h-6 w-6 text-primary/70 group-hover/item:text-primary transition-colors" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-foreground group-hover/item:text-primary transition-colors truncate">{title}</h3>
              {badge && (
                <Badge className="h-5 px-2 text-[9px] font-black uppercase tracking-widest bg-primary text-white border-none shadow-sm shadow-primary/20">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs font-semibold text-muted-foreground/80 mt-1 truncate">{subtitle}</p>
            {meta && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="h-1 w-1 rounded-full bg-primary/30" />
                <p className="text-[10px] text-muted-foreground/50 font-medium line-clamp-1 uppercase tracking-tight">{meta}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Link>
  );
}

function NoResults({ tab }: { tab: string }) {
  return (
    <div className="py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
      <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">No matching results found in {tab}</p>
    </div>
  );
}
