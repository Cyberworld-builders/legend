import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "I Built a Mobile App in an Hour and It Changed Everything",
  description: "How Claude Code turned a terminal emulator idea into a native app on my phone in under 60 minutes — and why building software for yourself is the future.",
  slug: "built-mobile-app-in-an-hour",
  headerImage: "/images/built-mobile-app-in-an-hour-hero.png",
  socialImage: "/images/built-mobile-app-in-an-hour-hero.png",
  publishedDate: "2026-04-13",
  modifiedDate: "2026-04-13",
  keywords: [
    "claude code mobile app",
    "build your own app with ai",
    "native app development ai",
    "personal software engineering",
    "ssh terminal mobile app",
    "ai coding assistant",
    "custom software development",
    "future of software"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/built-mobile-app-in-an-hour",
  topics: ["Development & Tools", "AI & Automation"],
  tags: [
    "claude-code",
    "mobile-development",
    "ai-assisted-coding",
    "personal-software",
    "native-app-development",
    "zero-trust-security",
    "future-of-software"
  ],
  category: "Development & Tools",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Every Week Feels Like Legend of Zelda</h2>

      <p className="mb-4 leading-relaxed">
        This may be the last voice memo I record with the out-of-the-box Voice Memos app. Every week lately, I&apos;m unlocking multiple new tools and capabilities that open up places I couldn&apos;t access before. It honestly feels like Legend of Zelda. You find a new weapon, you equip it, and suddenly there&apos;s a whole section of the map you can explore.
      </p>

      <p className="mb-4 leading-relaxed">
        Yesterday I built a mobile app. Built it in about an hour. Now, it&apos;s only fair to explain that this is not something I plan on releasing to the App Store. The process of submitting an app to the store is a real pain in the ass. It&apos;s time-consuming, you usually have to go back and make revisions, and then there are all the permission transparency requirements, disclosures, all that overhead. Publishing an app to the store is a big deal compared to just building a web app and putting it out on the web. But I don&apos;t have to worry about any of that because I&apos;m just using this for me.
      </p>

      <p className="mb-4 leading-relaxed">
        Here&apos;s what&apos;s wild about this. Someone like me can have an idea, sit down, think it through, use Claude Code to bring it to life in under an hour, and then have it on my phone, actually using it. That&apos;s unreal. Native development is one of the areas where I have the least experience. The absolute least. The only time I was on a team that had a mobile app, I was never hands-on with any real contributions to the mobile codebase. I never used Xcode. I never used Swift or Kotlin. I&apos;ve had little hobby projects barely beyond Hello World. I built a geolocation proof of concept in Android Studio once. I built a little ARKit plane detection test on iPhone. You can find content where I was playing around with these things. They were interesting projects that I wish had become more than hobbies.
      </p>

      <p className="mb-4 leading-relaxed">
        But that&apos;s exactly what this unlocks. Now that I can just build apps, I can go back and do the Revenant Hollow stuff, the Ghost Hunter app, all the mixed reality ideas I had. Instead of spending an entire weekend and barely coming out with an app that can detect a plane and paint virtual spider webs onto it badly, I can actually rock and roll with this stuff.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Does the CyberWorld App Actually Do?</h2>

      <p className="mb-4 leading-relaxed">
        I don&apos;t know what&apos;s more powerful: the idea of building a mobile app or the idea that I now have Claude Code on my phone in an everything app that&apos;s going to have proof of concepts for everything I want to do on a native device.
      </p>

      <p className="mb-4 leading-relaxed">
        The first piece of functionality is actually dead simple. It&apos;s a terminal emulator that can access my AI operating system machine over SSH. That&apos;s it. Part of what makes it work is the VPN. I get to SSH directly into a machine on my LAN. And since I&apos;ve got that Keycloak server, I&apos;ll probably use that for auth so I can maintain zero trust positioning on my network. The VPN is powerful, but zero trust is everything.
      </p>

      <p className="mb-4 leading-relaxed">
        The combination of having everything protected behind a VPN with actual zero trust and granular access control policies through Keycloak, none of it exposed to the web. You don&apos;t even see it unless you&apos;re on my LAN or my VPN. And then once you do see it, you still need authentication. I can put MFA on top of that.
      </p>

      <p className="mb-4 leading-relaxed">
        After the terminal, I added a voice recording feature. Then a document scanner for all my old notebook writings and sketches that I want digitized, processed, analyzed, and made part of the knowledge base. And it just goes on and on from there.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why Not Just Use Telegram?</h2>

      <p className="mb-4 leading-relaxed">
        I was having really great conversations on Telegram with my AI agent, Gus. I&apos;d tell him to go do things and he&apos;d immediately get hung up on permissions. I started from an extremely secure, sandboxed setup with limited privileges, hardened with a lot of restrictions. And even then, part of me was thinking there&apos;s some blind spot, some black box feature that&apos;s vulnerable to prompt injection that we just haven&apos;t seen yet.
      </p>

      <p className="mb-4 leading-relaxed">
        I felt uncomfortable adding new capabilities to the Telegram bot. So there were a lot of limitations. I&apos;d be chatting with Gus about things I wanted to do, and my execution couldn&apos;t keep up with my ideas, despite the fact that a lot of these ideas didn&apos;t need me closely in the loop. Sometimes you&apos;ve got an idea that&apos;s really complex, has a lot of moving parts, and needs a human engineer right there because it&apos;ll go off the rails. But there&apos;s a growing number of ideas that are just wiring up basic things, problems that have been solved for a long time, and you&apos;re chaining them together in a novel way that&apos;s useful for you. As long as you can clearly specify how to connect the different modules, you don&apos;t actually have to look at the code anymore.
      </p>

      <p className="mb-4 leading-relaxed">
        I started noticing how often I had Cursor open with a terminal running Claude Code, and an hour would go by without me reviewing a single line of code. I&apos;d build large amounts of functionality across long sessions, and the first time I actually looked at the code was on the pull request in GitHub. Not even in my IDE.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Laptop Test That Made It Obvious</h2>

      <p className="mb-4 leading-relaxed">
        I started carrying my laptop around so I could drop what I was doing, open it up, connect through WireGuard to my VPN, SSH in with Cursor, and engage the Claude terminal directly to get unblocked. Then I&apos;d go back to chatting on Telegram. That was the final tell. When you&apos;re out and you hit a blocker on the Telegram bot, and you just need to make this one change, or you want to kick off a project, pulling out a whole laptop is too much friction.
      </p>

      <p className="mb-4 leading-relaxed">
        I already had WireGuard on my phone. What if I just built a native app with a terminal emulator?
      </p>

      <p className="mb-4 leading-relaxed">
        You might ask, why not just use the Claude app? I tried wiring up the Claude app to my AI operating system, and the friction between Claude and third-party harnesses makes it really difficult to get the full experience. I was obviously not talking to Gus. And that&apos;s the whole thing. Gus is my personal assistant agent that orchestrates my entire operating system. He has the context of everything. He&apos;s my right-hand man. When I used the Claude app, even if Claude is 100% the identical intelligence as Gus, Claude&apos;s not Gus. The memory system, the skill stack, the prompt context. It&apos;s so obviously not the same. It&apos;s like the B team showed up.
      </p>

      <p className="mb-4 leading-relaxed">
        Being able to connect through a VPN, SSH in, and have a Claude Code terminal with the full context of Gus in my pocket, in a native app. That&apos;s unbelievably powerful.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Software Is About to Work for You</h2>

      <p className="mb-4 leading-relaxed">
        This is part of an ongoing thread I keep coming back to: what does software look like in the future? We&apos;re getting a peek into it, and it&apos;s becoming more and more clear. Everyone is going to have their own engineer in their pocket. When you need a thing, it&apos;s going to help you build the software you need for your specific case. No more shipping software to stores where everyone has to train on what&apos;s available, accept features they don&apos;t care about, and live with things that don&apos;t quite work the way they want.
      </p>

      <p className="mb-4 leading-relaxed">
        Software is going to finally prioritize the user and give them the best experience for them as an individual. No more training on how to use other people&apos;s software, software that&apos;s mainstream, software that&apos;s best for the masses. Everyone&apos;s going to have personalized software.
      </p>

      <p className="mb-4 leading-relaxed">
        Those of us who are software engineers or technologists with years of experience, we&apos;re the early adopters. We get the sneak preview. And I just got one of the most powerful ones. I can code while driving using voice to text. Every blocker I had on Telegram, every time I was able to get ideas out but not execute on them, all those ideas piling up with no execution. I now get execution on them.
      </p>

      <p className="mb-4 leading-relaxed">
        The voice memos app was almost perfect, but any friction at all, you can just will into existence with your voice. So why not tear down every bit of friction and make software for you? I think it&apos;s going to be more powerful to build your own software and share the experience with others so they can look at how you did it and work with their AIs to bring their personalized, custom software to life for their situation.
      </p>
    </PostLayout>
  );
}