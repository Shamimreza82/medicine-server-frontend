import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, badge, className }: PageHeaderProps) {
  return (
    <div className={cn("relative space-y-4 mb-8", className)}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">{eyebrow}</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {badge && (
            <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
              {badge}
            </Badge>
          )}
        </div>
      </div>
      <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/20" />
    </div>
  );
}
