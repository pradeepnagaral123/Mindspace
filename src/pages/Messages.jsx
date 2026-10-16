import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Ban,
  Check,
  CheckCheck,
  Copy,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  Trash2,
  UserPlus,
} from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = API_URL ? API_URL.replace(/\/api\/?$/, "") : undefined;

const gradients = ["mint", "lavender", "peach", "blossom", "sun"];

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function clockTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const sortThreads = (list) =>
  [...list].sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
  );

export default function Messages() {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");
  const [peerTyping, setPeerTyping] = useState({});
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [search, setSearch] = useState("");
  const [socketLive, setSocketLive] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const myId = useMemo(() => {
    if (user?._id) return String(user._id);
    if (!token) return null;
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload?.id ? String(payload.id) : null;
    } catch {
      return null;
    }
  }, [user, token]);

  const socketRef = useRef(null);
  const activeIdRef = useRef(null);
  const listRef = useRef(null);
  const lastTypingRef = useRef(0);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const targetConnection = searchParams.get("connection");
  useEffect(() => {
    if (targetConnection) setActiveId(targetConnection);
  }, [targetConnection]);

  const fetchThreads = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/messages/threads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data?.threads) ? data.threads : [];
      setThreads(sortThreads(list));
      setActiveId((current) => current || list[0]?.connectionId || null);
    } catch {
      // keep whatever we have
    } finally {
      setLoadingThreads(false);
    }
  }, [token]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => setSocketLive(true));
    socket.on("disconnect", () => setSocketLive(false));

    socket.on("message:new", (msg) => {
      const fromMe = myId && String(msg.sender._id) === myId;
      setMessages((current) => {
        const list = current[msg.connection] || [];
        if (list.some((m) => String(m._id) === String(msg._id))) return current;
        return { ...current, [msg.connection]: [...list, msg] };
      });

      const isActive = msg.connection === activeIdRef.current;
      setThreads((current) => {
        if (!current.some((t) => t.connectionId === msg.connection)) {
          fetchThreads();
          return current;
        }
        return sortThreads(
          current.map((t) =>
            t.connectionId === msg.connection
              ? {
                  ...t,
                  lastMessage: msg.text,
                  lastMessageAt: msg.createdAt,
                  unread:
                    fromMe || isActive ? 0 : (t.unread || 0) + 1,
                }
              : t,
          ),
        );
      });

      if (isActive && !fromMe) {
        socket.emit("messages:read", { connectionId: msg.connection });
      }
    });

    socket.on("message:deleted", ({ connectionId, messageId }) => {
      setMessages((current) => ({
        ...current,
        [connectionId]: (current[connectionId] || []).map((m) =>
          String(m._id) === String(messageId)
            ? { ...m, deleted: true, text: "" }
            : m,
        ),
      }));
      fetchThreads();
    });

    socket.on("message:removed", ({ connectionId, messageId }) => {
      setMessages((current) => ({
        ...current,
        [connectionId]: (current[connectionId] || []).filter(
          (m) => String(m._id) !== String(messageId),
        ),
      }));
      fetchThreads();
    });

    socket.on("typing", ({ connectionId, typing }) => {
      setPeerTyping((current) => ({ ...current, [connectionId]: typing }));
    });

    socket.on("messages:read", ({ connectionId }) => {
      setMessages((current) => ({
        ...current,
        [connectionId]: (current[connectionId] || []).map((m) =>
          myId && inStringEqual(m.sender, myId)
            ? { ...m, readAt: m.readAt || new Date().toISOString() }
            : m,
        ),
      }));
    });

    socket.on("presence", ({ userId, online }) => {
      setThreads((current) =>
        current.map((t) =>
          String(t.peer._id) === String(userId)
            ? { ...t, peer: { ...t.peer, online } }
            : t,
        ),
      );
    });

    socket.on("connection:new", () => fetchThreads());

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, myId, fetchThreads]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, activeId, peerTyping]);

  useEffect(() => {
    if (!activeId || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${activeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data?.messages) && !cancelled) {
          setMessages((current) => {
            const existing = current[activeId] || [];
            const incoming = data.messages;
            const seen = new Set(incoming.map((m) => String(m._id)));
            const extras = existing.filter((m) => !seen.has(String(m._id)));
            const merged = [...incoming, ...extras].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            return { ...current, [activeId]: merged };
          });
        }
      } catch {
        // leave empty; socket messages will still arrive
      }
    })();
    socketRef.current?.emit("messages:read", { connectionId: activeId });
    return () => {
      cancelled = true;
    };
  }, [activeId, token]);

  const openThread = (connectionId) => {
    setActiveId(connectionId);
    setThreads((current) =>
      current.map((t) =>
        t.connectionId === connectionId ? { ...t, unread: 0 } : t,
      ),
    );
    setPeerTyping((current) => ({ ...current, [connectionId]: false }));
  };

  const sendMessage = () => {
    const text = draft.trim();
    const socket = socketRef.current;
    const connId = activeIdRef.current;
    if (!text || !socket || !connId) return;

    setDraft("");
    socket.emit("typing", { connectionId: connId, typing: false });
    lastTypingRef.current = 0;

    socket.emit("message:send", { connectionId: connId, text }, (response) => {
      if (response?.error) {
        console.error("Message not sent:", response.error);
      }
    });
  };

  const copyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = message.text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(message._id);
    setTimeout(
      () => setCopiedId((current) => (current === message._id ? null : current)),
      1400,
    );
  };

  const confirmDelete = (messageId) => {
    setPendingDelete(null);
    const socket = socketRef.current;
    if (!socket || !messageId) return;
    socket.emit("message:delete", { messageId }, (response) => {
      if (response?.error) console.error("Delete failed:", response.error);
    });
  };

  const handleDraft = (value) => {
    setDraft(value);
    const socket = socketRef.current;
    const connId = activeIdRef.current;
    if (!socket || !connId) return;
    const now = Date.now();
    if (value.trim() && now - lastTypingRef.current > 1500) {
      lastTypingRef.current = now;
      socket.emit("typing", { connectionId: connId, typing: true });
    }
    if (!value.trim()) {
      socket.emit("typing", { connectionId: connId, typing: false });
      lastTypingRef.current = 0;
    }
  };

  const activeThread = threads.find((t) => t.connectionId === activeId);
  const activeMessages = messages[activeId] || [];
  const activeGradient = useMemo(() => {
    const index = threads.findIndex((t) => t.connectionId === activeId);
    return gradients[(index < 0 ? 0 : index) % gradients.length];
  }, [threads, activeId]);

  const visibleThreads = search.trim()
    ? threads.filter((t) =>
        t.peer.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : threads;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your supportive conversations, all in one place.
          {!socketLive && (
            <span className="ml-2 text-xs text-sun-deep">Reconnecting…</span>
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <Card className="flex flex-col p-2">
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-line bg-cream py-2.5 pr-3 pl-10 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-mint-deep focus:bg-white focus:ring-2 focus:ring-mint/40"
              />
            </div>
          </div>

          <div className="space-y-1 overflow-y-auto p-1.5">
            {loadingThreads && (
              <p className="px-3 py-6 text-center text-[13px] text-muted">
                Loading conversations…
              </p>
            )}

            {!loadingThreads && visibleThreads.length === 0 && (
              <div className="px-4 py-8 text-center">
                <MessageCircle size={22} className="mx-auto text-muted" />
                <p className="mt-2 text-[13px] font-semibold text-ink">
                  No conversations yet
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Connect with someone on Find a Peer and your chat will show
                  up here.
                </p>
                <Link
                  to="/find-a-peer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-[12px] font-semibold text-white hover:bg-navy-2"
                >
                  <UserPlus size={14} />
                  Find a Peer
                </Link>
              </div>
            )}

            {visibleThreads.map((thread) => {
              const active = thread.connectionId === activeId;
              const index = threads.findIndex(
                (t) => t.connectionId === thread.connectionId,
              );
              const typing = peerTyping[thread.connectionId];
              return (
                <button
                  key={thread.connectionId}
                  onClick={() => openThread(thread.connectionId)}
                  className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors ${
                    active ? "bg-navy" : "hover:bg-cream"
                  }`}
                >
                  <Avatar
                    name={thread.peer.name}
                    size={40}
                    gradient={gradients[index % gradients.length]}
                    status={thread.peer.online ? "online" : "offline"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-[13px] font-bold ${
                          active ? "text-white" : "text-ink"
                        }`}
                      >
                        {thread.peer.name}
                      </p>
                      <span
                        className={`shrink-0 text-[11px] ${
                          active ? "text-white/50" : "text-muted"
                        }`}
                      >
                        {thread.lastMessageAt ? timeAgo(thread.lastMessageAt) : ""}
                      </span>
                    </div>
                    <p
                      className={`mt-0.5 truncate text-[13px] ${
                        typing
                          ? "text-mint-deep italic"
                          : active
                            ? "text-white/70"
                            : "text-muted"
                      }`}
                    >
                      {typing ? "typing…" : thread.lastMessage || "Say hello 👋"}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blossom px-1.5 text-[10.5px] font-semibold text-white">
                      {thread.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex min-h-[540px] flex-col overflow-hidden">
          {activeThread ? (
            <>
              <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={activeThread.peer.name}
                    size={38}
                    gradient={activeGradient}
                    status={activeThread.peer.online ? "online" : "offline"}
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {activeThread.peer.name}
                    </p>
                    <p
                      className={`text-xs ${
                        peerTyping[activeThread.connectionId]
                          ? "text-mint-deep"
                          : activeThread.peer.online
                            ? "text-mint-deep"
                            : "text-muted"
                      }`}
                    >
                      {peerTyping[activeThread.connectionId]
                        ? "typing…"
                        : activeThread.peer.online
                          ? "Online now"
                          : "Offline"}
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-lg p-2 text-muted hover:bg-cream hover:text-ink"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div
                ref={listRef}
                className="flex-1 space-y-3 overflow-y-auto bg-cream/40 px-5 py-5"
              >
                {activeMessages.length === 0 && (
                  <p className="py-10 text-center text-[13px] text-muted">
                    No messages yet — start the conversation with something
                    kind.
                  </p>
                )}
                {activeMessages.map((message, index) => {
                  const mine = myId && inStringEqual(message.sender, myId);
                  const confirming = pendingDelete === message._id;
                  const isDeleted = Boolean(message.deleted);
                  const prev = activeMessages[index - 1];
                  const senderKey = (m) =>
                    m && typeof m.sender === "object"
                      ? m.sender?._id
                      : m?.sender;
                  const showLabel =
                    !prev ||
                    String(senderKey(prev)) !== String(senderKey(message));
                  return (
                    <div
                      key={message._id}
                      className={`flex flex-col ${
                        mine ? "items-end" : "items-start"
                      }`}
                    >
                      {showLabel && (
                        <span className="mb-1 px-1 text-[11px] font-semibold text-muted">
                          {mine ? "You" : activeThread.peer.name}
                        </span>
                      )}
                      <div className="group flex items-center gap-1.5">
                        {mine && (
                          <div className="flex shrink-0 items-center gap-1">
                            {confirming ? (
                              <>
                                <button
                                  onClick={() => confirmDelete(message._id)}
                                  className="rounded-lg bg-blossom/15 px-2 py-1 text-[11px] font-semibold text-blossom hover:bg-blossom/25"
                                >
                                  {isDeleted ? "Delete forever" : "Delete"}
                                </button>
                                <button
                                  onClick={() => setPendingDelete(null)}
                                  className="rounded-lg border border-line bg-white px-2 py-1 text-[11px] font-semibold text-muted hover:bg-cream"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                {!isDeleted && (
                                  <button
                                    onClick={() => copyMessage(message)}
                                    title="Copy message"
                                    aria-label="Copy message"
                                    className="rounded-lg p-1.5 text-muted hover:bg-cream hover:text-ink"
                                  >
                                    {copiedId === message._id ? (
                                      <Check size={14} className="text-mint-deep" />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setCopiedId(null);
                                    setPendingDelete(message._id);
                                  }}
                                  title={isDeleted ? "Delete forever" : "Delete message"}
                                  aria-label={isDeleted ? "Delete forever" : "Delete message"}
                                  className="rounded-lg p-1.5 text-muted hover:bg-blossom/15 hover:text-blossom"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isDeleted
                              ? `border border-dashed border-line bg-cream/70 text-muted ${
                                  mine ? "rounded-br-md" : "rounded-bl-md"
                                }`
                              : mine
                                ? "rounded-br-md bg-navy text-white"
                                : "rounded-bl-md bg-mint-soft text-ink"
                          }`}
                        >
                          {isDeleted ? (
                            <span className="flex items-center gap-1.5 text-[13px] italic">
                              <Ban size={13} />
                              This message was deleted
                            </span>
                          ) : (
                            message.text
                          )}
                          {!isDeleted && (
                            <span
                              className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                mine ? "text-white/50" : "text-muted"
                              }`}
                            >
                              {clockTime(message.createdAt)}
                              {mine &&
                                (message.readAt ? (
                                  <CheckCheck
                                    size={13}
                                    className="text-sky-300"
                                  />
                                ) : (
                                  <Check size={13} className="text-white/50" />
                                ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {peerTyping[activeId] && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-mint-soft px-4 py-2.5 text-sm text-muted">
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-line/70 bg-white px-4 py-3">
                <button
                  className="rounded-lg p-2 text-muted hover:bg-cream hover:text-mint-deep"
                  aria-label="Add attachment"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  className="rounded-lg p-2 text-muted hover:bg-cream hover:text-mint-deep"
                  aria-label="Add emoji"
                >
                  <Smile size={18} />
                </button>
                <input
                  value={draft}
                  onChange={(event) => handleDraft(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder="Write a kind message..."
                  className="flex-1 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-mint-deep focus:bg-white focus:ring-2 focus:ring-mint/40"
                />
                <button
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={15} />
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <MessageCircle size={34} className="text-muted" />
              <p className="mt-3 text-sm font-bold text-ink">
                No conversation selected
              </p>
              <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
                Connect with someone on Find a Peer to start a real-time
                conversation.
              </p>
              <Link
                to="/find-a-peer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-navy-2"
              >
                <UserPlus size={15} />
                Find a Peer
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function inStringEqual(sender, userId) {
  const senderId = sender && typeof sender === "object" ? sender._id : sender;
  return String(senderId) === String(userId);
}

function Dot({ delay = "0s" }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
      style={{ animationDelay: delay }}
    />
  );
}
