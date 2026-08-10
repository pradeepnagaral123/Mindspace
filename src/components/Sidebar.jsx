import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  MessageCircle,
  ClipboardList,
  BookOpen,
  Calendar,
  Bookmark,
  LifeBuoy,
  ShieldCheck,
  Leaf,
  Heart,
  X,
  Sparkle,
} from "lucide-react";
import Avatar from "./Avatar";
import { user } from "../data/mockData";

const mainNav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/find-a-peer", label: "Find a Peer", icon: UserPlus },
  { to: "/messages", label: "Messages", icon: MessageCircle, badge: 3 },
  { to: "/check-in", label: "Check-in", icon: ClipboardList },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/saved", label: "Saved", icon: Bookmark },
];

const supportNav = [
  { to: "/support", label: "Support Center", icon: LifeBuoy },
  { to: "/safety", label: "Safety", icon: ShieldCheck },
];

function NavItem({ to, label, icon: Icon, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-white/10 text-white"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon size={19} strokeWidth={2} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blossom px-1.5 text-[11px] font-semibold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col bg-navy text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-lavender text-navy shadow-lg shadow-mint/10">
              <Leaf size={22} strokeWidth={2.2} />
            </span>
            <span className="text-[19px] font-bold tracking-tight">MindSpace</span>
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}

          <div className="mx-3 my-4 h-px bg-white/10" />

          {supportNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>

        <div className="space-y-4 px-4 pb-6">
          <div className="rounded-2xl bg-navy-2 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-1.5 text-[12px] text-mint">
              <Heart size={13} className="fill-blossom text-blossom" />
              <span>Supportive reminder</span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-white/85">
              You're not alone.
              <br />
              We're here, together.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blossom/20 text-blossom">
                <Heart size={12} className="fill-blossom" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/20 text-mint">
                <Leaf size={12} />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-lavender">
                <Sparkle size={12} />
              </span>
            </div>
          </div>

          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-white/5"
          >
            <Avatar name={user.name} size={40} gradient="blossom" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-white/50">View Profile</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
