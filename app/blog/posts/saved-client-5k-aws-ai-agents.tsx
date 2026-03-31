import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "I Saved a Client $5K/Year on AWS in 2 Hours",
  description: "How AI agents turned years of backlogged cloud optimization ideas into real savings on Redshift and Aurora — and what I'm doing with the headroom.",
  slug: "saved-client-5k-aws-ai-agents",
  headerImage: "/images/saved-client-5k-aws-ai-agents-hero.png",
  socialImage: "/images/saved-client-5k-aws-ai-agents-hero.png",
  publishedDate: "2026-03-31",
  modifiedDate: "2026-03-31",
  keywords: [
    "AWS cost optimization",
    "AI agents cloud infrastructure",
    "Redshift cost savings",
    "Aurora serverless optimization",
    "agentic AI DevOps",
    "cloud cleanup automation",
    "startup cloud costs",
    "AWS observability dashboard"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/saved-client-5k-aws-ai-agents",
  topics: ["Development & Tools", "AI & Automation", "Business & Marketing"],
  tags: [
    "aws-cost-optimization",
    "ai-agents",
    "cloud-infrastructure",
    "redshift",
    "aurora-serverless",
    "agentic-devops",
    "terraform",
    "observability"
  ],
  category: "Cloud Infrastructure",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Backlog That Never Made Sense to Touch</h2>

      <p className="mb-4 leading-relaxed">
        I just saved one of my clients over $5,000 a year on their AWS bill. In two hours. And it&apos;s all stuff I&apos;ve been thinking about doing for a long time but never had the confidence or the time to plan and execute on. I want to break down exactly how I did it, and why it took AI claws to make it possible.
      </p>

      <p className="mb-4 leading-relaxed">
        Quick note on that term: Andrej Karpathy has been referencing these proactive, autonomous AI agents as &quot;claws.&quot; These agentic teams that go out and find things to improve, work with you to plan and build, and just operate with initiative. That&apos;s how I think about my setup now.
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;ve had ideas for ways to optimize this client&apos;s AWS costs for a long time. Sometimes I&apos;ll make small incremental improvements, but the overall rising cloud costs end up making those unnoticeable. Like everything in the economy, cloud costs generally inflate over time. If you&apos;ve got a client consistently in the thousands on their AWS bill and you save them under $100, when you factor in their data lake growing, their traffic growing, cloud pricing creeping up — you&apos;re not really justifying your cost for the time it took. Mathematically, you&apos;re not earning your keep.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why Not Just Walk Away?</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;ve actually been tempted to bow out of this engagement altogether. But two things keep me on the fence. First, every once in a while there is a breakthrough moment. You&apos;re chipping away at the system, and eventually you find something that collectively earns your keep. Those dozens of dollars saved per month do add up to hundreds over a year. You can make the case that without you there, it would be a lot worse. But then you factor in your own cost, and it offsets the savings to some degree.
      </p>

      <p className="mb-4 leading-relaxed">
        Second, there are response events. Spikes you have to address. Availability issues. The client also likes having me around because when they need a big migration, I&apos;m there. A lot of what we&apos;ve been doing is moving their front end out of ECS and into Vercel, which I&apos;ve covered in detail before. If you&apos;re running a standard public-facing site, it really is usually best to outsource your front-end infrastructure to Vercel. The only serious case for staying on AWS is at truly massive scale, like millions of daily users, where rolling your own edge caches and image optimization starts to pencil out. At thousands of users, Vercel&apos;s economy of scale is still a cost savings. Even at hundreds of thousands, they can handle it. It&apos;s just that at some point their pricing funnels you away, strategically, so they can better service startups, bootstrapped founders, cost-conscious teams. The companies with hundreds of thousands or millions of visitors should be more than capable of hiring an engineer to deploy on a self-managed cloud stack.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Redshift Problem: Paying 24/7 for a 5-Minute Job</h2>

      <p className="mb-4 leading-relaxed">
        One of the first things I did was look at their Redshift service. They have this custom data collection and analysis engine that ingests data, performs some analysis, and outputs something usable for the customer. I looked at the resource metrics on that thing and you could set your watch to the precision of these little spikes. It was so obvious what was happening. A script was firing off on a schedule, once a day and then once a month. We had records going back years showing this thing has never taken more than five minutes to run. I found the EventBridge scheduler task that fires it off at a specific time. And we were paying for that cluster to be available 24/7.
      </p>

      <p className="mb-4 leading-relaxed">
        I always thought it would be a huge cost savings to automate that thing to scale in and out. But first I had to coordinate with the team, who are notoriously hard to reach. Everything is poorly documented. The people I took over from did not leave good documentation on the infrastructure.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Happens When the Original Builders Are Gone?</h2>

      <p className="mb-4 leading-relaxed">
        This is actually a really common situation and it touches on a lot of things that are changing right now. The team who built this part of the system was an outside contractor who specializes in this kind of thing. They come in, get to know your team just enough to stand a viable thing up, your budget is limited, everybody&apos;s not always at the meetings, and then they go off. It seems fine until it&apos;s not. Something goes wrong and you&apos;ve got to hire another contractor because those people have moved on. But you&apos;ve got this critical piece of technology your organization depends on.
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;m the person who comes in after the fact, who happens to know a lot about cloud and has a background in software engineering. I&apos;ve met other engineers who hit this same wall. Even with the most probing investigative mentality, you keep trying to find new people to get in touch with. And with a company like this, it&apos;s not an enterprise where most people are still around. A lot of these people have moved on permanently. They&apos;re not in contact. There may even be bad blood. You end up at dead ends.
      </p>

      <p className="mb-4 leading-relaxed">
        So what do you do when you sense potential for cost optimization but it&apos;s pulling teeth to get people to respond? When you can&apos;t be sure there isn&apos;t some internal person somewhere who uses this tool sometimes, in a very awkward time zone, and you might be sound asleep for hours before you get the notification?
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">CloudTrail, Logs, and Building Confidence</h2>

      <p className="mb-4 leading-relaxed">
        I want to be clear that none of this is groundbreaking innovation. I&apos;ve always known about CloudTrail. I often use CloudTrail. This is where I think most of the wins are going to come from with AI. If they stopped improving the models right now, reasonably savvy IT professionals and engineers could take the current level of intelligence and there are so many clever tools and systems you can stitch together. The intelligence is increasing so fast that we can&apos;t even keep up with what&apos;s possible at the current level. And then by the time you&apos;ve created tools around that level, the model gets smarter and that skill you just developed is actually baked into the model now. That&apos;s how fast things are moving.
      </p>

      <p className="mb-4 leading-relaxed">
        It&apos;s a bunch of obvious things. Let&apos;s start capturing the resource metric data and storing it somewhere. Let&apos;s start capturing CloudTrail events. Let&apos;s start capturing request logs. Between resource metrics, request logs, CloudTrail, and then comparing that with git history, I can say with confidence that nothing is happening other than that three-to-five-minute job once a day. The cluster just sits there for 23 hours doing absolutely nothing and we&apos;re paying for it.
      </p>

      <p className="mb-4 leading-relaxed">
        So I automated a script that shuts it off after the spike and fires it back up 30 minutes before the next one. That&apos;s hundreds of dollars in savings on their Redshift bill alone.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Read Replica Nobody Was Reading</h2>

      <p className="mb-4 leading-relaxed">
        Same approach with the database. CloudTrail, query logs, request logs. There&apos;s a read replica that&apos;s just not being used at all. The queries probably should be split between reader and writer, but honestly all it is is a GraphQL backend running locally on the network. It&apos;s not something that needs to scale. It&apos;s serverless Aurora, so Amazon already owns the failover responsibility. The only purpose for a read replica in this situation would be if you&apos;re periodically performing heavy data read operations for reporting or data science, and anything like that is happening in Redshift anyway. So I shut the replica off.
      </p>

      <p className="mb-4 leading-relaxed">
        Between Redshift scheduling and the Aurora replica, in about two to three hours, I managed to save them over $5,000 a year.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Reinvesting the Savings Instead of Just Being Cheap</h2>

      <p className="mb-4 leading-relaxed">
        What I&apos;ve decided to do is take that extra headroom and instead of just trying to be as cheap as possible, look at what they&apos;re doing and understand the data science portion that&apos;s probably been underserviced. The people who stood some of this stuff up have not been involved in the organization in years. What were they doing years ago that I can quickly and effectively learn enough to improve?
      </p>

      <p className="mb-4 leading-relaxed">
        Between my rapid education track, which is AI-supplemented and guided, plugged into the community for authority signals and validated sources, plus building custom skills based on the exact system I&apos;m working on, it&apos;s never been more possible for me to revive these projects that were taken to a viable state and then abandoned in terms of development and maintenance. I&apos;m taking the money I&apos;m saving and investing it back into their system.
      </p>

      <p className="mb-4 leading-relaxed">
        The practical justification: we may actually be able to replace some of what they&apos;re doing with an AI-powered agentic team running in a simple ECS task. We already have an ECS service powering a lot of web services, so what&apos;s one more task? This data science pipeline was built before anyone was using ChatGPT. What if they&apos;re running heavy Python scripts on expensive AWS infrastructure that can actually be done better with modern AI models for almost no money?
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Fresh Terraform, an Observability Dashboard, and What Comes Next</h2>

      <p className="mb-4 leading-relaxed">
        Their Terraform configs were horribly outdated, running an older version locked into a Docker build for long-term support. Smart at the time, but it made it real easy to never update anything. It was so far behind that it just made sense to start a new repository and build out fresh modules with the latest version of Terraform for everything I touched. Before, I&apos;d put this work down for a month or two because I&apos;m busy with other client work and don&apos;t want to be padding hours. Now I can point my agents at it and actually make progress.
      </p>

      <p className="mb-4 leading-relaxed">
        I also built an observability dashboard so that all of the things we&apos;re tracking are in one convenient place. That was a non-starter before. How was I going to justify 10 or 20 hours? How often would it be used? And now, because you can just do things, I was collecting all this data and said, &quot;Hey, while we&apos;re at it, why don&apos;t we present it in a graphical dashboard?&quot; Five minutes later, done. Really good. Really useful. Super quick and simple and easy to update.
      </p>

      <p className="mb-4 leading-relaxed">
        I should probably firm this whole approach up into a repeatable tool. In every service I touched, it&apos;s the same pattern: put a CloudTrail on it, make sure logging is good, give it a month, come back and look at resource metrics, request logs, CloudTrail events. Find out who&apos;s accessing what and when. This also has powerful implications for security. If you can identify when people are using what, you can use that to inform your IAM roles and limit access to the hours when they actually need it. Principle of least privilege. A lot of compliance requirements are built around gating resources to certain times of the day.
      </p>

      <p className="mb-4 leading-relaxed">
        The point is, now startups can do this. Bootstrapped three-person teams can hire me and my agents to come in and clean up their AWS positioning. I can now do things that only the top fraction of cloud architects were capable of doing before. And it&apos;s just stringing simple principles together with confidence. Ideas just spring forth now. Anything you previously thought about doing but couldn&apos;t justify, it&apos;s time to reevaluate, because you might be able to utter it into existence with your voice. Which is crazy to say. But that&apos;s where we are.
      </p>
    </PostLayout>
  );
}