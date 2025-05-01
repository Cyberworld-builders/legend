import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface ArticleProps {
  content: string;
}

export default function Article({ content }: ArticleProps) {
  const components: Components = {
    h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mb-2" {...props} />,
    p: (props) => <p className="mb-4" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
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
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}