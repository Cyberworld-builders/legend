import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Transitioning from Cable Contracting to Freelance Web Development: A Career Pivot",
  description: "A detailed account of transitioning from over three years as a cable installation contractor to becoming a full-time freelance web developer. Covers misclassification challenges, rediscovering programming skills, and the breakthrough moment leveraging Upwork to escape manual labor.",
  slug: "transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot",
  headerImage: "/images/transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot-hero.png",
  socialImage: "/images/transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot-hero.png",
  publishedDate: "2024-01-09",
  modifiedDate: "2026-03-05",
  keywords: ["career transition","cable contracting","freelance web development","misclassification","Charter Communications","Spectrum","Upwork","WordPress","PHP","MySQL","self-directed learning","global freelance market","career pivot","manual labor","programming skills"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot",
  topics: ["Career & Professional Development"],
  tags: ["career-transition","cable-contracting","freelance","web-development","misclassification","charter-communications","upwork","wordpress","PHP","MySQL","self-learning","global-market","career-pivot","manual-labor","programming"],
  series: "Career Journey",
  category: "Career",
  isFeatured: true,
  priority: 1,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>

      <h1 className="text-4xl font-bold mb-6 text-[#00ff00]">From Cable Trucks to Code: How I Left Contracting Behind</h1>
      <p className="mb-4 leading-relaxed">For over three years, circa 2012 to 2015, I worked as a cable installation contractor for Charter Communications (now Spectrum) through a company called Southern Cable. I say &quot;contractor,&quot; but that&apos;s generous. There was actually a class action lawsuit over it because the lines between employee and contractor were basically nonexistent. They controlled our schedules, assigned our jobs, held us to rigid standards. But when it came to payroll taxes, equipment costs, and the volatility of the pay? That was on us.</p>
      <p className="mb-4 leading-relaxed">The money was brutal. Some jobs paid $20 for four or five hours of work just to meet their technical quality assurance standards. If you failed TQA, you got chargebacks. During slow periods, I&apos;d make $20 in a day. And if you even thought about working for someone else, they&apos;d punish you for it. I once applied to a satellite company and suddenly a colleague&apos;s &quot;lost&quot; equipment started showing up on my account. That&apos;s the kind of operation it was.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Coding After 16-Hour Shifts</h2>
      <p className="mb-4 leading-relaxed">As cable work got worse, I started programming again. I had this old Windows XP machine that I loaded Ubuntu on, and after 16-hour cable shifts I&apos;d sit down and code for an hour. I fell asleep at the keyboard more times than I can count. I didn&apos;t have a plan to make money from it. I just wanted to stay sharp.</p>
      <p className="mb-4 leading-relaxed">I gravitated toward WordPress because it&apos;s PHP-based, and PHP was what I knew from my time at DocWorks. That job had me deep in monolithic PHP, SOAP/XML APIs, HL7 compliance work, JavaScript, MySQL. My DocWorks experience actually made me skeptical of MVC frameworks for a while, because the one Ruby on Rails system I&apos;d seen there was poorly implemented and left a bad taste. So I stuck with what I knew and started learning WordPress inside and out.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The First Upwork Job</h2>
      <p className="mb-4 leading-relaxed">In 2015, I found Upwork. WordPress and PHP jobs were everywhere on the platform, and I figured I could compete. My first job was a $20 fixed-price gig customizing a WordPress plugin. It ended up requiring a lot of JavaScript work, and it took me about a month. If you do the math on the hourly rate, it was terrible.</p>
      <p className="mb-4 leading-relaxed">But it was real contract work. I could negotiate. Nobody was assigning me jobs or docking my pay for made-up equipment losses. The client, Chris Bailey, paid the $20 plus a $20 bonus and asked for more work. I finished the follow-up in a few days and walked away with $100. That was the moment I knew freelancing could actually work.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Burning the Ships</h2>
      <p className="mb-4 leading-relaxed">On May 9, 2015 (or maybe 2016, I go back and forth on the exact year), Southern Cable lost its contract with Charter. I had a choice: go back to another low-paying plant job, or go all in on freelancing. I lined up $1,000 worth of Upwork jobs, ran a data cable out to our barn so I&apos;d have a quiet workspace, and coded for a solid week. I made the $1,000. That was it. I was done with cable.</p>
      <p className="mb-4 leading-relaxed">The difference between cable contracting and freelancing was simple. Freelancing let me negotiate, decline bad jobs, and build something. The global market on Upwork cared about what I could do, not where I went to school or what certifications I had. All those nights falling asleep at the keyboard after cable shifts, grinding through WordPress tutorials with no clear endgame, that&apos;s what got me here.</p>
      <p className="mb-4 leading-relaxed">Every time it rains, I think about climbing utility poles and crawling through attics. Now I work indoors. And when I get an unreasonable client, I don&apos;t have to take it. I can prioritize reason, finish the work if it makes sense, or just move on. That alone made the whole transition worth it.</p>

    </PostLayout>
  );
}
