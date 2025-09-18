import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-[#00ff00]/50">/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#00ff00]/70" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
