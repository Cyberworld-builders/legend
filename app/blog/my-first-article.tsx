import Article from '../../components/Article';

const markdownContent = `
# My First CyberWorld Article

Welcome to my first blog post on CyberWorld! I'm excited to share my journey as a builder in this futuristic tech platform.

## What is CyberWorld?

CyberWorld is a digital ecosystem for builders, creators, and innovators. It offers tools for:

- Authentication
- Payments
- And more!

## Why I Joined

I joined CyberWorld to leverage its powerful tools for my projects. The platform's focus on innovation makes it the perfect place for creators like me.

### My Goals

- Build innovative apps.
- Connect with other creators.
- Share my knowledge through this blog.

Check out my profiles on [GitHub](https://github.com/CyberWorld-builders) and [X](https://x.com/cyberbuilders) for more updates!
`;

export default function BlogPost() {
  return <Article content={markdownContent} />;
}