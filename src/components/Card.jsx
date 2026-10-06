export default function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white shadow-[0_4px_24px_rgba(7,21,34,0.1),0_1px_4px_rgba(7,21,34,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(7,21,34,0.14),0_2px_6px_rgba(7,21,34,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
