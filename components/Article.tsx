import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
// import { addInternalLinks } from '@/lib/content-utils';

interface ArticleProps {
  content: string;
  currentSlug?: string;
}

export default function Article({ content }: ArticleProps) {
  // Temporarily disable internal links to test basic markdown parsing
  const enhancedContent = content; // currentSlug ? addInternalLinks(content, currentSlug) : content;
  const components: Components = {
    h1: (props) => <h1 className="text-4xl font-bold mb-6 text-[#00ff00]" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mb-4 text-[#00ff00]" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mb-3 text-[#00ff00]" {...props} />,
    h4: (props) => <h4 className="text-lg font-bold mb-2 text-[#00ff00]" {...props} />,
    h5: (props) => <h5 className="text-base font-bold mb-2 text-[#00ff00]" {...props} />,
    h6: (props) => <h6 className="text-sm font-bold mb-2 text-[#00ff00]" {...props} />,
    p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    strong: (props) => <strong className="font-bold text-[#00ff00]" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    a: (props) => {
      const { href, ...restProps } = props;
      const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
      
      return (
        <a 
          className="text-[#00ff00] hover:text-[#00cc00] hover:underline transition-colors" 
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...restProps} 
        />
      );
    },
    blockquote: (props) => (
      <blockquote className="border-l-4 border-[#00ff00] pl-4 italic mb-4" {...props} />
    ),
    code: (props) => {
      const { className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      return !isInline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-[#2a2a2a] px-1 py-0.5 rounded">
          {children}
        </code>
      );
    },
    table: (props) => (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-4" {...props} />
      </div>
    ),
    th: (props) => (
      <th className="border border-[#00ff00] px-4 py-2 text-left" {...props} />
    ),
    td: (props) => (
      <td className="border border-[#00ff00] px-4 py-2" {...props} />
    ),
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown 
          components={components}
          remarkPlugins={[remarkGfm]}
        >
          {enhancedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}