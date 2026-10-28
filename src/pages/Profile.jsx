import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AtSign,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  Globe,
  Lock,
  LogOut,
  Mail,
  Pencil,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const interestPool = [
  "Anxiety",
  "Student life",
  "Mindfulness",
  "Sleep",
  "Journaling",
  "Breathwork",
  "Self-care",
  "Focus",
  "Therapy",
  "Gratitude",
];

const roleOptions = [
  "Student",
  "Peer supporter",
  "Educator",
  "Counsellor",
  "Just here to listen",
];

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-mint-deep" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [journalCount, setJournalCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);
  const [moodCount, setMoodCount] = useState(0);
  const [privacy, setPrivacy] = useState({
    anonymous: true,
    privateMood: true,
    onlineStatus: true,
    visibility: "connections",
  });
  const [form, setForm] = useState({
    name: user?.name || "",
    handle: user?.email ? `@${user.email.split("@")[0]}` : "",
    role: "Student",
    bio: "Final-year student finding calm between deadlines. Here to listen and be heard.",
    interests: ["Anxiety", "Student life", "Mindfulness", "Sleep", "Journaling", "Breathwork"],
  });
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/journals/count`, { headers })
      .then((r) => r.ok && r.json())
      .then((d) => { if (d) setJournalCount(d.count); })
      .catch(() => {});

    fetch(`${API_URL}/connections/count`, { headers })
      .then((r) => r.ok && r.json())
      .then((d) => { if (d) setConnectionCount(d.count); })
      .catch(() => {});

    fetch(`${API_URL}/moods/stats`, { headers })
      .then((r) => r.ok && r.json())
      .then((d) => { if (d) setMoodCount(d.totalCheckIns); })
      .catch(() => {});
  }, [token]);

  const stats = [
    { label: "Check-ins", value: String(moodCount), to: "/check-in-history", icon: Activity, tint: "bg-mint-soft text-mint-deep" },
    { label: "Connections", value: String(connectionCount), to: "/find-a-peer", icon: Users, tint: "bg-lavender-soft text-lavender-deep" },
    { label: "Communities", value: "3", to: "/communities", icon: Globe, tint: "bg-peach-soft text-peach-deep" },
    { label: "Journal entries", value: String(journalCount), to: "/journal", icon: BookOpen, tint: "bg-blossom-soft text-blossom-deep" },
  ];

  const startEdit = () => {
    setSnapshot(form);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (snapshot) setForm(snapshot);
    setEditing(false);
  };

  const save = () => {
    setSnapshot(null);
    setEditing(false);
  };

  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-mint-deep focus:ring-2 focus:ring-mint/40";
  const labelClass =
    "text-[11px] font-bold tracking-wide text-muted uppercase";

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

      <Card className="overflow-hidden">
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-mint via-lavender to-blossom sm:h-36">
          <div className="absolute -top-14 -right-8 h-44 w-44 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute -bottom-16 left-14 h-40 w-40 rounded-full bg-white/20 blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[length:20px_20px] opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/45 to-transparent" />
        </div>

        <div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar
                  name={form.name}
                  size={96}
                  gradient="blossom"
                  className="ring-4 ring-white shadow-lg"
                />
                <span className="absolute right-1 bottom-1 h-5 w-5 rounded-full border-[3px] border-white bg-mint-deep" />
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex items-center gap-1.5">
                  <p className="break-words font-display text-xl font-semibold text-ink sm:text-2xl">
                    {form.name || "Your name"}
                  </p>
                  <BadgeCheck size={19} className="text-mint-deep" />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                    <AtSign size={11} />
                    {form.handle.replace(/^@/, "")}
                  </span>
                  <span className="rounded-full bg-lavender-soft px-2.5 py-0.5 text-[11px] font-semibold text-lavender-deep">
                    {form.role}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-semibold text-mint-deep">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-deep" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {editing ? (
              <div className="flex gap-2 pb-1">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
                >
                  <Check size={15} />
                  Save changes
                </button>
              </div>
            ) : (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-mint/50 hover:bg-mint-soft/50"
              >
                <Pencil size={14} />
                Edit profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-6 rounded-2xl border border-line bg-cream/60 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Name</span>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Handle</span>
                  <input
                    value={form.handle}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, handle: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Role</span>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, role: event.target.value }))
                    }
                    className={inputClass}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Bio</span>
                  <input
                    value={form.bio}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, bio: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <div className="sm:col-span-2">
                  <span className={labelClass}>Interests</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {interestPool.map((interest) => {
                      const selected = form.interests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            selected
                              ? "bg-navy text-white"
                              : "border border-line bg-white text-muted hover:bg-cream"
                          }`}
                        >
                          {selected && <Check size={11} />}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
                {form.bio}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {form.interests.map((interest, index) => {
                  const tints = [
                    "bg-mint-soft text-mint-deep",
                    "bg-lavender-soft text-lavender-deep",
                    "bg-peach-soft text-peach-deep",
                    "bg-sun-soft text-sun-deep",
                    "bg-blossom-soft text-blossom-deep",
                  ];
                  return (
                    <span
                      key={interest}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        tints[index % tints.length]
                      }`}
                    >
                      {interest}
                    </span>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  to={stat.to}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-cream/50 p-4 transition-all hover:-translate-y-0.5 hover:border-mint/50 hover:bg-white hover:shadow-md"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.tint}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold text-ink">
                      {stat.value}
                    </p>
                    <p className="truncate text-[11px] font-medium text-muted">
                      {stat.label}
                    </p>
                  </div>
                  <ChevronRight
                    size={15}
                    className="ml-auto shrink-0 text-line transition-colors group-hover:text-mint-deep"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint-soft text-mint-deep">
              <Mail size={15} />
            </span>
            <h2 className="text-[15px] font-bold text-ink">Account</h2>
          </div>
          <div className="mt-4 divide-y divide-line">
            {[
              { icon: Mail, tint: "bg-mint-soft text-mint-deep", title: "Email", value: user?.email || "" },
              { icon: AtSign, tint: "bg-lavender-soft text-lavender-deep", title: "Handle", value: form.handle },
              { icon: Lock, tint: "bg-peach-soft text-peach-deep", title: "Password", value: "••••••••••" },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.title} className="flex items-center gap-3 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${row.tint}`}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">{row.title}</p>
                    <p className="truncate text-xs text-muted">{row.value}</p>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-line" />
                </div>
              );
            })}
          </div>
          <p className="mt-1 text-[11px] text-muted">Password last changed 3 months ago</p>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lavender-soft text-lavender-deep">
              <ShieldCheck size={15} />
            </span>
            <h2 className="text-[15px] font-bold text-ink">Privacy & security</h2>
          </div>
          <div className="mt-4 divide-y divide-line">
            <div className="flex items-start gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Anonymous by default</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  Post in communities without revealing your identity.
                </p>
              </div>
              <Toggle
                label="Anonymous by default"
                on={privacy.anonymous}
                onChange={() =>
                  setPrivacy((current) => ({ ...current, anonymous: !current.anonymous }))
                }
              />
            </div>
            <div className="flex items-start gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Private mood history</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  Only visible to you. Never shared or published.
                </p>
              </div>
              <Toggle
                label="Private mood history"
                on={privacy.privateMood}
                onChange={() =>
                  setPrivacy((current) => ({ ...current, privateMood: !current.privateMood }))
                }
              />
            </div>
            <div className="flex items-start gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Show online status</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  Let connections see when you're around.
                </p>
              </div>
              <Toggle
                label="Show online status"
                on={privacy.onlineStatus}
                onChange={() =>
                  setPrivacy((current) => ({ ...current, onlineStatus: !current.onlineStatus }))
                }
              />
            </div>
            <div className="flex items-center gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Profile visible to</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  Choose who can open your full profile.
                </p>
              </div>
              <select
                value={privacy.visibility}
                onChange={(event) =>
                  setPrivacy((current) => ({ ...current, visibility: event.target.value }))
                }
                className="shrink-0 rounded-xl border border-line bg-white px-3 py-2 text-[12px] font-semibold text-ink outline-none transition-colors focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections</option>
                <option value="nobody">Only me</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <Card className="relative overflow-hidden border-blossom/40 p-5 sm:p-6">
        <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-blossom-soft blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blossom-soft text-blossom-deep">
              <LogOut size={17} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-ink">Sign out of MindSpace</p>
              <p className="text-[13px] text-muted">
                You'll still keep all your check-ins, journal and connections.
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-blossom-deep/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </Card>
    </div>
  );
}
