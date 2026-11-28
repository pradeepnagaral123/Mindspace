import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  HeartHandshake,
  Leaf,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppShell from "../components/AppShell";
import Card from "../components/Card";

const highlights = [
  {
    icon: HeartHandshake,
    title: "Peer support first",
    description: "A caring community, not professional care.",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    icon: Users,
    title: "Respect each other",
    description: "Kindness shapes every conversation.",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    icon: Lock,
    title: "Privacy matters",
    description: "Share only what feels right for you.",
    accent: "bg-blossom-soft text-blossom-deep",
  },
  {
    icon: Sparkles,
    title: "Terms may change",
    description: "Updates are always published here.",
    accent: "bg-sun-soft text-sun-deep",
  },
];

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    icon: FileText,
    paragraphs: [
      "By creating an account or using Mindspace, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.",
      "If you do not agree with these terms, please discontinue using the platform.",
    ],
  },
  {
    id: "about",
    number: "02",
    title: "About Mindspace",
    icon: HeartHandshake,
    paragraphs: [
      "Mindspace is a mental health peer support platform designed to encourage emotional well-being through communication, community interaction, self-reflection, and supportive activities.",
      "Our platform provides:",
    ],
    bullets: [
      "Peer-to-peer messaging.",
      "Community support and discussions.",
      "Anonymous journaling for personal reflection.",
      "Wellness activities and interactive games.",
      "Mental health awareness resources.",
    ],
  },
  {
    id: "responsibilities",
    number: "03",
    title: "User Responsibilities",
    icon: Users,
    paragraphs: ["Users agree to:"],
    bullets: [
      "Provide accurate information during registration.",
      "Maintain the confidentiality of their login credentials.",
      "Treat other users with kindness and respect.",
      "Avoid bullying, harassment, hate speech, or abusive language.",
      "Avoid sharing misleading, harmful, or inappropriate content.",
      "Respect the privacy and personal experiences of other users.",
    ],
    note: "Users are responsible for all activities performed through their accounts.",
  },
  {
    id: "disclaimer",
    number: "04",
    title: "Mental Health Disclaimer",
    icon: ShieldCheck,
    paragraphs: [
      "Mindspace is an educational and peer-support platform. It is not a medical service and does not provide professional mental health diagnosis, therapy, counselling, or treatment.",
    ],
    bullets: [
      "Peer support is not a substitute for professional medical advice.",
      "Information shared by other users should not be considered professional guidance.",
      "Users experiencing serious emotional distress are encouraged to seek help from qualified mental health professionals.",
      "In an emergency or immediate danger, contact local emergency services or seek immediate professional assistance.",
    ],
  },
  {
    id: "privacy",
    number: "05",
    title: "Privacy and Data Protection",
    icon: Lock,
    paragraphs: [
      "We respect the privacy of our users and aim to protect their personal information.",
    ],
    bullets: [
      "Personal information is used to provide and improve platform services.",
      "Users should avoid sharing sensitive personal information publicly.",
      "Account information and platform data may be stored securely.",
      "We do not encourage users to disclose private information in community discussions.",
    ],
    note: "Please refer to our Privacy Policy for further information about data collection, storage, and usage.",
  },
  {
    id: "journaling",
    number: "06",
    title: "Anonymous Journaling",
    icon: BookOpen,
    paragraphs: [
      "Mindspace provides an anonymous journaling feature that allows users to express their thoughts and feelings.",
    ],
    bullets: [
      "Journal entries are intended for personal reflection.",
      "Users should not include sensitive identifying information in journal entries.",
      "Anonymous journaling does not necessarily mean complete technical anonymity.",
      "Users should not attempt to access another user's private journal entries.",
    ],
  },
  {
    id: "messaging",
    number: "07",
    title: "Peer Messaging and Community Guidelines",
    icon: MessageCircle,
    paragraphs: [
      "Mindspace encourages healthy communication and supportive interactions. Users must not:",
    ],
    bullets: [
      "Harass, threaten, or intimidate other users.",
      "Share another person's private conversations without permission.",
      "Spread harmful or misleading information.",
      "Use the platform for spam, scams, or inappropriate activities.",
    ],
    note: "We reserve the right to restrict or suspend accounts that violate these guidelines.",
  },
  {
    id: "accounts",
    number: "08",
    title: "Account Suspension and Termination",
    icon: ShieldCheck,
    paragraphs: [
      "Mindspace reserves the right to suspend or terminate accounts that:",
    ],
    bullets: [
      "Violate these Terms and Conditions.",
      "Engage in abusive or harmful activities.",
      "Misuse platform features.",
      "Attempt unauthorized access to the platform or its data.",
    ],
    note: "Users may discontinue using the platform at any time.",
  },
  {
    id: "intellectual-property",
    number: "09",
    title: "Intellectual Property",
    icon: FileText,
    paragraphs: [
      "All platform designs, branding, content, and original features belong to Mindspace or their respective owners. Users may not reproduce, distribute, or commercially exploit platform content without appropriate permission.",
    ],
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to These Terms",
    icon: Sparkles,
    paragraphs: [
      "We reserve the right to update or modify these Terms and Conditions whenever necessary. Updated terms will be published on this page. Continued use of the platform indicates acceptance of the revised terms.",
    ],
  },
  {
    id: "contact",
    number: "11",
    title: "Contact Information",
    icon: Mail,
    paragraphs: [
      "If you have questions, concerns, or suggestions regarding these Terms and Conditions, please contact the Mindspace development team.",
      "Platform: Mindspace – Mental Health Peer Support Platform",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Terms and Conditions
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Mindspace – Mental Health Peer Support Platform
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12px] font-semibold text-muted">
          <CalendarDays size={15} className="text-mint-deep" />
          Last updated: November 28, 2026
        </span>
      </div>

      <Card className="relative overflow-hidden bg-navy! p-6 text-white sm:p-8">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-mint/10" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-blossom/10" />
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-lavender text-navy">
            <FileText size={30} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold">
              Welcome to Mindspace
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/75">
              By accessing or using our platform, you agree to comply with these
              Terms and Conditions. Please read them carefully before using our
              services.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-5">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent}`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[14px] font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {item.description}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-[15px] font-bold text-ink">On this page</h2>
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-lg px-2 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-cream hover:text-mint-deep"
            >
              <span className="mr-2 text-[11px] font-bold text-mint-deep">
                {section.number}
              </span>
              {section.title}
            </a>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-mint-deep">
                    <Icon size={19} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-wide text-mint-deep">
                      SECTION {section.number}
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-semibold text-ink sm:text-xl">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-4 pl-0 sm:pl-[52px]">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="mt-2 text-[13.5px] leading-relaxed text-muted first:mt-0"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="mt-3 space-y-2.5">
                      {section.bullets.map((bullet, index) => (
                        <li
                          key={index}
                          className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted"
                        >
                          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-mint-deep" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <p className="mt-4 rounded-xl bg-cream px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
                      {section.note}
                    </p>
                  )}
                </div>
              </Card>
            </section>
          );
        })}
      </div>

      <Card className="border-mint/40 bg-gradient-to-br from-mint-soft/70 to-cream p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-mint">
            <Mail size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-ink">
              Thank you for being part of Mindspace
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Let's create a safe, supportive, and understanding community
              together. For questions about these terms, contact the Mindspace
              development team.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function TermsPage() {
  const { user, loading } = useAuth();
  const content = <TermsAndConditions />;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return <AppShell>{content}</AppShell>;
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <header className="border-b border-white/10 bg-navy text-white">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-lavender text-navy">
              <Leaf size={20} strokeWidth={2.2} />
            </span>
            MindSpace
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 lg:py-12">
        {content}
      </main>

      <footer className="border-t border-line/70 px-4 py-6 text-center text-[12px] text-muted">
        © 2026 MindSpace. All rights reserved.
      </footer>
    </div>
  );
}
