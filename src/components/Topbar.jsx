import { Bell, Menu } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line/70 bg-cream/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-xl p-2 text-ink hover:bg-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
        <button
          className="relative rounded-xl border border-line bg-white p-2.5 text-ink shadow-sm transition-colors hover:bg-cream"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

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
