import Image from 'next/image';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import { getAllPosts } from '@/lib/post-metadata';

const interests = [
  {
    number: '01',
    title: 'Agents as instruments',
    description: 'The memory, tools, and operating systems around AI that let people and agents do difficult work together.',
    note: 'stop-wrapping-the-frontier-harness',
    hub: '/field-notes/agents',
  },
  {
    number: '02',
    title: 'Media that listens back',
    description: 'Music and film as material to explore, annotate, learn from, and reshape with human judgment in the loop.',
    note: 'rznjn-human-ai-music-collaboration',
    hub: '/field-notes/media',
  },
  {
    number: '03',
    title: 'Technology with atmosphere',
    description: 'Interactive horror, mixed reality, puzzles, and physical systems where the technology serves the feeling.',
    note: 'occult-artifact-ar-wrapper-puzzle-fun',
    hub: '/field-notes/atmosphere',
  },
];

const noteSlugs = new Set([
  'stop-wrapping-the-frontier-harness',
  'occult-artifact-ar-wrapper-puzzle-fun',
  'rznjn-human-ai-music-collaboration',
  'revenant-hollow-never-stopped-being-alive',
]);

function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Home() {
  const notes = getAllPosts().filter((post) => noteSlugs.has(post.slug)).slice(0, 4);
  const latest = notes[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground opacity={7} fullWidth />
      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-16 md:grid-cols-[1.2fr_.8fr] md:items-center md:px-8 md:pb-28 md:pt-24">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <Image src="/images/logo.png" alt="CyberWorld Builders" width={62} height={62} priority className="h-14 w-14 object-contain" />
              <p className="text-xs uppercase tracking-[.24em] text-[#00ff00]/60">An independent technology workshop</p>
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] text-[#e8f0e8] md:text-6xl">
              Useful systems.<br />
              <span className="text-[#00ff00]">Unusual ideas.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#c2c9c2] md:text-lg md:leading-8">
              CyberWorld is where I explore the technology I can’t stop thinking about: human–AI collaboration,
              creative tools, immersive experiences, and the infrastructure that makes them real.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
              <Link href="#workbench" className="text-[#00ff00] underline decoration-[#00ff00]/40 underline-offset-4 hover:decoration-[#00ff00]">See what I’m exploring ↓</Link>
              <Link href="/blog" className="text-[#c2c9c2] underline decoration-white/20 underline-offset-4 hover:text-white">Read the field notes →</Link>
            </div>
          </div>

          <aside className="border border-[#00ff00]/20 bg-[#080b08]/85 p-5 font-mono text-sm shadow-[0_18px_70px_#0009] md:p-7">
            <p className="mb-5 text-xs uppercase tracking-[.2em] text-[#00ff00]/65">Current coordinates</p>
            <dl className="space-y-5">
              <div>
                <dt className="text-xs text-[#7f8a7f]">DAY WORK</dt>
                <dd className="mt-1 text-[#e8f0e8]">Full-time with Platinum</dd>
              </div>
              <div>
                <dt className="text-xs text-[#7f8a7f]">INDEPENDENT WORK</dt>
                <dd className="mt-1 text-[#e8f0e8]">A few long-running client collaborations</dd>
              </div>
              <div>
                <dt className="text-xs text-[#7f8a7f]">CYBERWORLD</dt>
                <dd className="mt-1 leading-6 text-[#c2c9c2]">Personal systems, creative experiments, and ideas I want to follow all the way through.</dd>
              </div>
            </dl>
            <div className="mt-7 border-t border-[#00ff00]/15 pt-4 text-xs text-[#7f8a7f]">
              <span className="mr-2 text-[#00ff00]">●</span>Not an agency menu. A record of the work.
            </div>
          </aside>
        </section>

        <section id="workbench" className="border-y border-[#00ff00]/15 bg-[#070907]/90 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.2em] text-[#00ff00]/60">The workbench</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#e8f0e8] md:text-3xl">Questions I keep chasing</h2>
              </div>
              <span className="font-mono text-xs text-[#778077]">INTERESTS / IN PROGRESS</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {interests.map((interest) => (
                <Link key={interest.number} href={interest.hub} className="group min-h-60 border border-white/10 bg-[#0c100c] p-6 transition-colors hover:border-[#00ff00]/45">
                  <div className="flex items-center justify-between font-mono text-xs text-[#6f796f]">
                    <span>{interest.number} / 03</span><span className="text-[#00ff00]/50 transition-transform group-hover:translate-x-1">↗</span>
                  </div>
                  <h3 className="mt-9 text-xl font-semibold text-[#dfe7df] group-hover:text-[#00ff00]">{interest.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#9da69d]">{interest.description}</p>
                  <span className="mt-6 inline-block font-mono text-xs text-[#00ff00]/65">EXPLORE THE NOTES →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[.7fr_1.3fr] md:px-8 md:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-[#00ff00]/60">Why this exists</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#e8f0e8] md:text-3xl">I don’t need every interest to become a business.</h2>
          </div>
          <p className="text-base leading-8 text-[#aeb7ae]">
            I work full-time at Platinum and still take on a small number of long-term client projects. CyberWorld has a different job:
            it gives my own experiments a home. Some will become useful tools. Some will become strange experiences. Some are just
            questions worth spending time with. The common thread is curiosity, careful engineering, and making technology serve people.
          </p>
        </section>

        <section id="field-notes" className="border-t border-white/10 bg-[#080a08]/85 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.2em] text-[#00ff00]/60">Field notes</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#e8f0e8] md:text-3xl">Recent paths through the work</h2>
              </div>
              <Link href="/blog" className="font-mono text-sm text-[#00ff00]/80 hover:text-[#00ff00]">All notes →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {notes.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={`group grid overflow-hidden border border-white/10 bg-[#0b0e0b] transition-colors hover:border-[#00ff00]/40 ${index === 0 ? 'md:col-span-2 md:grid-cols-[1.1fr_.9fr]' : ''}`}>
                  <div className={`relative min-h-48 ${index === 0 ? 'md:min-h-72' : ''}`}>
                    {post.headerImage ? <Image src={post.headerImage} alt={`Hero image for ${post.title}`} fill sizes={index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 45vw'} className="object-cover opacity-80 transition-opacity group-hover:opacity-100" /> : null}
                  </div>
                  <div className="flex flex-col justify-center p-5 md:p-7">
                    <p className="font-mono text-xs text-[#00ff00]/60">{post.category} <span className="px-2 text-[#657065]">/</span> {dateLabel(post.publishedDate)}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-[#e6ece6] group-hover:text-[#00ff00]">{post.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#9da69d]">{post.description}</p>
                    <span className="mt-5 font-mono text-xs text-[#00ff00]/70">READ THE NOTE →</span>
                  </div>
                </Link>
              ))}
            </div>
            {latest ? <p className="mt-6 font-mono text-xs text-[#657065]">Latest entry: {dateLabel(latest.publishedDate)}</p> : null}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-4xl px-5 py-16 text-center md:px-8 md:py-24">
          <Image src="/images/logo.png" alt="CyberWorld Builders logo" width={48} height={48} className="mx-auto mb-5 opacity-70" />
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#00ff00]/55">About this place</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#e8f0e8] md:text-3xl">CyberWorld Builders is the name on the workshop door.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#9da69d]">
            I’m Jay: an engineer, lifelong tinkerer, music obsessive, and horror fan. This site is a map of what I’m learning and making—not a catalog of services.
          </p>
        </section>
      </main>
    </div>
  );
}
