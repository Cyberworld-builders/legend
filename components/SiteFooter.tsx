import Link from 'next/link';

const links = [
  { label: 'GitHub', href: 'https://github.com/CyberWorld-builders' },
  { label: 'YouTube', href: 'https://youtube.com/@cyberbuilders' },
  { label: 'X', href: 'https://x.com/cyberbuilders' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#00ff00]/15 bg-[#070907]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Link href="/" className="font-mono font-bold text-[#00ff00]">~/cyberworld</Link>
          <p className="mt-1 text-xs text-[#778077]">A personal technology workshop by Jay Long.</p>
        </div>
        <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#9da69d]">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff00]">{link.label}</a>
          ))}
          <a href="mailto:contact@cyberworldbuilders.com" className="text-[#00ff00]/75 hover:text-[#00ff00]">Email Jay</a>
        </nav>
      </div>
      <p className="border-t border-white/5 px-5 py-3 text-center font-mono text-[11px] text-[#667066]">© {new Date().getFullYear()} CyberWorld Builders</p>
    </footer>
  );
}
