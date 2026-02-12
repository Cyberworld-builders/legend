'use client';

/**
 * Forgot password: requests a reset email via Supabase Auth.
 * Add your app’s reset URL to Supabase: Dashboard → Auth → URL Configuration → Redirect URLs
 * (e.g. https://yoursite.com/admin/reset-password and http://localhost:3000/admin/reset-password).
 */
import { useState } from 'react';
import Link from 'next/link';
import { createAuthBrowserClient } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createAuthBrowserClient();
      const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/reset-password`;
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-[#00ff00]/30 bg-[#1a1a1a] rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#00ff00] font-mono">
              {'>'} RESET PASSWORD
            </h1>
            <p className="text-[#00ff00]/50 text-sm mt-2 font-mono">
              Enter your email to receive a reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <p className="text-[#00ff00] font-mono text-sm">
                If an account exists for that email, we&apos;ve sent a link to reset your password.
                Check your inbox and spam folder.
              </p>
              <Link
                href="/admin/login"
                className="block w-full py-3 bg-[#00ff00] text-[#0a0a0a] font-bold font-mono rounded hover:bg-[#00cc00] transition-colors text-center"
              >
                Back to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-mono text-[#00ff00]/70 mb-2"
                >
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
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

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
