"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { trackEvent, getSession } from '@/lib/tracking';

interface Message {
  role: 'user' | 'bot';
  content: string;
  quickReplies?: string[];
  showEmailCapture?: boolean;
  ts?: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'bot',
  content: "Hey! I'm Jay's assistant at CyberWorld Builders. What brings you here today?",
  quickReplies: ['Marketing & Lead Gen', 'Custom Software', 'Automation', 'Just Browsing'],
};

/** Inline email/phone capture form rendered inside the chat. */
function InlineCaptureForm({ onSubmit, disabled }: { onSubmit: (value: string) => void; disabled: boolean }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <div className="mx-4 mb-3 p-3 bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('email')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mode === 'email'
              ? 'bg-[#00ff00]/20 border border-[#00ff00] text-[#00ff00]'
              : 'border border-[#00ff00]/20 text-[#00ff00]/50 hover:border-[#00ff00]/40'
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMode('phone')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mode === 'phone'
              ? 'bg-[#00ff00]/20 border border-[#00ff00] text-[#00ff00]'
              : 'border border-[#00ff00]/20 text-[#00ff00]/50 hover:border-[#00ff00]/40'
          }`}
        >
          Phone
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type={mode === 'email' ? 'email' : 'tel'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={mode === 'email' ? 'you@company.com' : '(555) 123-4567'}
          required
          disabled={disabled}
          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] text-sm placeholder-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-3 py-2 bg-[#00ff00] text-[#1a1a1a] rounded font-bold text-sm hover:bg-[#00cc00] transition disabled:opacity-50 flex items-center gap-1"
        >
          <Send size={14} />
        </button>
      </form>
      <p className="text-[10px] text-[#00ff00]/30 mt-1.5">Jay will reach out within 24 hours</p>
    </div>
  );
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const impressionFired = useRef(false);

  // Track impression once on mount
  useEffect(() => {
    if (!impressionFired.current) {
      impressionFired.current = true;
      trackEvent('chat_impression', {});
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmailCapture]);

  const toggleChat = () => {
    const willOpen = !isOpen;
    if (willOpen) {
      trackEvent('chat_open', {});
    }
    setIsOpen(willOpen);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    // Clear quick replies and email capture from the last bot message when user responds
    const clearedMessages = messages.map((m, i) =>
      i === messages.length - 1 && m.role === 'bot'
        ? { ...m, quickReplies: undefined, showEmailCapture: undefined }
        : m,
    );
    const updatedMessages = [...clearedMessages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setShowEmailCapture(false);
    setIsLoading(true);

    const userMsgCount = updatedMessages.filter(m => m.role === 'user').length;
    trackEvent('chat_message_sent', { message_count: userMsgCount });

    try {
      const session = getSession();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: clearedMessages,
          sessionId: session.session_id,
          page: window.location.pathname,
        }),
      });
      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, something went wrong.' }]);
      } else {
        const botMsg: Message = {
          role: 'bot',
          content: data.response,
          quickReplies: Array.isArray(data.quickReplies) && data.quickReplies.length > 0
            ? data.quickReplies
            : undefined,
        };
        setMessages((prev) => [...prev, botMsg]);

        // Show email capture form if API says so (and we haven't already captured)
        if (data.showEmailCapture && !emailCaptured) {
          setShowEmailCapture(true);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => sendMessage(input);
  const handleQuickReply = (reply: string) => sendMessage(reply);

  const handleEmailCapture = (value: string) => {
    // Send the contact info as a chat message so it flows through the normal path
    // The server-side extraction will pick it up
    setShowEmailCapture(false);
    setEmailCaptured(true);
    sendMessage(value);
  };

  // Get quick replies from the last message (if it's a bot message)
  const lastMessage = messages[messages.length - 1];
  const activeQuickReplies =
    !isLoading && !showEmailCapture && lastMessage?.role === 'bot' && lastMessage.quickReplies
      ? lastMessage.quickReplies
      : [];

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 bg-[#00ff00] text-[#1a1a1a] rounded-full shadow-lg hover:bg-[#00cc00] transition z-50"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-6 md:w-[400px] md:h-[600px] bg-[#2a2a2a] border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00] z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-[#1a1a1a] border-b border-[#00ff00]">
            <h2 className="text-lg uppercase">CyberWorld Chat</h2>
            <button onClick={toggleChat} className="text-[#00ff00] hover:text-[#00cc00]">
              <X size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                content={msg.content}
                role={msg.role}
              />
            ))}
            {isLoading && (
              <div className="mb-3 text-left">
                <span className="inline-block p-2 rounded-lg bg-[#1a1a1a] text-[#00ff00]/50 animate-pulse">
                  Thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Inline Email/Phone Capture Form */}
          {showEmailCapture && !isLoading && (
            <InlineCaptureForm onSubmit={handleEmailCapture} disabled={isLoading} />
          )}

          {/* Quick Reply Buttons */}
          {activeQuickReplies.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {activeQuickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 text-xs border border-[#00ff00]/50 text-[#00ff00] rounded-full hover:bg-[#00ff00]/20 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="p-4 border-t border-[#00ff00]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 bg-[#1a1a1a] text-[#00ff00] border border-[#00ff00] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00ff00] placeholder-[#00ff00]/50 text-sm"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-2 bg-[#00ff00] text-[#1a1a1a] rounded-sm hover:bg-[#00cc00] transition uppercase text-sm disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={toggleChat}
        />
      )}
    </>
  );
};

export default ChatWidget;
