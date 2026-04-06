import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Why My AI OS Survived Anthropic's Harness Lockdown",
  description: "Anthropic killed 3rd party harness support and broke everyone running OpenClaw. My custom setup didn't flinch. Here's the architecture that made the difference.",
  slug: "why-my-ai-os-survived-anthropics-harness-lockdown",
  headerImage: "/images/why-my-ai-os-survived-anthropics-harness-lockdown-hero.png",
  socialImage: "/images/why-my-ai-os-survived-anthropics-harness-lockdown-hero.png",
  publishedDate: "2026-04-06",
  modifiedDate: "2026-04-06",
  keywords: [
    "claude code third party harness",
    "ai operating system architecture",
    "openclaw alternative",
    "claude code single machine setup",
    "custom ai harness",
    "wireguard vpn development workflow",
    "agentic automation setup",
    "anthropic harness lockdown"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/why-my-ai-os-survived-anthropics-harness-lockdown",
  topics: ["AI & Automation", "Development & Tools"],
  tags: [
    "ai-operating-system",
    "claude-code",
    "openclaw",
    "custom-harness",
    "vpn-development-workflow",
    "agentic-automation",
    "self-hosted-ai"
  ],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Day Anthropic Dropped the Hammer</h2>

      <p className="mb-4 leading-relaxed">
        Today was the day Anthropic discontinued support for 3rd party harnesses. What this effectively did was force everyone who was using their Claude Code subscription to power a 3rd party automation harness to either give up their whole AI operating system or quit using Claude and go with something like OpenAI. For most people, this is going to push them straight onto Codex.
      </p>

      <p className="mb-4 leading-relaxed">
        I was completely unaffected.
      </p>

      <p className="mb-4 leading-relaxed">
        I have all the benefit of OpenClaw. I&apos;ve actually even got a pretty decent TypeScript UI that I use for observability into all of my automations. It&apos;s fully custom, cherry-picked from what OpenClaw does that I actually want to do. And because it&apos;s my own custom solution, it kind of flies under the radar.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Makes My Architecture Different?</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;ll be honest, I kind of lucked into this. The architecture we chose is technically not doing exactly what OpenClaw is doing. A couple of things stand out. One, it runs all on one machine. It&apos;s a single user. I think that&apos;s what&apos;s getting a lot of people: they&apos;re managing multiple subscriptions, and something about that is what Anthropic targeted. I haven&apos;t had time to dig into all the technical details behind the lockdown, but I didn&apos;t miss a beat. Didn&apos;t go down at all. Didn&apos;t have to change anything.
      </p>

      <p className="mb-4 leading-relaxed">
        There&apos;s some kind of difference between the way OpenClaw powers itself with your Claude Code subscription versus the way mine is actually running Claude Code terminals. It&apos;s just the one subscription, and I think the main secret sauce here is that I chose to go ahead and harden my network, optimize my VPN, and do a lot of networking upgrades. That, combined with centralizing all of my development onto one machine, is what makes it all possible.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Old M1 Mac That Became the Engine</h2>

      <p className="mb-4 leading-relaxed">
        I wanted to be really close to the engine of my AI operating system. So what I did was take my old M1 Mac, the machine I discontinued when I upgraded my daily driver workstation. Nothing was wrong with it. I completely reformatted it and set it up as a dedicated machine for Gus, my AI agent.
      </p>

      <p className="mb-4 leading-relaxed">
        Back in the first wave of OpenClaw, everybody was loading up Mac Minis to get around some of the security flaws because the platform was still in beta. There were gaping security issues, so people were setting it up on a completely separate machine that didn&apos;t have access to all their services. I did the same thing with my old M1. Rather than buy a Mac Mini, I just had this old computer laying around, so I used it.
      </p>

      <p className="mb-4 leading-relaxed">
        Having a physical machine sitting on my desk with a monitor and keyboard turned out to be way more valuable than I expected. Initially I thought the only benefit was going to be easy setup: give Gus his own Google account, his own everything, test it in a sandbox until I was comfortable with the security model, then harden one thing at a time. But working two computers at once, being right there next to it, that changed how I built the whole system.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Cherry-Picking Instead of Chasing Parity</h2>

      <p className="mb-4 leading-relaxed">
        While I&apos;m building this, I&apos;ve got two projects open. I&apos;m following the open source repository for OpenClaw, and I&apos;m following the development of the spec and all the skills in Claude Code. The skills are all just markdown files, plainly readable, no obfuscation at all. So I&apos;m already substantially reverse engineering it just from the spec, and building my own thing on top.
      </p>

      <p className="mb-4 leading-relaxed">
        Here&apos;s what I underestimated. There were at least two things that were making my harness develop as its own thing rather than a clone. First, I was developing it for me. My direct personal assistant. No multi-tenant enterprise concerns, no managing separate subscriptions. Second, because the machine was right there, I was directly overseeing every terminal. Running many agents at once, but all under my own login, on one box.
      </p>

      <p className="mb-4 leading-relaxed">
        The whole time, I&apos;m thinking I&apos;m a failure if I can&apos;t keep parity with OpenClaw and Claude Code. My agent kept correcting me: &quot;No, we&apos;re not keeping parity, but it&apos;s okay. We don&apos;t want to.&quot; And I&apos;m just like, whatever dude, I&apos;m seeing parity to the point that I care about. Not even realizing that cherry-picking the features you want is just not what parity means. But that&apos;s exactly what saved me. I built what I needed, not what they built.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How Does the Remote Workflow Actually Work?</h2>

      <p className="mb-4 leading-relaxed">
        They did screw us, and it is a limiting factor, but it&apos;s not a crippling one. I don&apos;t have to go pay for a $200 Codex subscription because my Claude Code subscription stopped being useful. I would probably run into problems if I tried running all my automated agentic workflows on Gus while also doing direct development work on my own workstation logged in separately. It would throttle or kill one or the other.
      </p>

      <p className="mb-4 leading-relaxed">
        But I put all of my repos for all of my current development work on Gus. That started out as laziness, and then I realized no, this is just efficiency. It&apos;s right there next to Gus. It&apos;s a lot easier to have it already detected under Gus&apos;s memory system than to have Gus reach out to my machine. Plus there are security concerns. That&apos;s another attack surface to harden and monitor and manage.
      </p>

      <p className="mb-4 leading-relaxed">
        The directory where all my working repos live is shared on the LAN with Samba. I connect through SSH with Cursor. And one thing I thought was going to be a dealbreaker: Claude Code is really handy when you can take screenshots and drop them into the terminal, or a client provides images and you need to drop those directly in. I struggled with this for a bit, but because the repo directory is shared on the LAN, I can just open up Finder, drag images over into the other Finder window, they show up in the file system, and then I drag from the Cursor file system right into the terminal. Almost no extra friction.
      </p>

      <p className="mb-4 leading-relaxed">
        Now the deal breaker you&apos;re probably already thinking of: what happens when I take my laptop somewhere? I don&apos;t have access to any of my files. Have to clone the repo and start fresh. Nope. Because I did all that work to set up WireGuard, I can just tunnel right into my LAN. SSH from Cursor into the repo folder on Gus, use Finder too. Everything works seamlessly when I&apos;m remote, as long as I can connect through the VPN. The only remaining gap is internet redundancy at home, unless I&apos;m there with my cell phone to use as a hotspot.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">One Machine, One Login, Zero Disruption</h2>

      <p className="mb-4 leading-relaxed">
        So now I don&apos;t have to worry about logging in with my Claude Code subscription on another machine and killing all my automations. The only place I&apos;m logged into Claude Code is on that machine. It&apos;s not optimal. It still sucks that Anthropic did this. But the level of functionality I have is actually really powerful. All of my client workflows that I&apos;m currently managing were already running on Gus anyway.
      </p>

      <p className="mb-4 leading-relaxed">
        I am going to start moving toward setting up individual AI operating systems for other people. And I need a way to share some of these more common automations because it&apos;s reinventing the wheel to keep building them from scratch every time. But for now, my system survived because I built it for one person, ran it on one machine, and stayed close to the metal. Sometimes the custom path is the only one that doesn&apos;t collapse when the platform shifts underneath you.
      </p>
    </PostLayout>
  );
}