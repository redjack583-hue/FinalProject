
// Chatbot component to handle user queries and show show responses from backend API.


import { Bot, X, Send } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSize, setChatSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{role: 'bot' | 'user', text: string}[]>([
    {
      role: 'bot',
      text: 'Aaniin! (Hello!) I can help you find services, businesses, or events in Thunder Bay. Whenever you ask, I will respond with helpful local information and general context. Please ask your question.'
    }
  ]);

  const formatInlineText = (text: string): ReactNode[] => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
      const match = part.match(/^\*\*(.+)\*\*$/);
      if (match) return <strong key={idx}>{match[1]}</strong>;
      return <span key={idx}>{part}</span>;
    });
  };

  const renderFormattedMessage = (message: string): ReactNode => {
    const lines = message.split("\n");
    const bullets = lines.filter((line) => line.trim().startsWith("*")).length;
    if (bullets > 0) {
      return (
        <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed">
          {lines.map((line, idx) => {
            const clean = line.trim().replace(/^\*\s*/, "");
            if (!clean) return null;
            return <li key={idx}>{formatInlineText(clean)}</li>;
          })}
        </ul>
      );
    }

    return (
      <div className="space-y-1 text-xs leading-relaxed">
        {lines.map((line, idx) => (
          <p key={idx}>{formatInlineText(line)}</p>
        ))}
      </div>
    );
  };


  const scrollRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    small: 'w-[280px] max-h-[420px]',
    medium: 'w-[360px] max-h-[560px]',
    large: 'w-[480px] max-h-[760px]',
  }[chatSize];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.chatbot.ask(userMsg);
      setChat(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'bot', text: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div className={`mb-4 overflow-hidden rounded-3xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl animate-fade-in origin-bottom-right flex flex-col ${sizeStyles}`}>
          <div className="bg-primary p-6 text-primary-foreground shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold">Community Assistant</h4>
                  <p className="text-[11px] opacity-80">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/10 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 pb-4 pt-2 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-foreground/80">Size:</span>
              <div className="flex items-center gap-1">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setChatSize(size)}
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold transition ${chatSize === size ? 'bg-white text-primary' : 'bg-white/20 text-foreground/80 hover:bg-white/30'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar" ref={scrollRef}>
            <div className="space-y-4">
              {chat.map((m, i) => (
                <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role === 'bot' ? 'bg-secondary' : 'bg-primary/20'}`}>
                    <Bot className={`h-4 w-4 ${m.role === 'bot' ? 'text-primary' : 'text-primary'}`} />
                  </div>
                  <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'bot' 
                      ? 'rounded-tl-none bg-secondary/50 text-foreground' 
                      : 'rounded-tr-none bg-primary text-primary-foreground'
                  }`}>
                    {renderFormattedMessage(m.text)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-secondary/30 p-3 text-xs text-foreground">
                    AI is generating a response... please hold on.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border/10 bg-secondary/10 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2 rounded-2xl bg-secondary/30 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button 
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-primary-foreground" />
        ) : (
          <>
            <Bot className="h-7 w-7 text-primary-foreground group-hover:animate-bounce" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground animate-pulse">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
}