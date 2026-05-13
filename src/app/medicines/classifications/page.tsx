'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Network, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppShell } from '@/shared/components/app-shell';
import { PageHeader } from '@/shared/components/page-header';
import { useClassificationTree } from '@/modules/medicines/hooks';
import type { SystemicNode, TherapeuticNode } from '@/modules/medicines/types';

export default function ClassificationsPage() {
  const { data: tree, isLoading, isError } = useClassificationTree();

  return (
    <AppShell>
      <PageHeader
        badge="Classification System"
        description="Navigate through the systemic and therapeutic hierarchy of medicines."
        eyebrow="Drug Classifications"
        title="Medicine Hierarchy"
      />

      <div className="container py-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="py-8 text-center text-destructive">
              Failed to load classification tree. Please try again later.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tree?.map((node) => (
              <SystemicAccordion key={node.id} node={node} level={0} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function SystemicAccordion({ node, level }: { node: SystemicNode; level: number }) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = node.children.length > 0 || node.therapeutics.length > 0;

  return (
    <Card className={`border-primary/5 transition-all duration-300 ${level === 0 ? 'shadow-md' : 'shadow-none border-l-2 border-l-primary/20 ml-4'}`}>
      <div 
        className={`flex cursor-pointer items-center justify-between p-4 hover:bg-muted/30 transition-colors ${isOpen ? 'bg-muted/20' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${level === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {level === 0 ? <Network className="h-4 w-4" /> : <BookOpen className="h-3 w-3" />}
          </div>
          <span className={`font-bold ${level === 0 ? 'text-lg' : 'text-sm'}`}>{node.name}</span>
        </div>
        {hasChildren && (
          isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="p-2 space-y-2">
          {node.children.map((child) => (
            <SystemicAccordion key={child.id} node={child} level={level + 1} />
          ))}
          {node.therapeutics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
              {node.therapeutics.map((t) => (
                <TherapeuticLink key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function TherapeuticLink({ t }: { t: TherapeuticNode }) {
  return (
    <Link 
      href={`/medicines/classifications/${t.id}`}
      className="group flex items-center justify-between p-3 rounded-xl border border-primary/5 bg-white hover:border-primary/20 hover:shadow-sm transition-all"
    >
      <span className="text-sm font-medium group-hover:text-primary transition-colors">{t.name}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
