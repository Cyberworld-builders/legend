"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { trackEvent, getSession } from '@/lib/tracking';

interface Message {
  role: 'user' | 'bot' | 'jay';
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

const CHAT_STATE_KEY = 'cwb_chat_state';

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  hasOpened: boolean;
  emailCaptured: boolean;
  jayOnline: boolean;
}

function saveChatState(state: ChatState) {
  try {
    sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function loadChatState(): ChatState | null {
  try {
    const stored = sessionStorage.getItem(CHAT_STATE_KEY);
    if (stored) return JSON.parse(stored) as ChatState;
  } catch { /* ignore */ }
  return null;
}

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
          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#00ff00]/30 rounded text-[#00ff00] text-base placeholder-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-3 py-2 bg-[#00ff00] text-[#1a1a1a] rounded font-bold text-sm hover:bg-[#00cc00] transition disabled:opacity-50 flex items-center gap-1"
        >
          <Send size={14} />
        </button>
      </form>
      <p className="text-xs text-[#00ff00]/30 mt-1.5">Jay will reach out within 24 hours</p>
    </div>
  );
}

const ChatWidget = () => {
  const restored = useRef(loadChatState());
  const [isOpen, setIsOpen] = useState(restored.current?.isOpen ?? false);
  const [messages, setMessages] = useState<Message[]>(restored.current?.messages ?? [WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(restored.current?.emailCaptured ?? false);
  const [hasOpened, setHasOpened] = useState(restored.current?.hasOpened ?? false);
  const [jayOnline, setJayOnline] = useState(restored.current?.jayOnline ?? false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const impressionFired = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track impression once on mount
  useEffect(() => {
    if (!impressionFired.current) {
      impressionFired.current = true;
      trackEvent('chat_impression', {});
    }
  }, []);

  // Persist chat state to sessionStorage on every change
  useEffect(() => {
    saveChatState({ messages, isOpen, hasOpened, emailCaptured, jayOnline });
  }, [messages, isOpen, hasOpened, emailCaptured, jayOnline]);

  // Poll for Jay's messages when chat is open and there's been interaction
  useEffect(() => {
    if (!isOpen || messages.length <= 1) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    const session = getSession();
    const poll = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(session.session_id)}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.jayOnline !== undefined) {
          setJayOnline(data.jayOnline);
        }

        if (data.jayMessages && data.jayMessages.length > 0) {
          const newMsgs: Message[] = data.jayMessages
            .filter((m: string) => m !== '__CAPTURE__')
            .map((m: string) => ({ role: 'jay' as const, content: m }));

          const hasCaptureSignal = data.jayMessages.includes('__CAPTURE__');

          if (newMsgs.length > 0) {
            setMessages(prev => [...prev, ...newMsgs]);
          }
          if (hasCaptureSignal || data.showEmailCapture) {
            setShowEmailCapture(true);
          }
        }
      } catch {
        // Polling failures are silent
      }
    };

    pollRef.current = setInterval(poll, 4000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isOpen, messages.length]);

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
      setHasOpened(true);
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
        const newMsgs: Message[] = [];

        // Add Jay's messages first (if any came with this response)
        if (data.jayMessages && data.jayMessages.length > 0) {
          for (const jm of data.jayMessages) {
            if (jm !== '__CAPTURE__') {
              newMsgs.push({ role: 'jay', content: jm });
            }
          }
          if (data.jayMessages.includes('__CAPTURE__')) {
            setShowEmailCapture(true);
          }
          if (data.jayMessages.length > 0) {
            setJayOnline(true);
          }
        }

        // Then add bot response
        const botMsg: Message = {
          role: 'bot',
          content: data.response,
          quickReplies: Array.isArray(data.quickReplies) && data.quickReplies.length > 0
            ? data.quickReplies
            : undefined,
        };
        newMsgs.push(botMsg);
        setMessages((prev) => [...prev, ...newMsgs]);

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
      {/* Floating Chat Launcher */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg shadow-[#00ff00]/20 transition-all duration-300 ${
          isOpen
            ? 'p-3 bg-[#1a1a1a] border border-[#00ff00]/50 text-[#00ff00] hover:border-[#00ff00]'
            : 'px-4 py-3 bg-[#1a1a1a] border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00]/10 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Chat with us'}
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff00] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff00]" />
            </span>
            <MessageCircle size={20} />
            {!hasOpened && (
              <span className="text-sm font-bold tracking-wide">Chat</span>
            )}
          </>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-6 md:w-[400px] md:h-[600px] md:rounded-lg bg-[#2a2a2a] border-2 border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.3)] z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-[#1a1a1a] border-b border-[#00ff00]">
            <div>
              <h2 className="text-lg uppercase">CyberWorld Chat</h2>
              {jayOnline && (
                <span className="text-xs text-[#00ff00]/70 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                  Jay is online
                </span>
              )}
            </div>
            <button onClick={toggleChat} className="text-[#00ff00] hover:text-[#00cc00]">
              <X size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              msg.role === 'jay' ? (
                <div key={index} className="mb-3 text-left">
                  <div className="inline-block p-2 rounded-lg bg-[#003300] border border-[#00ff00]/60 text-[#00ff00] max-w-[85%]">
                    <span className="text-xs text-[#00ff00]/70 block mb-1 font-bold uppercase tracking-wider">Jay is online</span>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <ChatMessage
                  key={index}
                  content={msg.content}
                  role={msg.role}
                />
              )
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
                className="flex-1 p-2 bg-[#1a1a1a] text-[#00ff00] border border-[#00ff00] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00ff00] placeholder-[#00ff00]/50 text-base"
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

      {/* Backdrop for desktop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 hidden md:block z-40"
          onClick={toggleChat}
        />
      )}
    </>
  );
};

export default ChatWidget;
