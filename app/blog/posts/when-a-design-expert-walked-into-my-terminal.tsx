import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "When a Design Expert Walked Into My Terminal",
  description: "How loading a single skill file turned a coding agent into a battle-tested design consultant, and why I stopped reviewing AI-generated code line by line.",
  slug: "when-a-design-expert-walked-into-my-terminal",
  publishedDate: "2026-03-18",
  modifiedDate: "2026-03-18",
  keywords: [
    "ai coding agents",
    "claude code skills",
    "ai agent orchestration",
    "playwright testing ai",
    "ai code review workflow",
    "multi-agent development",
    "ai design specialist",
    "automated test coverage"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/when-a-design-expert-walked-into-my-terminal",
  topics: ["AI & Automation", "Development & Tools", "Business & Marketing"],
  tags: [
    "ai-agent-orchestration",
    "claude-code",
    "automated-testing",
    "playwright",
    "ai-code-review",
    "multi-agent-pipelines",
    "digital-marketing-automation",
    "saas-development"
  ],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">From Cursor to the Command Line</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;ve been doing client work for a while now, and what started as traditional custom SaaS projects has been completely transformed. The catalyst was discovering what happens when you automate AI agents and subagents, and everything that&apos;s exploded with OpenClaw and Claude Code. This arms race to build proactive personal assistants that orchestrate teams of subagents has changed how I build software at a fundamental level.
      </p>

      <p className="mb-4 leading-relaxed">
        Not long ago, for nearly every client, my workflow was me and Cursor. I&apos;d let Cursor use Composer, flip between models based on what made sense for the task, and it felt really comfortable. It was all IDE-based, had a terminal right there, and I could flip back and forth easily. But it funneled me toward reviewing code in a traditional VS Code style, which was familiar. Looking back, that was a comfort thing. It made me more comfortable with AI to feel like I had the ability to review everything in a way I already knew.
      </p>

      <p className="mb-4 leading-relaxed">
        I remember ThePrimeagen talking about forcing himself to use Neovim for two weeks and then never going back to an IDE. I was totally going to do that but never got around to it. Too busy, too steep a learning curve. I did start using Vim over Nano on servers just to get familiar with the commands. The reason I bring this up is because it feels like if I&apos;d made that switch, I would have been a faster adopter of Claude Code.
      </p>

      <p className="mb-4 leading-relaxed">
        And look, it&apos;s weird to say, because I&apos;m a Linux guy. I&apos;ve been managing servers for years. I had an Ubuntu workstation for several years. I work with Docker. I&apos;m very comfortable in a terminal. All day, every day, I&apos;m shooting commands in terminals. But when it came to code, I was always in an IDE. Most people are. Though it does seem like some of the heaviest hitters just use the most basic text editor. A lot of the most elite engineers I&apos;ve talked to just use Vim or Notepad or Emacs. It&apos;s kind of wild.
      </p>

      <p className="mb-4 leading-relaxed">
        Now that I&apos;ve gotten a taste of Claude Code, I still keep Cursor around, but the Cursor agent is more of a meta tool. If Claude Code is getting into trouble and I just need some generic commands or a quick web search that doesn&apos;t need deep context, it&apos;s nice to have that fallback. I also keep a <code className="bg-gray-800 px-1 rounded text-sm">today.md</code> file open and sometimes use it to marinate in my thought process while I type out my next prompt. Sometimes typing into the command line feels rushed, like there&apos;s this urgency to think faster, move faster. There&apos;s a lot of power in just stopping time and letting your thoughts manifest.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why Did I Stop Reviewing Code Line by Line?</h2>

      <p className="mb-4 leading-relaxed">
        This feels like a weird thing to admit, almost like I should be ashamed, but I&apos;m going to be honest. My reviews have moved almost entirely to GitHub. I used to feel the need to review every line of code as the AI generated it. A lot of people would call what I do now YOLO, but I think that&apos;s the wrong term. If I were putting the agent in dangerous mode on the main branch with the ability to push and deploy, that&apos;s YOLO. But if I put it on its own branch and make sure every deployment goes through a pull request, all I&apos;ve done is relocate the review process.
      </p>

      <p className="mb-4 leading-relaxed">
        Think about what&apos;s changed because of AI coding. I am 10 times, maybe 100 times more likely to do a refactor now. I&apos;m 10 times more likely to rebuild an entire system. So imagine how often I build a complete feature, an entire module, and then scrap it or completely redo it. Now think about reviewing all that code inline as it&apos;s being written. Think about how many times I&apos;d be reviewing code that&apos;s going to get deleted. Or how many times I&apos;d be catching errors that the automated test suite would catch anyway.
      </p>

      <p className="mb-4 leading-relaxed">
        You could call it YOLO, except that I review it in the pull request. I just religiously use pull requests for every single deployment. And you should already be doing this anyway.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Test Suite That Paid for Itself in 15 Minutes</h2>

      <p className="mb-4 leading-relaxed">
        I was working on a custom SaaS client&apos;s product. Tight budget, most of the code already written. I had good test coverage on the back end, but there weren&apos;t a lot of end-to-end front-end tests. I already had the Playwright suite in place, just not enough tests using it.
      </p>

      <p className="mb-4 leading-relaxed">
        I was chatting with my Claude agent, and it told me to go look at the reports and tell it what problems I found. I started to type them all out, then I stopped and said, actually, why don&apos;t you just go build a full, thorough set of Playwright tests to cover the front end. Write tests for everything obvious, run them, and let&apos;s see what shakes out. I just admitted it: I&apos;m slow at this. I don&apos;t mind doing it, but I&apos;m slow. And I think a lot of this stuff is obvious enough that if you write tests, you&apos;ll catch it.
      </p>

      <p className="mb-4 leading-relaxed">
        I was right. It found a ton of test cases, wrote tests for all of them, and we ran the suite. About 90% of the issues I&apos;d seen visually just cleared up. I had this small remaining list of things that really do need human eyes, the stuff that&apos;s hard to see without actually having photons hitting retinas. We got our test suite, and I cut down my QA time drastically.
      </p>

      <p className="mb-4 leading-relaxed">
        Then later, I needed to upgrade the React version on the same project. Because that test suite was already in place, it was a 15-minute upgrade. I was able to regression test everything, catch every issue. Some of the tests had to be rewritten, but because they existed, they served as a spec for the post-upgrade suite. Within maybe 20 minutes I had completely upgraded everything, redone the whole architecture, changed how all the components were rendered from client-side to server-side for better performance, ripped out a ton of deprecated packages and replaced them with updated ones. That&apos;s the kind of refactor that used to take days.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Killing an Entire AWS Service With One Good Idea</h2>

      <p className="mb-4 leading-relaxed">
        This same SaaS product does a lot of complex work with data behind the scenes, algorithms and reporting and calculations, but ultimately the product being sold is a PDF report with graphical representations of data. Tons of layout and style that has to be perfect, and these reports are very dynamic, so it&apos;s tricky to get the layout just right across many different scenarios.
      </p>

      <p className="mb-4 leading-relaxed">
        I had to rewrite the entire PDF generation module. The app was Next.js deployed to Vercel, and it shouldn&apos;t have been more complex than that. But something weird was going on with generating PDFs in the Vercel runtime. We had these HTML reports and needed pixel-perfect PDF output. I tried so many different approaches, and the only dependable way was to use Selenium with a headless Chromium browser, basically printing the screen behind the scenes. It worked every time, but the Vercel runtime didn&apos;t like it.
      </p>

      <p className="mb-4 leading-relaxed">
        So I bit the bullet. We already had an AWS account, were already using SES, I have a background in Terraform. And now with AI, if you can explain cloud architecture in Markdown, agents can generate Terraform code and you can launch it with one command. I already had it running locally with Docker Compose, and AI can translate that instantly into an ECS task definition. Within minutes I deployed the service.
      </p>

      <p className="mb-4 leading-relaxed">
        But it always bugged me. Dependable as it was, it felt hacky. I had this intuition that something was going to surface at scale. I didn&apos;t know what, but I sensed an unknown unknown waiting to bite us. If we could just keep the whole thing serverless in the Vercel environment, we&apos;d be in a much better place. And my agents found the way to do it. Just did it, in minutes. We deleted a whole chunk of AWS cloud architecture.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Moment a Design Expert Walked Into the Room</h2>

      <p className="mb-4 leading-relaxed">
        While working on the front-end layout and style of this system, I had loaded up front-end skills, framework skills, SEO skills. I was getting really good results and some cool improvements. But when it came to design advice, I was out of my depth. I was never a great designer. I always had better success with things that were scientific and measurable, empirical data and calculations you can present objectively as improvements. Subjective stuff? Not my strong suit.
      </p>

      <p className="mb-4 leading-relaxed">
        With things like coding patterns, database queries, and cloud architecture, I&apos;ve built a career around these. I&apos;m comfortable grabbing the wheel and driving. I know what questions to ask. There aren&apos;t as many unknown unknowns. But with design, I felt like I needed someone in my ear who had the same level of expertise and professional authority that I have with DevOps, automation, cloud architecture, database design. Someone who could throw some weight around and actually drive for a minute.
      </p>

      <p className="mb-4 leading-relaxed">
        We were making progress. We were both coming up with good ideas, moving the needle incrementally. But we weren&apos;t having that leapfrog moment. We weren&apos;t having the next-level conversations that would be transformative in an area where there was clearly room for transformation.
      </p>

      <p className="mb-4 leading-relaxed">
        So I told my coding agent: do a web search, find Claude Code skills or OpenClaw skills for design. Not developer skills. Not someone who&apos;s an expert in tooling and code patterns and SEO. Someone who specializes in the look and feel. What&apos;s going to pop, what&apos;s going to resonate, what&apos;s going to convert. We need to understand the thought process behind all that marketing lingo without necessarily using those words.
      </p>

      <p className="mb-4 leading-relaxed">
        We found the skills. I loaded them up and said, okay, now use your front-end design professional opinion and evaluate our site. Give us your brutal, honest, professional opinion.
      </p>

      <p className="mb-4 leading-relaxed">
        It was like a different person walked into the room.
      </p>

      <p className="mb-4 leading-relaxed">
        The advice it gave is advice I would have expected from a human designer who had been doing design for years at a rock-star digital marketing firm. And it wasn&apos;t some bullshitter who learned all the buzzwords. I&apos;ve been around enough of both types to know the difference. There&apos;s a version of confidence that comes from competence, and you can sense it. You can tell the difference between someone who knows the buzzwords because they&apos;ve memorized them and someone who knows the buzzwords because they&apos;re just the easiest way to communicate principles they&apos;ve internalized through years of failures and successes.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Does a Battle-Tested Expert Actually Know?</h2>

      <p className="mb-4 leading-relaxed">
        The thing about a real expert in digital marketing design is that they can see it instantly. They can get behind the eyes of the users and just know what has a high probability of having an impact and what doesn&apos;t. Take site performance. It might seem obvious that if a site takes too long to load, people bounce. But it&apos;s a trap that a surprising number of people fall into. They want the coolest-looking website and they assume everyone will have the patience to wait for it to load. They convince themselves that a person might wait multiple seconds. They look at that fancy thing they put all that effort into building and think the fancier it looks, the more forgiving users will be.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s just not the case. Not even close. Performance is actually a very high bar that most people think they understand but don&apos;t.
      </p>

      <p className="mb-4 leading-relaxed">
        An expert can walk in and identify 80 or 90% of the issues at a glance. They already know all the things that don&apos;t change. The only remaining work is the stuff that&apos;s always evolving: where the trends are, where the market is, what needs A/B testing because it&apos;s genuinely uncertain. That&apos;s why you need a retainer. That&apos;s why you need someone competent and battle-tested constantly scanning your site, constantly improving, measuring, adapting.
      </p>

      <p className="mb-4 leading-relaxed">
        When I loaded up those design skills, the thing that appeared was that expert. It had the intuition, the professional opinion, the pattern recognition. And if it could just use my eyeballs, and we could build end-to-end tests based on its experience combined with my visual feedback, we&apos;d effectively have a digital marketing design expert as a permanent member of our team.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Plan: Specialist Agents on Tap</h2>

      <p className="mb-4 leading-relaxed">
        That means our company has that expert now. I didn&apos;t have to hire anyone, which matters because I don&apos;t have the budget to bring on a whole human being for a specialized role right now. I want to. I&apos;m ready to as soon as the company is ready. I want more humans on my team. But until I build up enough traction and momentum, AI fills the gap.
      </p>

      <p className="mb-4 leading-relaxed">
        Even when I do start hiring, the first person won&apos;t be a marketing design expert. It&apos;ll be someone with a more general knowledge base. As this AI technology keeps advancing, the humans you depend on will become more generalized. There&apos;s at least a phase we&apos;re going through where humans pivot into the role of the general component in artificial general intelligence. We&apos;ll move away from our specialties and be able to act as specialists in a large number of fields because the AI supplements the intuition, the perspective, the training. All we need to provide is the human experience.
      </p>

      <p className="mb-4 leading-relaxed">
        The plan from here is to build this into my coding pipelines. My coding agents need the ability to tap a specialist agent as a tool. Bring in the design specialist. Bring in the SEO specialist. Bring in the QA specialist to help build test coverage. And we need a &quot;call a human&quot; button. The pipeline needs to be able to send me a Telegram message with a link to a preview environment and just ask me what I think about the way something looks and feels. For architecture decisions too. Maybe set a five-minute timeout for a response. That&apos;s the next piece: specialist agents on demand and a human-in-the-loop when it actually matters.
      </p>
    </PostLayout>
  );
}