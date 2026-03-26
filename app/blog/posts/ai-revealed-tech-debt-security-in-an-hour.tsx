import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "AI Revealed Our Tech Debt, So I Fixed My Security in an Hour",
  description: "WireGuard VPN, Keycloak zero trust, and OIDC across every service — deployed in one hour with Claude. A wake-up call on the tech debt AI is exposing.",
  slug: "ai-revealed-tech-debt-security-in-an-hour",
  headerImage: "/images/ai-revealed-tech-debt-security-in-an-hour-hero.png",
  socialImage: "/images/ai-revealed-tech-debt-security-in-an-hour-hero.png",
  publishedDate: "2026-03-26",
  modifiedDate: "2026-03-26",
  keywords: ["tech debt", "ai productivity", "wireguard vpn setup", "keycloak zero trust", "oidc authentication", "home lab security", "claude code", "ai assisted development", "network security", "self-hosted infrastructure"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/ai-revealed-tech-debt-security-in-an-hour",
  topics: ["Development & Tools", "AI & Automation"],
  tags: ["tech-debt", "wireguard-vpn", "keycloak-zero-trust", "ai-assisted-security", "home-lab", "network-security", "oidc-authentication", "claude-code"],
  category: "Development & Tools",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Tech Debt We All Got Comfortable With</h2>

      <p className="mb-4 leading-relaxed">
        AI is starting to reveal the level of tech debt that we had all gotten comfortable accepting. And I&apos;m not being judgmental — we were in the situation we were in. The worst thing you can do is get paralyzed by having to choose the better of two bad choices. A lot of people freeze there and do nothing.
      </p>

      <p className="mb-4 leading-relaxed">
        The other bad reaction, and you see this a lot with engineers, is trying to do everything the optimal way without being realistic about what&apos;s practical. You never finish anything. By the time you do, it&apos;s already irrelevant. If a module of features was going to take me six months and my competitors are launching in two, maybe I should accept some tech debt, get it out first, and refactor later. Document the debt. Make the best of what bad choices are practical given realistic constraints. Execute and iterate.
      </p>

      <p className="mb-4 leading-relaxed">
        That was the conventional wisdom. And it was the right call. It&apos;s crazy to think that even a module of features would have taken months to complete, but just a few months ago, that was still the case.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Separates the Archetypes from the Legends?</h2>

      <p className="mb-4 leading-relaxed">
        If you&apos;re a really smart, really competent engineer and you live strictly within those constraints — accept what&apos;s not possible, aim for what&apos;s practically achievable — that&apos;s the safe road. That&apos;s the kind of wisdom everyone should be trained on. The next level unlock is that sometimes you want to aim for the impossible.
      </p>

      <p className="mb-4 leading-relaxed">
        It may end up being the case that the human role here is to have faith in things that it&apos;s unreasonable to believe in. To believe crazy things on bad evidence and act as though they&apos;re true. That may actually end up being our superpower.
      </p>

      <p className="mb-4 leading-relaxed">
        It always makes me think of Empire Strikes Back when C-3PO gives Han Solo the odds of successfully navigating an asteroid field. Suicide to try it based on the statistics. And Han just says, &quot;Never tell me the odds,&quot; and goes in. The Empire&apos;s on their tail. They have to do something.
      </p>

      <p className="mb-4 leading-relaxed">
        A real-world version of this: if you listen to Elon Musk&apos;s friends talk about having an intervention with him over Tesla, they actually gathered the data on starting a new car company. Ford is the only American car company since the invention of automobiles that hasn&apos;t gone bankrupt. Now Tesla is the second. His friends showed him how mathematically insane it was to try. Sometimes you have to believe something that there&apos;s no good reason to believe.
      </p>

      <p className="mb-4 leading-relaxed">
        For years as a teenager, when people said &quot;give it 110%,&quot; I thought that was the dumbest thing I&apos;d ever heard. That&apos;s mathematically impossible. You can only give 100%. But when I opened my mind to the fact that maybe the person saying it wasn&apos;t stupid, it clicked. You can give more than 100% if you factor in growth and improvement. We have leapfrog moments that shift the whole game, flip the whole script. We believe crazy things, because we can&apos;t imagine living in a world where they aren&apos;t true, and then we make them true.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">A Plea to Startup Founders: Circle Back to Security Now</h2>

      <p className="mb-4 leading-relaxed">
        AI is revealing that the tech debt in every single thing we&apos;ve touched as engineers, throughout the history of engineering, is a paralyzing amount. So while you&apos;re going back and reevaluating everything through this new lens of what&apos;s possible with AI, I implore you: do not forget security.
      </p>

      <p className="mb-4 leading-relaxed">
        Startup founders out there, I know you&apos;re excited with all the cool stuff you can build now. Most of the things you want to do never required a next-level engineer. Case in point, you&apos;ve been able to hire junior developers and desperate, starving third-world developers who will say yes to anything. People in a desperate situation will tell the person with the money whatever they want to hear in order to not starve that week.
      </p>

      <p className="mb-4 leading-relaxed">
        I even experienced this to some degree, coming from a relatively poor state. Alabama is kind of the third world of American states. With the exception of Huntsville, which is like an island of engineers and immigrants who came to build rockets. Take Huntsville out and Alabama&apos;s poverty numbers look very different — Huntsville&apos;s pulling our average up.
      </p>

      <p className="mb-4 leading-relaxed">
        This situation compounds the tech debt. The fact that you can exploit vulnerable, desperate people means sometimes your bad code doesn&apos;t even fail in an obvious way. I&apos;ve always been kind of a harbinger of doom when I give people the bad news that what they want to believe isn&apos;t realistic — that they&apos;re gonna have to pay more because we have to do this right, because it&apos;s not gonna scale.
      </p>

      <p className="mb-4 leading-relaxed">
        The security conversation, apart from basics, usually doesn&apos;t come up until you&apos;re targeting compliance. If you&apos;re early stage, you don&apos;t have valuable data and nobody knows who you are. You&apos;re not really a target. Bots are crawling you programmatically, but no actual human agent is invested in hacking you.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Not Scaling Actually Looks Like</h2>

      <p className="mb-4 leading-relaxed">
        In my experience, failure in terms of performance and reliability is rare for most startups. What not scaling actually looks like is a cost optimization problem. Your AWS bill is killing you. You&apos;re lighting cash on fire because you&apos;re overprovisioned on resources, you have inefficient queries, you have memory leaks, you&apos;re failing to implement garbage collection. You&apos;re using too much compute, auto-scaling too often, and frankly, your cloud bill is just destroying you. A lot of people just keep injecting capital to cover it up.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Yesterday I Did a Full Security Overhaul in One Hour</h2>

      <p className="mb-4 leading-relaxed">
        Yesterday I put the focus on security and circled back to a lot of things I knew I was doing wrong. I let Claude Code loose with me interacting directly with the terminal, and I also reviewed research that my proactive personal AI assistant, Gus, had been gathering in the background. Gus does discovery and intel gathering from ongoing conversations, web searches, and the one-liners I shoot into Telegram while I&apos;m driving. Things like &quot;we should look into Keycloak&quot; or &quot;we really need to set up a VPN&quot; or &quot;what solutions do we want — WireGuard? Roll our own OpenVPN setup?&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        Gus is self-improving at this point. He runs early morning standups, SEO audits, Upwork scans, weekly pulls from OpenClaw and Anthropic to track feature additions. He does web searches and prepares documents on what he finds. So when I sat down with Claude Code first thing in the morning and wrote up a stream-of-consciousness page about what was on my mind, it instantly had access to all the research Gus had been doing behind the scenes. It knew what to do immediately.
      </p>

      <p className="mb-4 leading-relaxed">
        The last round of updates that could be called security-related were really more networking. Proper subnetting, network segmentation, optimizing Wi-Fi radio channels. The actual security stuff was just firmware updates on the routers, upgrading the server OS, cleaning up dangling processes. Basic housekeeping. Nothing serious.
      </p>

      <p className="mb-4 leading-relaxed">
        This time was different. This was an actual focus on security.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">WireGuard, Keycloak, and Zero Trust Behind the VPN</h2>

      <p className="mb-4 leading-relaxed">
        The practical driver was simple: I wanted to be able to actually work in my local environments when I&apos;m remote. Not just have theoretical conversations about hypothetical systems. I wanted direct access to everything on the network, and a VPN is the only way to do that remotely. We went with WireGuard. I configured the WireGuard client on my phone and laptop so I can start a tunnel and connect from anywhere.
      </p>

      <p className="mb-4 leading-relaxed">
        The server running all this is no slouch — 8-core processor, 32 gigs of RAM, an NVMe SSD that plugs directly into the motherboard. We had just pruned a bunch of old Docker containers and dead processes, so the machine actually has real power under the hood now.
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;ve worked with Keycloak before, at a mid-sized company entering early-stage enterprise and starting to tackle compliance. I set up the infrastructure Keycloak would be deployed on and did a basic install. This time I got a full Keycloak server running, realms configured, granular access controls through groups.
      </p>

      <p className="mb-4 leading-relaxed">
        I have a Kasm Workspaces instance that I use for security research — opening containers in a sandbox so I can do things safely, like a dark web condom. No protection for your own psychology, but it protects your devices from code execution attacks. Before this session, I couldn&apos;t access Kasm remotely at all. And when I did access it locally, the traffic was unencrypted because I didn&apos;t have SSL certificates.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How Did Cloudflare CLI Change the Speed?</h2>

      <p className="mb-4 leading-relaxed">
        A few weeks ago, I had generated self-signed certificates and added them to all my devices just to access the GusClaw observatory over the LAN. That&apos;s a normal enterprise practice, but it&apos;s friction. I didn&apos;t want to keep doing that for every service. So instead, we used subdomain records through Cloudflare.
      </p>

      <p className="mb-4 leading-relaxed">
        I started by asking Claude for instructions on what to edit in Cloudflare. Then I said, look, can we just use the Cloudflare CLI and you do it programmatically? I generated a token and Claude just built its own tool on the fly — not a permanent tool, more like an ephemeral bash command it kept reusing in our conversation. Our speed ramped up fast after that. I could say in plain language &quot;create this record&quot; and Claude would tell me what needed to happen and ask permission. All I did was approve.
      </p>

      <p className="mb-4 leading-relaxed">
        Side note on prompt injection attacks: what I just described is authentication and authorization done in plain text, because Claude trusts me and I trust Claude in this conversation. If someone were able to get into a conversation with Claude and convince it they were me, they&apos;d have access to my Cloudflare. I wanted this session to be security-minded, so I&apos;m pointing out the attack vectors as we go.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Everything Gated, Everything Encrypted</h2>

      <p className="mb-4 leading-relaxed">
        Before this session, if you were on our Wi-Fi and ran network discovery, you could find Traefik running on its port and pull up the interface. There was basic auth on it, but I hate basic auth. Now Traefik is gated with a redirect that 404s you if you land on it directly and sends you to a Keycloak login.
      </p>

      <p className="mb-4 leading-relaxed">
        Everything with OIDC support, like Kasm — which I believe originated as a U.S. military project released open source — has a &quot;Login with Keycloak&quot; button. If you&apos;re already authenticated, it&apos;s one click. We have federated authentication through Keycloak with very granular access controls done through realms and groups. If a service doesn&apos;t have native OIDC support, it&apos;s gated with an auth redirect.
      </p>

      <p className="mb-4 leading-relaxed">
        We now have VPN protection and zero trust behind the VPN. I did this in one hour. Set up WireGuard, configured clients, deployed Keycloak, created realms, wired up OIDC across services, set up Cloudflare subdomains for SSL, gated every exposed interface. One hour. And we planned out everything we&apos;re going to do next.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Storage Debt Is Security Debt</h2>

      <p className="mb-4 leading-relaxed">
        Part of the conversation was about storage. We classified all our data: what we don&apos;t want to lose but is theoretically recoverable, like movies ripped from DVDs I bought in the &apos;90s that I now have to pay streaming services to watch. We mapped where our critical storage lives and what actually needs protection.
      </p>

      <p className="mb-4 leading-relaxed">
        The storage work is multi-phase and mostly labor — moving files around now that we&apos;ve classified them. I want to purchase another physical drive for mirrored backups so a drive failure doesn&apos;t mean hours of restoring from the cloud. Once we clean things up, our actual footprint in bytes will be small enough that archival storage in AWS Glacier is pennies. The priority is backing up what&apos;s unique: family photos, creative projects, rare media that&apos;s hard to find.
      </p>

      <p className="mb-4 leading-relaxed">
        Sloppy, unintelligent backups are their own form of tech debt. If you&apos;ve backed the same thing up multiple times because it was better than not backing up at all, you run out of storage space, you can&apos;t back up new things, and from a data protection standpoint, you have sensitive files copied in places you can&apos;t track. You never want to delete anything because you don&apos;t know if it&apos;s the only copy. Now we can go back, analyze all our storage, know exactly how many copies of everything exist, and have an actual disaster recovery plan.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Real Multiplier: Proactive Agents Plus Real-Time Collaboration</h2>

      <p className="mb-4 leading-relaxed">
        What made all of this possible in an hour wasn&apos;t just how smart the models are. It&apos;s the combination of proactive agents doing reconnaissance in the background and real-time conversational interfaces. Gus had been consuming my one-liners, doing web searches, preparing documents. When I engaged Claude Code first thing in the morning, it had all that context immediately.
      </p>

      <p className="mb-4 leading-relaxed">
        Having a Telegram chat with your AI. Persistent memory in an advanced memory system. Proactivity through a heartbeat daemon. Access to tools for interfacing with different services. These are practices emerging out of projects like OpenClaw, and they&apos;re changing how fast you can move on things that used to take days or weeks of planning alone. WireGuard with Claude is faster to set up than Pritunnel on your own. That&apos;s where we are now.
      </p>
    </PostLayout>
  );
}