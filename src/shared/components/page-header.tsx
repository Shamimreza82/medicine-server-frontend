import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}

export function PageHeader({ eyebrow, title, description, badge }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">{eyebrow}</p>
      <div className="flex flex-col gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {badge ? <Badge>{badge}</Badge> : null}
      </div>
    </div>
  );
}
