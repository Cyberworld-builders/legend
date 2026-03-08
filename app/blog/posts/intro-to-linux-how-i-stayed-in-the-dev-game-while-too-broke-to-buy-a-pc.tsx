import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Intro to Linux: How I Stayed in the Dev Game While Too Broke to Buy a PC",
  description: "A personal journey learning Linux, from first exposure at DocWorks EMR startup to necessity-driven adoption after being laid off. Details how Ubuntu transformed an end-of-life Windows XP machine into a functional development workstation, providing foundational skills in command-line operations, networking, and server management.",
  slug: "intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc",
  headerImage: "/images/intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc-hero.png",
  publishedDate: "2024-01-06",
  modifiedDate: "2026-03-05",
  keywords: ["Linux","Ubuntu","command line","networking","server management","development workstation","Windows XP","career development","self-directed learning","cloud architecture","full-stack development","enterprise development","Linux skills","career transition"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc",
  topics: ["Career & Professional Development","Development & Tools"],
  tags: ["linux","ubuntu","command-line","networking","server-management","development","career-transition","self-learning","cloud-architecture","enterprise","biographical","early-career"],
  series: "Career Journey",
  category: "Career",
  priority: 3,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>

      <h1 className="text-4xl font-bold mb-6 text-[#00ff00]">Intro to Linux: How I Stayed in the Dev Game While Too Broke to Buy a PC</h1>
      <p className="mb-4 leading-relaxed">My first full-time development job was at DocWorks, and I was surrounded by developers with computer science degrees, certifications, formal training. I was self-taught. One colleague there was deep into hacker culture, had his CCNA, had done time in local computer shops. He introduced me to Ubuntu. Showed me the graphical interface, probably right around the transition from Unity to GNOME. That was the first time I saw Linux as something a regular person could just install and use. I was a Windows guy, too broke for a Mac, and up until that point my only exposure to Linux was vague references in movies and hacker culture.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Colleague Who Gatekept Everything</h2>
      <p className="mb-4 leading-relaxed">I didn&apos;t learn much from him. He was the type to gatekeep information, send you down rabbit holes, and let you waste time figuring out things he could have explained in two minutes. His name was Justin. He was finishing a master&apos;s degree and seemed like he&apos;d have job offers lined up, but his personality made him impossible to learn from. He bragged about students failing his classes like it was a badge of honor. Teaching is a skill, and he didn&apos;t have it.</p>
      <p className="mb-4 leading-relaxed">Fast forward a year or two, I got fired from DocWorks. Bad decision on both sides. What happened was they pitted me against Justin and asked if I could take over his role. I didn&apos;t feel confident enough to say yes. I didn&apos;t want to throw him under the bus. In retrospect, I should have just asserted myself. It was about confidence, not evidence.</p>
      <p className="mb-4 leading-relaxed">Getting fired turned out to be a blessing. I avoided entrenching bad habits from DocWorks&apos; dysfunctional &quot;Franken system.&quot; The place gave me real experience with databases, servers, APIs, HIPAA compliance, but the codebase was a mess, and staying longer would have cemented bad patterns. I would&apos;ve become a lifer stuck in a poorly architected startup.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Cable Tech and Customer Service</h2>
      <p className="mb-4 leading-relaxed">I moved to contract work as a cable technician, installing modems and setting up internet for people. That job taught me things I didn&apos;t expect to need: customer service, effort estimation, how to translate technical solutions into terms a customer actually understands. Those skills ended up complementing my tech growth in ways I couldn&apos;t have predicted at the time.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Old XP Machine That Changed Everything</h2>
      <p className="mb-4 leading-relaxed">My real Linux breakthrough came after DocWorks. I had this old Windows XP machine. Microsoft had stopped security updates around 2012, 2013. The thing was end-of-life, nearly unusable, crashing constantly from years of bloatware. I couldn&apos;t afford a new computer.</p>
      <p className="mb-4 leading-relaxed">So I installed Ubuntu.</p>
      <p className="mb-4 leading-relaxed">It revived the machine. Linux is lightweight. Minimal default software. It freed up resources that Windows had been choking on for years. That computer got three more years of life out of it. Using Ubuntu as my primary workstation forced me to learn Bash, command-line operations, file management, package management with <code className="bg-gray-800 px-1 rounded text-sm">apt</code>, networking. It felt like magic, turning a dead machine into a functional development environment.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">How It Shaped Everything After</h2>
      <p className="mb-4 leading-relaxed">That Linux proficiency changed my career path. When I started picking up contract development work, I could actually claim Linux experience on paper. That led to roles managing servers, and eventually pushed me toward cloud architecture. The whole thing started because I was too broke to buy a new PC and installed Ubuntu out of necessity. That necessity pointed me toward full-stack development and cloud work, and Linux became a core part of how I operate professionally.</p>

    </PostLayout>
  );
}
