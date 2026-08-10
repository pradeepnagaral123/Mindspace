import { useState } from "react";
import Card from "./Card";
import { moodOptions } from "../data/mockData";
import Icon from "./icons";

export default function MoodCheckIn({ onCheckIn, className = "" }) {
  const [selected, setSelected] = useState("good");

  const handleSelect = (id) => {
    setSelected(id);
    if (onCheckIn) onCheckIn(id);
  };

  return (
    <Card className={`p-6 sm:p-7 ${className}`}>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-[28px]">
          Good morning, Aarav 🌿
        </h2>
        <p className="mt-1 text-sm text-muted">How are you feeling today?</p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
        {moodOptions.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`group flex flex-col items-center gap-2.5 rounded-2xl px-3 py-2 transition-all ${
                active ? "bg-mint-soft/60" : "hover:bg-cream"
              }`}
              aria-pressed={active}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-all sm:h-16 sm:w-16 ${
                  option.circle
                } ${active ? `ring-2 ${option.ring} ring-offset-2` : "group-hover:scale-105"}`}
              >
                <Icon
                  name={option.icon}
                  size={28}
                  strokeWidth={1.8}
                  className={option.text}
                />
              </span>
              <span
                className={`text-[13px] font-semibold transition-colors ${
                  active ? option.text : "text-muted group-hover:text-ink"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-muted">
        {moodOptions.find((option) => option.id === selected)?.hint}
      </p>
    </Card>
  );
}
