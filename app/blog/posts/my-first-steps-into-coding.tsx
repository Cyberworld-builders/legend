import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "My First Steps into Coding: A Biographical Journey",
  description: "A personal journey through the early days of coding, from learning HTML and CSS to building my first Flash website and transitioning into software development at a medical records startup.",
  slug: "my-first-steps-into-coding",
  headerImage: "/images/my-first-steps-into-coding-hero.png",
  socialImage: "/images/my-first-steps-into-coding-hero.png",
  publishedDate: "2024-01-05",
  modifiedDate: "2026-03-05",
  keywords: ["coding journey","HTML","CSS","Flash","web development","career transition","self-directed learning","programming","software development","biographical","early career","technology"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/my-first-steps-into-coding",
  topics: ["Career & Professional Development"],
  tags: ["coding-journey","web-development","career-transition","biographical","early-career","self-learning","programming","technology"],
  series: "Career Journey",
  category: "Career",
  isFeatured: true,
  priority: 7,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>

      <h1 className="text-4xl font-bold mb-6 text-[#00ff00]">My First Steps into Coding</h1>
      <p className="mb-4 leading-relaxed">It&apos;s kind of shameful that it took so long. If I could talk to my younger self, I&apos;d say: with that first computer, that basic word-processing Tandy machine from the &apos;80s or early &apos;90s, or those Apple IIe machines at school, I could have gone all in for computers and programming. The teachers were there, I had one at home. I should have gotten more into code. But it is what it is.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">HTML in a Crash Pad</h2>
      <p className="mb-4 leading-relaxed">The first time I actually did anything code-related was at this apartment I used to crash at in my early 20s. I didn&apos;t live there. I was basically homeless, by choice, really. Just kind of a drifter, and that was one of the apartments I stayed at a lot. There was a girl who&apos;d visit someone who lived there, and she&apos;d taken classes on HTML and CSS. She showed me a few things, and I just went off on my own, nerding out, seeing what I could do with this basic foundational knowledge.</p>
      <p className="mb-4 leading-relaxed">When I was a kid with a dial-up internet connection, I was obsessed with how websites were made. I always wanted to make my own. I wanted to mod Quake levels too, but never did. So running into someone who actually knew HTML was a big deal. I remember thinking, &quot;That&apos;s it? That&apos;s all there is to it?&quot; I started building all kinds of stuff, local websites, never pushing anything to a domain. But I could actually do it, and that was enough.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Notebooks on a Forklift</h2>
      <p className="mb-4 leading-relaxed">Later, when I was working in a grocery warehouse on a forklift, I had two notebooks. In one, I&apos;d write story ideas. In the other, I&apos;d draw websites and write out pseudocode and code logic, designing sites with what would end up being common functionality. Not having access to computers, I folded up those notebooks, stuck them in my pockets, and pulled them out during downtime on 12-hour night shifts, 5 PM to 5 AM.</p>
      <p className="mb-4 leading-relaxed">At 2, 3, or 4 in the morning, while everyone else was smoking cigarettes and gossiping about company politics, I was writing. I didn&apos;t even have a phone. No smartphones then, pre-iPhone days. Steve Jobs&apos; original iPhone reveal will tell you what kind of phone I had, and I shared it with my wife, who stayed home with the kids. I went phoneless to the warehouse and would draw websites and write ideas in a notebook.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Building scaryprankster.com with Flash</h2>
      <p className="mb-4 leading-relaxed">I finally built a computer out of the most basic parts I could get away with and used it to build an actual website. A Flash website, because Flash was really popular then. Macromedia Flash, with Dreamweaver to help generate some code. Flash later got rolled into Adobe, and when HTML5 came out, it went away altogether.</p>
      <p className="mb-4 leading-relaxed">The site was <em>scaryprankster.com</em>, geared toward my personal interests. Psychedelic, horror-oriented, with a rebellious, punk rock, gothy, trippy attitude. It was for music, storytelling, and art. A community site for artists and creators, but really a personal creative outlet that could lead to networking and building a community.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">From the Plant to a Doctor&apos;s Office</h2>
      <p className="mb-4 leading-relaxed">That site was enough to demonstrate some web development capabilities. Remote work wasn&apos;t really a thing then. You didn&apos;t expect to do it. I thought if I could show any ability, I might get a job at a computer repair shop or something. I kept working at the plant.</p>
      <p className="mb-4 leading-relaxed">Then my wife found an ad in a local magazine called <em>The Swapper</em> for an electronic medical records system some local doctors had developed. I responded, basically saying, &quot;I can learn this. I don&apos;t know much, but I&apos;ve started to learn, and I can figure it out.&quot; I used all my vacation days from the plant. Five a year, plus weekends, giving me nine days to try it out.</p>
      <p className="mb-4 leading-relaxed">I took a week at the doctor&apos;s office, and they said, &quot;Here&apos;s your computer, there&apos;s the server. Write a script to read these files and insert data into the database, then write another to query the database and update a file with the list.&quot; It took me a while, but by the end of the day, I was starting to get it. Before that, I&apos;d written one PHP script. A simple form submission with a bit of PHP logic for authentication, probably using XAMPP for the database. That was all I&apos;d done with server-side scripting.</p>
      <p className="mb-4 leading-relaxed">The week went well. I learned fast and took a pay cut to do it.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Bad Habits, Good Exposure</h2>
      <p className="mb-4 leading-relaxed">It was a great experience, though I picked up bad habits that offset some of the gains. When I later worked with serious software companies, I had to unlearn a lot of bad practices and ideas. Some things I&apos;d been taught were stupid were actually smart choices at the time. That cynicism was burned into my brain, which was dumb.</p>
      <p className="mb-4 leading-relaxed">But the most important thing about that experience was spending two years hands-on with computers, surrounded by people who knew more or expected me to learn and be responsible for their systems. After years in a grocery warehouse with no access to computers or phones, just manual labor and ideas on paper, finally having access to computers again felt like I&apos;d been hiding under a rock. Those two years with Google in front of me all day were like being a kid with encyclopedias in the &apos;80s, or having smart parents and a big sister teaching me.</p>
      <p className="mb-4 leading-relaxed">As bad as the habits were, the exposure to technology was worth it. It was the right decision at the time, and one of the most important things I ever did was get out of that plant and back on computers.</p>

    </PostLayout>
  );
}
