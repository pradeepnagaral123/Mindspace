import { useState } from "react";
import {
  AtSign,
  Check,
  Heart,
  Lock,
  LogOut,
  Mail,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import { user } from "../data/mockData";

const interests = [
  "Anxiety",
  "Student life",
  "Mindfulness",
  "Sleep",
  "Journaling",
  "Breathwork",
];

const stats = [
  { label: "Check-ins", value: "9" },
  { label: "Connections", value: "12" },
  { label: "Communities", value: "3" },
  { label: "Journal entries", value: "24" },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    handle: user.handle,
    role: user.role,
    bio: "Final-year student finding calm between deadlines. Here to listen and be heard.",
  });

  const save = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Your Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your identity, connections and privacy settings.
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-mint via-lavender to-blossom" />
        <div className="relative px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar name={form.name} size={80} gradient="blossom" className="ring-4 ring-white" />
              <div className="pb-1">
                <p className="text-lg font-bold text-ink">{form.name}</p>
                <p className="text-[13px] text-muted">
                  {form.handle} · {form.role}
                </p>
              </div>
            </div>
            {editing ? (
              <button
                onClick={save}
                className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
              >
                <Check size={15} />
                Save changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
              >
                <Pencil size={14} />
                Edit profile
              </button>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {form.bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-mint-deep"
              >
                {interest}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-cream/50 p-3.5 text-center"
              >
                <p className="font-display text-xl font-semibold text-ink">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {editing && (
        <Card className="p-6">
          <h2 className="text-[15px] font-bold text-ink">Edit details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-bold tracking-wide text-muted uppercase">
                Name
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold tracking-wide text-muted uppercase">
                Handle
              </span>
              <input
                value={form.handle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, handle: event.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold tracking-wide text-muted uppercase">
                Bio
              </span>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(event) =>
                  setForm((current) => ({ ...current, bio: event.target.value }))
                }
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
              />
            </label>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Card className="p-5">
          <h2 className="text-[15px] font-bold text-ink">Account</h2>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-cream/50 p-3.5">
              <Mail size={16} className="text-muted" />
              <div>
                <p className="text-[13px] font-semibold text-ink">Email</p>
                <p className="text-xs text-muted">pradeep.nagaral@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-cream/50 p-3.5">
              <AtSign size={16} className="text-muted" />
              <div>
                <p className="text-[13px] font-semibold text-ink">Handle</p>
                <p className="text-xs text-muted">{form.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-cream/50 p-3.5">
              <Lock size={16} className="text-muted" />
              <div>
                <p className="text-[13px] font-semibold text-ink">Password</p>
                <p className="text-xs text-muted">Last changed 3 months ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-bold text-ink">Privacy & security</h2>
          <div className="mt-3 space-y-2.5">
            {[
              { icon: ShieldCheck, title: "Anonymous by default", text: "Post in communities without revealing your identity." },
              { icon: Lock, title: "Profile visible to", text: "Only your connections can see your full profile." },
              { icon: Heart, title: "Mood history", text: "Only visible to you. Never shared or published." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-line bg-cream/50 p-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-mint-deep">
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">
                      {item.title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3 border-blossom/30 p-5">
        <div>
          <p className="text-[14px] font-bold text-ink">Sign out of MindSpace</p>
          <p className="text-[13px] text-muted">
            You'll still keep all your check-ins, journal and connections.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-blossom-deep/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft">
          <LogOut size={15} />
          Sign out
        </button>
      </Card>
    </div>
  );
}
