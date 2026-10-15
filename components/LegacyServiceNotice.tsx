import Link from 'next/link';
import { Info } from 'lucide-react';

export default function LegacyServiceNotice() {
  return (
    <div className="bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-lg p-4 mx-4 mt-4 max-w-4xl lg:mx-auto">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-[#00ff00]/60 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#00ff00]/70 leading-relaxed">
          This page describes past services. CyberWorld is now an independent
          technology workshop — see the{' '}
          <Link
            href="/blog"
            className="text-[#00ff00] underline underline-offset-2 hover:text-[#00ff00]/80"
          >
            Field Notes
          </Link>{' '}
          or return to the{' '}
          <Link
            href="/"
            className="text-[#00ff00] underline underline-offset-2 hover:text-[#00ff00]/80"
          >
            homepage
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
