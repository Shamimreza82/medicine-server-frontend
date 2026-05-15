'use client';

import { 
  Pill, 
  TestTube, 
  Building2, 
  Plus,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/modules/admin/components/stat-card';
import { ActivityFeed } from '@/modules/admin/components/activity-feed';
import { SystemHealth } from '@/modules/admin/components/system-health';
import { AdminStat, AdminActivity } from '@/modules/admin/types';
import { useDashboardData } from '@/modules/admin/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/shared/lib/utils';

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading } = useDashboardData();

  const stats: AdminStat[] = [
    { 
      label: 'Total Medicines', 
      value: dashboardData?.stats.brands.toLocaleString() ?? '0', 
      icon: Pill, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      change: '+12%' 
    },
    { 
      label: 'Generics', 
      value: dashboardData?.stats.generics.toLocaleString() ?? '0', 
      icon: Database, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      change: '+5%' 
    },
    { 
      label: 'Companies', 
      value: dashboardData?.stats.companies.toLocaleString() ?? '0', 
      icon: Building2, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      change: '+2%' 
    },
    { 
      label: 'Lab Tests', 
      value: dashboardData?.stats.labTests.toLocaleString() ?? '0', 
      icon: TestTube, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      change: '+8%' 
    },
  ];

  const recentActivities: AdminActivity[] = dashboardData?.activities.map((act) => ({
    id: act.id,
    action: act.action,
    target: act.target,
    time: formatTimeAgo(act.createdAt),
    user: act.userName ?? 'System',
  })) ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Overview</h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm">Welcome back, Administrator. Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))
        ) : (
          stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        {isLoading ? (
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        ) : (
          <ActivityFeed activities={recentActivities} />
        )}
      </div>
    </div>
  );
}
