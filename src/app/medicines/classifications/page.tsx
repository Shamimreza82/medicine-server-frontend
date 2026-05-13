'use client';

import { Network, Search, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';

export default function ClassificationsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Pharmacology"
        description="Navigate the systematic categorization of pharmaceutical substances by their therapeutic, pharmacological, and chemical properties."
        eyebrow="Drug Classifications"
        title="Medical Hierarchy Browser"
      />

      <div className="grid gap-8 md:grid-cols-3">
        <FeatureCard 
          icon={<Network className="h-5 w-5" />}
          title="Systemic View"
          description="Browse drugs based on the physiological systems they target, such as Cardiovascular or Respiratory."
        />
        <FeatureCard 
          icon={<Layers className="h-5 w-5" />}
          title="Sub-Classifications"
          description="Drill down into specific sub-groups to find precisely categorized medication classes."
        />
        <FeatureCard 
          icon={<BookOpen className="h-5 w-5" />}
          title="Clinical Links"
          description="Connect directly to generic formulations and indications from any therapeutic class."
        />
      </div>

      <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/[0.01] shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-dashed">
        <CardContent className="p-16 flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/30">
              <Search className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              Begin Exploration
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg font-medium leading-relaxed">
              The medical hierarchy is ready. Use the <span className="text-primary font-bold">Browse Hierarchy</span> tool 
              to navigate through clinical drug classes.
            </p>
          </div>
          
          <div className="pt-8 grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-primary">15+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Systems</span>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-primary">500+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Classes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-primary/5 bg-white/50 backdrop-blur-sm rounded-3xl hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6 space-y-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
