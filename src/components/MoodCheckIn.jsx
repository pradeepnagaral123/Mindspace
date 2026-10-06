import { useState, useEffect } from "react";
import { moodOptions } from "../data/mockData";
import Icon from "./icons";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function MoodCheckIn({ className = "", onCheckIn }) {
  const { user, token } = useAuth();
  const [selected, setSelected] = useState("good");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/moods/latest`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data?.mood) setSelected(data.mood.mood);
      })
      .catch(() => {});
  }, [token]);

  const handleSelect = (id) => {
    setSelected(id);
    onCheckIn?.(id);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-mint/35 bg-gradient-to-br from-mint-soft via-white to-lavender-soft p-5 shadow-[0_4px_24px_rgba(165,240,210,0.18),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(165,240,210,0.25),0_2px_6px_rgba(7,21,34,0.08)] ${className}`}>
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-mint/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-lavender/15 blur-2xl" />

      <div className="relative mb-4">
        <h2 className="text-base font-bold text-ink">
          {getGreeting()}, {firstName}
        </h2>
        <p className="mt-0.5 text-[12px] text-muted">
          How are you feeling today?
        </p>
      </div>

      <div className="relative grid grid-cols-5 gap-1.5 sm:gap-3">
        {moodOptions.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`group flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl py-2.5 transition-all sm:py-3 ${
                active
                  ? "bg-white/80 shadow-md scale-105"
                  : "bg-white/40 hover:bg-white/70 hover:shadow-sm"
              }`}
              aria-pressed={active}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all sm:h-11 sm:w-11 ${
                  option.circle
                } ${active ? `ring-2 ${option.ring} ring-offset-2` : "group-hover:scale-110"}`}
              >
                <Icon
                  name={option.icon}
                  size={18}
                  strokeWidth={1.8}
                  className={option.text}
                />
              </span>
              <span
                className={`text-center text-[10px] leading-tight font-semibold transition-colors sm:text-[11px] ${
                  active ? option.text : "text-muted group-hover:text-ink"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="relative mt-3 text-[11px] text-muted/70">
        {moodOptions.find((option) => option.id === selected)?.hint}
      </p>
    </div>
  );
}
