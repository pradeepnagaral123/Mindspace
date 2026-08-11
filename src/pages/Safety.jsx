import { useState } from "react";
import {
  Ban,
  EyeOff,
  Flag,
  HandHeart,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Siren,
} from "lucide-react";
import Card from "../components/Card";

const principles = [
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "Your identity is protected unless you choose otherwise. Nothing you share is ever exposed without your explicit consent.",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    icon: HandHeart,
    title: "Kindness, always",
    description:
      "Every conversation is held in a culture of compassion. Unkind words and judgment have no place here.",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    icon: ShieldCheck,
    title: "Active moderation",
    description:
      "Real people review reports and patrol our spaces so everyone feels safe to open up.",
    accent: "bg-blossom-soft text-blossom-deep",
  },
  {
    icon: EyeOff,
    title: "Respect boundaries",
    description:
      "You can go anonymous, mute threads, or leave a conversation at any time — no questions asked.",
    accent: "bg-sun-soft text-sun-deep",
  },
];

const controls = [
  {
    title: "Anonymous posting",
    description: "Share thoughts in communities without revealing your identity.",
    enabled: true,
  },
  {
    title: "Mute conversations",
    description: "Pause notifications for any thread without leaving it.",
    enabled: true,
  },
  {
    title: "Restrict direct messages",
    description: "Only allow messages from people you've connected with.",
    enabled: false,
  },
  {
    title: "Block & report",
    description: "Block a member and report any content that makes you uncomfortable.",
    enabled: true,
  },
];

export default function Safety() {
  const [toggles, setToggles] = useState(
    Object.fromEntries(controls.map((control) => [control.title, control.enabled])),
  );

  const toggle = (title) => {
    setToggles((current) => ({ ...current, [title]: !current[title] }));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Safety
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          How we keep this space safe, private and kind — and the controls you
          always have.
        </p>
      </div>

      <Card className="relative overflow-hidden bg-navy! p-6 text-white sm:p-8">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-mint/10" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-blossom/10" />
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-lavender text-navy">
            <ShieldCheck size={30} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold">
              A space you can trust
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/75">
              Safety isn't a feature — it's the foundation. Everything on
              MindSpace is designed so you can be honest without being exposed,
              and vulnerable without being judged.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <Card
              key={principle.title}
              className="flex flex-col p-5 transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${principle.accent}`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[14px] font-bold text-ink">
                {principle.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {principle.description}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-[15px] font-bold text-ink">
            Controls you always have
          </h2>
          <div className="mt-3 divide-y divide-line/70">
            {controls.map((control) => {
              const enabled = toggles[control.title];
              return (
                <div
                  key={control.title}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">
                      {control.title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {control.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(control.title)}
                    aria-pressed={enabled}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                      enabled ? "bg-mint-deep" : "bg-line"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-lavender-soft px-3.5 py-2.5 text-[12px] font-medium text-lavender-deep">
            <ShieldCheck size={15} />
            These controls are applied instantly and can be changed at any time.
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-blossom/30 bg-gradient-to-br from-blossom-soft/70 to-cream p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blossom/20 text-blossom-deep">
              <Flag size={18} />
            </span>
            <h3 className="mt-3 text-[14px] font-bold text-ink">
              Report something
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              If anything feels off, report it. Our care team reviews every
              report privately and confidentially.
            </p>
            <button className="mt-3 w-full rounded-xl border border-blossom-deep/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft">
              Report a concern
            </button>
          </Card>

          <Card className="border-blossom/30 bg-gradient-to-br from-navy to-navy-2 p-5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blossom/20 text-blossom">
              <Siren size={18} />
            </span>
            <h3 className="mt-3 text-[14px] font-bold">
              In a crisis right now?
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/75">
              Peer support isn't a replacement for professional care. If you
              need urgent help, reach a crisis line now.
            </p>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blossom px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-blossom-deep">
              <HeartHandshake size={15} />
              View helplines
            </button>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cream text-muted">
              <Ban size={16} />
            </span>
            <p className="text-[13px] leading-relaxed text-muted">
              Bullying, harassment or unsolicited medical advice is never
              tolerated and is removed immediately.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
