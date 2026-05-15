'use client';

import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SystemHealth() {
  return (
    <Card className="border-primary/5 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="p-6 pb-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-2 mx-auto">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg font-black tracking-tight">System Integrity</CardTitle>
        <CardDescription>Real-time server performance</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>API Response Time</span>
              <span className="text-emerald-600">Optimal</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-emerald-500 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground/40">
              <span>0ms</span>
              <span>142ms</span>
              <span>500ms</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>Database Load</span>
              <span className="text-orange-600">Medium</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-orange-500 rounded-full" />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-primary/5">
            <Button className="w-full rounded-xl font-bold text-[10px] uppercase tracking-widest py-6" variant="outline">
              Run Database Maintenance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
