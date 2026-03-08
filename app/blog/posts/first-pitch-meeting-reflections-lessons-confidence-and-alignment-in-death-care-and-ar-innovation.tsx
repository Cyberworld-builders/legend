import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "First Pitch Meeting Reflections: Lessons, Confidence, and Alignment in Death Care and AR Innovation",
  description: "Reflections on my first investor pitch meeting, its unexpected value as a forcing function for prototyping, and the alignment of death care solutions with augmented reality (AR) location-based experiences, reinforcing confidence to pursue the vision independently.",
  slug: "first-pitch-meeting-reflections-lessons-confidence-and-alignment-in-death-care-and-ar-innovation",
  headerImage: "/images/first-pitch-meeting-reflections-lessons-confidence-and-alignment-in-death-care-and-ar-innovation-hero.png",
  socialImage: "/images/first-pitch-meeting-reflections-lessons-confidence-and-alignment-in-death-care-and-ar-innovation-hero.png",
  publishedDate: "2025-10-15",
  modifiedDate: "2026-03-05",
  keywords: ["pitch meeting","investor pitch","death care technology","augmented reality","location-based experiences","prototype development","career alignment","digital marketing","cemetery management","entrepreneurial confidence"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/first-pitch-meeting-reflections-lessons-confidence-and-alignment-in-death-care-and-ar-innovation",
  topics: ["Career & Professional Development","AI & Automation","Entrepreneurship"],
  tags: ["pitch-reflections","death-care-ar","prototyping","investor-strategy","revenant-hollow"],
  category: "Technology",
  isFeatured: true,
  priority: 9,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>

      <h1 className="text-4xl font-bold mb-6 text-[#00ff00]">My First Pitch Meeting (and Why I Don&apos;t Need Their Money)</h1>
      <p className="mb-4 leading-relaxed">I had my first pitch meeting yesterday. Wild experience. I didn&apos;t even realize it was my first until afterward. I&apos;ve always been the CTO, the lead engineer. Someone else does the pitching. This time it was me, and I didn&apos;t clock that until the drive home.</p>
      <p className="mb-4 leading-relaxed">It went well. No funding agreement came out of it, but my confidence is through the roof. Which is funny, because right after the meeting I felt like the whole thing was a disaster.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Setup Was Already Off</h2>
      <p className="mb-4 leading-relaxed">The objective was simple: secure financing. The business owner had been connected to me through his manager, and I&apos;d built some rapport early on by troubleshooting his website. But as the meeting got closer, his energy shifted. Communications got odd. He grew distant.</p>
      <p className="mb-4 leading-relaxed">The meeting itself got canceled, then rescheduled late on a Sunday. Monday was packed with client work, so I stayed up late cramming. I wrote a 1,000-to-2,000-word plan (which actually started as a Grok prompt for vanilla HTML/JS) and built out CMS and CRM prototypes in about two hours. Phase three of the strategy, the AR and IoT stuff, was too advanced to demo live, so I described it through text and images.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">Reading the Room</h2>
      <p className="mb-4 leading-relaxed">When I walked in, the owner&apos;s energy was off. He seemed unmotivated, like he was doing a favor for his manager. Wishy-washy. I could tell the manager was the one who pushed for the meeting, and I got the sense he wanted cheap digital marketing, not the full phase two and three vision I was presenting.</p>
      <p className="mb-4 leading-relaxed">But the owner asked questions about phase three. Real questions, not just polite nodding. That told me something. Even someone who wasn&apos;t fully bought in could see the potential in what I was laying out.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">The Post-Meeting Spiral</h2>
      <p className="mb-4 leading-relaxed">Right after, I felt like I&apos;d wasted my time. I could&apos;ve been serving paying clients. I could&apos;ve spent that time with my son. My wife was actually more disappointed about it than I was, which is saying something. But I rebounded fast.</p>
      <p className="mb-4 leading-relaxed">I went back and looked at the demo I&apos;d put together. It was substantial. Near-MVP. I&apos;d built that in a couple hours on no sleep, and it was <em>good</em>. That&apos;s when the shift happened.</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">I Don&apos;t Need Them</h2>
      <p className="mb-4 leading-relaxed">The strategy is solid. CMS, CRM, AR/IoT for death care. I can execute this solo, or I can pitch it elsewhere. My wife has connections in the death care space, and there are investors out of state who won&apos;t have the small-town mindset I keep running into locally.</p>
      <p className="mb-4 leading-relaxed">The meeting was worth it for reasons I didn&apos;t expect. It forced me to document everything, prototype fast, and organize ideas that had been floating around. It proved I can pitch. And it confirmed that the work my wife and I are building toward in death care is aligned.</p>
      <p className="mb-4 leading-relaxed">I&apos;m dedicating real time to this now, daily and weekly. I&apos;m going to find the right investors. And honestly, that owner might look back on this as their &quot;Slack moment.&quot; They had a shot at something real and didn&apos;t see it.</p>
      <p className="mb-4 leading-relaxed">I&apos;m moving forward either way.</p>

    </PostLayout>
  );
}
