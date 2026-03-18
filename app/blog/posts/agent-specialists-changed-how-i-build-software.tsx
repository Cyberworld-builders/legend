import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Agent Specialists Changed How I Build Software",
  description: "How loading design and QA skills into coding agents created expert teammates I couldn't afford to hire — and why the human role is shifting to generalist.",
  slug: "agent-specialists-changed-how-i-build-software",
  headerImage: "/images/agent-specialists-changed-how-i-build-software-hero.png",
  socialImage: "/images/agent-specialists-changed-how-i-build-software-hero.png",
  publishedDate: "2026-03-18",
  modifiedDate: "2026-03-18",
  keywords: [
    "ai coding agents",
    "claude code skills",
    "ai agent specialists",
    "automated testing playwright",
    "ai code review workflow",
    "multi-agent orchestration",
    "ai design review",
    "human in the loop ai"
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/agent-specialists-changed-how-i-build-software",
  topics: ["AI & Automation", "Development & Tools", "Business & Marketing"],
  tags: [
    "ai-agent-automation",
    "claude-code",
    "automated-testing",
    "code-review",
    "multi-agent-orchestration",
    "playwright",
    "digital-marketing",
    "freelance-engineering"
  ],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">From the IDE to the Command Line</h2>

      <p className="mb-4 leading-relaxed">
        I had these pre-existing clients where I was building custom SaaS products, and for a while I was just plugging along with Cursor. Me and Cursor&apos;s composer, flipping between models based on what made sense. It was comfortable because it was all IDE-based. You had your terminal right there, you could flip back and forth easily, and it funneled you toward reviewing code in a traditional VS Code style. That was really familiar, and honestly, looking back, it was just a comfort thing. It made me feel like I had the ability to review everything in a way I already understood.
      </p>

      <p className="mb-4 leading-relaxed">
        I remember ThePrimeagen talking about forcing himself to use Neovim for two weeks and then never going back. I was totally going to do that, but I never got around to it because I was too busy and the learning curve was steep. I did start using Vim over Nano on servers just to get more familiar with the commands. The reason I bring this up is that if I had made that switch, I think I would have been a faster adopter of Claude Code.
      </p>

      <p className="mb-4 leading-relaxed">
        And it&apos;s weird to say, because I&apos;m a Linux guy. I&apos;ve been managing servers for years. I had an Ubuntu workstation for several years. I work with Docker. I&apos;m very comfortable in a terminal. All day, every day I work in terminals. Everything you develop, you&apos;re shooting commands in a terminal. So it&apos;s strange to think that, but at the same time, when it comes to code, you&apos;re always in an IDE. Or I was, and I think most people are. Not everybody, though. Some of the heaviest hitters just use the most basic text editor. A lot of the most elite engineers I&apos;ve talked to just use Vim or Notepad. Or Emacs, of course.
      </p>

      <p className="mb-4 leading-relaxed">
        Now that I&apos;ve gotten a taste of Claude Code, I do still keep Cursor open, but the Cursor agent is more like a meta tool. If Claude Code is getting deep into something and I just need a quick web search or some generic commands that don&apos;t need a lot of context, it&apos;s nice to have that fallback. I also keep a <code className="bg-gray-800 px-1 rounded text-sm">today.md</code> file open. Sometimes I&apos;ll use it to marinate in my thought process while I type out the next thing I&apos;m going to say. Sometimes I feel too rushed typing into the command line, like there&apos;s this urgency to think faster, move faster. There&apos;s a lot of power in just stopping time and letting your thoughts manifest.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why I Stopped Reviewing Code Inline</h2>

      <p className="mb-4 leading-relaxed">
        This feels like a weird thing to admit, but I&apos;m going to be totally honest. My reviews have moved almost entirely to GitHub. I used to feel the need to review every line of code as these things generated it. A lot of people would say I&apos;m just going YOLO and letting the AI code everything. I think YOLO is the wrong term for it.
      </p>

      <p className="mb-4 leading-relaxed">
        If I were putting it in dangerous mode on main branch and giving it the ability to push and deploy, that&apos;s YOLO. But if I put it on its own branch and make sure everything that deploys goes through a pull request, all I&apos;ve done is move that review process to a better place. Here&apos;s why.
      </p>

      <p className="mb-4 leading-relaxed">
        A lot of important things have completely changed because of AI coding. I am ten times, maybe a hundred times more likely to do a refactor now. I&apos;m ten times more likely to rebuild an entire system. So think about how often I build an entire feature, an entire module, and then just scrap it or completely redo it. Now think about reviewing all that code inline as it&apos;s being written. Think about how many times I&apos;m reviewing code that&apos;s going to get deleted. Or how many times I&apos;m catching errors that would have been caught by the automated test suite anyway.
      </p>

      <p className="mb-4 leading-relaxed">
        I guess you could call it YOLO, except that I&apos;m going to review it in the pull request. I just religiously use pull requests for every single deployment. You should already be doing this anyway.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How Does a Test Suite Change Everything?</h2>

      <p className="mb-4 leading-relaxed">
        One of my custom SaaS clients had a tight budget. What I would consider actual YOLO is not having test coverage. I had good test coverage on the backend, but there weren&apos;t a lot of end-to-end frontend tests. I did already have the Playwright suite in place, though.
      </p>

      <p className="mb-4 leading-relaxed">
        I was working on a very design-intensive part of the system, a lot of front-end layout and style changes. There were a bunch of problems with the reports, and my Claude agent told me to go look and catalog everything I found. I started typing them all out, and then I stopped and said, actually, why don&apos;t you just go build a full, thorough set of Playwright tests with end-to-end coverage? Write tests for everything that&apos;s obviously needed and just run them. I admitted it straight up: I&apos;m slow at this. I don&apos;t mind doing it, but a lot of this stuff is obvious, and if you just write the tests, you&apos;ll catch it.
      </p>

      <p className="mb-4 leading-relaxed">
        I was right. The agent found a ton of test cases, wrote tests for all of them, and when we ran it, about 90% of the issues I&apos;d seen were just cleared up. I had a small remaining list of things that really needed human eyes, things that are just hard to see without photons hitting retinas. But my QA time dropped drastically.
      </p>

      <p className="mb-4 leading-relaxed">
        And then the payoff compounded. Later that same day, I needed to upgrade the React version and completely rearchitect how components were rendered. This was an SEO performance task. A lot of stuff was being rendered client-side that should have been server-side. We had to change the entire rendering approach, rip out a ton of deprecated packages, replace them with updated ones. Because that test suite was in place, it was a fifteen-minute rewrite. I was able to regression test everything, catch every issue. Some of the tests had to be rewritten, but because they existed, they served as a spec for the post-upgrade test suite. Within about twenty minutes, everything was completely upgraded and rearchitected.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Deleting a Whole Chunk of AWS</h2>

      <p className="mb-4 leading-relaxed">
        The product I&apos;m talking about does a lot of complex work with data behind the scenes, algorithms and reporting and calculations, but ultimately what gets sold is a PDF report with graphical representations of different data. There&apos;s a lot of layout and style that has to be perfect, and these reports are very dynamic, so getting it right across many different scenarios is tricky.
      </p>

      <p className="mb-4 leading-relaxed">
        I had to rewrite the entire PDF generation module. It was burning me up that I had this Next.js app deployed to Vercel, and architecturally there was no reason it shouldn&apos;t just work there. But something weird was going on with generating PDFs, and I had to get the solution out the door to land our first client. So I asked myself, what is the fastest thing I can do tonight that I know will work?
      </p>

      <p className="mb-4 leading-relaxed">
        The only dependable way to generate these graphical PDF reports from HTML was to use Selenium with a headless Chromium browser and just print the screen behind the scenes. That worked every time, but the Vercel runtime didn&apos;t like it. So I bit the bullet. We already had an AWS account, we were already using SES, I have a background in Terraform. With AI, if you can explain cloud architecture in Markdown, it can build Terraform code and you can launch it with one command. I already had it running locally with Docker Compose, and AI can translate that instantly into an ECS task definition. Within minutes I had the service deployed.
      </p>

      <p className="mb-4 leading-relaxed">
        But it always bugged me. Dependable as it was, it felt hacky. I had this intuition that it was going to cause some weird problem at scale. I didn&apos;t know what, but I sensed there was an unknown unknown that would surface. If we could just keep the whole thing serverless in the Vercel environment, we&apos;d be good. My agents found the way to do that and just did it. In minutes. We deleted a whole chunk of AWS cloud architecture.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">When a Design Expert Walked Into the Room</h2>

      <p className="mb-4 leading-relaxed">
        This is where it gets into the architecture change that I think matters most. I was working on front-end layout and style, and I had loaded up front-end skills, framework skills, SEO skills. I was getting really good results, making cool improvements, asking for advice on layout and style. But I was never a great designer. I always had better success with things that were scientific, things you could measure. Empirical data, calculations, objective improvements. Subjective stuff was always harder for me.
      </p>

      <p className="mb-4 leading-relaxed">
        I knew we were making progress. We were moving the needle forward incrementally. But we weren&apos;t having that leapfrog moment. We weren&apos;t having the kind of conversation that would be next-level in an area where there was room for transformation.
      </p>

      <p className="mb-4 leading-relaxed">
        So I told my coding agent: do a web search. Find any design-focused skills in the community, Claude Code skills, OpenClaw skills. Not a developer who&apos;s an expert in tooling and code patterns and SEO, but somebody who specializes in the look and feel. What&apos;s going to pop, what&apos;s going to resonate with users. All those marketing terms I could never stomach. We don&apos;t have to use those words, but we need to understand what they&apos;re talking about when they use them.
      </p>

      <p className="mb-4 leading-relaxed">
        When I loaded up those design skills, it was like a different person walked into the room. The advice it gave was advice I would have expected to hear from a human designer who had been doing design for years at a serious digital marketing firm. And it wasn&apos;t some bullshitter who learned all the buzzwords with only academic knowledge. I&apos;ve been around enough of these people to know the difference.
      </p>

      <p className="mb-4 leading-relaxed">
        There&apos;s a version of confidence that comes from competence. You can sense it. You can tell the difference between a person who has learned all the buzzwords and knows you don&apos;t know them, so they just deploy them with confidence, and a person who knows the buzzwords only because they&apos;re the easiest way to communicate principles they picked up through experience. Through a lot of failures, a lot of websites getting zero clicks, solid layouts that check all the boxes but just don&apos;t motivate people to convert. Only after going through that do you get an intuition about what&apos;s likely to work and what isn&apos;t.
      </p>

      <p className="mb-4 leading-relaxed">
        The thing I pick up on with people who have that experience is that they can see it instantly. They can get behind the eyes of the users and just know what has a high probability of impact and what doesn&apos;t. They&apos;re not starting from zero on any given system. All that experience gets them 80 or 90% of the way there. They just need to button up that last bit with A/B testing, because that&apos;s the part that&apos;s constantly evolving.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s what showed up when I loaded those skills. That battle-tested intuition. And if you combine that with my eyeballs, actual human eyes consuming screens, you&apos;ve effectively added a digital marketing design expert to your team. Our company has that expert now. I didn&apos;t have to hire anyone, because I don&apos;t have the budget right now to hire a whole human to fill that role.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Does the Agent Architecture Look Like?</h2>

      <p className="mb-4 leading-relaxed">
        The idea that came out of all this is to create agents-as-tools in my coding pipelines. My coding agents can tap a specialist agent and say, okay, bring in the design specialist. Bring in the SEO specialist. Bring in the QA specialist to help build test coverage. Multiple perspectives from the same model, forced to look at a problem through different lenses. I&apos;m sure somebody else has thought of this and there&apos;s probably a term for it already. It has overlap with what people have been calling a &quot;team of experts.&quot; A bunch of different agents with different specialties.
      </p>

      <p className="mb-4 leading-relaxed">
        We also need a &quot;call a human&quot; tool in the pipeline. The agent needs to be able to send me a Telegram message with a link to a preview environment and ask what I think about the way something looks and feels. For architecture decisions, it could flag a pull request and say, hey, we need your review on this. Maybe a five-minute timeout. The point is that the pipeline knows when it needs human eyes and can request them.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Human Role Is Shifting to Generalist</h2>

      <p className="mb-4 leading-relaxed">
        I want more humans on my team. I want friends that have my back. But until I can build up that traction and momentum, when I do hire, it won&apos;t be a marketing design expert first. It&apos;ll be someone with a more general knowledge of things, especially as this AI technology keeps advancing.
      </p>

      <p className="mb-4 leading-relaxed">
        I think the humans you depend on will become more generalized. There&apos;s at least a phase we&apos;re going to go through where humans pivot into the role of the general part of artificial general intelligence. We&apos;ll move away from our specialties and be able to act as specialists in a large number of fields because the AI supplements the intuition, the perspective, the training, the experience. All we need to provide is the human experience. The photons on retinas. The gut reaction to whether something feels right. The embodied knowledge that a machine can approximate with high probability but might still get something subtly off about.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s where this is all heading for me. My digital marketing work was relatively straightforward to automate. You ask Google and the analytics tools what needs to change, they tell you, you build a GitHub issue from the feedback, and you get coding agents to make the changes and open the pull request. The custom SaaS work is more complex, but the improvements I&apos;m making along the way in the simpler pipeline are giving me the roadmap to automate the harder stuff. Every kink I work out, every specialist agent I build, every test suite I stand up is another piece of that roadmap.
      </p>
    </PostLayout>
  );
}