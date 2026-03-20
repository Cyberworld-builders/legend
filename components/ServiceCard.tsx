import Link from 'next/link';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  image?: string;
}

export default function ServiceCard({ href, icon: Icon, title, description, tags, image }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="block border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 transition-colors bg-[#1a1a1a] group overflow-hidden"
    >
      {image && (
        <div className="relative overflow-hidden h-36">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
      <Icon className="w-10 h-10 text-[#00ff00] mb-4" />
      <h3 className="text-xl font-bold mb-2 text-[#00ff00]">{title}</h3>
      <p className="text-[#00ff00]/70 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs bg-[#00ff00]/10 border border-[#00ff00]/20 rounded text-[#00ff00]/80"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="text-sm text-[#00ff00]/60 group-hover:text-[#00ff00]/80 transition-colors">
        Learn more &rarr;
      </span>
      </div>
    </Link>
  );
}

export type { ServiceCardProps };
