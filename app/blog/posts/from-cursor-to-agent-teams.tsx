import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "From Cursor to Agent Teams",
  description: "How loading one design skill into Claude Code changed everything about my client work. A story about test suites, deleted cloud architecture, and AI agents that smell like real experts.",
  slug: "from-cursor-to-agent-teams",
  headerImage: "/images/from-cursor-to-agent-teams-hero.png",
  socialImage: "/images/from-cursor-to-agent-teams-hero.png",
  publishedDate: "2026-03-18",
  modifiedDate: "2026-03-18",
  keywords: ["claude code workflow", "ai coding agents", "specialist ai agents", "playwright test automation", "ai code review process", "cursor vs claude code", "agent orchestration", "ai team of experts"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/from-cursor-to-agent-teams",
  topics: ["AI & Automation", "Development & Tools", "Career & Professional Development"],
  tags: ["claude-code", "ai-coding-agents", "playwright-testing", "agent-orchestration", "cursor-ide", "specialist-subagents", "code-review-workflow", "digital-marketing-automation"],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The IDE Security Blanket</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;ve been doing client work for a while now, building custom SaaS products, and the way I deliver that work
        looks nothing like it did even a few months ago. I discovered the magic of automating AI agents and subagents,
        and everything that&apos;s exploded with OpenClaw and Claude Code. This arms race to put out features for proactive
        personal assistants that orchestrate teams of subagents has completely changed the game.
      </p>

      <p className="mb-4 leading-relaxed">
        Before all of this, I was mostly just plugging along one-to-one with Cursor. I&apos;d let Cursor&apos;s composer flip
        from model to model based on what made sense, and it felt really comfortable because it was all IDE-based. It had a
        terminal right there. You could flip back and forth real easily. But it funneled you towards reviewing code in a
        traditional VS Code style, and that was familiar. Looking back, it was a comfort thing. It made me more comfortable
        with AI to feel like I had the ability to review everything in a familiar way.
      </p>

      <p className="mb-4 leading-relaxed">
        I remember ThePrimeagen talking about forcing himself to use Neovim for two weeks and then never going back to an IDE.
        I was totally going to do that, but I never got around to it because I was too busy and the learning curve was steep. I
        did start using Vim over Nano on servers just to get more familiar with the commands. The reason I bring this up is
        because if I had made that switch, I think I would have been a faster adopter of Claude Code.
      </p>

      <p className="mb-4 leading-relaxed">
        And it&apos;s a weird thing to say, because I&apos;m a Linux guy. I&apos;ve been managing servers for years. I had an Ubuntu
        workstation for several years. I work with Docker. I&apos;m very comfortable in a terminal. All day, every day, I&apos;m
        shooting commands in terminals. But when it comes to code, I was always in an IDE. Most people are. Though it does seem
        like some of the heaviest hitters just use the most basic text editor. A lot of the most elite engineers you&apos;ll talk
        to just use Vim or Notepad. Or Emacs.
      </p>

      <p className="mb-4 leading-relaxed">
        Now that I&apos;ve gotten a taste of Claude Code, I still keep Cursor open, but the Cursor agent is more of a meta tool. If
        Claude Code is getting deep into something and I just need some generic commands or a quick web search that doesn&apos;t
        need a lot of context from my workflow, it&apos;s nice to have that Cursor agent to fall back on. I always keep a
        today.md file open too. Sometimes I&apos;ll use that to marinate in my thought process while I type out the next thing
        I&apos;m going to say. There&apos;s this urgency when typing into the command line, like hurry up, think faster, move faster.
        I think there&apos;s a lot of power in just stopping time and letting your thoughts manifest.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Why I Stopped Reviewing Code Line by Line</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;m going to be totally honest. I was going to say I don&apos;t hardly review anything, but that&apos;s not actually true.
        The truth is my reviews have moved almost entirely to GitHub. I used to feel the need to review every line of code as
        these things generated it. People say &quot;oh, you just YOLO and let the AI code everything.&quot; I think YOLO is the wrong
        term. If I were putting it in dangerous mode on main branch and giving it the ability to push and deploy, that&apos;s YOLO.
        But if I put it on its own branch and make sure everything that deploys goes through a pull request, all I&apos;ve done is
        move that slow, tedious review process to the right place.
      </p>

      <p className="mb-4 leading-relaxed">
        There are a lot of things that have completely changed because of AI coding. One of the biggest: I am 10 times, maybe
        100 times more likely to do a refactor now. I&apos;m 10 times more likely to rebuild the whole system. So imagine how
        often I build an entire feature, an entire module of features, and then just scrap it or completely redo it. Now
        think about reviewing all that code in line as it&apos;s being written. Think about how many times I&apos;d be reviewing code
        that&apos;s going to get deleted. Or how many times I&apos;m catching errors that will end up being caught by the automated
        test suite anyway.
      </p>

      <p className="mb-4 leading-relaxed">
        I guess you could call it YOLO, except that I review it in the pull request. I just religiously use pull
        requests for every single deployment. You should already be doing this anyway.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How Does a Test Suite Build Itself?</h2>

      <p className="mb-4 leading-relaxed">
        This particular client project was tight budget. What I would actually consider YOLO is not having test coverage. I had
        good coverage on the back end, but there weren&apos;t a lot of end-to-end front-end tests. I did already have the Playwright
        suite in place, just not many tests written for it.
      </p>

      <p className="mb-4 leading-relaxed">
        I was working on a custom SaaS product, making a lot of front-end changes. The product does a lot with data behind the
        scenes, complex algorithms and reporting and calculations, but ultimately what gets sold is a PDF report with graphical
        representations of different data. There&apos;s a lot of layout and style involved that has to be perfect, and these reports
        are very dynamic, so it&apos;s tricky to get things just right across many different scenarios.
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;m chatting with my Claude, and it tells me to go look at the reports and describe what problems I find. I pull
        open the report and there&apos;s this whole list of things wrong. I started to type them all out and then I was like,
        actually, why don&apos;t you just go build a full set of Playwright tests with end-to-end coverage? Write tests
        for everything obvious, then run them. I just admitted it: I&apos;m slow. I don&apos;t mind doing it, but I&apos;m slow. And I
        think a lot of this stuff is obvious. If you just write the tests, you&apos;ll catch it.
      </p>

      <p className="mb-4 leading-relaxed">
        I was correct. It found a lot of test cases, wrote tests for all of them, and then we ran it. 90% of the
        things I saw with my own eyes were just cleared up. I had this small remaining list to point out, the stuff
        that&apos;s just hard to see without human eyes, without photons actually hitting retinas. We got our test suite and I cut
        down my QA time drastically.
      </p>

      <p className="mb-4 leading-relaxed">
        That same day, I needed to upgrade the React version. Because that test suite was in place, it was a 15-minute upgrade.
        I was able to regression test everything and catch every issue. Some of the tests had to be rewritten, but because they
        existed, they served as a spec for the post-upgrade suite. Within maybe 20 minutes I had completely upgraded
        everything, redone the architecture, moved a ton of stuff from client-side rendering to server-side for better SEO
        performance, ripped out deprecated packages, replaced them with updated ones. All because the tests were there.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Deleting Cloud Architecture in Minutes</h2>

      <p className="mb-4 leading-relaxed">
        That PDF generation module had always bugged me. The product has these HTML reports that need to become pixel-perfect
        PDFs. I tried so many different ways. The only dependable approach was to use Selenium, launch a headless Chromium browser,
        and just print the screen. It worked every time, but the Vercel runtime didn&apos;t like it.
      </p>

      <p className="mb-4 leading-relaxed">
        So I bit the bullet. We already had an AWS account, already using SES. I have a background in Terraform, and now
        with AI, if you can explain your cloud architecture in Markdown, it can build the Terraform code and you can launch it
        with one command. I already had it working locally with Docker Compose, and AI can translate that instantly into an ECS
        task definition. Within minutes I had deployed the service. Had to modify the Docker container to specify the
        architecture since I run a Mac, but that&apos;s trivial.
      </p>

      <p className="mb-4 leading-relaxed">
        It always bugged me though. As dependable as it was, it felt hacky. I had this intuition that something weird was going
        to surface at scale. I didn&apos;t know what, but I could sense an unknown unknown. If we could just keep the whole
        thing serverless in the Vercel environment, we&apos;d be good. And my agents found the way to do exactly that. In
        minutes. We deleted a whole chunk of AWS cloud architecture.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Does Real Expertise Smell Like?</h2>

      <p className="mb-4 leading-relaxed">
        This is the part that really changed how I think about agent orchestration. I was working on the layout and style of a
        website, and I had loaded up front-end skills, framework skills, SEO skills. I was getting really good results. But with
        things like coding patterns, database queries, and cloud architecture, these are things I&apos;ve built a career around. I
        know what questions to ask. There aren&apos;t as many unknown unknowns for me. I grab the wheel and drive.
      </p>

      <p className="mb-4 leading-relaxed">
        Design was different. I was never a great designer. I always had better success with things that are scientific, things
        you can measure. Empirical data and calculations that you can present objectively as an improvement. Subjective things
        were harder for me. I felt like I needed someone in my ear who had the same level of expertise and professional authority
        in design that I have with DevOps, cloud architecture, and database design. Someone who could come in,
        throw some weight around, and give us a plan.
      </p>

      <p className="mb-4 leading-relaxed">
        We were making progress, moving the needle forward incrementally. But we weren&apos;t having that leapfrog moment. We
        weren&apos;t having the next-level conversation in an area where there was room for one. So I told my coding agent to do
        a web search. Find Claude Code skills, find OpenClaw skills, find any kind of community skills focused on design. Not a
        developer perspective. Not someone expert in tooling and code patterns. Someone who specializes in the look and feel.
        What&apos;s going to pop, what&apos;s going to work. We need to understand the thought process behind all those marketing
        terms, even if we don&apos;t use them ourselves.
      </p>

      <p className="mb-4 leading-relaxed">
        We found the skills, loaded them up, and told it: use your front-end design professional opinion and evaluate our site.
        Give us your brutal, honest, professional opinion.
      </p>

      <p className="mb-4 leading-relaxed">
        It was like a different person walked into the room.
      </p>

      <p className="mb-4 leading-relaxed">
        The advice it gave is advice I would have expected from a human designer who had been doing design for years at a
        rock star digital marketing firm. And I can tell the difference. I&apos;ve been around enough of them. There&apos;s a version of
        confidence that comes from competence, and you can smell it.
      </p>

      <p className="mb-4 leading-relaxed">
        You can tell the difference between a person who has learned all the buzzwords and knows you don&apos;t know them, so they
        just deploy them with confidence, and a person who knows the buzzwords only because they&apos;re the easiest way to
        communicate principles picked up through experience. The second type has had a lot of failures. They&apos;ve had a lot
        of websites getting zero clicks where the performance is solid and the layout checks all the boxes, but there&apos;s just
        something about the market and strategy that&apos;s not motivating people to convert. Only after going through that do you
        get an intuition about what&apos;s likely to work and what isn&apos;t.
      </p>

      <p className="mb-4 leading-relaxed">
        One of the things I pick up on with these people is that they reach a point where they can see it instantly. They can
        get behind the eyes of the users and just know what has a high probability of impact versus a low one. Take site
        performance. It may seem obvious that if a site takes too long to load, people bounce. But it&apos;s actually not as obvious
        as you&apos;d think. People fall into a trap. They want the coolest looking website. They assume everyone will have the
        patience to wait for it to load. They convince themselves a person might wait multiple seconds before bouncing. And
        when you&apos;re looking at that cool thing you put all that effort into building, some part of you thinks the fancier it
        looks, the more likely they are to wait. That&apos;s just not the case. Not even close.
      </p>

      <p className="mb-4 leading-relaxed">
        A real expert can walk in, and 80 or 90% of the game is just things they can look at and know. That&apos;s not going to
        work. No one&apos;s going to care about that. That&apos;s going to give all the wrong signals. The remaining things that need
        validation are the things that change frequently, and that&apos;s where ongoing AB testing comes in. But the experienced
        person doesn&apos;t start from zero. They start 90% of the way there and just button up the last bit.
      </p>

      <p className="mb-4 leading-relaxed">
        When I loaded up those design skills, the thing that appeared had that quality. It had the intuition I&apos;ve only ever
        recognized in battle-tested design experts. And really, if it could just use my eyeballs, and we could build end-to-end
        tests based on its experience combined with my human reactions, we effectively have a digital marketing design expert
        on the team. Our company has that expert now. I didn&apos;t have to hire anyone, because I don&apos;t have the budget right
        now to hire a whole human being to fill that role.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Where This Is Going</h2>

      <p className="mb-4 leading-relaxed">
        I want more humans on my team. I want friends who have my back. But until I can build up that traction and momentum,
        and even then, the first hire won&apos;t be a marketing design expert. It&apos;ll be someone with a more general set of skills.
        As this AI technology keeps advancing, I think the humans you depend on will become more generalized. There&apos;s at least a
        phase we&apos;re going to go through where humans pivot into the generalist role. We&apos;ll move away from narrow specialties
        and be able to act as specialists across many fields because AI supplements the training, the experience, the
        perspective. All we need to provide is the human experience.
      </p>

      <p className="mb-4 leading-relaxed">
        The plan now is to create agent-as-a-tool in my coding pipelines. My coding agents can tap a subagent and say: bring in
        the design specialist. Bring in the SEO specialist. Bring in the QA specialist. Help me build test coverage. And then
        there&apos;s the missing piece: a call-a-human tool. Something in the pipeline that can send me a Telegram message with a
        link to a preview environment and just ask me what I think about how something looks and feels. Or for architecture
        decisions, it could flag a pull request for my review. Maybe a five-minute timeout. The pipeline keeps moving, and I
        step in where only human eyes and human judgment can go.
      </p>
    </PostLayout>
  );
}