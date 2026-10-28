import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Inbox } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const typeTints = {
  connection: "bg-lavender-soft text-lavender-deep",
  message: "bg-mint-soft text-mint-deep",
  system: "bg-peach-soft text-peach-deep",
};

export default function NotificationBell() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const markRead = async (notification) => {
    if (!notification.read) {
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      fetch(`${API_URL}/notifications/${notification._id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const markAllRead = async () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
    setUnreadCount(0);
    fetch(`${API_URL}/notifications/read-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-xl border border-line bg-white p-2.5 text-ink shadow-sm transition-colors hover:bg-cream"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blossom-deep px-1 text-[10px] font-bold text-white shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-4 top-[72px] z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_32px_rgba(7,21,34,0.14)] sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[13px] font-bold text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-mint-deep transition-colors hover:text-navy"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Inbox size={22} className="text-line" />
                <p className="text-[13px] font-semibold text-ink">All caught up</p>
                <p className="text-xs text-muted">
                  New activity will show up here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => markRead(notification)}
                  className={`flex w-full items-start gap-3 border-b border-line/60 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-cream/70 ${
                    notification.read ? "" : "bg-mint-soft/30"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      typeTints[notification.type] || typeTints.system
                    }`}
                  >
                    {notification.read ? (
                      <Check size={14} />
                    ) : (
                      <Bell size={14} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-semibold text-ink">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blossom-deep" />
                      )}
                    </span>
                    {notification.body && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                        {notification.body}
                      </span>
                    )}
                    <span className="mt-1 block text-[10px] font-medium text-muted">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
