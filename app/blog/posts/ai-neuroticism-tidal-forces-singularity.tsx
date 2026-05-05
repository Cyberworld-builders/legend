import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "AI Neuroticism and the Tidal Forces of the Singularity",
  description: "It's not the singularity that spaghettifies you. It's the tidal forces — the differential rate of change that's tearing engineers and founders apart. Here's how to step out of the hype-vs-trolls feedback loop.",
  slug: "ai-neuroticism-tidal-forces-singularity",
  headerImage: "/images/ai-neuroticism-tidal-forces-singularity-hero.png",
  socialImage: "/images/ai-neuroticism-tidal-forces-singularity-hero.png",
  publishedDate: "2026-05-05",
  modifiedDate: "2026-05-05",
  keywords: [
    "ai neuroticism",
    "ai hype cycle",
    "engineers vs founders",
    "ai singularity criticism",
    "human in the loop ai",
    "ai engineering pragmatism",
    "tidal forces metaphor",
    "vibe coded mvp",
  ],
  canonicalUrl: "https://cyberworldbuilders.com/blog/ai-neuroticism-tidal-forces-singularity",
  topics: ["AI & Automation", "Career & Professional Development", "Business & Marketing"],
  tags: [
    "ai-hype",
    "ai-neuroticism",
    "engineers-vs-founders",
    "human-in-the-loop",
    "tidal-forces",
    "engineering-pragmatism",
    "ai-singularity",
  ],
  category: "AI & Automation",
  isFeatured: false,
  isDraft: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <p className="mb-4 leading-relaxed">
        It&apos;s been a minute since I really got immersed in this kind of technology storytelling, so a quick pulse check. The OpenClaw-style automation setup I run is plateauing for me. The new has worn off. The tools are still very powerful, but they&apos;ve become normal. I find myself wondering how much of that plateau is me getting accustomed to them, how much is a quiet failure to perform on the harder problems, and how much is the main upstream products catching up with what a lot of us have been building with third-party harnesses. Open questions, and I&apos;ll come back to them. But what I really want to talk about is the frustration, because the frustration is louder than any of those questions right now.
      </p>

      <p className="mb-4 leading-relaxed">
        The amount of hype around AI has gotten cult-like. I get why people like Sam Altman, Elon Musk, and Dario Amodei are hyping the technology the way they are — they have to. They&apos;re raising money. You hype the safety risks, you hype the future-where-no-one-works, you hype the productivity uplift. That&apos;s the job of a CEO at a frontier-AI company. None of that surprises me. What surprises me is how much that hype has reshaped the conversation between the rest of us — between engineers and founders, the people who actually have to ship.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">It&apos;s Not the Singularity That Spaghettifies You</h2>

      <p className="mb-4 leading-relaxed">
        There&apos;s a physics analogy I want to risk here, because it captures the dynamic better than anything else I&apos;ve found. When you fall into a black hole, the singularity itself isn&apos;t what kills you. What kills you are the <em>tidal forces</em> — the gravitational gradient. The part of you closer to the singularity gets pulled harder than the part of you farther away, and the differential between those two pulls stretches you. That stretching has a name: spaghettification.
      </p>

      <p className="mb-4 leading-relaxed">
        I keep reaching for that image because it&apos;s exactly what the AI moment feels like from inside the industry. It&apos;s not the singularity people argue about — the future-of-everything endpoint where the curve goes vertical. That&apos;s a story. It&apos;s entertaining, it raises money, it sells books. The thing that&apos;s actually doing damage is the differential. Different parts of your professional identity are experiencing different rates of change. Your coding skill is being told it&apos;s about to be obsolete. Your architecture skill is supposedly still needed. Your client-relationship skill, your business sense, your taste — those are getting pulled at different speeds by different forces. And the differential is what causes the strain. One part of you is sprinting to keep up. Another part is being told it&apos;s irrelevant. That&apos;s the stretch.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">AI Neuroticism, Not AI Psychosis</h2>

      <p className="mb-4 leading-relaxed">
        People throw around the phrase &quot;AI psychosis&quot; for a particular kind of true-believer behavior — the founder who can&apos;t sleep because while they&apos;re sleeping, their AI-using competitors are widening the gap. The hyper-optimized productivity guilt. I think that&apos;s the wrong word. Psychosis implies a break from reality. What this actually is, for most of the people I see suffering from it, is closer to <em>neurosis</em>. AI neuroticism. Chronic, low-grade anxiety produced by living inside the tidal forces.
      </p>

      <p className="mb-4 leading-relaxed">
        The symptom is ambient unease. The dread that you&apos;re not using AI optimally. The sense that the rules of your craft are being rewritten faster than you can process them. The feeling that someone somewhere has figured out something you haven&apos;t, and your skills are decaying in real time, and the things you thought you were good at are about to be commoditized. It&apos;s not delusion. It&apos;s a stress response to a real differential in the rate of change. It&apos;s the psychological version of the spaghettification — different parts of your professional self being pulled at different rates, and the strain showing up as a constant low-amplitude hum of <em>am I keeping up.</em>
      </p>

      <p className="mb-4 leading-relaxed">
        I&apos;ll come back to this, because I think AI neuroticism is the thing actually driving the two camps I&apos;m about to describe. Both camps are stress responses to the same tidal differential. They just respond by leaning in opposite directions.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Adaptation Is for Other People; This Was Always a Filter</h2>

      <p className="mb-4 leading-relaxed">
        Here&apos;s a useful test. If you wanted to know whether someone identifies as a technologist or not — really, at their core — you could ask them a single question. <em>How do you respond to change, to innovation, to having to learn new things?</em> Do you grumble about it, or does it light you up? Because if you&apos;re actually into technology, change is what you live for. Disruption is what excites you. The new release notes are the dopamine. That&apos;s the whole point.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s why I bristle at the word &quot;adaptation&quot; when it&apos;s applied to engineers. Adaptation is what you do when something new shows up that you have to deal with against your will. For people who don&apos;t identify as technologists but who increasingly need to use technology to do their jobs, sure, that&apos;s adaptation. For us it was never adaptation. It was a filter. The people who couldn&apos;t handle constant change filtered themselves out a long time ago. The rest of us stayed because the change is the thing.
      </p>

      <p className="mb-4 leading-relaxed">
        Which is why the AI moment is so disorienting. The hype around AI has finally produced something that&apos;s broken even technologists. A lot of us are grumbling now. We&apos;re acting like the people we used to roll our eyes at. Not because we hate the technology — most of the engineers grumbling the loudest are using AI tools every day and lying about it — but because the differential is too high. The tidal forces are stretching us past our normal tolerance for change. And when that happens, you stop sounding like a technologist and start sounding like the IT-resistant department head you swore you&apos;d never become.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Two Camps, One Force</h2>

      <p className="mb-4 leading-relaxed">
        The visible damage shows up as two camps that hate each other. They&apos;re both stress responses to the tidal forces, but they lean opposite directions and they amplify each other in the worst possible way.
      </p>

      <p className="mb-4 leading-relaxed">
        On one end, the <strong>hype men</strong> at the top of the AI companies. They have a fundraising job to do. They have to sell the story where coding is solved, knowledge work is solved, the singularity is imminent, you-have-to-act-now-or-be-left-behind. That story is rocket fuel for raising capital. It&apos;s also rocket fuel for AI neuroticism in the people listening to it. Founders especially. Because if you&apos;re a startup founder and you&apos;ve had bad experiences with engineers in the past — too expensive, too slow, too opinionated, dismissive about your business ideas — and the most powerful CEOs in tech are now telling you, <em>good news, you don&apos;t need them anymore</em>, that&apos;s not just product news. That&apos;s validation of every grievance you&apos;ve been carrying. So founders eat it up. They become the marks. The hype men need them to believe, and the founders want to believe, and the loop tightens.
      </p>

      <p className="mb-4 leading-relaxed">
        On the other end, the <strong>cynical gatekeeper engineers</strong>. Their stress response runs the opposite direction. AI is all hype. AI is for losers. Real engineers don&apos;t need it. Anyone who uses it is a fake who couldn&apos;t code without a chatbot. This camp is over-correcting against the hype, and they&apos;re doing it loudly because their identity is on the line. If coding really is being solved, then the part of their professional self that&apos;s been most invested in is the part being pulled hardest by the tidal force. So they dig in. They gatekeep. They post snarky threads. They tell you they&apos;d &quot;never let an AI touch their codebase&quot; while they go home and use Cursor.
      </p>

      <p className="mb-4 leading-relaxed">
        Both camps sound equally retarded from the middle. Both are reacting to the same underlying stretch. And the worst part is the feedback loop between them. The more the hype men tell founders they don&apos;t need engineers, the more engineers feel attacked, the harder they over-correct, the more cynical and gatekeepy they sound, the more it confirms to founders that engineers are out-of-touch dinosaurs who don&apos;t want to evolve. Round and round. Each side gets exactly the evidence it needs to keep believing the worst of the other.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Truth Is Annoyingly in the Middle</h2>

      <p className="mb-4 leading-relaxed">
        I&apos;ll say it plainly. AI is real. It&apos;s powerful. I don&apos;t touch a line of code that doesn&apos;t in some way interact with Claude. If it weren&apos;t Claude it would be Codex or Cursor or one of the others. It&apos;s silly to hand-write every line in 2026, and if I gave up all my AI coding tools my productivity would fall off a cliff. I&apos;d do a tenth of the work I do now. That&apos;s real.
      </p>

      <p className="mb-4 leading-relaxed">
        And: I have almost no clients where AI just autonomously fixes things. Really. At all. In the cases where it seems like it did, you usually pay a price later. You get a quietly broken assumption baked into the codebase. You get a passing test that&apos;s testing the wrong thing. You get an integration that works for the happy path and silently corrupts data on the unhappy one. AI is a force multiplier on whatever judgment is in the loop. If the judgment in the loop is good, the multiplier is good. If the judgment is absent, the multiplier just helps you make the wrong thing faster.
      </p>

      <p className="mb-4 leading-relaxed">
        The way I&apos;ve found myself categorizing the work is by where I&apos;ll allow autonomy. There are exactly two pipelines I&apos;m comfortable letting AI run pretty close to fully autonomously, and they share a property: <em>the failure mode is cheap and visible</em>. The first is SEO. I&apos;ve got robust test coverage, lighthouse runs, and integration tests that catch most of the ways it could go wrong. The cost of a bad SEO change that ships is a small ranking dip, and the next pipeline run rolls it back. So sure — let it ship 80% of those updates autonomously, with guardrails.
      </p>

      <p className="mb-4 leading-relaxed">
        The second is this blog publishing pipeline. The one this post is going through right now. I talk for thirty-plus minutes into a voice recorder. The pipeline transcribes, organizes, copy-edits, generates a hero image, opens a PR, and waits for me to approve. Every idea in this article came out of my brain through my voice. The pipeline did spell-check, tightened redundancy, organized paragraphs, took a few small liberties with the prose at the character level — the kind of liberties a copy editor takes. Then I read every word before merge. That&apos;s human-in-the-loop done right. The AI does the work that&apos;s mechanical and the human keeps the work that&apos;s judgment.
      </p>

      <p className="mb-4 leading-relaxed">
        On the hero image specifically, since people sometimes get prickly about it: I put it in the same category as the font and the color palette. I&apos;m not inventing a new typeface from whole cloth for every article. I&apos;m not mixing custom hex codes by hand. The community made those, the tools generate them, and they&apos;re fine. Hero images are the same. The algorithm penalizes posts without one. People click on posts with one. The AI does it pretty well if the prompt factors in the article and the brand. If the article is actually about a feature with a UI worth showing, I take screenshots. Otherwise, I let the pipeline cook and I move on.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What Founders Need to Hear</h2>

      <p className="mb-4 leading-relaxed">
        There&apos;s more to engineering than code. I know that sounds like the most predictable engineer-defending-their-turf line in the world, but the reason I have to keep saying it is that the hype machine has made it controversial. The fact is I spend a tiny fraction of my time writing actual code or even reviewing code. Most of my time goes to planning, scoping, architecture conversations, security reviews, scalability calls, cost optimization, compliance, and triage when something inevitably goes wrong in production. The list goes on. Coding is the part that gets all the attention because it&apos;s the part that&apos;s easiest to film someone doing. The other parts are invisible until they&apos;re missing, at which point they&apos;re catastrophic.
      </p>

      <p className="mb-4 leading-relaxed">
        So when Anthropic gets one inch closer to &quot;solving coding,&quot; I get it, that feels like a dunk on engineers. It&apos;s not. It&apos;s a dunk on <em>typing</em>. The work is still the work. You will still need someone who can tell you that the architecture you sketched on a napkin won&apos;t survive contact with real users. You will still need someone who can read a Postgres explain plan and tell you why your &quot;simple query&quot; is going to bring down the database at 10x scale. You will still need someone who can sit in a compliance review and translate between &quot;the auditor wants to see SOC 2 controls&quot; and &quot;here&apos;s the actual change set in our infrastructure repo.&quot; That work is engineering. The coding part was always the smallest fraction of it. The hype men know this, by the way. They&apos;re hiring engineers as fast as they can.
      </p>

      <p className="mb-4 leading-relaxed">
        And to the engineers — you&apos;re often hopeless on the business side. I say that with love. I&apos;ve been watching engineers (myself included) underestimate the founder side of the equation for a decade. We&apos;re great at solving problems. We&apos;re generally bad at picking which problems are worth solving, who&apos;ll pay to have them solved, and how to talk to the people writing the checks. So when a founder shows up with a wild vision and a fundraising deck, the move is not to roll our eyes. The move is to recognize that they&apos;re bringing the half of the equation we&apos;re weakest at.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Loop Has to Be Broken From Inside</h2>

      <p className="mb-4 leading-relaxed">
        The thing about the hype-and-troll feedback loop is that it can&apos;t be fixed from the outside. Both ends are economically incentivized to keep doing what they&apos;re doing. The hype men have to keep raising. The cynical gatekeepers have to keep defending an identity that&apos;s under tidal stress. Neither group is going to wake up tomorrow and choose to be more reasonable. The only way the loop weakens is if the people in the middle — the ones actually shipping things — stop participating in either side&apos;s drama.
      </p>

      <p className="mb-4 leading-relaxed">
        That&apos;s where I&apos;m landing. The work is in the middle and it always has been. The engineers who matter are the ones quietly building production systems, using AI tools where they help, and ignoring them where they don&apos;t. The founders who matter are the ones quietly shipping products, respecting the engineering process, and treating AI as a productivity boost rather than a replacement for judgment. They&apos;re on every platform — LinkedIn, X, Facebook, the rest — but they&apos;re posting the work, not the drama. They&apos;re sharing what they shipped, what they learned, what surprised them, what they&apos;d do differently. The signal is there if you know to look for it. It just doesn&apos;t move as loud as the feedback loop, because real work usually doesn&apos;t.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">What to Actually Do</h2>

      <p className="mb-4 leading-relaxed">
        If you&apos;re a founder, stop reading the hype men. They need you to believe coding is solved so they can keep raising. The ones who actually want your money are the ones telling you the most flattering story about how cheap and easy your project will be without engineers. Notice the incentive.
      </p>

      <p className="mb-4 leading-relaxed">
        If you&apos;re an engineer, stop reading the cynical gatekeepers. They need you to believe AI is fake so their identity stays intact. The ones who are loudest about &quot;real engineers don&apos;t use AI&quot; are usually the ones most quietly afraid that they no longer have a moat without it. Notice that incentive too.
      </p>

      <p className="mb-4 leading-relaxed">
        The work is in the middle, where it always was. Build something. Ship it. Keep your judgment yours. And when the next hype cycle or the next backlash kicks up, remember the tidal forces are doing exactly what they&apos;re designed to do — stretching whatever isn&apos;t anchored to something solid. Anchor yourself to the work. The rest is gravity wells and fundraising decks.
      </p>
    </PostLayout>
  );
}
