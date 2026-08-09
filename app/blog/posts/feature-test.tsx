/**
 * Generated from living-document publish worker
 * DO NOT EDIT MANUALLY
 */

import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Feature Test",
  description: "A brief exploration of the voice recording feature and its potential.",
  slug: "feature-test",
  publishedDate: "2026-08-09",
  modifiedDate: "2026-08-09",
  keywords: ["voice recording", "testing", "feature test"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/feature-test",
  topics: ["AI & Automation"],
  tags: ["voice-memos", "transcripts-memory"],
  series: "",
  category: "Technology",
  isDraft: true,
  isFeatured: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Testing the Voice Recording Feature"}</h2>
      <p className="mb-4 leading-relaxed">{"Test, test. This is a test of the voice recording feature."}</p>
      <h3 className="text-xl font-bold mb-3 mt-6 text-[#00ff00]">{"Initial Impression"}</h3>
      <p className="mb-4 leading-relaxed">{"Initially, I was skeptical about how well this would work. The idea of capturing my voice and converting it into text seemed both exciting and daunting."}</p>
      <h3 className="text-xl font-bold mb-3 mt-6 text-[#00ff00]">{"Conclusion"}</h3>
      <p className="mb-4 leading-relaxed">{"Overall, the voice recording feature has been a useful smoke test for the living-document publish path."}</p>
    </PostLayout>
  );
}
