import Article from '@/components/Article';
import markdownContent from './markdown/markdown-test.md';

export default function BlogPost() {
  return <Article content={markdownContent} />;
}