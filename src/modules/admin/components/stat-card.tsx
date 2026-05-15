'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { AdminStat } from '../types';

interface StatCardProps {
  stat: AdminStat;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;
  
  return (
    <Card className="border-primary/5 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp className="h-3 w-3" />
            {stat.change}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">{stat.label}</p>
          <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
