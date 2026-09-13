'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, Send, Loader2, User, Maximize2, Minimize2, Calculator, ExternalLink } from 'lucide-react';
import { CalculatorAction } from '@/lib/calculators/calculator-action';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  calculatorAction?: CalculatorAction;
}

const INITIAL_GREETING: Message = {
  role: 'model',
  parts: [{ text: "Hi! I'm IndiaWise AI 👋\nI can help you with IndiaWise calculators, explain your results, compare What-If scenarios, and guide you to the right calculator.\nWhat would you like to calculate?\n\n**Pro Tips:**\n- Click the **X** above to exit and clear this chat.\n- Click the **bottom logo** to sleep/minimize the chat without losing your history.\n\nSUGGESTED_QUESTIONS: [\"What is IndiaWise?\", \"Calculate Home Loan EMI\", \"How does What-If work?\"]" }]
};

export function MiniAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'full'>('default');

  const handleOpen = useCallback(() => {
    if (!hasStarted) {
      setMessages([INITIAL_GREETING]);
      setHasStarted(true);
    }
    setIsOpen(true);
  }, [hasStarted]);

  const confirmExit = () => {
    setMessages([]);
    setHasStarted(false);
    setIsOpen(false);
    setShowExitConfirm(false);
    setError(null);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && !showExitConfirm) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showExitConfirm]);

  // Lock body scroll in full-screen mode and preserve scroll position
  useEffect(() => {
    if (isOpen && viewMode === 'full') {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, viewMode]);

  // Keyboard shortcuts: Esc=minimize, C/E=open & write, F=fullscreen, Q=quit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else {
          setIsOpen(false);
          setViewMode('default');
        }
        return;
      }

      // Y/N for exit confirmation
      if (showExitConfirm) {
        if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          confirmExit();
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          setShowExitConfirm(false);
        }
        return;
      }

      if (isTyping) return;

      if ((e.key === 'c' || e.key === 'C') && !isOpen) {
        e.preventDefault();
        handleOpen();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else if ((e.key === 'e' || e.key === 'E') && isOpen) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if ((e.key === 'f' || e.key === 'F') && isOpen) {
        e.preventDefault();
        setViewMode(viewMode === 'full' ? 'default' : 'full');
      } else if ((e.key === 'q' || e.key === 'Q') && isOpen) {
        e.preventDefault();
        setShowExitConfirm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, viewMode, hasStarted, showExitConfirm, handleOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', parts: [{ text: userText }] }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: data.text }],
          calculatorAction: data.calculatorAction
        }
      ]);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const parseMessage = (rawText: string) => {
    let text = rawText;
    let suggestions: string[] = [];
    const sqIndex = text.lastIndexOf('SUGGESTED_QUESTIONS:');
    if (sqIndex !== -1) {
      try {
        const jsonStr = text.substring(sqIndex + 20).trim();
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) suggestions = parsed;
        text = text.substring(0, sqIndex).trim();
      } catch {
        // Fallback if AI didn't format JSON perfectly
      }
    }
    return { text, suggestions };
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      
      let isList = false;
      let content = line;
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        isList = true;
        content = line.substring(2);
      }

      // Fix for when Gemini wraps links in bold tags e.g. **[Link](url)**
      content = content.replace(/\*\*\[(.*?)\]\((.*?)\)\*\*/g, '[$1]($2)');

      const tokens: React.ReactNode[] = [];
      const regex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(https?:\/\/[^\s),]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      let lastIdx = 0;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIdx) {
          tokens.push(content.substring(lastIdx, match.index));
        }
        
        if (match[1]) {
          const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(match[1]);
          if (linkMatch) {
            const rawUrl = linkMatch[2];
            const isMailto = rawUrl.startsWith('mailto:');
            // Check if URL is an internal IndiaWise path or production site URL
            const isInternal = !isMailto && (
              rawUrl.startsWith('/') ||
              rawUrl.startsWith('https://indiawise.vercel.app') ||
              (typeof window !== 'undefined' && rawUrl.startsWith(window.location.origin))
            );
            
            let internalPath = rawUrl;
            if (rawUrl.startsWith('https://indiawise.vercel.app')) {
              internalPath = rawUrl.replace('https://indiawise.vercel.app', '') || '/';
            } else if (typeof window !== 'undefined' && rawUrl.startsWith(window.location.origin)) {
              internalPath = rawUrl.replace(window.location.origin, '') || '/';
            }

            // Ensure safe clean path without double encoding
            let cleanInternalPath = internalPath;
            try {
              cleanInternalPath = decodeURI(internalPath);
            } catch {
              cleanInternalPath = internalPath;
            }

            if (isInternal) {
              tokens.push(
                <Link key={match.index} href={cleanInternalPath} className="text-brand underline hover:text-navy font-semibold">
                  {linkMatch[1]}
                </Link>
              );
            } else if (isMailto) {
              tokens.push(
                <a key={match.index} href={rawUrl} className="text-brand underline hover:text-navy font-semibold">
                  {linkMatch[1]}
                </a>
              );
            } else {
              tokens.push(
                <a key={match.index} href={rawUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline hover:text-navy font-semibold">
                  {linkMatch[1]}
                </a>
              );
            }
          }
        } else if (match[2]) {
          tokens.push(<strong key={match.index} className="font-bold">{match[2].replace(/\*\*/g, '')}</strong>);
        } else if (match[3]) {
          const rawUrl = match[3];
          const isInternal = rawUrl.startsWith('/') ||
            rawUrl.startsWith('https://indiawise.vercel.app') ||
            (typeof window !== 'undefined' && rawUrl.startsWith(window.location.origin));

          let internalPath = rawUrl;
          if (rawUrl.startsWith('https://indiawise.vercel.app')) {
            internalPath = rawUrl.replace('https://indiawise.vercel.app', '') || '/';
          } else if (typeof window !== 'undefined' && rawUrl.startsWith(window.location.origin)) {
            internalPath = rawUrl.replace(window.location.origin, '') || '/';
          }

          let cleanInternalPath = internalPath;
          try {
            cleanInternalPath = decodeURI(internalPath);
          } catch {
            cleanInternalPath = internalPath;
          }

          tokens.push(
            isInternal ? (
              <Link key={match.index} href={cleanInternalPath} className="text-brand underline hover:text-navy font-semibold">
                {rawUrl}
              </Link>
            ) : (
              <a key={match.index} href={rawUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline hover:text-navy font-semibold">
                {rawUrl}
              </a>
            )
          );
        } else if (match[4]) {
          const email = match[4];
          tokens.push(
            <a key={match.index} href={`mailto:${email}`} className="text-brand underline hover:text-navy font-semibold">
              {email}
            </a>
          );
        }
        lastIdx = regex.lastIndex;
      }
      if (lastIdx < content.length) {
        tokens.push(content.substring(lastIdx));
      }

      if (isList) {
        return <li key={i} className="ml-4 list-disc my-1">{tokens}</li>;
      }
      return <p key={i} className="mb-2 last:mb-0">{tokens}</p>;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden flex flex-col items-end">
        <button
          onClick={() => { if (isOpen) { setIsOpen(false); setViewMode('default'); } else { handleOpen(); } }}
          className={`flex items-center justify-center bg-gradient-to-r from-brand to-navy text-white rounded-full font-bold shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(29,78,216,0.3)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 active:translate-y-0 group ${
            isOpen ? 'w-[52px] h-[52px] p-0' : 'pl-3 pr-5 py-3 gap-2.5 w-auto'
          }`}
          aria-label={isOpen ? "Minimize IndiaWise AI" : "Open IndiaWise AI"}
        >
          <div className={`rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
            isOpen ? 'bg-transparent w-7 h-7' : 'bg-white w-8 h-8 p-1.5'
          }`}>
            <img src="/images/favicon.png" alt="Icon" className={`w-full h-full object-contain transition-all ${
              isOpen ? 'brightness-[100] grayscale opacity-90' : ''
            }`} />
          </div>
          <span className={`hidden sm:inline whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Ask AI</span>
          {!isOpen && <kbd className="hidden sm:inline text-[9px] font-mono bg-white/20 text-white/70 px-1.5 py-0.5 rounded ml-0.5">C</kbd>}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bg-white flex flex-col overflow-hidden font-sans print:hidden origin-bottom-right animate-in zoom-in-95 slide-in-from-bottom-2 fade-in duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transition-all ${
          viewMode === 'full'
            ? 'inset-0 rounded-none z-[60]'
            : 'z-40 sm:bottom-24 sm:right-6 sm:w-[400px] w-full h-[100dvh] sm:h-[550px] sm:max-h-[70vh] sm:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-200'
        }`}>
          
          {/* Exit Confirmation Overlay */}
          {showExitConfirm && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 max-w-[320px]">
                <h4 className="font-bold text-navy mb-2 text-xl">Exit IndiaWise AI?</h4>
                <p className="text-sm text-gray-500 mb-5">Your current conversation will be cleared from this session.</p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    No, keep chat
                    <kbd className="hidden sm:inline text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">N</kbd>
                  </button>
                  <button 
                    onClick={confirmExit}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Yes, exit
                    <kbd className="hidden sm:inline text-[10px] bg-red-600 text-red-100 px-1.5 py-0.5 rounded font-mono">Y</kbd>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className={`bg-gradient-to-r from-navy to-[#0F172A] text-white flex items-center justify-between border-b border-white/10 shadow-sm relative z-10 ${
            viewMode === 'default' ? 'px-5 py-4' : 'px-6 py-4'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm p-1 ${
                viewMode === 'default' ? 'w-8 h-8' : 'w-9 h-9'
              }`}>
                <img src="/images/favicon.png" alt="Icon" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className={`font-bold tracking-wide ${viewMode === 'default' ? 'text-sm' : 'text-base'}`}>IndiaWise AI</h3>
                <p className={`text-blue-200 font-medium tracking-wider ${viewMode === 'default' ? 'text-[10px]' : 'text-xs'}`}>Financial Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Esc hint */}
              <span className="hidden sm:inline text-[9px] text-gray-400 font-mono mr-1">Esc <span className="opacity-70">(sleep)</span></span>
              {/* Full-screen toggle */}
              <button 
                onClick={() => setViewMode(viewMode === 'full' ? 'default' : 'full')}
                className={`hidden sm:flex items-center gap-1 p-2 rounded-full transition-colors ${viewMode === 'full' ? 'text-white bg-white/20' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                aria-label={viewMode === 'full' ? 'Default view' : 'Full screen'}
                title={viewMode === 'full' ? 'Exit full screen (F)' : 'Full screen (F)'}
              >
                {viewMode === 'full' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <kbd className="text-[9px] font-mono opacity-60">F</kbd>
              </button>
              {/* Exit */}
              <button 
                onClick={() => setShowExitConfirm(true)}
                className="flex items-center gap-1 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Exit IndiaWise AI (Q)"
                title="Exit (Q)"
              >
                <X className="w-5 h-5" />
                <kbd className="hidden sm:inline text-[9px] font-mono opacity-60">Q</kbd>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 ${
            viewMode === 'default' ? 'p-4' : 'p-6'
          }`}>
            {messages.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center text-center px-4 ${viewMode !== 'default' ? 'max-w-xl mx-auto' : ''}`}>
                <div className={`bg-gradient-to-tr from-brand/10 to-brand/5 rounded-2xl flex items-center justify-center mb-5 border border-brand/10 shadow-sm ${
                  viewMode === 'default' ? 'w-14 h-14' : 'w-20 h-20'
                }`}>
                  <img src="/images/favicon.png" alt="IndiaWise AI" className={`object-contain opacity-80 ${viewMode === 'default' ? 'w-7 h-7' : 'w-10 h-10'}`} />
                </div>
                <h4 className={`font-bold text-navy mb-2 tracking-tight ${viewMode === 'default' ? 'text-lg' : 'text-2xl'}`}>How can I help?</h4>
                <p className={`text-gray-500 max-w-[300px] leading-relaxed mb-6 ${viewMode === 'default' ? 'text-sm' : 'text-base'}`}>
                  Ask me to calculate an EMI, explain SIPs, or guide you to the right calculator.
                </p>
                <div className={`bg-white border border-brand/20 bg-brand/5 rounded-xl text-left w-full shadow-sm mb-4 ${viewMode === 'default' ? 'p-3' : 'p-4'}`}>
                  <p className={`text-brand/80 font-semibold mb-1 uppercase tracking-wider ${viewMode === 'default' ? 'text-[11px]' : 'text-xs'}`}>💡 Pro Tips</p>
                  <ul className={`text-gray-600 space-y-1.5 list-disc list-inside ${viewMode === 'default' ? 'text-[12px]' : 'text-sm'}`}>
                    <li>Click the <b>X</b> above to clear this chat.</li>
                    <li>Click the <b>bottom logo</b> to sleep/minimize chat without losing history.</li>
                  </ul>
                </div>
                <div className={`flex flex-col gap-2.5 w-full ${viewMode !== 'default' ? 'flex-row' : ''}`}>
                  <button onClick={() => setInput("Calculate EMI for 50 Lakhs at 8.5% for 20 years")} className={`bg-white border border-gray-200 rounded-xl text-left text-gray-600 hover:border-brand hover:text-brand transition-all shadow-sm hover:shadow-md group flex items-center justify-between ${viewMode === 'default' ? 'text-[13px] p-3' : 'text-sm p-4 flex-1'}`}>
                    <span>Calculate EMI for 50 Lakhs at 8.5% for 20 years</span>
                    <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={() => setInput("What's the difference between FD and RD?")} className={`bg-white border border-gray-200 rounded-xl text-left text-gray-600 hover:border-brand hover:text-brand transition-all shadow-sm hover:shadow-md group flex items-center justify-between ${viewMode === 'default' ? 'text-[13px] p-3' : 'text-sm p-4 flex-1'}`}>
                    <span>What&apos;s the difference between FD and RD?</span>
                    <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, i) => {
                const isUser = m.role === 'user';
                const { text, suggestions } = isUser ? { text: m.parts[0].text, suggestions: [] } : parseMessage(m.parts[0].text);
                
                return (
                  <div key={i} className={`flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300 ${viewMode !== 'default' ? 'max-w-3xl mx-auto w-full' : ''}`}>
                    <div className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className={`rounded-full flex-shrink-0 bg-white border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm p-1 ${
                          viewMode === 'default' ? 'w-7 h-7' : 'w-9 h-9'
                        }`}>
                          <img src="/images/favicon.png" alt="AI" className="w-full h-full object-contain" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl leading-relaxed shadow-sm ${
                        viewMode === 'default' ? 'px-4 py-3 text-[14.5px]' : 'px-5 py-4 text-[15.5px]'
                      } ${
                        isUser 
                          ? 'bg-brand text-white rounded-br-sm font-medium' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {renderText(text)}

                        {!isUser && m.calculatorAction && (
                          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-start">
                            <Link
                              href={m.calculatorAction.url}
                              onClick={() => {
                                if (viewMode === 'full') {
                                  setViewMode('default');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-brand text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all group"
                              title={`Open in ${m.calculatorAction.name}`}
                            >
                              <Calculator className="w-3.5 h-3.5 text-blue-300 group-hover:text-white transition-colors" />
                              <span>Open in Calculator</span>
                              <ExternalLink className="w-3 h-3 text-blue-300 group-hover:text-white transition-colors ml-0.5" />
                            </Link>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className={`rounded-full flex-shrink-0 bg-brand/10 border border-brand/20 flex items-center justify-center ${
                          viewMode === 'default' ? 'w-7 h-7' : 'w-9 h-9'
                        }`}>
                          <User className={`text-brand ${viewMode === 'default' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        </div>
                      )}
                    </div>
                    
                    {!isUser && suggestions.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mt-1 ${viewMode === 'default' ? 'ml-9' : 'ml-11'}`}>
                        {suggestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInput(q);
                              setTimeout(() => {
                                const el = document.getElementById('chat-form-btn');
                                if (el) el.click();
                              }, 10);
                            }}
                            className={`bg-white border border-gray-200 text-brand rounded-full hover:bg-brand hover:text-white transition-colors shadow-sm ${
                              viewMode === 'default' ? 'text-[11px] px-3 py-1.5' : 'text-xs px-4 py-2'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            
            {isLoading && (
              <div className={`flex justify-start ${viewMode !== 'default' ? 'max-w-3xl mx-auto w-full' : ''}`}>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            {error && (
              <div className={`flex justify-center my-2 ${viewMode !== 'default' ? 'max-w-3xl mx-auto w-full' : ''}`}>
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-lg text-center">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`bg-white border-t border-gray-100 ${viewMode === 'default' ? 'p-4 pb-5' : 'p-5 pb-6'}`}>
            <form onSubmit={handleSubmit} className={`flex items-end gap-2 relative bg-gray-50/50 border border-gray-200 focus-within:border-brand/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/5 rounded-2xl p-1.5 transition-all shadow-sm ${viewMode !== 'default' ? 'max-w-3xl mx-auto' : ''}`}>
              <div className="relative flex-1 flex items-center">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about calculations..."
                  className={`w-full max-h-32 bg-transparent px-3 py-2.5 focus:outline-none resize-none text-navy placeholder:text-gray-400 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 ${
                    viewMode === 'default' ? 'min-h-[44px] text-[14px]' : 'min-h-[48px] text-[15px]'
                  }`}
                  rows={1}
                  disabled={isLoading}
                />
                {!input && (
                  <div className="hidden sm:flex items-center pr-2 pointer-events-none select-none text-gray-400">
                    <kbd className="text-[10px] font-mono bg-white text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 shadow-2xs" title="Press E to type">E</kbd>
                  </div>
                )}
              </div>
              <button
                id="chat-form-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`bg-brand text-white rounded-xl flex items-center justify-center hover:bg-navy disabled:opacity-40 disabled:hover:bg-brand transition-all flex-shrink-0 mb-0.5 mr-0.5 shadow-sm ${
                  viewMode === 'default' ? 'w-10 h-10' : 'w-11 h-11'
                }`}
                title="Send message (Enter)"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </form>
            <div className={`text-center mt-3 ${viewMode !== 'default' ? 'max-w-3xl mx-auto' : ''}`}>
              <p className={`text-gray-400 font-medium ${viewMode === 'default' ? 'text-[10px]' : 'text-xs'}`}>
                IndiaWise AI provides estimates. Always verify exact figures.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
