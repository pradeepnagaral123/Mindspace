import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Send, Sparkles, TriangleAlert, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hi! I'm the MindSpace assistant. Ask me anything about mental health — stress, sleep, anxiety, or self-care.",
    },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const history = [...messages, { id: Date.now(), role: "user", text }];
    setMessages(history);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.type)
            .map((m) => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.text,
            })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.reply) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          type: "warning",
          text: error.message || "Could not reach the chatbot service. Please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className={`fixed bottom-24 right-4 z-40 flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_16px_48px_rgba(7,21,34,0.22)] transition-all duration-300 sm:right-6 ${
            expanded
              ? "h-[70vh] w-[calc(100vw-2rem)] max-w-[620px]"
              : "h-[460px] w-[calc(100vw-2rem)] max-w-[370px]"
          }`}
        >
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-navy">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">MindSpace Assistant</p>
                <p className="text-[11px] leading-tight text-mint">Online · mental health info</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="rounded-lg p-1.5 text-mint transition-colors hover:bg-white/20 hover:text-white"
                aria-label={expanded ? "Restore chat window" : "Enlarge chat window"}
              >
                {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-mint transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4">
            {messages.map((message) =>
              message.type === "warning" ? (
                <div
                  key={message.id}
                  className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-semibold leading-relaxed text-red-600"
                >
                  <TriangleAlert size={17} className="mt-0.5 shrink-0" />
                  <span>{message.text}</span>
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-navy text-white"
                        : "rounded-bl-md border border-line bg-white text-ink shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && send()}
                placeholder={typing ? "Thinking..." : "Ask about your wellbeing..."}
                className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-mint-deep"
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-navy transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-tight text-muted">
              General information only — not a substitute for professional help.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        className={`fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-navy shadow-[0_8px_24px_rgba(7,21,34,0.28)] transition-all hover:-translate-y-1 sm:right-6 ${
          open ? "bg-navy text-mint" : "bg-mint"
        }`}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </>
  );
}
