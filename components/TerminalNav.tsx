'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'home', href: '/' },
  { label: 'services', href: '/services' },
  { label: 'blog', href: '/blog' },
  { label: 'cemetery-software', href: '/cemetery-software' },
  { label: 'contact', href: '/#contact' },
];

export default function TerminalNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" aria-label="Main navigation">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#00ff00]/20">
        <Link href="/" className="text-[#00ff00] font-bold text-sm tracking-wider">
          <span className="text-[#00ff00]/60">~/</span>cyberworld
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-[#00ff00]/70 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur border-b border-[#00ff00]/20">
          <div className="px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-[#00ff00]/70 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors"
              >
                <span className="text-[#00ff00]/40 mr-2">$</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
