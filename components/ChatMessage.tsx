import React from 'react';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'bot';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role }) => {
  // Function to parse links and make them clickable
  const parseContent = (text: string) => {
    // Combined regex to match both external URLs and blog post links
    const linkRegex = /(https?:\/\/[^\s]+|\/blog\/[a-zA-Z0-9-]+)/g;
    
    const parts = text.split(linkRegex);
    
    return parts.map((part, index) => {
      // Check if this part matches our link pattern
      const isLink = /^(https?:\/\/[^\s]+|\/blog\/[a-zA-Z0-9-]+)$/.test(part);
      
      if (isLink) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ccff] hover:text-[#00aaff] underline"
          >
            {part}
          </a>
        );
      } else {
        // Regular text
        return part;
      }
    });
  };

  return (
    <div
      className={`mb-3 ${role === 'user' ? 'text-right' : 'text-left'}`}
    >
      <span
        className={`inline-block p-2 rounded-lg ${
          role === 'user'
            ? 'bg-[#00ff00] text-[#1a1a1a]'
            : 'bg-[#1a1a1a] text-[#00ff00]'
        }`}
      >
        {parseContent(content)}
      </span>
    </div>
  );
};

export default ChatMessage;