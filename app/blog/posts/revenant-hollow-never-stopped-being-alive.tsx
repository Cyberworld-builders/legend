import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Revenant Hollow Never Stopped Being Alive",
  description: "I tabled this project before the pandemic. Years later, three signals stacked up at once: an old friend's question, dormant YouTube numbers out-pacing my paid work, and the speakers I'd sourced years ago mounted in a haunt I walked through. Then Meow Wolf chose Niantic. Then 8th Wall went open source. Here's why I'm picking it back up.",
  slug: "revenant-hollow-never-stopped-being-alive",
  headerImage: "/images/revenant-hollow-never-stopped-being-alive-hero.png",
  socialImage: "/images/revenant-hollow-never-stopped-being-alive-hero.png",
  publishedDate: "2026-05-06",
  modifiedDate: "2026-05-06",
  keywords: [
    "revenant hollow",
    "location-based entertainment",
    "haunted attractions",
    "augmented reality",
    "niantic spatial",
    "8th wall open source",
    "lightship vps",
    "spatial computing",
    "lbe technology",
    "horror entertainment tech",
    "meow wolf niantic partnership",
    "practical effects",
    "third place renaissance",
    "arx mortis",
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/revenant-hollow-never-stopped-being-alive",
  topics: ["AI & Automation", "Development & Tools", "Career & Professional Development"],
  tags: [
    "revenant-hollow",
    "location-based-entertainment",
    "augmented-reality",
    "spatial-computing",
    "haunted-attractions",
    "niantic",
    "8th-wall",
    "horror-tech",
    "practical-effects",
    "personal-recommit",
  ],
  series: "Entertainment Technology",
  category: "Technology",
  isFeatured: true,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <p className="mb-4 leading-relaxed">
        I checked my YouTube analytics the other day and noticed something I should have noticed a while ago. The videos I haven&apos;t touched in years, footage from a project I tabled before the pandemic, are quietly out-pacing the work I&apos;m getting paid to make right now. There&apos;s no marketing push and no recent activity. The algorithm has no freshness signal to feed off. These are basically archived videos. They get more monthly views and more engagement than the new content I&apos;m publishing about technologies I&apos;m currently being paid to work on.
      </p>

      <p className="mb-4 leading-relaxed">
        That observation isn&apos;t the reason I&apos;m picking up Revenant Hollow again. It&apos;s just the most recent of several signals telling me what I already knew underneath. This project never stopped being alive in me. It went quiet for a few years for reasons I&apos;ll get to. It never went away.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">A Friend&apos;s Question</h2>

      <p className="mb-4 leading-relaxed">
        I ran into a friend of mine from way back at the beginning of this year. He works for the city. We hadn&apos;t really talked in a long time, just the kind of cordial nod when you bump into each other at the gas station. This time we got into it. AI, aliens, the kind of weird-cultural-zeitgeist conversation two guys have when both of them turn out to be paying more attention than the other one realized. Then he said something that knocked me back a step.
      </p>

      <p className="mb-4 leading-relaxed">
        &quot;Hey man, are you still doing that home haunt stuff? Are you doing anything with all those scare props?&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        I told him honestly: I didn&apos;t know you were paying attention to that. I didn&apos;t even know that stuff was visible.
      </p>

      <p className="mb-4 leading-relaxed">
        He said, &quot;If anybody can do it, it would be you.&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        One conversation didn&apos;t restart Revenant Hollow. The project was already loaded. The encouragement just lit the fuse on something that had been packed for years. Every signal that matters in this kind of work has to be there before someone else&apos;s confidence can do anything with it. Otherwise you take the encouragement, feel good for a day, and nothing happens.
      </p>

      <p className="mb-4 leading-relaxed">
        There&apos;s a Tarantino interview I keep thinking about. He was on the verge of giving up on Inglourious Basterds and turning it into a miniseries. Then he ran into someone — I&apos;m pretty sure it was Christoph Waltz, but I might be wrong about which person — who told him no, it needs to be a movie, and if you&apos;ll do it I&apos;m on board. Within days he had a draft of the film that worked. The rest is history. The encouragement didn&apos;t write the screenplay. Tarantino had been living with that material long enough that the moment somebody gave him permission to take it seriously again, the work just fell out of him. The fuse was already in place. Somebody handed him a match.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s what was happening to me. The friend from the city was the match. The fuse was the part of me that had been quietly mapping geocoordinates and sketching node placements and pricing weather-resistant speakers for years, even when I told myself I&apos;d put the project down.
      </p>

      <figure className="my-8">
        <img
          src="/images/revenant-hollow-arduino-node-prototype.png"
          alt="A node prototype on a workbench: Arduino, breadboard, jumper wires, glowing blue LED"
          className="w-full max-w-md mx-auto rounded"
        />
        <figcaption className="text-center text-sm text-gray-400 mt-2">
          A node prototype from years back. Still on the workbench.
        </figcaption>
      </figure>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Data That Confirmed It</h2>

      <p className="mb-4 leading-relaxed">
        A few weeks after that conversation I went and looked at the actual numbers on what I&apos;d been posting and how it was performing. Not the warm-fuzzy version. The real version. I&apos;ve been gathering data on all the content I publish across every channel for a while now, partly because I&apos;ve been building a market-intelligence layer on top of my own work to find overlap between what I want to do and what people are actually paying for. The shape of what I found surprised me.
      </p>

      <p className="mb-4 leading-relaxed">
        The stuff I was working on years ago for my own projects, with no marketing push and no recent activity, was getting more views and more engagement than the new content I was publishing about technologies I&apos;m currently being paid to work on. It's Nothing mind-blowing. Honestly, the numbers are actually tiny. The shape is what matters: dormant content from a tabled project quietly pacing live content from active client work.
      </p>

      <p className="mb-4 leading-relaxed">
        If you&apos;ve ever tried to get an audience to find a piece of work, you know that doesn&apos;t usually happen by accident. Algorithmic re-surfacing isn&apos;t random, but it isn&apos;t generous to dead content either. When dead content keeps holding ground against live content, it means something the algorithm noticed before I did.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Arx Mortis, Bloody Valentine</h2>

      <p className="mb-4 leading-relaxed">
        The third signal came in February. My wife and I are both big horror fans, and on Valentine&apos;s Day this year we drove out to Killen, Alabama, for the Bloody Valentine event at <a href="https://arxmortis.com/" target="_blank" rel="noopener noreferrer" className="text-[#00ff00] underline">Arx Mortis</a>. It was the first time I&apos;d been to a haunt with genuinely good scare actors and the production budget to match. We don&apos;t get out much, just the two of us, with all the kids. This was already a small big deal before I even walked through the door.
      </p>

      <p className="mb-4 leading-relaxed">
        Then I started noticing things.
      </p>

      <p className="mb-4 leading-relaxed">
        I noticed the speakers. I had spent a lot of time, years back, sourcing weather-resistant outdoor speakers for the node concept I was designing. The right balance of bass, scale, and durability. Not overpriced. Designed for boathouses, of all things, so they handled humidity and temperature swings without flinching. I bought some, tested them, designed them into the spec. Walking through Arx Mortis, I saw the exact same speakers mounted in their sets.
      </p>

      <p className="mb-4 leading-relaxed">
        That moment isn&apos;t a small thing to me, and I want to be careful explaining why. It isn&apos;t that the speakers themselves are interesting. It&apos;s that other people who are seriously building this kind of attraction had landed on the same component I had landed on, and they had landed on it through a completely different process. They were thinking about the same problems I was thinking about. They were just solving them in the normal way. I had, and still have, a different way of solving them. But the validation that <em>the problems are real, and other serious operators are working on them</em> was sitting on the wall, three feet off the floor, screwed into a corner of the set.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">I Already Wrote the Long Version of This Once</h2>

      <p className="mb-4 leading-relaxed">
        I wrote the long-form technical pitch for Revenant Hollow back in 2024. It covers the AR ghost rendering, the facade-wall nodes, the augmented-reality sports complex it eventually scales into, and the matrix-pod observation about why this matters in the first place. The piece is <a href="/blog/revenant-hollow-integrating-technology-into-location-based-horror-experiences" className="text-[#00ff00] underline">here</a>. I&apos;m not going to recap it. The thesis hasn&apos;t changed. What&apos;s changed is everything around it, and that&apos;s what the rest of this post is about.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What&apos;s Changed Since</h2>

      <p className="mb-4 leading-relaxed">
        The clearest signal that the universe is agreeing didn&apos;t come from a friend at the gas station. It came from Meow Wolf.
      </p>

      <p className="mb-4 leading-relaxed">
        The largest, most-aligned independent immersive-experience producer in the location-based-entertainment space announced a partnership with Niantic Spatial in 2026. Their experiences are being expanded through Niantic&apos;s AR platform, the same Lightship VPS, centimeter-precision visual-positioning stack any independent operator would also evaluate first.
      </p>

      <p className="mb-4 leading-relaxed">
        I did contract work for Meow Wolf during the period <a href="https://sada.com/customer-story/meow-wolf-leverages-anthos-to-bring-surreal-experience-to-life-with-help-from-sada/" target="_blank" rel="noopener noreferrer" className="text-[#00ff00] underline">they were standing up Omega Mart on Google Cloud and Anthos</a>. That contract was one of two location-based-entertainment-adjacent tailwinds I lost when life took over and I had to put the project down. Watching them, years later, choose the same platform a smaller independent operator would also choose is the build-vs-buy question answered at industrial scale. Even a company with their resources decided not to roll their own.
      </p>

      <p className="mb-4 leading-relaxed">
        For somebody coming back to this work greenfield, that&apos;s not just validation. It&apos;s a runway. The work isn&apos;t &quot;should I build a platform?&quot; anymore. It&apos;s &quot;what do I build on top of the platform someone else has already validated?&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        The same week I was looking at that announcement, two more pieces moved into place. Niantic&apos;s Lightship VPS for Web shipped — centimeter-precision AR through a browser, no app install required. And 8th Wall, Niantic&apos;s multi-user WebAR runtime, began its transition off the paid hosted platform. The story there is messier than a clean open-source headline. The engine framework is MIT-licensed, but the SLAM core is a binary-only commercial license, the deeper venue-anchoring pieces stay on Niantic&apos;s paid VPS service, and the broader WebAR community is mid-migration to alternatives like Blippar, Mattercraft, and others. The trajectory is still clear. Infrastructure I would have had to invent in 2020 is becoming buyable, self-hostable, or open in some combination. The conditions for this project are catching up with the project.
      </p>

      <p className="mb-4 leading-relaxed">
        And outside of the industry, the cultural current is moving the same direction. The third-place renaissance — run clubs, supper clubs, board game nights, people walking out of their bedrooms back into rooms with other humans in them — is the same instinct Revenant Hollow is built around, at a much higher budget. The matrix-pod model is softening. The discourse is starting to recognize that AR&apos;s home isn&apos;t a headset on your face at home. It&apos;s shared, physical, location-based. A high-budget genre-specific version of that hunger is exactly what location-based horror entertainment is.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Practical-First, But Not Dogmatic</h2>

      <p className="mb-4 leading-relaxed">
        There&apos;s a design discipline I want to name, because it shapes what gets built and what gets killed in this work. Practical-first. Every feature I consider gets the same question: does this enhance the physical experience, or does it replace it? My bias is hard toward enhancement.
      </p>

      <p className="mb-4 leading-relaxed">
        Your phone augments the actor&apos;s jump-scare. The IoT layer makes the fog and the lightning more synchronized with the real performer. The AR ghost amplifies a fear that&apos;s already in the room. The discipline says be careful before substituting the synthetic for the practical, because the practical is what the audience came for.
      </p>

      <p className="mb-4 leading-relaxed">
        It isn&apos;t a bolted door, though. Some moments only work virtually. A phone-only easter egg. An AR figure that disappears the instant a real performer steps in. A ghost flying through a wall the actor is leaning against. Those things earn their way in. The default favors enhancement, and the rule is <em>convince me</em>, not <em>no</em>. Cameron over Lucas, in the cinematic shorthand. VFX serving practical effects, not replacing them. That&apos;s the design center of gravity.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What&apos;s Actually Driving This</h2>

      <p className="mb-4 leading-relaxed">
        I want to be honest about what&apos;s underneath all of these signals.
      </p>

      <p className="mb-4 leading-relaxed">
        The friend from the city, the dormant YouTube numbers, the speakers in Killen, the Meow Wolf announcement, the open-source release of 8th Wall. Those are signals. Real ones. Each one is part of the case. But the actual driver underneath them is older than any of them, and it isn&apos;t particularly rational.
      </p>

      <p className="mb-4 leading-relaxed">
        I have worked on a lot of projects in my career. Most of them I was excited about because somebody else was excited about them, and inhabiting a founder&apos;s vision the way they inhabit it is part of my job. That&apos;s a real skill. But this project is different. This was my project. My obsession. The thing my entire creative force aligned around for years.
      </p>

      <p className="mb-4 leading-relaxed">
        Regardless of whether anyone ever pays me for it. Regardless of whether anyone gives me a single ounce of praise. Even if every cynical person who ever told me you-can&apos;t-do-it or it&apos;s-a-dumb-idea or somebody-else-would-have-done-it-already turns out to be exactly right. None of that ever killed it. Nothing has ever killed this idea in my mind. It is eternal. It is immortal. It is everlasting. It comes from within and it never dies.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s the actual thesis. The signals just gave it permission to surface again.
      </p>

      <p className="mb-4 leading-relaxed">
        So that&apos;s what I&apos;m doing now.
      </p>

      <figure className="my-8">
        <img
          src="/images/revenant-hollow-haunt-fog-night.png"
          alt="Night-time haunt environment: a dimly lit structure with heavy fog drifting under a single warm overhead light"
          className="w-full max-w-md mx-auto rounded"
        />
        <figcaption className="text-center text-sm text-gray-400 mt-2">
          The work doesn&apos;t live online. It lives outside, after dark, in the fog.
        </figcaption>
      </figure>

    </PostLayout>
  );
}
