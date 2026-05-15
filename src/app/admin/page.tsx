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

export default function AdminDashboardPage() {
  const stats: AdminStat[] = [
    { label: 'Total Medicines', value: '12,482', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
    { label: 'Generics', value: '1,240', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', change: '+5%' },
    { label: 'Companies', value: '458', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50', change: '+2%' },
    { label: 'Lab Tests', value: '850', icon: TestTube, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+8%' },
  ];

  const recentActivities: AdminActivity[] = [
    { id: 1, action: 'Updated Brand', target: 'Napa 500mg Tablet', time: '2 mins ago', user: 'Admin' },
    { id: 2, action: 'Added New Generic', target: 'Azithromycin v2', time: '45 mins ago', user: 'Admin' },
    { id: 3, action: 'Modified Indication', target: 'Hypertension', time: '3 hours ago', user: 'Admin' },
    { id: 4, action: 'Deleted Company', target: 'Old Pharma Ltd', time: '5 hours ago', user: 'Admin' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Overview</h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold text-xs h-10 border-primary/10">
            Export Data
          </Button>
          <Button className="rounded-xl font-bold text-xs h-10 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add New Record
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <ActivityFeed activities={recentActivities} />

        {/* System Health */}
        <SystemHealth />
      </div>
    </div>
  );
}
