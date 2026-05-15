'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminActivity } from '../types';

interface ActivityFeedProps {
  activities: AdminActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="lg:col-span-2 border-primary/5 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-black tracking-tight">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-[10px] font-bold text-primary uppercase tracking-widest p-0 h-auto hover:bg-transparent">
            View All History
          </Button>
        </div>
        <CardDescription>Latest changes made to the medical database</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 group">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                    {activity.action}: <span className="text-muted-foreground font-medium">{activity.target}</span>
                  </p>
                  <span className="text-[10px] font-medium text-muted-foreground/50 whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Performed by <span className="font-bold text-primary/40">{activity.user}</span></p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
