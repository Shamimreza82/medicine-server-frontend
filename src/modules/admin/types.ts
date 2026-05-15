import { LucideIcon } from 'lucide-react';

export interface AdminStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  change: string;
}

export interface AdminActivity {
  id: string | number;
  action: string;
  target: string;
  time: string;
  user: string;
}

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: NavChild[];
}
