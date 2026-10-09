# Blog Post Publishing Guide

How a post goes from a file to live on cyberworldbuilders.com. Applies to any
agent, CI job, or human writing posts.

## Architecture

```
content/blog/<slug>.mdx   (source of truth: YAML frontmatter + markdown body)
  -> lib/posts.ts         (reads + validates every file at build time)
    -> next build         (pre-renders /blog/<slug>, tag pages, sitemap)
      -> Vercel           (preview on any branch, production on main)
```

There is no generated index and no database. Adding a post is one new file in
one commit.

## Post format

```mdx
---
title: "Post Title Here"
description: "One or two sentences for search results and listings."
slug: post-title-here
publishedDate: "2026-10-09"
modifiedDate: "2026-10-09"
headerImage: /images/post-title-here-hero.png
socialImage: /images/post-title-here-hero.png
canonicalUrl: https://cyberworldbuilders.com/blog/post-title-here
category: Technology
series: Entertainment Technology
topics:
  - AI & Automation
tags:
  - tag-one
  - tag-two
keywords:
  - keyword one
  - keyword two
isFeatured: false
isDraft: false
priority: 5
---

Opening paragraph in plain markdown.

## A section heading

Text with **bold**, *italics*, `code` and [links](https://example.com).

<PostCard slug="another-post-slug" />

<Figure
  src="/images/some-image.png"
  alt="What the image shows"
  caption="Optional caption."
/>
```

### Frontmatter rules

`lib/posts.ts` validates every file during the build. A bad file fails the
build (and therefore the Vercel preview) with a message naming the file and
field.

| Field | Required | Notes |
|---|---|---|
| `title`, `description` | yes | strings |
| `slug` | yes | must equal the filename without `.mdx` |
| `publishedDate` | yes | `YYYY-MM-DD`; quote it |
| `modifiedDate` | no | `YYYY-MM-DD`; defaults to `publishedDate` |
| `headerImage`, `socialImage`, `canonicalUrl`, `category`, `series`, `language` | no | strings |
| `topics`, `tags`, `keywords` | no | lists of strings; tags and keywords become `/blog/tag/<slug>` pages |
| `isDraft`, `isFeatured` | no | `true`/`false`; drafts are not built |
| `priority` | no | number; breaks ties between posts published the same day |

Any other field is rejected.

### Body rules

- Write plain markdown. Do not add classes or inline styles: all post styling
  lives in `components/mdx/MdxComponents.tsx`.
- Components available in posts: `<PostCard slug="..." />` (inline link card to
  another post) and `<Figure src alt caption />`.
- MDX treats `{`, `}`, `<` and `>` as syntax. Escape them with a backslash in
  prose (`\{`, `\<`).
- GitHub-flavored markdown (tables, strikethrough, autolinked URLs) is enabled.

## Publishing steps

1. Add `content/blog/<slug>.mdx` and any images under `public/images/`.
2. Check it: `npm run test:ci` (frontmatter checks) and `npm run build`.
3. Push a branch and open a PR. Vercel posts a preview URL.
4. Merge to `main` to publish.

Editing a post is the same: change the file, bump `modifiedDate`, open a PR.
