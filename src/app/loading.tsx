import { HeartPulse } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background/50 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40">
          <HeartPulse className="h-8 w-8 animate-pulse" />
        </div>
      </div>
      <div className="mt-8 text-center space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
          Health Intelligence
        </p>
        <p className="text-sm font-bold text-muted-foreground animate-pulse">
          Synchronizing clinical data...
        </p>
      </div>
    </div>
  );
}