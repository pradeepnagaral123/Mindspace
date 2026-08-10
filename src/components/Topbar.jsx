import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import Avatar from "./Avatar";
import { useSearch } from "../context/SearchContext";
import { user } from "../data/mockData";

export default function Topbar({ onMenu }) {
  const { query, setQuery } = useSearch();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { title: "Maya replied to your message", time: "2m ago" },
    { title: "New post in Student Support Circle", time: "26m ago" },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line/70 bg-cream/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-xl p-2 text-ink hover:bg-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="relative max-w-xl flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search anything..."
          className="w-full rounded-2xl border border-line bg-white py-2.5 pr-10 pl-11 text-sm text-ink shadow-sm outline-none placeholder:text-muted/70 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-line/60 hover:text-ink"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((value) => !value)}
            className="relative rounded-xl border border-line bg-white p-2.5 text-ink shadow-sm transition-colors hover:bg-cream"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blossom-deep ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-white p-2 shadow-xl">
              <p className="px-3 py-2 text-sm font-semibold text-ink">
                Notifications
              </p>
              {notifications.map((notification) => (
                <button
                  key={notification.title}
                  className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-cream"
                >
                  <p className="text-[13px] font-medium text-ink">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted">{notification.time}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white py-1.5 pr-3 pl-1.5 shadow-sm">
          <Avatar name={user.name} size={32} gradient="blossom" />
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-tight text-ink">
              {user.name}
            </p>
            <p className="text-[11px] leading-tight text-muted">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
