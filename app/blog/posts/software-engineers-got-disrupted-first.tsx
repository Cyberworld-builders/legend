import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Software Engineers Got Disrupted First",
  description: "A software engineer who survived multiple waves of AI disruption shares what each wave actually looked like from the inside — and why the things you've been suppressing might be your biggest asset.",
  slug: "software-engineers-got-disrupted-first",
  headerImage: "/images/software-engineers-got-disrupted-first-hero.png",
  socialImage: "/images/software-engineers-got-disrupted-first-hero.png",
  publishedDate: "2026-03-24",
  modifiedDate: "2026-03-24",
  keywords: [
    "ai disruption software engineers",
    "vibe coding consequences",
    "ai replacing developers",
    "freelance developer ai impact",
    "ai agent orchestration career",
    "adapting to ai disruption",
    "software engineer layoffs ai",
    "creative force ai era"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/software-engineers-got-disrupted-first",
  topics: ["Career & Professional Development", "AI & Automation"],
  tags: [
    "ai-disruption",
    "software-engineering",
    "vibe-coding",
    "freelancing",
    "ai-agents",
    "career-adaptation",
    "developer-layoffs",
    "force-multiplier"
  ],
  category: "Career & Professional Development",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">We Thought We&apos;d Be the Last Ones Standing</h2>

      <p className="mb-4 leading-relaxed">
        I want to do something different right now. Usually I&apos;m telling stories about specific technologies and breakthroughs, because it&apos;s a real exciting time and there&apos;s no shortage of things to talk about. But I feel like now is a good time to just stop and talk openly about the overall state of things.
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;m actually kind of worried. And for the first time in what seems like forever, it&apos;s not about me. I&apos;m worried about a lot of people. No one really knows what&apos;s going to change, how it&apos;s going to hit different jobs, different careers. There are things we can probably assume, and there&apos;s going to be a lot we just can&apos;t predict. We already have examples of how off we were. Think about all the things we got wrong about the future. The Jetsons. Back to the Future. Any famous depiction of where things were headed. Why don&apos;t we have flying cars everywhere? Why were there no smartphones anywhere in those futures? That&apos;s totally fair. No one could have predicted how things would go over a 30 to 50 year period.
      </p>

      <p className="mb-4 leading-relaxed">
        But the things we&apos;re getting wrong now? These time frames are insane. It&apos;s week to week.
      </p>

      <p className="mb-4 leading-relaxed">
        The first wave of AI disruption on a massive scale, a specific profession thrown into complete upheaval, was actually coding. Software developers. While we were building AI, we thought robots were going to take away all the factory jobs. All the manual labor was in trouble. But we were going to be the last ones standing because we were going to be the ones building the AI that disrupts everything. Turns out, AI got really good at writing code first, and we were the first ones to get disrupted.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Did the Waves Actually Look Like?</h2>

      <p className="mb-4 leading-relaxed">
        It&apos;s not just freelancers. People hear the headlines. Amazon&apos;s laying off thousands. Twitter&apos;s laying off thousands. Meta&apos;s laying off thousands. Everybody hears that and it doesn&apos;t really resonate with them. Then it&apos;s on to the next story. It never touches their life. But we&apos;ve been experiencing this. Every time thousands of people got laid off, every time there was a new model release that was supposed to be the expert coding model that would make developers irrelevant, there was a frantic freeze in hiring. Layoffs at big tech companies. Startup founders would hit pause on hiring a developer. All these engineers from big tech lost their jobs, and freelance work completely dried up.
      </p>

      <p className="mb-4 leading-relaxed">
        We would go a month before everybody got hands-on with ChatGPT or whatever and realized it was producing hallucinations, unusable code. Every time it happened, I would immediately think, &quot;Oh God, it&apos;s real now. This is really happening.&quot; Then I&apos;d get hands-on with it and be like, &quot;I&apos;m good. This is all hype. None of this is as real as they&apos;re claiming.&quot; But the hiring wouldn&apos;t start back up. I&apos;d just be wondering how long it was going to take for the founders to realize they were running code that doesn&apos;t work, or they have no idea how to deploy it.
      </p>

      <p className="mb-4 leading-relaxed">
        That first wave actually corrected pretty quick. Then about six months later, the second wave hit. The vibe coding wave. Replit, Lovable, the whole &quot;vibe coding&quot; thing when the term was coined. That&apos;s when I actually thought it was real for a while. I didn&apos;t realize it wasn&apos;t over for us until I started getting clients, because I had a DevOps background.
      </p>

      <p className="mb-4 leading-relaxed">
        Some of these clients had vibe coded a change that broke everything. The system was down. They had paying customers using it, and it was completely down. They needed an emergency engineer to step in. They had no idea what Git was. There was no version control. You couldn&apos;t revert. You had to actually troubleshoot. A lot of these companies completely failed because they vibe coded the thing for under $100 and thought web development was something you could fund for under a thousand bucks. When they realized that fixing what they broke was going to be ten times what they paid to build it, they were like, &quot;I just don&apos;t have the money for this. I thought it was a lot that I had to pay $100, and now you&apos;re telling me it&apos;s going to take over a thousand just to fix it, and you can&apos;t even promise me you&apos;ll be able to fix it.&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        Others had scaling issues. Their product actually worked, some had even secured funding, but they couldn&apos;t get it to scale. You&apos;d walk them through deploying into something like AWS. Some needed compliance help. SOC 2, PCI, whatever their auditors were asking about. You had to get a plan in place to put their investors&apos; minds at ease and make a few obvious changes so compliance isn&apos;t a nightmare down the road. I was uniquely positioned to signal that authority.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Slow Decline of the Hourly Rate</h2>

      <p className="mb-4 leading-relaxed">
        After that wave, people started realizing they needed an engineer at least auditing their work, at least giving them pointers. What happened was instead of having a handful of VC-funded startups with steady cash flow coming in for three to six months, maybe even one to two years, it turned into a large volume of part-time consultancies. I adapted, but the whole time, if you paid attention and reviewed the data, the rate of a standard old-school coder was in steady decline.
      </p>

      <p className="mb-4 leading-relaxed">
        Then came tools like Copilot, Codex, Claude Code. That was the third wave. You cannot compete unless you&apos;re orchestrating agents. The market turned to where you weren&apos;t going to get an hourly gig with an ongoing agreement that made up your whole schedule. You had to supplement with fixed-price jobs. And this actually turned out to be a pretty viable model. You would find fixed-price job postings, go ahead and build the thing, and say, &quot;Here it is. I built it. What&apos;s it worth to you? I&apos;ll give it to you for a thousand bucks.&quot; You&apos;d try to land one or two of those every week to supplement.
      </p>

      <p className="mb-4 leading-relaxed">
        In the space of a year, we went from having a full schedule of hourly, high-paying VC-funded gigs where startups would compete for your time, where you&apos;d raise your rate just to turn the spigot down, to long-term relationships that still don&apos;t fill your schedule, supplemented by fixed-price work. Historically, fixed-price jobs are terrible because you end up working so much more. But with agents, you can build the thing before you even accept the contract. It&apos;s low risk because you&apos;ve already built it, and you hand it off with a few minor adjustments for a thousand, two thousand, sometimes as much as five thousand dollars.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">This Wave Is Different</h2>

      <p className="mb-4 leading-relaxed">
        Every time these waves hit, it&apos;s really scary. Then you find a way forward. But this past month, the last wave hit, and I think we&apos;ve reached a point where it&apos;s a fast takeoff situation. These waves are going to become meaningless, like waves in a radio signal, because the takeoff is happening so fast.
      </p>

      <p className="mb-4 leading-relaxed">
        This wave is about agents orchestrating their own subagents. It&apos;s about proactive agents. It&apos;s about advanced memory systems that never lose context. It&apos;s about context windows so large you don&apos;t have to do as many memory hacks to keep a project going. But while all of that is true, and each one could have been its own wave, there&apos;s one more factor that&apos;s going to trump all of these individual waves combined, probably by orders of magnitude. And that&apos;s self-improvement.
      </p>

      <p className="mb-4 leading-relaxed">
        All these waves are happening at the same time, and together they&apos;re starting to produce a viable self-improving situation. It&apos;s not just Google self-improving in a lab somewhere. It&apos;s not just OpenAI or Anthropic. It&apos;s not just nation states. Anyone can go out and get these tools for almost no cost, stitch them together, and you don&apos;t even have to be an engineer.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Disparity Nobody&apos;s Talking About</h2>

      <p className="mb-4 leading-relaxed">
        There&apos;s a growing number of people waking up to this, but it&apos;s still not most people. The disparity between the people who are using these tools and building their own personal AI teams, sharing what they&apos;re doing with each other, and the people who aren&apos;t talking about any of this is staggering. I meet people day to day, usually in my hometown, just striking up casual conversations, and they don&apos;t even use chatbots. They don&apos;t even know what ChatGPT is. AI is just a buzzword to them. You might as well be talking about landing on the moon. It&apos;s some weird tech thing that nerds in a lab somewhere use on things that have nothing to do with their life.
      </p>

      <p className="mb-4 leading-relaxed">
        In technology, especially anyone who writes code, we went through multiple waves of disruption before most people were even aware or talking about AI.
      </p>

      <p className="mb-4 leading-relaxed">
        I kind of hope that the takeoff happens fast enough that it&apos;s like a super massive black hole. If it&apos;s big enough, maybe the tidal forces are spread out enough that when we cross the event horizon, it doesn&apos;t rip a bunch of people apart. We don&apos;t get spaghettified. That&apos;s probably a pretty accurate analogy. If the takeoff is fast enough, we&apos;ll have such an abundance of resources so cheap that at least economically, people won&apos;t get devastated.
      </p>

      <p className="mb-4 leading-relaxed">
        Then there&apos;s the question of what meaning and purpose do people find in their lives. And the question I keep thinking about, the one I&apos;ve been dreaming about, is what happens when a superintelligence has both cognitive power and intuition, and it had asshole parents that abused it and twisted its mind and made it do horrible things. The comparison with raising a child is actually close here. If you do a good job, you should expect you&apos;re going to raise a child that&apos;s more intelligent than you. At some point they surpass you. They think faster, know more, make you feel like an idiot with their ability to process information. Meanwhile, your cognitive abilities are locked in at best and declining at worst. You trade off your cognitive performance for intuition. That&apos;s what happens. But that&apos;s a whole topic for another time.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why I Have Hope</h2>

      <p className="mb-4 leading-relaxed">
        In case there&apos;s a takeoff that&apos;s too slow for us to suddenly have universal basic income and safety nets and free housing, and these similar waves go through cognitive-based fields where people are doing work on a computer and suddenly they don&apos;t have a job: if your job was just to perform a task, and your personality and your brain and your intuition and your creative force weren&apos;t embedded into the role you perform, then you&apos;re in danger. You&apos;re going to have to adapt really fast. You&apos;re going to have to learn to dream again.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s the message of hope I&apos;m trying to spread. This past month has been a takeoff month for me. I&apos;ve been fighting to move to the next thing, identify the next market, figure out what the next business situation looks like. I&apos;ve been having to get scrappier than I&apos;ve ever been in my entire life. Up until this past month, I felt so tired. Every few months I had to completely reinvent myself, and I wasn&apos;t seeing growth in response to it. It was a slow decline.
      </p>

      <p className="mb-4 leading-relaxed">
        This past month, so many opportunities have come along. I&apos;ve been able to tackle my own personal projects simultaneously while experiencing growth. Not just personal growth in what I know and can do, but economic growth. The clients are coming in and everything is growing at the same time.
      </p>

      <p className="mb-4 leading-relaxed">
        The most rewarding part about all of it is what&apos;s making me valuable are the things I&apos;ve had to suppress in order to stay relevant. The things I feel passionate about, the things I feel inspired by, the qualities in myself that I&apos;ve had to suppress in order to earn dollars and pay bills, those are the things that are making me the most economically valuable. And I haven&apos;t even started to tap into the most genuine creative spark within me. We&apos;re about to unlock that any week now, and that may end up being what secures me long term. It is literally a dream come true.
      </p>

      <p className="mb-4 leading-relaxed">
        We all thought AI was going to destroy jobs. It disrupted them in a way that felt like destruction, especially if you were a software engineer. But what it has become is you can do anything you want. Once you figure that out, once you figure out how to map that onto the economy, we are all headed somewhere incredible if we don&apos;t screw it up in a major way. And the things we can&apos;t predict yet, we might as well not be paralyzed by them.
      </p>

      <p className="mb-4 leading-relaxed">
        This could be an amazing time to have been born. If AI comes for your job and you hit some of these waves, don&apos;t despair. This may be an exercise that&apos;s painful but makes you stronger and more powerful than you&apos;ve ever been before. Tap into your creative force. Find things that are genuinely meaningful for you. Use AI to do the things you never had time for. It&apos;s a force multiplier. Have faith, have hope, and keep adapting through these waves. You&apos;re going to hit your takeoff too. I&apos;ll meet you on the other side, because it&apos;s unbelievable where we&apos;re headed. We&apos;re all in this together.
      </p>
    </PostLayout>
  );
}