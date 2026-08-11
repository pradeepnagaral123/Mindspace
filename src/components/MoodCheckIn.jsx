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
    <Card className={`p-5 ${className}`}>
      <div className="mb-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Good morning, Aarav 🌿
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">How are you feeling today?</p>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4">
        {moodOptions.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`group flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all ${
                active ? "bg-mint-soft/60" : "hover:bg-cream"
              }`}
              aria-pressed={active}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all sm:h-11 sm:w-11 ${
                  option.circle
                } ${active ? `ring-2 ${option.ring} ring-offset-2` : "group-hover:scale-105"}`}
              >
                <Icon
                  name={option.icon}
                  size={20}
                  strokeWidth={1.8}
                  className={option.text}
                />
              </span>
              <span
                className={`text-[12px] font-semibold transition-colors ${
                  active ? option.text : "text-muted group-hover:text-ink"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] text-muted">
        {moodOptions.find((option) => option.id === selected)?.hint}
      </p>
    </Card>
  );
}
