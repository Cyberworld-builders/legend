import Link from 'next/link';
import { Github, X, ArrowUpRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-5xl mb-4 tracking-wider">CyberWorld</h1>
      <p className="text-lg mb-8 text-[#00ff00]/70">
        Welcome to the CyberWorld ecosystem. Join the future.
      </p>
      <div className="flex justify-center gap-4 mb-12">
        <Link
          href="/login"
          className="px-6 py-2 bg-[#00ff00] text-[#1a1a1a] font-bold rounded hover:bg-[#00cc00] transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 bg-transparent border-2 border-[#00ff00] text-[#00ff00] font-bold rounded hover:bg-[#00ff00] hover:text-[#1a1a1a] transition"
        >
          Signup
        </Link>
      </div>
      <div className="flex justify-center gap-6 mb-8">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff00] hover:text-[#00cc00] transition"
        >
          <Github size={24} />
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff00] hover:text-[#00cc00] transition"
        >
          <X size={24} />
        </a>
        <a
          href="https://upwork.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff00] hover:text-[#00cc00] transition"
        >
          <ArrowUpRight size={24} />
        </a>
      </div>
      <p className="text-xl mb-2">Jay Long</p>
      <p className="text-sm text-[#00ff00]/70">CyberWorld Builders</p>
      <a
        href="mailto:your-email@example.com"
        className="text-sm text-[#00ff00] hover:underline mt-2 block"
      >
        email me
      </a>
    </div>
  );
}