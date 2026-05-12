'use client';

import { 
  Pill, 
  Syringe, 
  Droplets, 
  FlaskConical, 
  Wind, 
  Waves, 
  Box, 
  StickyNote,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FormIconProps {
  form: string | null | undefined;
  className?: string;
}

export function MedicineFormIcon({ form, className }: FormIconProps) {
  if (!form) return <HelpCircle className={cn("h-4 w-4 text-muted-foreground/40", className)} />;

  const normalizedForm = form.toLowerCase();

  if (normalizedForm.includes('tablet')) {
    return <Pill className={cn("h-4 w-4 text-blue-500", className)} />;
  }
  
  if (normalizedForm.includes('capsule')) {
    return <Pill className={cn("h-4 w-4 text-indigo-500 rotate-45", className)} />;
  }
  
  if (normalizedForm.includes('syrup') || normalizedForm.includes('suspension')) {
    return <FlaskConical className={cn("h-4 w-4 text-amber-500", className)} />;
  }
  
  if (normalizedForm.includes('injection')) {
    return <Syringe className={cn("h-4 w-4 text-rose-500", className)} />;
  }
  
  if (normalizedForm.includes('cream') || normalizedForm.includes('ointment') || normalizedForm.includes('gel')) {
    return <Waves className={cn("h-4 w-4 text-emerald-500", className)} />;
  }
  
  if (normalizedForm.includes('drop')) {
    return <Droplets className={cn("h-4 w-4 text-cyan-500", className)} />;
  }
  
  if (normalizedForm.includes('inhaler')) {
    return <Wind className={cn("h-4 w-4 text-sky-500", className)} />;
  }
  
  if (normalizedForm.includes('suppository')) {
    return <Box className={cn("h-4 w-4 text-purple-500", className)} />;
  }
  
  if (normalizedForm.includes('patch')) {
    return <StickyNote className={cn("h-4 w-4 text-orange-500", className)} />;
  }

  return <Pill className={cn("h-4 w-4 text-muted-foreground/60", className)} />;
}
