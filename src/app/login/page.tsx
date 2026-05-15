'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, AlertCircle, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { login } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push('/admin');
      router.refresh(); // Refresh to ensure middleware sees the new cookie
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-[400px] animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Medicine Hub Admin</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Sign in to access the dashboard</p>
        </div>

        <Card className="border-primary/5 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-bold">Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold animate-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="admin"
                    className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl font-bold text-base shadow-md shadow-primary/20" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-muted-foreground text-sm hover:text-primary" >
            <Link target="_blank"
             href="/">← Back to Public Site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
