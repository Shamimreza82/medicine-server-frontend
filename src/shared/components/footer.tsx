'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year ?? '...'} Medicine Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/disclaimer"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Disclaimer
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/login"
              className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Lock className="h-3 w-3 transition-colors group-hover:text-primary" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
