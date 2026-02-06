'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createAuthBrowserClient } from '@/lib/supabase';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const supabase = createAuthBrowserClient();

    const setReadyAndClearError = () => {
      setReady(true);
      setSessionError('');
    };

    const tryEstablishSession = async () => {
      // 1) Force client to process redirect URL (hash or query) - fixes token in fragment
      await supabase.auth.initialize();
      const { data: { session: sessionAfterInit } } = await supabase.auth.getSession();
      if (sessionAfterInit) {
        setReadyAndClearError();
        return;
      }

      // 2) If token is in query params (e.g. PKCE or when fragment was stripped), verify OTP
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      if (tokenHash && type === 'recovery') {
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });
        if (!verifyError && verifyData?.session) {
          setReadyAndClearError();
          // Remove token from URL without full navigation
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('token_hash');
            url.searchParams.delete('type');
            window.history.replaceState({}, '', url.pathname + url.search);
          }
          return;
        }
      }

      // 3) Session may already be set from hash (initialize or storage)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReadyAndClearError();
        return;
      }
    };

    tryEstablishSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setReadyAndClearError();
      }
    });

    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) setSessionError('Invalid or expired reset link. Request a new one.');
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createAuthBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'reset-password:handleSubmit',message:'updateUser error',data:{message:updateError.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        setError(updateError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
            <p className="text-red-400 font-mono text-sm mb-6">{sessionError}</p>
            <Link
              href="/admin/forgot-password"
              className="block w-full py-3 bg-[#00ff00] text-[#0a0a0a] font-bold font-mono rounded hover:bg-[#00cc00] transition-colors text-center"
            >
              Request new reset link
            </Link>
            <p className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="text-[#00ff00]/70 hover:text-[#00ff00] text-sm font-mono"
              >
                ← Back to Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
          <p className="text-[#00ff00]/50 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#00ff00] font-mono">
              {'>'} SET NEW PASSWORD
            </h1>
            <p className="text-[#00ff00]/50 text-sm mt-2 font-mono">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-mono text-[#00ff00]/70 mb-2"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-[#00ff00]/60"
                placeholder="********"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-mono text-[#00ff00]/70 mb-2"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
              {isLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-[#00ff00]/70 hover:text-[#00ff00] text-sm font-mono"
            >
              ← Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
          <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
            <p className="text-[#00ff00]/50 font-mono">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
