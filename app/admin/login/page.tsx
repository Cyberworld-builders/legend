'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createAuthBrowserClient } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createAuthBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#00ff00] font-mono">
          {'>'} AUTHENTICATE
        </h1>
        <p className="text-[#00ff00]/50 text-sm mt-2 font-mono">
          CyberWorld Builders Admin Console
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-mono text-[#00ff00]/70 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60"
            placeholder="admin@cyberworldbuilders.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-mono text-[#00ff00]/70 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60"
            placeholder="********"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm font-mono border border-red-400/30 bg-red-400/10 rounded px-4 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#00ff00] text-[#0a0a0a] font-bold font-mono rounded hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Authenticating...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8 text-center">
            <p className="text-[#00ff00]/50 font-mono">Loading...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
