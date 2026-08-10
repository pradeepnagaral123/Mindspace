const gradients = {
  mint: "from-mint to-lavender",
  lavender: "from-lavender to-blossom",
  peach: "from-peach to-sun",
  blossom: "from-blossom to-lavender",
  sun: "from-sun to-peach",
  navy: "from-navy-2 to-navy",
};

export default function Avatar({
  name,
  size = 40,
  gradient = "mint",
  status,
  className = "",
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const statusColors = {
    online: "bg-mint-deep",
    away: "bg-sun-deep",
    offline: "bg-muted",
  };

  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br ${
          gradients[gradient] || gradient
        } font-bold text-white ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`absolute right-0 bottom-0 rounded-full border-2 border-white ${
            statusColors[status] || "bg-muted"
          }`}
          style={{ width: Math.max(10, size * 0.28), height: Math.max(10, size * 0.28) }}
        />
      )}
    </div>
  );
}
