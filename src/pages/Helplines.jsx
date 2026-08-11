import { Phone, PhoneCall, ShieldCheck } from "lucide-react";
import Card from "../components/Card";

const helplines = [
  {
    name: "KIRAN",
    tagline: "Government of India mental health helpline",
    phone: "1800-599-0019",
    hours: "24/7 · Toll-free",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    name: "iCall (TISS)",
    tagline: "Professional counseling by trained psychologists",
    phone: "+91 91529 87821",
    hours: "Mon–Sat, 10 AM – 8 PM",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    name: "Vandrevala Foundation",
    tagline: "Free mental health support & crisis care",
    phone: "+91 9999 666 555",
    hours: "24/7 · Free",
    accent: "bg-blossom-soft text-blossom-deep",
  },
  {
    name: "AASRA",
    tagline: "Crisis intervention and suicide prevention",
    phone: "+91 98204 66726",
    hours: "24/7 · Free",
    accent: "bg-sun-soft text-sun-deep",
  },
  {
    name: "Tele-MANAS",
    tagline: "National tele-mental health programme",
    phone: "14416",
    hours: "24/7 · Toll-free",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    name: "Aasra Emergency",
    tagline: "For immediate, urgent support",
    phone: "9880466726",
    hours: "24/7 · Free",
    accent: "bg-peach-soft text-peach-deep",
  },
];

const tips = [
  "Stay on the line until someone answers — even a few minutes of human connection helps.",
  "It's okay to not know what to say. Just start with 'I need help right now.'",
  "If you're worried about someone, offer to call with them or wait with them.",
  "You deserve immediate, compassionate care. Reaching out is a strength, not a weakness.",
];

export default function Helplines() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Helplines & Crisis Support
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Professional and crisis resources you can reach right now, whenever
          you need them.
        </p>
      </div>

      <Card className="relative overflow-hidden bg-navy! p-6 text-white sm:p-8">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blossom/10" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-mint/10" />
        <div className="relative">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blossom/20 text-blossom">
            <PhoneCall size={26} />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">
            If you're in crisis, please reach out right now.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
            MindSpace is a peer support space and does not replace professional
            care. The helplines below are staffed by trained, caring
            professionals who are ready to listen — any time, day or night.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helplines.map((helpline) => (
          <Card
            key={helpline.name}
            className="flex flex-col p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-ink">
                  {helpline.name}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {helpline.tagline}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${helpline.accent}`}
              >
                <Phone size={17} />
              </span>
            </div>

            <p className="mt-4 font-display text-xl font-semibold text-ink">
              {helpline.phone}
            </p>
            <span className="mt-1 w-fit rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
              {helpline.hours}
            </span>

            <a
              href={`tel:${helpline.phone.replace(/[^+\d]/g, "")}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
            >
              <PhoneCall size={15} />
              Call now
            </a>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-mint-soft text-mint-deep">
              <ShieldCheck size={17} />
            </span>
            <h2 className="text-[15px] font-bold text-ink">
              When you call
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-blossom/30 bg-gradient-to-br from-blossom-soft/70 to-cream p-5">
          <h3 className="text-[14px] font-bold text-ink">
            Worried about someone?
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            It's okay to be concerned. Let them know you care, ask gently how
            they're doing, and offer to connect with a helpline together.
          </p>
          <button className="mt-3 w-full rounded-xl border border-blossom-deep/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft">
            Learn how to help
          </button>
        </Card>
      </div>
    </div>
  );
}
