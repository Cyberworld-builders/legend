/**
 * Static hero headline. Engineering-first positioning, May 2026 reposition.
 * (Previous A/B test on marketing-firm framing was retired alongside the
 * positioning shift — there wasn't enough traffic for an A/B to reach
 * significance, and the direction was already decided.)
 */
export default function HeroHeadline() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#00ff00]">
        Founders ship MVPs. We ship them to production.
      </h1>
      <p className="text-lg md:text-xl text-[#00ff00]/70 mb-8 max-w-2xl mx-auto">
        Senior engineering for AWS, Next.js, Python, and AI agent systems — the work that actually has to last.
      </p>
    </>
  );
}
