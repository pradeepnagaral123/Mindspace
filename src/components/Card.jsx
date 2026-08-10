export default function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(7,21,34,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}
