'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // Hardcoded credentials for simple admin login
  if (username === 'admin' && password === 'admin') {
    (await cookies()).set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return { success: true };
  }

  return { success: false, error: 'Invalid username or password' };
}

export async function logout() {
  (await cookies()).delete('admin-auth');
  redirect('/login');
}
