'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, getSession } from '@/lib/tracking';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  role: 'user' | 'bot' | 'jay';
  content: string;
}

interface WhisperLine {
  text: string;
  /** Delay before this line starts typing (ms) */
  delay?: number;
}

// ---------------------------------------------------------------------------
// Page context — enriches every interaction, not just blog posts
// ---------------------------------------------------------------------------

import postIndex from '@/lib/post-index.json';

interface PostEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  topics: string[];
  tags: string[];
}

interface PageContext {
  path: string;
  pageType: 'blog-post' | 'blog-index' | 'service-tier' | 'service-meta' | 'case-study' | 'homepage' | 'other';
  article?: {
    slug: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    related: { slug: string; title: string }[];
  };
  serviceTier?: string;
}

const postsById = new Map<string, PostEntry>();
for (const p of postIndex.posts) {
  postsById.set(p.slug, p as PostEntry);
}

function getRelatedSlugs(current: PostEntry, max = 3): string[] {
  const scores: { slug: string; score: number }[] = [];
  for (const p of postIndex.posts) {
    if (p.slug === current.slug) continue;
    const overlap = (p.topics as string[]).filter(t => current.topics.includes(t)).length;
    if (overlap > 0) scores.push({ slug: p.slug, score: overlap });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, max).map(s => s.slug);
}

function buildPageContext(pathname: string): PageContext {
  // Blog post
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
    const post = postsById.get(slug);
    if (post) {
      const relatedSlugs = getRelatedSlugs(post);
      const related = relatedSlugs
        .map(s => postsById.get(s))
        .filter((p): p is PostEntry => !!p)
        .map(p => ({ slug: p.slug, title: p.title }));
      return {
        path: pathname,
        pageType: 'blog-post',
        article: {
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          tags: post.tags,
          related,
        },
      };
    }
    return { path: pathname, pageType: 'blog-post' };
  }

  if (pathname === '/blog' || pathname === '/blog/') {
    return { path: pathname, pageType: 'blog-index' };
  }

  // Service pages
  const tierMatch = pathname.match(/^\/services\/(digital-marketing|automation|custom-saas)\/?$/);
  if (tierMatch) {
    return { path: pathname, pageType: 'service-tier', serviceTier: tierMatch[1] };
  }
  if (pathname.startsWith('/services/') && pathname !== '/services/') {
    const tier = pathname.split('/')[2];
    return { path: pathname, pageType: 'service-meta', serviceTier: tier };
  }
  if (pathname === '/services' || pathname === '/services/') {
    return { path: pathname, pageType: 'service-tier' };
  }

  if (pathname === '/cemetery-software') {
    return { path: pathname, pageType: 'case-study' };
  }

  if (pathname === '/' || pathname === '') {
    return { path: pathname, pageType: 'homepage' };
  }

  return { path: pathname, pageType: 'other' };
}

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------

function useTypewriter(text: string, speed = 35, startTyping = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayed('');
      setDone(false);
      return;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Production: 45s linger, 35s prefetch. Set ?terminal=debug in URL to use 5s for testing.
const _isDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('terminal') === 'debug';
const LINGER_DELAY = _isDebug ? 5_000 : 45_000;
const PREFETCH_DELAY = _isDebug ? 2_000 : 35_000;
const JAY_TIMEOUT = 300_000;    // 5 minutes before funnel fallback kicks in
const REWHISPER_INTERVAL = _isDebug ? 15_000 : 90_000; // Periodic re-whisper every 90s
const CHAT_STATE_KEY = 'cwb_terminal_state';

// ---------------------------------------------------------------------------
// Session persistence
// ---------------------------------------------------------------------------

interface TerminalState {
  messages: Message[];
  minimized: boolean;
  engagedAt: number | null;  // timestamp when user first engaged
}

function saveState(state: TerminalState) {
  try {
    sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function loadState(): TerminalState | null {
  try {
    const stored = sessionStorage.getItem(CHAT_STATE_KEY);
    if (stored) return JSON.parse(stored) as TerminalState;
  } catch { /* ignore */ }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TerminalWhisper() {
  const pathname = usePathname();
  const restored = useRef<TerminalState | null>(null);
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'whispered' | 'engaged' | 'minimized'>('waiting');
  const [whisperLines, setWhisperLines] = useState<WhisperLine[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [typingStarted, setTypingStarted] = useState<boolean[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jayOnline, setJayOnline] = useState(false);
  const [engagedAt, setEngagedAt] = useState<number | null>(null);
  const [jayResponded, setJayResponded] = useState(false);
  const restoredOnce = useRef(false);

  const pageContextRef = useRef<PageContext | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const impressionFired = useRef(false);
  const whisperFetched = useRef(false);
  const autoSubmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWhisperPath = useRef<string | null>(null);
  const rewhisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeFired = useRef(false);

  // Restore session state client-side only (avoids hydration mismatch)
  useEffect(() => {
    if (restoredOnce.current) return;
    restoredOnce.current = true;
    const state = loadState();
    if (state) {
      restored.current = state;
      if (state.messages.length > 0) setMessages(state.messages);
      if (state.engagedAt) setEngagedAt(state.engagedAt);
      if (state.minimized) setPhase('minimized');
      else if (state.messages.length > 0) setPhase('engaged');
    }
  }, []);

  // Build page context on mount + navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    pageContextRef.current = buildPageContext(pathname);
  }, [pathname]);

  // Persist state
  useEffect(() => {
    saveState({
      messages,
      minimized: phase === 'minimized',
      engagedAt,
    });
  }, [messages, phase, engagedAt]);

  // Fetch a fresh whisper from GusClaw (used by initial prefetch, navigation, and periodic re-whisper)
  const fetchWhisper = useCallback(async () => {
    try {
      const ctx = buildPageContext(pathname);
      pageContextRef.current = ctx;
      const session = getSession();
      const res = await fetch('/api/chat/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.session_id,
          pageContext: ctx,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lines && Array.isArray(data.lines) && data.lines.length >= 2) {
          const lines: WhisperLine[] = data.lines.map((line: string, i: number) => ({
            text: `> ${line}`,
            delay: i === 0 ? 0 : 4000,
          }));
          setWhisperLines(lines);
          setTypingStarted(new Array(lines.length).fill(false));
          setCurrentLineIdx(0);
          return;
        }
        if (data.hook && data.followUp) {
          setWhisperLines([
            { text: `> ${data.hook}`, delay: 0 },
            { text: `> ${data.followUp}`, delay: 4000 },
          ]);
          setTypingStarted([false, false]);
          setCurrentLineIdx(0);
          return;
        }
      }
    } catch { /* fall through to fallback */ }

    setWhisperLines([
      { text: '> systems online', delay: 0 },
      { text: '> monitoring page activity', delay: 3000 },
      { text: '> something on your mind? [y/n]', delay: 4000 },
    ]);
    setTypingStarted([false, false, false]);
    setCurrentLineIdx(0);
  }, [pathname]);

  // Pre-fetch whisper from GusClaw (initial load only — no callback deps to avoid timer resets)
  useEffect(() => {
    if (phase !== 'waiting' || whisperFetched.current) return;

    const timer = setTimeout(async () => {
      if (whisperFetched.current) return;
      whisperFetched.current = true;
      lastWhisperPath.current = window.location.pathname;
      await fetchWhisper();
    }, PREFETCH_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Re-fire whisper on page navigation (only when not engaged/minimized)
  useEffect(() => {
    if (phase === 'engaged' || phase === 'minimized' || phase === 'waiting') return;
    if (!lastWhisperPath.current || lastWhisperPath.current === pathname) return;

    // New page — reset and fetch fresh whisper
    lastWhisperPath.current = pathname;
    nudgeFired.current = false;
    setPhase('typing');
    fetchWhisper();
    trackEvent('terminal_whisper_refire', { page: pathname, trigger: 'navigation' });
  }, [pathname, phase, fetchWhisper]);

  // Periodic re-whisper every ~90s while idle (typing/whispered but not engaged/minimized)
  useEffect(() => {
    if (phase !== 'whispered') {
      if (rewhisperTimer.current) { clearTimeout(rewhisperTimer.current); rewhisperTimer.current = null; }
      return;
    }

    rewhisperTimer.current = setTimeout(async () => {
      // Don't re-whisper if they engaged or minimized while waiting
      lastWhisperPath.current = pathname;
      nudgeFired.current = false;
      await fetchWhisper();
      setPhase('typing');
      trackEvent('terminal_whisper_refire', { page: pathname, trigger: 'periodic' });
    }, REWHISPER_INTERVAL);

    return () => {
      if (rewhisperTimer.current) { clearTimeout(rewhisperTimer.current); rewhisperTimer.current = null; }
    };
  }, [phase, pathname, fetchWhisper]);

  // Linger timer — reveal after delay
  useEffect(() => {
    if (phase !== 'waiting') return;

    const timer = setTimeout(() => {
      setPhase('typing');
      if (!impressionFired.current) {
        impressionFired.current = true;
        trackEvent('terminal_whisper_impression', { page: window.location.pathname });
      }
    }, LINGER_DELAY);

    return () => clearTimeout(timer);
  }, [phase]);

  // Drive the typewriter sequence line by line
  useEffect(() => {
    if (phase !== 'typing' || whisperLines.length === 0) return;

    if (currentLineIdx === 0 && !typingStarted[0]) {
      setTypingStarted(prev => {
        const next = [...prev];
        next[0] = true;
        return next;
      });
    }
  }, [phase, whisperLines, currentLineIdx, typingStarted]);

  const handleLineDone = useCallback((lineIdx: number) => {
    if (lineIdx < whisperLines.length - 1) {
      const nextDelay = whisperLines[lineIdx + 1]?.delay ?? 800;
      setTimeout(() => {
        setCurrentLineIdx(lineIdx + 1);
        setTypingStarted(prev => {
          const next = [...prev];
          next[lineIdx + 1] = true;
          return next;
        });
      }, nextDelay);
    } else {
      setPhase('whispered');
    }
  }, [whisperLines]);

  // Nudge if they sit at the whispered y/n without clicking
  useEffect(() => {
    if (phase !== 'whispered' || nudgeFired.current) return;

    const nudgeDelay = _isDebug ? 8_000 : 30_000;
    const timer = setTimeout(() => {
      if (nudgeFired.current) return;
      nudgeFired.current = true;
      // Append a nudge line and switch back to typing to animate it
      setWhisperLines(prev => [
        ...prev,
        { text: '> jay built this — want me to get him on the line? [y/n]', delay: 0 },
      ]);
      setCurrentLineIdx(prev => prev + 1);
      setTypingStarted(prev => [...prev, true]);
      setPhase('typing');
    }, nudgeDelay);

    return () => clearTimeout(timer);
  }, [phase]);

  // Poll for Jay's messages when engaged
  useEffect(() => {
    if (phase !== 'engaged' || messages.length === 0) {
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
        if (data.jayOnline !== undefined) setJayOnline(data.jayOnline);
        if (data.jayMessages?.length > 0) {
          const newMsgs: Message[] = data.jayMessages
            .filter((m: string) => m !== '__CAPTURE__')
            .map((m: string) => ({ role: 'jay' as const, content: m }));
          if (newMsgs.length > 0) {
            setMessages(prev => [...prev, ...newMsgs]);
            setJayResponded(true);
          }
        }
      } catch { /* silent */ }
    };

    pollRef.current = setInterval(poll, 4000);
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [phase, messages.length]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when entering engaged mode
  useEffect(() => {
    if (phase === 'engaged') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase]);

  // Determine if funnel mode should activate (Jay hasn't responded in 5 min)
  const funnelActive = engagedAt !== null && !jayResponded && (Date.now() - engagedAt > JAY_TIMEOUT);

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    // Clear auto-submit timer to prevent double-fire
    if (autoSubmitTimer.current) { clearTimeout(autoSubmitTimer.current); autoSubmitTimer.current = null; }

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    const userMsgCount = updated.filter(m => m.role === 'user').length;
    trackEvent('terminal_message_sent', { message_count: userMsgCount });

    try {
      const session = getSession();
      const history = messages.map(m => ({
        role: m.role === 'jay' ? 'bot' as const : m.role,
        content: m.content,
      }));

      const ctx = pageContextRef.current ?? buildPageContext(window.location.pathname);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          sessionId: session.session_id,
          page: window.location.pathname,
          pageContext: ctx,
          funnelActive,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: 'bot', content: '> connection lost. try again.' }]);
      } else {
        const newMsgs: Message[] = [];

        if (data.jayMessages?.length > 0) {
          for (const jm of data.jayMessages) {
            if (jm !== '__CAPTURE__') newMsgs.push({ role: 'jay', content: jm });
          }
          if (data.jayMessages.length > 0) {
            setJayOnline(true);
            setJayResponded(true);
          }
        }

        newMsgs.push({ role: 'bot', content: data.response });
        setMessages(prev => [...prev, ...newMsgs]);

        // Only honor funnel signals (email capture, quick replies) after Jay timeout
        // Before that, GusClaw should be in pure conversation mode
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '> connection lost. try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleWhisperClick = () => {
    if (phase === 'whispered' || phase === 'typing') {
      setPhase('engaged');
      setEngagedAt(Date.now());
      trackEvent('terminal_whisper_engaged', { page: window.location.pathname });
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhase('minimized');
    trackEvent('terminal_whisper_minimized', {});
  };

  const handleExpand = () => {
    setPhase('engaged');
    trackEvent('terminal_whisper_expanded', {});
  };

  // Parse message content — strip blog links from text, render them as cards below
  const renderContent = (text: string) => {
    const blogLinkRegex = /\/blog\/[a-zA-Z0-9-]+/g;
    const externalLinkRegex = /(https?:\/\/[^\s]+)/g;

    // Collect blog slugs
    const blogSlugs: string[] = [];
    let match;
    while ((match = blogLinkRegex.exec(text)) !== null) {
      const slug = match[0].replace('/blog/', '');
      if (!blogSlugs.includes(slug)) blogSlugs.push(slug);
    }

    // Strip blog links from the text body
    const cleanedText = text
      .replace(/\/blog\/[a-zA-Z0-9-]+/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Parse remaining text for external URLs
    const textParts = cleanedText.split(externalLinkRegex);
    const inlineContent = textParts.map((part, idx) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-[#00ccff] underline underline-offset-2 decoration-[#00ccff]/30 hover:decoration-[#00ccff]">
            {part}
          </a>
        );
      }
      return <span key={idx}>{part}</span>;
    });

    // Build blog cards
    const blogCards = blogSlugs.map(slug => {
      const post = postsById.get(slug);
      const fullEntry = postIndex.posts.find(p => p.slug === slug);
      const img = fullEntry?.headerImage;
      return (
        <a
          key={slug}
          href={`/blog/${slug}`}
          className="flex gap-2 mt-1.5 px-2 py-1.5 rounded border border-[#00ff00]/15 bg-[#00ff00]/5 hover:bg-[#00ff00]/10 transition-colors group/link"
        >
          {img && (
            <img
              src={img}
              alt=""
              className="w-10 h-10 rounded object-cover flex-shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[#00ff00]/80 group-hover/link:text-[#00ff00] transition-colors text-xs font-medium truncate">
              {post?.title ?? slug}
            </div>
            {post?.description && (
              <div className="text-[#00ff00]/40 text-[10px] leading-tight line-clamp-2 mt-0.5">
                {post.description}
              </div>
            )}
          </div>
        </a>
      );
    });

    return (
      <>
        <span>{inlineContent}</span>
        {blogCards.length > 0 && <div className="flex flex-col">{blogCards}</div>}
      </>
    );
  };

  if (phase === 'waiting') return null;

  return (
    <div
      className="fixed bottom-0 left-0 z-50 font-mono text-xs select-none"
      style={phase !== 'engaged'
        ? { maxWidth: 'min(520px, calc(100vw - 16px))' }
        : { width: 'min(640px, calc(100vw - 24px))', height: 'min(480px, calc(100dvh - 80px))' }
      }
    >
      {/* Whisper phase — ghostly text crawl, fading upward like credits */}
      {(phase === 'typing' || phase === 'whispered') && (
        <div
          onClick={handleWhisperClick}
          className="cursor-pointer pb-3 pl-4 pr-6"
          role="button"
          tabIndex={0}
          aria-label="Open terminal"
          onKeyDown={(e) => { if (e.key === 'Enter') handleWhisperClick(); }}
          style={{
            /*
             * Single mask fades BOTH text and its background together.
             * The bg is on this same element so it grows with content — no
             * empty dark box visible before text appears.
             * Vertical: ghost at top → solid at bottom.
             * Horizontal: fade on both left and right edges.
             */
            background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.1) 35%, rgba(10,10,10,0.5) 52%, rgba(10,10,10,0.85) 64%, rgba(10,10,10,0.98) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.05) 8%, rgba(0,0,0,0.1) 18%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.85) 58%, black 66%), linear-gradient(to right, black 0%, black 80%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.05) 8%, rgba(0,0,0,0.1) 18%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.85) 58%, black 66%), linear-gradient(to right, black 0%, black 80%, rgba(0,0,0,0.5) 92%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <div className="space-y-1">
            {whisperLines.map((line, i) => (
              <WhisperLineRenderer
                key={i}
                text={line.text}
                startTyping={typingStarted[i] ?? false}
                isLast={i === whisperLines.length - 1 || i === currentLineIdx}
                isFinalLine={i === whisperLines.length - 1}
                onDone={() => handleLineDone(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Engaged phase — full-screen conversational terminal */}
      {phase === 'engaged' && (
        <div className="flex flex-col w-full h-full overflow-hidden rounded-md border border-[#00ff00]/15 shadow-[0_0_20px_rgba(0,255,0,0.05)] bg-[#0a0a0a]/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#00ff00]/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff00]/40 text-[10px] tracking-widest uppercase">terminal</span>
              {jayOnline && (
                <span className="flex items-center gap-1 text-[10px] text-[#00ff00]/50">
                  <span className="w-1 h-1 rounded-full bg-[#00ff00] animate-pulse" />
                  live
                </span>
              )}
            </div>
            <button
              onClick={handleMinimize}
              className="text-[#00ff00]/30 hover:text-[#00ff00]/60 transition-colors text-[10px] leading-none"
              aria-label="Close terminal"
            >
              x
            </button>
          </div>

          <div
            className="flex-1 px-4 py-3 overflow-y-auto break-words"
            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
          >
            {messages.length === 0 && whisperLines.map((line, i) => (
              <div key={`w-${i}`} className="text-[#00ff00]/50 leading-relaxed">
                {line.text}
              </div>
            ))}

            {messages.map((msg, i) => (
              <div key={i} className="leading-relaxed">
                {msg.role === 'user' ? (
                  <div className="text-[#00ff00]">
                    <span className="text-[#00ff00]/40">{'> '}</span>
                    {msg.content}
                  </div>
                ) : msg.role === 'jay' ? (
                  <div className="text-[#00ccff]">
                    <span className="text-[#00ccff]/40">jay: </span>
                    {renderContent(msg.content)}
                  </div>
                ) : (
                  <div className="text-[#00ff00]/70">
                    {renderContent(msg.content)}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-[#00ff00]/30 animate-pulse">...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center border-t border-[#00ff00]/10 px-4 py-3 flex-shrink-0">
            <span className="text-[#00ff00]/40 mr-1.5 flex-shrink-0">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                const val = e.target.value;
                setInput(val);
                // Auto-submit after 2.5s typing pause (helps mobile users who can't find Enter)
                if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
                if (val.trim()) {
                  autoSubmitTimer.current = setTimeout(() => {
                    if (val.trim() && !isLoading) sendMessage(val);
                  }, 5000);
                }
              }}
              disabled={isLoading}
              className="flex-1 bg-transparent text-[#00ff00] text-xs outline-none placeholder-[#00ff00]/20 caret-[#00ff00]"
              placeholder=""
              aria-label="Terminal input"
              autoComplete="off"
            />
            <span className={`w-1.5 h-3 bg-[#00ff00] ml-0.5 flex-shrink-0 ${!input ? 'animate-pulse' : 'opacity-0'}`} />
          </form>
        </div>
      )}

      {/* Minimized state — tiny expand arrow */}
      {phase === 'minimized' && (
        <button
          onClick={handleExpand}
          className="m-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0a0a0a]/90 border border-[#00ff00]/15 text-[#00ff00]/30 hover:text-[#00ff00]/60 hover:border-[#00ff00]/30 transition-colors font-mono text-xs"
          aria-label="Expand terminal"
        >
          <span>{'>'}</span>
          <span className="w-1.5 h-3 bg-current animate-pulse" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Whisper line with typewriter
// ---------------------------------------------------------------------------

function WhisperLineRenderer({
  text,
  startTyping,
  isLast,
  isFinalLine,
  onDone,
}: {
  text: string;
  startTyping: boolean;
  isLast: boolean;
  isFinalLine: boolean;
  onDone: () => void;
}) {
  const { displayed, done } = useTypewriter(text, 30, startTyping);
  const firedDone = useRef(false);

  useEffect(() => {
    if (done && !firedDone.current) {
      firedDone.current = true;
      onDone();
    }
  }, [done, onDone]);

  if (!startTyping) return null;

  // Final line (the y/n question) is fully bright — all others are ghostly
  const textClass = isFinalLine
    ? 'text-[#00ff00] leading-relaxed'
    : 'text-[#00ff00]/50 leading-relaxed';

  return (
    <div className={textClass}>
      {displayed}
      {isLast && !done && (
        <span
          className="inline-block w-2 h-3.5 bg-[#00ff00] align-middle ml-px"
          style={{ animation: 'pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />
      )}
      {isLast && done && (
        <span
          className="inline-block w-2 h-3.5 bg-[#00ff00]/80 align-middle ml-px"
          style={{ animation: 'pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />
      )}
    </div>
  );
}
