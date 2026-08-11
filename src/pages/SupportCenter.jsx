import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  LifeBuoy,
  Mail,
  MessageCircle,
  Newspaper,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import Card from "../components/Card";

const topics = [
  { icon: LifeBuoy, title: "Getting started", description: "Explore what MindSpace has to offer.", accent: "bg-mint-soft text-mint-deep" },
  { icon: UserRound, title: "Account & profile", description: "Settings, privacy and your identity.", accent: "bg-lavender-soft text-lavender-deep" },
  { icon: MessageCircle, title: "Communities & messages", description: "Posts, peers and conversations.", accent: "bg-blossom-soft text-blossom-deep" },
  { icon: ShieldAlert, title: "Reporting & safety", description: "Report content and block members.", accent: "bg-peach-soft text-peach-deep" },
  { icon: BookOpen, title: "Resources & journal", description: "Tools, articles and your private space.", accent: "bg-sun-soft text-sun-deep" },
  { icon: Newspaper, title: "Updates & notices", description: "What's new and what changed.", accent: "bg-mint-soft text-mint-deep" },
];

const faqs = [
  {
    question: "Is MindSpace really anonymous?",
    answer:
      "Yes. Your identity is never shown to other members unless you choose to reveal it. Communities are moderated, and everything you post stays within the space you choose to share it in.",
  },
  {
    question: "How does Find a Peer match me?",
    answer:
      "We match you based on the topics you relate to and what you're looking for — a listening ear, someone to share with, or both. Matches stay anonymous until both people choose to reveal themselves.",
  },
  {
    question: "Is my journal private?",
    answer:
      "Completely. Your journal is only visible to you, stored securely and never shared with communities or peers. You can export or delete your entries at any time.",
  },
  {
    question: "How do I report something that makes me uncomfortable?",
    answer:
      "Every post and message has a report option. When you report, a member of our care team reviews it privately and takes action — including removing content or blocking a member — while keeping you anonymous.",
  },
  {
    question: "What if I'm in crisis and need help right now?",
    answer:
      "Please reach out to a professional crisis line immediately. You'll find helplines and crisis resources in the Helplines page, available 24/7. MindSpace is a peer support space, not a substitute for professional care.",
  },
];

export default function SupportCenter() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Support Center
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Help with using MindSpace, community guidelines and reporting
          concerns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card
              key={topic.title}
              className="group p-5 transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${topic.accent}`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[14px] font-bold text-ink group-hover:text-mint-deep">
                {topic.title}
              </h3>
              <p className="mt-1 text-[13px] text-muted">
                {topic.description}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-[15px] font-bold text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-3 divide-y divide-line/70">
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                  >
                    <span className="text-sm font-semibold text-ink">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-muted transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="pb-4 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-mint/40 bg-gradient-to-br from-mint-soft/70 to-cream p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-mint">
              <Mail size={18} />
            </span>
            <h3 className="mt-3 text-[14px] font-bold text-ink">
              Still need help?
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Our care team replies within 24 hours, usually much sooner.
            </p>
            <button className="mt-3 w-full rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2">
              Contact support
            </button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-ink">Quick links</h3>
            <div className="mt-2.5 space-y-1">
              {[
                "Community guidelines",
                "Report a post",
                "Block a member",
                "Privacy settings",
                "Data & export",
              ].map((link) => (
                <button
                  key={link}
                  className="w-full rounded-lg px-2 py-2 text-left text-[13px] font-medium text-mint-deep transition-colors hover:bg-cream"
                >
                  {link}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
