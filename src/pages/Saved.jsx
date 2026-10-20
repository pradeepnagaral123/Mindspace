import { useCallback, useEffect, useState } from "react";
import { Bookmark, Clock, Users } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const tabs = [
  { id: "post", label: "Posts" },
  { id: "resource", label: "Resources" },
  { id: "community", label: "Communities" },
];

export default function Saved() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("post");

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const unsave = async (item) => {
    setItems((current) =>
      current.filter(
        (entry) =>
          !(entry.itemType === item.itemType && entry.refId === item.refId)
      )
    );
    try {
      await fetch(`${API_URL}/saved/${item.itemType}/${item.refId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
  };

  const counts = {
    post: items.filter((item) => item.itemType === "post").length,
    resource: items.filter((item) => item.itemType === "resource").length,
    community: items.filter((item) => item.itemType === "community").length,
  };

  const visible = items.filter((item) => item.itemType === activeTab);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Saved
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Posts, resources and communities you've kept close for later.
        </p>
      </div>

      <div className="flex rounded-xl border border-line bg-white p-1 shadow-sm sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors sm:flex-none ${
              activeTab === tab.id
                ? "bg-navy text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 text-[10.5px] font-semibold ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-cream text-muted"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="p-10 text-center">
          <p className="text-[13px] text-muted">Loading your saved items...</p>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-soft text-mint-deep">
            <Bookmark size={22} />
          </span>
          <p className="mt-3 text-[14px] font-bold text-ink">
            Nothing saved here yet
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Tap the bookmark on any {activeTab} to keep it close for later.
          </p>
        </Card>
      ) : activeTab === "post" ? (
        <div className="space-y-3">
          {visible.map((item) => (
            <Card key={item._id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-ink">{item.title}</p>
                  {item.meta && (
                    <p className="mt-0.5 text-[11px] text-muted">{item.meta}</p>
                  )}
                </div>
                <button
                  onClick={() => unsave(item)}
                  className="rounded-lg p-1.5 text-blossom-deep hover:bg-blossom-soft"
                  aria-label="Remove from saved"
                >
                  <Bookmark size={16} className="fill-blossom-deep" />
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      ) : activeTab === "resource" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Card
              key={item._id}
              className="group flex flex-col p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent || "bg-mint-soft text-mint-deep"}`}
                >
                  <Icon name={item.icon || "bookOpen"} size={20} strokeWidth={2} />
                </span>
                <button
                  onClick={() => unsave(item)}
                  className="rounded-lg p-1.5 text-blossom-deep hover:bg-blossom-soft"
                  aria-label="Remove from saved"
                >
                  <Bookmark size={16} className="fill-blossom-deep" />
                </button>
              </div>
              <h3 className="mt-4 text-[15px] font-bold leading-snug text-ink group-hover:text-mint-deep">
                {item.title}
              </h3>
              <div className="mt-auto flex items-center gap-3 pt-4 text-xs font-medium text-muted">
                {item.category && (
                  <span className="rounded-full bg-cream px-2 py-0.5 font-semibold">
                    {item.category}
                  </span>
                )}
                {item.meta && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {item.meta}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((item) => (
            <Card
              key={item._id}
              className="group flex items-start gap-3.5 p-5 transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.accent || "bg-mint-soft text-mint-deep"}`}
              >
                <Icon name={item.icon || "usersRound"} size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-ink group-hover:text-mint-deep">
                  {item.title}
                </p>
                {item.meta && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-muted">
                    <Users size={11} />
                    {item.meta}
                  </p>
                )}
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {item.description}
                </p>
                <button
                  onClick={() => unsave(item)}
                  className="mt-3 rounded-xl border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-cream"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
