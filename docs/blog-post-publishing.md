# Blog Post Publishing Guide

Canonical reference for how blog posts go from creation to live on cyberworldbuilders.com. This applies to any agent, CI job, or human involved in the blog pipeline.

## Architecture Overview

```
TSX post file (source of truth)
  -> generate-post-index script (extracts metadata)
    -> lib/post-index.json (checked into git)
      -> Vercel build (next build consumes index as-is)
        -> Live site
```

Key principle: **`lib/post-index.json` is a committed artifact, not generated at build time.** Vercel's build command (`npm run lint && npm run build`) does NOT run index generation. The index must be up-to-date in the repo before deploy.

## Blog Post Format

Posts are React `.tsx` components in `app/blog/posts/`. Each file exports:

1. `metadata: PostMeta` — structured metadata object
2. A default component — the post content as JSX

```tsx
import type { PostMeta } from '@/lib/post-types';
import PostLayout from '@/components/PostLayout';

export const metadata: PostMeta = {
  title: "Post Title Here",
  description: "A short description for SEO and listings.",
  slug: "post-title-here",
  publishedDate: "2026-03-06",
  modifiedDate: "2026-03-06",
  keywords: ["keyword-one", "keyword-two"],
  canonicalUrl: "https://cyberworldbuilders.com/blog/post-title-here",
  topics: ["AI & Automation"],
  tags: ["tag-one", "tag-two"],
  category: "Technology",
  isFeatured: false,
  priority: 5,
};

export default function Post() {
  return (
    <PostLayout meta={metadata}>
      <h2>First Section</h2>
      <p>Content here...</p>
    </PostLayout>
  );
}
```

See `lib/post-types.ts` for the full `PostMeta` interface and `docs/frontmatter-example.md` for field descriptions.

## Publishing Steps

### 1. Create the TSX post file

Place it at `app/blog/posts/<slug>.tsx`. The slug in the filename must match `metadata.slug`.

### 2. Regenerate the blog index

```bash
npm run generate-post-index
```

This runs `scripts/generate-post-index-new.js`, which scans all `.tsx` files in `app/blog/posts/`, extracts metadata via regex, and writes `lib/post-index.json`.

### 3. Verify

```bash
# Confirm post count increased
node -e "console.log(require('./lib/post-index.json').count)"

# Confirm the new post is in the index
node -e "const idx = require('./lib/post-index.json'); console.log(idx.posts.find(p => p.slug === '<slug>') ? 'FOUND' : 'MISSING')"

# Build succeeds
npm run build
```

### 4. Commit both files

```bash
git add app/blog/posts/<slug>.tsx lib/post-index.json
git commit -m "feat: add blog post — <title>"
```

**Both files must be in the same commit (or at least the same PR).** If you commit the post without the updated index, the post won't appear on the site after deploy.

### 5. Deploy

- **Preview (draft):** Push to a feature branch. Vercel auto-deploys a preview URL.
- **Production:** Merge to `main`. Vercel auto-deploys to cyberworldbuilders.com.
- **Manual:** `vercel --prod` from the repo root.

## What Happens If the Index Is Stale

If `lib/post-index.json` is not regenerated after adding a post:

| What breaks | Why |
|-------------|-----|
| `/blog` listing | `getAllPosts()` reads from the index — post won't be listed |
| `/blog/<slug>` SSG | `generateStaticParams()` reads from the index — no static page generated |
| `/sitemap.xml` | Sitemap reads from the index — post won't be in sitemap |
| Related posts | Won't include the new post in suggestions |

The post file will exist on disk and could technically be loaded by a direct dynamic import, but without the index entry it's invisible to the rest of the system.

## Automated Pipeline Integration

For the GusClaw transcript-to-blog pipeline:

```
1. GET /api/automation/transcripts/next-unprocessed
2. Run editor pipeline (voice-dna + transcript-editor + stop-slop)
3. Generate TSX blog post component
4. npm run generate-post-index
5. git add app/blog/posts/<slug>.tsx lib/post-index.json
6. git commit + push + create PR
7. PATCH /api/automation/transcripts/:id { is_processed: true }
```

Step 4 is critical. If the transcript agent and index agent are separate jobs, the index agent must run on the same branch before the PR is merged.

See `docs/automation-api.md` for API endpoint details and authentication.

## Vercel Build Configuration

From `vercel.json`:

```json
{
  "buildCommand": "npm run lint && npm run build",
  "installCommand": "npm ci"
}
```

- `npm run lint` = `next lint`
- `npm run build` = `next build`

No index generation happens here. The build consumes whatever `lib/post-index.json` is checked in.

## Quick Reference

| Task | Command |
|------|---------|
| Regenerate index | `npm run generate-post-index` |
| Regenerate index (alias) | `npm run seo` |
| Local dev setup | `npm run dev:setup` |
| Build | `npm run build` |
| Dev server | `npm run dev` |
| Validate tags | `npm run validate-tags` |

## Related Docs

- `docs/automation-api.md` — Transcript pipeline API endpoints
- `docs/frontmatter-example.md` — Metadata field reference
- `docs/github-workflows.md` — CI workflows
- `lib/post-types.ts` — PostMeta TypeScript interface
- `scripts/generate-post-index-new.js` — Index generation source
