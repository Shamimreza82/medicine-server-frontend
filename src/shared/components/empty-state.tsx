import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actions?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionHref, actions }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {(actionLabel && actionHref) || actions ? (
        <CardContent>
          {actions}
          {actionLabel && actionHref && (
            <Link href={actionHref}>
              <Button variant="outline">{actionLabel}</Button>
            </Link>
          )}
        </CardContent>
      ) : (
        <CardContent />
      )}
    </Card>
  );
}
