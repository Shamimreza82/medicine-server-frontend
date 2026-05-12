import '@/app/globals.css';

import { Manrope } from 'next/font/google';

import { QueryProvider } from '@/shared/providers/query-provider';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

const manrope = Manrope({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Medicine Hub',
  description: 'Intelligent platform for medicine and lab test information.',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
