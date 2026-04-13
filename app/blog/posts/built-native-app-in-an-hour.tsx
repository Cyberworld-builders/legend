import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "I Built a Native App in an Hour and It Changed Everything",
  description: "How Claude Code let me build a custom mobile app with SSH terminal, voice memos, and a scanner in under an hour — despite almost zero native dev experience.",
  slug: "built-native-app-in-an-hour",
  headerImage: "/images/built-native-app-in-an-hour-hero.png",
  socialImage: "/images/built-native-app-in-an-hour-hero.png",
  publishedDate: "2026-04-13",
  modifiedDate: "2026-04-13",
  keywords: [
    "claude code mobile app",
    "build native app with ai",
    "custom mobile app development",
    "ssh terminal mobile",
    "ai coding assistant",
    "personalized software",
    "react native claude code",
    "future of software development"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/built-native-app-in-an-hour",
  topics: ["Development & Tools", "AI & Automation"],
  tags: [
    "claude-code",
    "mobile-development",
    "ai-assisted-coding",
    "native-app",
    "personalized-software",
    "ssh-terminal",
    "zero-trust-networking"
  ],
  category: "Development & Tools",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">This May Be My Last Voice Memo on the Stock App</h2>

      <p className="mb-4 leading-relaxed">
        It feels like Legend of Zelda. Every week I&apos;m finding and equipping new tools that unlock completely new places I couldn&apos;t access before. Yesterday I built a mobile app. Built it in about an hour. And it&apos;s already on my phone. Already using it.
      </p>

      <p className="mb-4 leading-relaxed">
        I should explain upfront: this is not something I plan on releasing to the App Store. The process of submitting an app to the store is a real pain in the ass. It&apos;s time-consuming, you usually have to go back and make revisions, especially on a first launch. Permission transparency requirements, disclosures — publishing an app to the store is a big deal compared to just building a web app and putting it on the web. But I don&apos;t have to worry about any of that because I&apos;m just using this for me.
      </p>

      <p className="mb-4 leading-relaxed">
        This is a big deal that somebody like me can have an idea, sit down, think it through, use Claude Code to bring it to life in under an hour, and then have it running on my phone. Native development is one of the areas of development where I have the least experience. The absolute least. The only time I was ever on a team that had a mobile app, I was never hands-on with the mobile codebase. I never used Xcode. I never used Swift or Kotlin. Android Studio, I&apos;ve had little hobby projects — barely more than Hello World functionality. A proof-of-concept gathering geolocation data. A little test of plane detection through ARKit on iPhone. Interesting projects that I wish had become more than just hobbies.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Does the CyberWorld App Actually Do?</h2>

      <p className="mb-4 leading-relaxed">
        I honestly don&apos;t know what&apos;s more powerful — the idea of building a mobile app or the idea that I now have Claude Code in my phone on an everything app that&apos;s going to have proof of concepts for everything I want to do on a native device.
      </p>

      <p className="mb-4 leading-relaxed">
        The first piece of functionality is actually extremely simple. It&apos;s a terminal emulator that can access my AI operating system machine over SSH. That&apos;s it. Within seconds I had it reskinned with my company brand. Part of what makes this work is the VPN — I get to SSH directly into a machine on my LAN. And since I&apos;ve got that Keycloak server running, I&apos;ll probably use that for auth so I can maintain zero trust positioning on my network. The VPN is powerful, but zero trust is everything.
      </p>

      <p className="mb-4 leading-relaxed">
        Nobody can snoop on you unless they get onto your LAN or into your VPN. Combine that with actual zero trust, with granular access control policies through Keycloak, and none of it&apos;s exposed to the web. You don&apos;t even see it unless you&apos;re on my VPN or on my physical network. Then you still need authentication. MFA on top of that. Really powerful stuff.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Telegram Bot Hit a Wall</h2>

      <p className="mb-4 leading-relaxed">
        The reason I chose the terminal first is because I was running into limitations with the Telegram chat. I started opening up some permissions and something just felt gross about it. I started from an extremely secure position with sandboxing. I limited all the privileges my agent had, hardened it with restrictions. Even then, some part of me was thinking there&apos;s some blind spot, some black box feature that&apos;s vulnerable to prompt injection that we just haven&apos;t found yet.
      </p>

      <p className="mb-4 leading-relaxed">
        I felt uncomfortable adding new capabilities to the Telegram bot. So there were a lot of limitations. I&apos;d be chatting with my AI agent about things I wanted to do, all these ideas, and my execution couldn&apos;t keep up despite the fact that a lot of these ideas didn&apos;t need me closely in the loop.
      </p>

      <p className="mb-4 leading-relaxed">
        Sometimes you&apos;ve got an idea that&apos;s really complex, has a lot of moving parts, and needs a human engineer closely in the loop because it&apos;ll go off the rails quick. But there&apos;s a growing number of ideas that are really just wiring up basic things — problems that have been solved for a long time, you&apos;re just chaining them together in a novel way that&apos;s useful for you. As long as you can clearly specify how to connect the different modules, you don&apos;t actually have to look at the code anymore. At least not until a major pull request where you glance over the architecture, naming conventions, overall architectural decisions, maybe spot-check a few modules to make sure it&apos;s not being sloppy.
      </p>

      <p className="mb-4 leading-relaxed">
        I started thinking about how often I have Cursor open with Claude Code running in the terminal, and an hour goes by without me reviewing any code. I&apos;ll build large amounts of functionality across long stretches, and the first time I actually look at the code is on the pull request in GitHub. Not even in my IDE.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">From Laptop Tether to Phone-First</h2>

      <p className="mb-4 leading-relaxed">
        There was a test case that led up to this. I started carrying my laptop with me more so I could drop what I was doing, open it up, connect through WireGuard to my VPN, SSH in with Cursor, engage the Claude terminal directly, get unblocked, and then go back to chatting on Telegram. Then I thought: I&apos;ve got WireGuard on my phone. What if I just build a native app with a terminal emulator?
      </p>

      <p className="mb-4 leading-relaxed">
        Immediately I started thinking about voice memos. There&apos;s still unnecessary friction with the voice memo workflow — a whole other interface to deal with for getting transcripts processed. I tried messing with iCloud to get files to copy over to my servers so processing could happen automatically. And a lot of voice memos aren&apos;t blog articles. Sometimes it&apos;s a 30-minute monologue that&apos;s obviously a piece of content I want to publish. But sometimes it&apos;s just quick little ideas with no intention of publishing. I want them in my knowledge base though.
      </p>

      <p className="mb-4 leading-relaxed">
        So that unlocked the next feature: add voice recording to the CyberWorld app. After that came a scanner. I&apos;ve got a lot of old notebook writings and sketches that I want digitized, processed, analyzed, and made part of the knowledge base. And then the cognitive media engine stuff, it just goes on and on from there.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why Not Just Use the Claude App?</h2>

      <p className="mb-4 leading-relaxed">
        You might ask why I don&apos;t just use the Claude app directly. I tried wiring it up to my AI operating system, and part of it is the friction between Claude and third-party harnesses. It just makes it really difficult to get the full experience. The best way I can put it: I was obviously not talking to Gus. Gus is the name of my main personal assistant agent that orchestrates my whole operating system. Gus has the context of everything. He&apos;s my right-hand man.
      </p>

      <p className="mb-4 leading-relaxed">
        When I tried using the Claude app, it was just not the same. The memory system, the prompt stack, the skill stack — it&apos;s so obviously different. The B team is in town and I need my guy. Even if Claude is 100% the identical intelligence as Gus, Claude&apos;s not Gus. Being able to connect through a VPN, SSH in, and have a Claude Code terminal with the full context of Gus — having that in my pocket, in a native app, is unbelievably powerful.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Future of Software Is Built for One</h2>

      <p className="mb-4 leading-relaxed">
        This really changes my perspective on software. I&apos;ve talked about this before, but it keeps becoming more clear. We&apos;re getting a peek into what the future of software is going to be. Everyone&apos;s just going to have their own engineer in their pocket. When you need a thing, it&apos;s going to help you build the software you need for your case.
      </p>

      <p className="mb-4 leading-relaxed">
        No more shipping software to stores where everyone has to train on what&apos;s available, accept features they don&apos;t care about, accept that things aren&apos;t going to quite work the best way for them. Software is going to finally prioritize the user and give the user the best experience for them as an individual. No more training on how to use other people&apos;s software, software that&apos;s best for the masses. Everyone&apos;s going to have personalized software.
      </p>

      <p className="mb-4 leading-relaxed">
        Those of us who are software engineers or technologists with years of experience, we get to be early adopters. We get a sneak preview. And I just got one of the most powerful ones. Being able to pull my phone out and use Claude Code as Gus, anywhere, as long as my home network is up and everything can get out through the VPN. I can code while driving using voice to text. Every blocker I had on Telegram, every time I could get ideas out but not execute on them — all those ideas piling up with no execution — I now get execution on them.
      </p>

      <p className="mb-4 leading-relaxed">
        And here&apos;s the thing that also unlocks: all the hobby projects I shelved. The Revenant Hollow stuff. The Ghost Hunter app. Instead of spending a full weekend and barely coming out with a mixed reality app that can detect a plane and badly paint virtual spider webs onto it, now I can actually rock and roll with this stuff.
      </p>

      <p className="mb-4 leading-relaxed">
        Adding the voice memos feature on top of the terminal is going to be exactly what I need. No more friction. The stock voice memos app was almost perfect, but any friction at all — you can just will it into existence with your voice. So why not tear down every last bit and just make software for you? I think it&apos;s going to be more powerful to build your own software and share the experience with other people so they can look at how you did it and work with their AIs to bring their own personalized custom software to life. Stay tuned.
      </p>
    </PostLayout>
  );
}