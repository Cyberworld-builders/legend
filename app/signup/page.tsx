"use client";

import { useState, FormEvent } from 'react';
import { signUp } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ChatWidget from '../../components/ChatWidget';

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a confirmation link!');
        // Send webhook to Make.com after successful signup
        await fetch(process.env.NEXT_PUBLIC_MAKE_COM_WEBHOOK_URL as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: email,
            signupTime: new Date().toISOString(),
          }),
        });
        // Optionally redirect after a short delay
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <Link href="/">
          <Image
            src="/icons/favicon.ico"
            alt="CyberWorld Logo"
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <h1 className="text-4xl mb-8 tracking-wider">CyberWorld Signup</h1>
      <div className="bg-[#2a2a2a] p-8 rounded-lg border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00,0_0_20px_#00ff00] w-full max-w-md">
        <div className="mb-4 text-sm text-[#00ff00]/70">
          Enter the CyberWorld. Create your account.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-[#1a1a1a] text-[#00ff00] border border-[#00ff00] rounded focus:outline-none focus:ring-2 focus:ring-[#00ff00] placeholder-[#00ff00]/50"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-[#1a1a1a] text-[#00ff00] border border-[#00ff00] rounded focus:outline-none focus:ring-2 focus:ring-[#00ff00] placeholder-[#00ff00]/50"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
          {message && (
            <div className="mb-4 text-green-500 text-sm">{message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-[#00ff00] text-[#1a1a1a] font-bold rounded hover:bg-[#00cc00] transition disabled:opacity-50 uppercase"
          >
            {loading ? 'Processing...' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-[#00ff00] hover:underline text-sm">
            Already have an account? Login
          </Link>
        </div>
      </div>
      <ChatWidget />
    </>
  );
}