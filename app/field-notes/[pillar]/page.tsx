import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageBackground from '@/components/PageBackground';
import Breadcrumb from '@/components/Breadcrumb';
import { getPillarBySlug, getPillarIds } from '@/lib/pillar-config';
import { getPostsForPillar } from '@/lib/pillar-posts';
import type { Metadata } from 'next';

interface PillarPageProps {
  params: Promise<{
    pillar: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPillarIds().map((slug) => ({ pillar: slug }));
}

export async function generateMetadata({ params }: PillarPageProps): Promise<Metadata> {
  const { pillar: pillarSlug } = await params;
  const pillar = getPillarBySlug(pillarSlug);

  if (!pillar) {
    return { title: 'Not Found' };
  }

  const baseUrl = 'https://cyberworldbuilders.com';
  const canonical = `${baseUrl}/field-notes/${pillar.slug}`;

  return {
    title: `${pillar.title} — Field Notes | CyberWorld Builders`,
    description: pillar.description,
    openGraph: {
      title: `${pillar.title} — Field Notes | CyberWorld Builders`,
      description: pillar.description,
      url: canonical,
      type: 'website',
      siteName: 'CyberWorld Builders',
      images: [
        { url: `${baseUrl}/images/logo.png`, width: 250, height: 250, alt: 'CyberWorld Builders Logo' },
      ],
    },
    twitter: {
      card: 'summary',
      site: '@cyberbuilders',
      creator: '@cyberbuilders',
      title: `${pillar.title} — Field Notes`,
      description: pillar.description,
    },
    alternates: { canonical },
  };
}

function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { pillar: pillarSlug } = await params;
  const pillar = getPillarBySlug(pillarSlug);

  if (!pillar) {
    notFound();
  }

  const posts = getPostsForPillar(pillarSlug);
  const baseUrl = 'https://cyberworldbuilders.com';

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
      <PageBackground opacity={20} fullWidth />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-4xl mb-6 px-5 md:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Field Notes', href: '/blog' },
              { label: pillar.title },
            ]}
          />
        </div>

        <header className="w-full max-w-4xl px-5 md:px-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#00ff00]/60 mb-3">
            Field notes
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#00ff00] mb-4">
            {pillar.title}
          </h1>
          <p className="text-lg text-[#c2c9c2] max-w-2xl">
            {pillar.description}
          </p>
          <p className="text-sm text-[#00ff00]/50 mt-4">
            {posts.length} {posts.length === 1 ? 'note' : 'notes'}
          </p>
        </header>

        {/* CollectionPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${pillar.title} — Field Notes | CyberWorld Builders`,
              description: pillar.description,
              url: `${baseUrl}/field-notes/${pillar.slug}`,
              datePublished: posts.length > 0
                ? posts.reduce((oldest, p) => p.publishedDate < oldest ? p.publishedDate : oldest, posts[0].publishedDate) + 'T12:00:00Z'
                : new Date().toISOString(),
              dateModified: posts.length > 0
                ? (posts.reduce((latest, p) => (p.modifiedDate || p.publishedDate) > latest ? (p.modifiedDate || p.publishedDate) : latest, posts[0].modifiedDate || posts[0].publishedDate)) + 'T12:00:00Z'
                : new Date().toISOString(),
              publisher: {
                "@type": "Organization",
                name: "CyberWorld Builders",
                logo: { "@type": "ImageObject", url: `${baseUrl}/images/logo.png` },
              },
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: posts.length,
                itemListElement: posts.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${baseUrl}/blog/${p.slug}`,
                  name: p.title,
                })),
              },
            }),
          }}
        />

        <div className="w-full max-w-4xl px-5 md:px-8">
          {posts.length === 0 ? (
            <p className="text-[#9da69d]">No posts in this category yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group grid overflow-hidden border border-white/10 bg-[#0b0e0b] transition-colors hover:border-[#00ff00]/40 ${
                    index === 0 ? 'md:col-span-2 md:grid-cols-[1.1fr_.9fr]' : ''
                  }`}
                >
                  <div className={`relative min-h-48 ${index === 0 ? 'md:min-h-72' : ''}`}>
                    {post.headerImage ? (
                      <Image
                        src={post.headerImage}
                        alt={`Hero image for ${post.title}`}
                        fill
                        sizes={index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 45vw'}
                        className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center p-5 md:p-7">
                    <p className="font-mono text-xs text-[#00ff00]/60">
                      {post.category}
                      <span className="px-2 text-[#657065]">/</span>
                      {dateLabel(post.publishedDate)}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-[#e6ece6] group-hover:text-[#00ff00]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#9da69d] line-clamp-3">
                      {post.description}
                    </p>
                    <span className="mt-5 font-mono text-xs text-[#00ff00]/70">
                      READ THE NOTE →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl px-5 md:px-8 mt-12 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="text-[#00ff00]/70 hover:text-[#00ff00] font-mono text-sm"
          >
            ← All field notes
          </Link>
        </div>
      </div>
    </div>
  );
}
