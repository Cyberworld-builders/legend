import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleProps {
  content: string;
}

const Article = ({ content }: ArticleProps) => {
  return (
    <div className="prose prose-invert max-w-none px-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 uppercase" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 uppercase" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mb-2 uppercase" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-[#1a1a1a] text-[#00ff00] p-1 rounded" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-[#1a1a1a] text-[#00ff00] p-4 rounded mb-4 overflow-x-auto" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Article;