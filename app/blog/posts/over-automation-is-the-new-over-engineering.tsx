import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Over-Automation Is the New Over-Engineering",
  description: "Why the smartest AI strategy is knowing where to keep humans in the loop. From social posting friction to browser scraping, lessons from building a cross-platform content analytics system.",
  slug: "over-automation-is-the-new-over-engineering",
  headerImage: "/images/over-automation-is-the-new-over-engineering-hero.png",
  socialImage: "/images/over-automation-is-the-new-over-engineering-hero.png",
  publishedDate: "2026-04-08",
  modifiedDate: "2026-04-08",
  keywords: [
    "human in the loop AI",
    "over-automation",
    "AI content pipeline",
    "social media automation",
    "cross-platform analytics",
    "browser scraping with AI",
    "content marketing automation",
    "AI slop prevention"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/over-automation-is-the-new-over-engineering",
  topics: ["AI & Automation", "Business & Marketing"],
  tags: [
    "human-in-the-loop",
    "ai-automation-strategy",
    "content-pipeline",
    "social-media-analytics",
    "browser-scraping",
    "over-engineering",
    "cross-platform-tracking"
  ],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Friction That Taught Me Something</h2>

      <p className="mb-4 leading-relaxed">
        Yesterday I was updating my data collection functions for social campaign tracking, and I had an interesting experience. The last time I really did any major work on social data gathering was all the way back when I built the initial content publishing pipeline. What happened back then is I started automating social posting and immediately hit friction. X wanted a ton of money for API access. Facebook, even when you&apos;re talking about publishing for a business page, still traces back to your personal account, which wasn&apos;t going to work for clients. LinkedIn actually worked fine, but there was another technical issue: preview meta caching and timing. If you don&apos;t time your post right, you get a race condition. You could probably mitigate it with a simple timeout or some kind of test, but all these things stacked up.
      </p>

      <p className="mb-4 leading-relaxed">
        It was going to take a substantial amount of time to build a fully autonomous pipeline all the way to social posting. And ultimately, it just felt like social sharing was a good place to have a human in the loop.
      </p>

      <p className="mb-4 leading-relaxed">
        That decision turned out to be one of the smartest calls I&apos;ve made on this whole project. But I didn&apos;t fully understand why until yesterday.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why Is Over-Automation the New Over-Engineering?</h2>

      <p className="mb-4 leading-relaxed">
        A pattern is emerging. The optimal strategy for utilizing AI tools and agents seems to be: always look for where it makes the most sense to put a human in the loop. And it&apos;s a moving target. You need auditing, observability, and honestly some form of A/B testing with everything you automate and everywhere you choose to insert the human.
      </p>

      <p className="mb-4 leading-relaxed">
        The temptation is real. We&apos;ve all been so used to not having AI that we&apos;re obsessed with trying to automate everything now. We&apos;re automating things that shouldn&apos;t be automated. It wastes a lot of time and often produces diminishing returns or outright failure.
      </p>

      <p className="mb-4 leading-relaxed">
        There&apos;s this false dichotomy out there that&apos;s slowly being eroded. On one end, the doomers say AI is going to replace everybody, this might be an extinction event for humanity. On the other end, people say AI is slop, pure hype, none of it is real, anyone who uses it is a fraud. The deniers are getting eroded way faster than the doomers at this point, but what&apos;s actually happening is more interesting: the false dichotomy is producing false epiphanies. People who were deniers are overcorrecting toward doomer. There&apos;s this jerking, swinging motion where people just pivot wildly. This is actually a different perspective on something I talked about recently with the spaghettification of knowledge workers in the AI age, just viewed from the business owner side.
      </p>

      <p className="mb-4 leading-relaxed">
        So now you&apos;ve got business owners trying to over-automate things. And this is actually familiar territory because it&apos;s just a different form of a pattern engineers have seen forever: over-engineering. The classic contention between the founder and the engineer where the founder says &quot;this is how much money we&apos;ve got, if we don&apos;t ship something today, we&apos;re not gonna have a project anymore,&quot; and the engineer is trying to make everything future-proof and reusable and impressive to all the gatekeeper elitist programmers on GitHub.
      </p>

      <p className="mb-4 leading-relaxed">
        Only now, you don&apos;t have to be a coder to participate in the over-engineering. Now that there&apos;s vibe coding, now that there&apos;s Claude Code, now that AI is doing a lot of the heavy lifting in terms of engineering, the founders are over-engineering things. The entrepreneurs and business owners are over-engineering things.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Social Posting as a Security Gate</h2>

      <p className="mb-4 leading-relaxed">
        Back to the social posting decision. I asked myself: does automation make sense here? I got friction, and sometimes when things take longer than anticipated, you have to decide if the value is worth the effort. Sometimes it&apos;s a simple calculation: automate this, save X hours, multiply by frequency, get a dollar amount. But sometimes it&apos;s deeper than that. Sometimes the experience itself has a quality that&apos;s harder to quantify.
      </p>

      <p className="mb-4 leading-relaxed">
        When you&apos;re streamlining the publishing of blog content, you don&apos;t just need a human in the loop. The whole process needs to center around original thoughts and ideas from a human. The humanity needs to be sourced from human energy, human creativity. You can&apos;t just take the human out.
      </p>

      <p className="mb-4 leading-relaxed">
        Social sharing turned out to be the perfect checkpoint. It almost feels like automated test coverage. It almost feels like a security scan. Something you&apos;d put in a CI/CD pipeline to catch bugs before they hit production. Forcing the human in the loop on social sharing means you at least have to read the copy you&apos;re about to publish. You have to look at the hero image and the title. Then you&apos;re way more likely to flip over to the article itself and scan through it.
      </p>

      <p className="mb-4 leading-relaxed">
        What ended up happening from that workflow reminds me of managing finances. When you&apos;re in a desperate financial situation, you make bad decisions even when you don&apos;t have to. When you&apos;ve got plenty of money or credit or funding, you&apos;re way more likely to make wiser financial decisions. Something changes about your psychology when you don&apos;t have that level of urgency.
      </p>

      <p className="mb-4 leading-relaxed">
        Once I took 90-plus percent of the grunt work out of editing and publishing, even gathering information to validate or falsify my opinions, my cadence of publishing quality content went through the roof. Easing that urgency left me way more likely to do the human part that mattered. The friction of having to manually post to social platforms naturally led me to reading articles out loud before hitting publish. When I&apos;m getting ready to share something with real people, it forces me to imagine what they&apos;re going to think and how they&apos;re going to respond.
      </p>

      <p className="mb-4 leading-relaxed">
        Two forcing functions: the scrutiny of a community, and the easing of the urgency to get ideas out there. Those two factors led to a much better experience.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Scraping Instead of APIs</h2>

      <p className="mb-4 leading-relaxed">
        Rather than go back and revisit those API interfaces, I thought about it through the same lens of keeping the human in the loop and took a totally different approach to data gathering. And this totally doesn&apos;t scale. There are too many problems for it to really scale. But that&apos;s okay, and maybe this is a coachable moment.
      </p>

      <p className="mb-4 leading-relaxed">
        Rather than build API interfaces to fully automate things, what I did was log into social accounts on a machine where I have an AI agent running. It pulls up these websites in the browser and scrapes them. Me and Claude wrote all these different scraping tools. They&apos;ll need to be updated frequently, but we mapped out what data we want to get out of each site, where it is now, and where you should look for it.
      </p>

      <p className="mb-4 leading-relaxed">
        What it does is take a multi-hour session of clicking through consoles, gathering data, punching it into a spreadsheet, exporting CSV files, and map it out methodically and programmatically. It uses a library that lets you send command line commands to Google Chrome and scrape the browser content. It walks through different page navigations, scrapes content, clicks buttons, trying to get to the data and pull it out. I&apos;m right there if it runs into a turnstile or a captcha or a login wall or some kind of throttling. I&apos;m right there to nudge it along.
      </p>

      <p className="mb-4 leading-relaxed">
        A process that used to take hours of a human manually going through a list of data to gather on different posts is now programmatic. At this point it&apos;s pretty much fully automated, but you still want a human there because you&apos;re going to run into bot detection features, unexpected dialogues you need to silence, or they&apos;re going to change the design of the site and someone needs to be there to say &quot;they moved the button, let&apos;s adjust the script.&quot;
      </p>

      <p className="mb-4 leading-relaxed">
        It plugs into Telegram too. It alerts me that we need to do a daily scrape, I send a command back telling it whether I&apos;m ready, and it goes through all the automated scrapes. It can detect when it&apos;s having trouble moving forward with the playbook as written, and it can tell when it got nulls or weird data. So it&apos;ll message me: &quot;I&apos;m blocked, check your screen, there may be something we need to do.&quot; Or: &quot;We got bad data, we need to recalibrate.&quot; We have planned recalibration sessions built into the process. I used to work for a company whose whole product centered around scraping scratch-off ticket data to give people a probabilistic advantage, so this kind of work isn&apos;t new to me. But this is a more modern, AI-based approach.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How Does Slug-Based Tracking Connect Everything?</h2>

      <p className="mb-4 leading-relaxed">
        Here&apos;s probably the most valuable part of going with a scraping-based approach instead of an API-based approach: in order to fill in the gaps, we had to create mechanisms where we key on slug. Every social post has kind of a sister post on another platform, from another angle, but still talking about the same topic. It&apos;s repackaged in a way that&apos;s native for each platform. They&apos;re not only related to each other, they usually trace back to an original piece of content like a blog article. And now we&apos;re starting to do video too. There&apos;s usually a through line between all of it.
      </p>

      <p className="mb-4 leading-relaxed">
        What this forced me to do is identify a slug that can serve as the key across all platforms. This loosely normalized key that is the through line to all campaigns has given me deeper insight into conversion and performance across different platforms. Once I key the slug of a blog article, I can track that on different social platforms. When I&apos;m crawling the platform, I can find that post by slug. They may have a unique identifier appended to it, or it may be transformed, but overall that slug is findable. AI makes it easy to do regex matches and draw the connection.
      </p>

      <p className="mb-4 leading-relaxed">
        I can take that same slug and track Google Analytics data. That tells a deeper story about what all my content is doing. And then Upwork service pages get mapped onto the CyberWorld service pages using similar titles that produce slugs we can key on. Those Upwork services have their own analytical data. So while I&apos;m tracking that data, I can also track bidirectional conversions between the CyberWorld site and the Upwork pages.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">When Your AI Agent Calls You Out</h2>

      <p className="mb-4 leading-relaxed">
        This whole last push emerged out of Claude kicking me square in the balls, saying that we are generating AI slop in an automated loop that is going into a black hole and no one is engaging with it. I heard that and I was like, okay, I&apos;m going to take that as constructive, but I&apos;m going to push back too.
      </p>

      <p className="mb-4 leading-relaxed">
        First of all, I know we&apos;re not generating AI slop because I read these articles out loud before we publish them. They are my words. This is all stuff that I said into the microphone. It&apos;s been cleaned up, spell-checked, de-duped on the repetition, reorganized from my scatterbrained rambling into paragraphs. But it&apos;s not generating slop. These are things that I said, and we put very careful guardrails in place to make sure the pipeline wouldn&apos;t rip out my voice and generate a bunch of stuff I wouldn&apos;t say.
      </p>

      <p className="mb-4 leading-relaxed">
        Then I pushed back on the &quot;dead channel&quot; narrative. Yeah, we&apos;re not getting a lot of engagement on the Facebook platform directly, but I&apos;m looking at Vercel records and most of my blog traffic has a very clear backlink from facebook.com. X might not show a lot of x.com backlinks in Google Analytics, but my engagements are actually high on the X platform itself. Each channel is doing a different thing and we were having trouble connecting the dots.
      </p>

      <p className="mb-4 leading-relaxed">
        So I went and manually pulled up the platform data and showed how the real story wasn&apos;t what it looked like on the surface. And that&apos;s exactly where we landed: how to fill in the gaps and connect the dots. The slug-based cross-platform tracking, the scraping tools, the Telegram alerts, the daily standups that synthesize all of it together. It came from pushing back on a bad conclusion with better data. And it was really successful.
      </p>
    </PostLayout>
  );
}