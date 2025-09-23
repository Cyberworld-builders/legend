# Frontmatter Example

This document shows how to use the new metadata system with YAML frontmatter in your blog posts.

## Example Frontmatter

Here's an example of what frontmatter should look like in your markdown files:

```yaml
---
title: "Building an Effective Web Presence for Professional Validation"
description: "Learn how to create a professional web presence that validates your expertise and attracts opportunities in the tech industry."
publishedDate: 2024-01-15
modifiedDate: 2024-01-20
lastReviewedDate: 2024-01-20
keywords:
  - web presence
  - professional validation
  - SEO
  - marketing
  - blogging
  - digital presence
topics:
  - Marketing & Business
  - Career & Professional Development
tags:
  - career
  - marketing
  - SEO
  - professional development
series: "Professional Development"
category: "Career"
socialImage: "/images/web-presence-social.jpg"
headerImage: "/images/web-presence-hero.jpg"
isDraft: false
isFeatured: true
priority: 5
canonicalUrl: "https://cyberworldbuilders.com/blog/building-an-effective-web-presence-for-professional-validation"
language: "en-US"
---
```

## Required vs Optional Fields

### Required Fields
- None! The system will extract title and description from your markdown content if not provided.

### Recommended Fields
- `title`: Custom title (otherwise extracted from first H1)
- `description`: SEO description (otherwise extracted from content)
- `publishedDate`: When the post was first published
- `modifiedDate`: When the post was last modified
- `lastReviewedDate`: When the post was last reviewed for accuracy
- `keywords`: SEO keywords for the post
- `topics`: Main topic categories (used for related posts)
- `tags`: Additional tags for categorization

### Optional Fields
- `series`: If the post is part of a series
- `category`: Main category for the post
- `socialImage`: Image for social media sharing
- `headerImage`: Hero image for the post
- `isDraft`: Set to true to hide from production
- `isFeatured`: Set to true to highlight the post
- `priority`: Numeric priority for ordering (higher = more important)
- `canonicalUrl`: Canonical URL for SEO
- `language`: Language code (defaults to "en-US")

## Date Formats

Use ISO date format (YYYY-MM-DD) for all date fields:
- `publishedDate: 2024-01-15`
- `modifiedDate: 2024-01-20`
- `lastReviewedDate: 2024-01-20`

## Topic Categories

Use these predefined topic categories for consistency:
- `AI & Automation`
- `Career & Professional Development`
- `Development & Tools`
- `Marketing & Business`
- `General`

## Maintenance Workflow

1. **When creating a new post**: Add frontmatter with at least `publishedDate`, `topics`, and `keywords`
2. **When updating content**: Update `modifiedDate` and `lastReviewedDate`
3. **Quarterly review**: Update `lastReviewedDate` for all posts
4. **SEO optimization**: Review and update `keywords` and `description`

## Migration from Current System

The new system is backward compatible. Existing posts without frontmatter will:
- Use file modification date as `publishedDate` and `modifiedDate`
- Extract title from first H1
- Extract description from content
- Use default author information
- Be categorized as "General" topic

To migrate existing posts:
1. Add frontmatter with proper dates
2. Add relevant topics and keywords
3. Update `lastReviewedDate` to current date
4. Test the post to ensure it displays correctly
