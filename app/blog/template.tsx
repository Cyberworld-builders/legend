import Article from '../../components/Article';

const markdownContent = `
# Article Title

This is a placeholder for your article content. Replace this with your Markdown content.

## Section 1
- List item 1
- List item 2

## Section 2
Write your article here...
`;

export default function BlogPost() {
  return <Article content={markdownContent} />;
}