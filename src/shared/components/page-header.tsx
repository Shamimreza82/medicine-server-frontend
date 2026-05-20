import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, badge, className, actions }: PageHeaderProps) {
  return (
    <div className={cn("hidden md:block relative space-y-3 mb-6", className)}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">{eyebrow}</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h2>
            <p className="max-w-2xl text-xs md:text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {badge && (
              <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0.5 text-[10px]">
                {badge}
              </Badge>
            )}
            {actions}
          </div>
        </div>
      </div>
      <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-primary to-primary/20" />
    </div>
  );
}
