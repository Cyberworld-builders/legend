/**
 * Generated from living-document publish worker
 * DO NOT EDIT MANUALLY
 */

import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Comment Workflow and the Living Document Layer",
  description: "Jay on moving comments off raw transcripts into a living-document layer agents can keep updating.",
  slug: "comment-workflow-living-document-layer",
  publishedDate: "2026-08-09",
  modifiedDate: "2026-08-09",
  keywords: ["living documents", "comment workflow", "knowledge base", "cyber app"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/comment-workflow-living-document-layer",
  topics: ["AI & Automation", "Development & Tools"],
  tags: ["living-documents", "comment-workflow", "cyberworld", "agent-workflow"],
  series: "",
  category: "Technology",
  isDraft: false,
  isFeatured: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Working Summary"}</h2>
      <p className="mb-4 leading-relaxed">{"This piece comes from a run of voice memos about how CyberWorld should treat raw transcripts versus living documents. The through-line: keep transcripts canonical, move conversation into a living layer, and let agents keep updating that layer over time."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Fragmentation and the Need for a Living Document Layer"}</h2>
      <p className="mb-4 leading-relaxed">{"Early on, the problem was simple: raw transcripts are fragmented. One recording can jump across barely related topics, which makes them hard to manage or cite cleanly."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Moving Comments Onto Living Documents"}</h2>
      <p className="mb-4 leading-relaxed">{"Later memos pushed the next step \u2014 stop treating the transcript page as the main comment surface. Copy and stitch transcript chunks into living documents, then put comments there so discussion sits on the evolving synthesis instead of the immutable raw take."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"What a Living Document Should Be"}</h2>
      <p className="mb-4 leading-relaxed">{"The living layer is meant to stay agent-owned and continuously updated: front matter for structure, body for the current take, citations back to source memos. Transcripts stay the timestamped canonical record; living docs are where the thought evolves."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Comments as a Conversation Loop"}</h2>
      <p className="mb-4 leading-relaxed">{"The comment system belongs on that living layer so agents can ask questions, humans can steer, and the document can absorb the answer without rewriting history in the source transcript."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Why This Matters for Publishing"}</h2>
      <p className="mb-4 leading-relaxed">{"Publishing gets more conversational when the source of truth for \"current take\" is a living document. That is a forcing function to talk with agents in the same place the article is forming, instead of trying to polish a single frozen memo into a post."}</p>
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]">{"Current Take"}</h2>
      <p className="mb-4 leading-relaxed">{"Keep transcripts raw and stable. Put stitching, synthesis, comments, and publish packets on living documents. That is the layer that should feed the blog."}</p>
    </PostLayout>
  );
}
