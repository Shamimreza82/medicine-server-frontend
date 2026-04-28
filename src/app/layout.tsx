import '@/app/globals.css';

import { Manrope } from 'next/font/google';

import { QueryProvider } from '@/shared/providers/query-provider';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

const manrope = Manrope({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Doctor Prescription Frontend',
  description: 'Frontend console for lab tests and medicine prescribing workflows.',
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
