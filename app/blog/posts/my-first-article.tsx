import Article from '@/components/Article';

const markdownContent = `
# My First Article

Welcome to my first blog post! This is an example of how to structure your blog posts.

## Getting Started

Here are some tips for writing great blog posts:

- Use clear headings
- Break up text with lists
- Include code examples when relevant
- Add images to illustrate points

## Code Example

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Conclusion

Thanks for reading! Stay tuned for more articles.
`;

export default function BlogPost() {
  return {
    props: {
      content: markdownContent
    }
  };
}