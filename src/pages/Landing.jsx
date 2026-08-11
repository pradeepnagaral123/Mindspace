import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import sittingWomen from "../images/sitting_women.png";

const communities = [
  { icon: "🌱", title: "Stress & Anxiety", members: "12.4k members" },
  { icon: "🎓", title: "Student Life", members: "8.7k members" },
  { icon: "◉", title: "Loneliness", members: "7.2k members" },
  { icon: "♡", title: "Relationships", members: "6.1k members" },
  { icon: "🌿", title: "Self Growth", members: "5.8k members" },
  { icon: "🌾", title: "Grief & Loss", members: "4.3k members" },
];

const resources = [
  {
    title: "Understanding Anxiety",
    time: "5 min read",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Dealing With Academic Stress",
    time: "7 min read",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "When You Feel Lonely",
    time: "4 min read",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "5 Self-Care Habits That Help",
    time: "6 min read",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80",
  },
];

function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const navigate = useNavigate();

  return (
    <div className="app">
      <div className="home">
      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#">
          <span className="logo-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>MindSpace</span>
        </a>

        <nav>
          <a href="#how">How It Works</a>
          <a href="#communities">Communities</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
          <a href="#safety">Safety</a>
        </nav>

        <button className="nav-button" onClick={() => setAuthOpen(true)}>
          Get Support
        </button>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">A space to connect, listen & belong</p>

            <h1>
              You don't have to
              <br />
              go through it alone.
            </h1>

            <p className="hero-description">
              A safe, supportive space where you can connect with people who
              understand, share your experiences, and find resources for your
              wellbeing.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => setAuthOpen(true)}
              >
                Find Your Community
              </button>
              <button className="secondary-btn">How It Works</button>
            </div>

            <div className="member-row">
              <div className="avatars">
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏾</span>
                <span>👨🏻</span>
              </div>

              <p>
                Join <strong>50,000+ people</strong> finding support and
                connections every day.
              </p>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-outline"></div>

            <div className="sunset">
              <img
                src="https://images.unsplash.com/photo-1661025208052-f4f54db8d743?auto=format&fit=crop&w=900&q=80"
                alt="A family sitting on a hill watching the sunset together"
              />
              <div className="frame-glow"></div>
            </div>

            <div className="leaf-decoration">◢</div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <Trust
          icon="♙"
          title="Privacy focused"
          text="Your privacy comes first."
        />
        <Trust
          icon="♧"
          title="Peer support"
          text="Real people, real support."
        />
        <Trust
          icon="♢"
          title="Safe community"
          text="Moderated and protected."
        />
          <Trust
          icon="♡"
          title="You matter"
          text="Everyone belongs here."
        />
      </section>
      </div>

      {/* PROBLEM */}
      <section className="problem section" id="about">
        <div className="problem-body">
          <div className="problem-copy">
            <p className="section-label">YOU'RE NOT ALONE</p>

            <h2>
              Sometimes, you just need
              <br />
              someone who understands.
            </h2>

            <div className="problem-grid">
              <Problem icon="◉" title="Feeling overwhelmed">
                Everything feels like too much.
              </Problem>

              <Problem icon="♧" title="Feeling alone">
                I wish I could talk to someone.
              </Problem>

              <Problem icon="♡" title="Need someone who understands">
                I don't want to explain everything.
              </Problem>

              <Problem icon="☼" title="Looking for support">
                I don't know where to start.
              </Problem>
            </div>
          </div>

          <div className="problem-art">
            <img
              className="sitting-women-img"
              src={sittingWomen}
              alt="A young woman sitting on the ground with her knees pulled to her chest"
            />
          </div>
        </div>

        <div className="problem-extra">
          <div className="problem-quote">
            <span className="quote-mark">“</span>
            <p>
              Whatever you're going through, there are people here who get it —
              and you don't have to carry it alone.
            </p>
          </div>

          <div className="problem-stats">
            <div className="stat">
              <strong>50k+</strong>
              <span>Members supporting each other</span>
            </div>
            <div className="stat">
              <strong>12k+</strong>
              <span>Conversations started every month</span>
            </div>
            <div className="stat">
              <strong>24/7</strong>
              <span>A safe space, always here</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Anonymous participation</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how section" id="how">
        <div className="center-heading">
          <p className="section-label">SIMPLE BY DESIGN</p>
          <h2>How it works</h2>
          <div className="heading-line"></div>
        </div>

        <div className="steps">
          <Step number="01" icon="♙" title="Tell us what you're looking for">
            Share your interests and what matters to you.
          </Step>

          <Arrow />

          <Step number="02" icon="♧" title="Find people & communities">
            We connect you with peers and communities.
          </Step>

          <Arrow />

          <Step number="03" icon="◌" title="Connect and share">
            Start conversations and share at your own pace.
          </Step>

          <Arrow />

          <Step number="04" icon="♡" title="Support each other">
            Give and receive support in a safe, kind space.
          </Step>
        </div>
      </section>

      {/* COMMUNITIES */}
      <section className="communities section" id="communities">
        <div className="section-heading-row">
          <div>
            <p className="section-label">FIND YOUR PEOPLE</p>
            <h2>
              Find people who
              <br />
              understand.
            </h2>
          </div>

          <a href="#">Explore Communities →</a>
        </div>

        <div className="community-grid">
          {communities.map((community) => (
            <div className="community-card" key={community.title}>
              <div className="community-icon">{community.icon}</div>
              <h3>{community.title}</h3>
              <p>{community.members}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PEER MATCHING */}
      <section className="matching section">
        <div className="matching-copy">
          <p className="section-label light">PEER MATCHING</p>

          <h2>
            Find someone
            <br />
            who gets it.
          </h2>

          <p>
            Our smart matching helps you connect with people who share similar
            experiences and understand what you're going through.
          </p>

          <button className="primary-btn" onClick={() => setAuthOpen(true)}>
            Find a Peer
          </button>
        </div>

        <div className="match-card">
          <div className="profile-image">👩🏽</div>

          <div className="match-info">
            <div className="match-name">
              AnonymousUser
              <span>92% Match</span>
            </div>

            <p>Interested in:</p>

            <div className="tags">
              <span>Academic stress</span>
              <span>Student life</span>
            </div>

            <small>◷ Usually online in the evening</small>

            <button onClick={() => setAuthOpen(true)}>Connect</button>
          </div>
        </div>
      </section>

      {/* COMMUNITY PREVIEW */}
      <section className="feed section">
        <div className="section-heading-row">
          <div>
            <p className="section-label">REAL CONNECTION</p>
            <h2>
              Real conversations.
              <br />
              Real support.
            </h2>
          </div>

          <a href="#">Explore Community →</a>
        </div>

        <div className="post-grid">
          <Post
            community="Student Support"
            members="2.4k members"
            title="How do you guys deal with exam pressure?"
            description="It gets overwhelming sometimes..."
            replies="24 replies"
            likes="18"
          />

          <Post
            community="Anxiety Support"
            members="1.8k members"
            title="Had a really difficult week but trying to stay positive."
            description="Just wanted to share..."
            replies="12 replies"
            likes="31"
          />
        </div>
      </section>

      {/* RESOURCES */}
      <section className="resources section" id="resources">
        <div className="section-heading-row">
          <div>
            <p className="section-label">LEARN & GROW</p>
            <h2>
              Helpful resources
              <br />
              for your wellbeing.
            </h2>
          </div>

          <a href="#">Explore Resources →</a>
        </div>

        <div className="resource-grid">
          {resources.map((resource) => (
            <div className="resource-card" key={resource.title}>
              <img src={resource.image} alt="" />
              <div>
                <h3>{resource.title}</h3>
                <p>{resource.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section className="safety section" id="safety">
        <div className="safety-title">
          <div className="shield">♢</div>

          <div>
            <h2>A space built with safety in mind.</h2>
            <a href="#">Learn about our safety features →</a>
          </div>
        </div>

        <div className="safety-items">
          <SafetyItem icon="♙" text="Anonymous participation" />
          <SafetyItem icon="▣" text="Community guidelines" />
          <SafetyItem icon="♢" text="Report & moderation" />
          <SafetyItem icon="×" text="Block & privacy controls" />
          <SafetyItem icon="×" text="Peer support, not professional therapy" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="quote">
          <span>“</span>
          <p>
            I finally found a place where
            <br />
            I didn't feel judged.
          </p>
          <small>— Community member</small>
        </div>

        <div className="cta-copy">
          <h2>You don't have to do it alone.</h2>
          <p>
            Take the first step toward finding a community that understands.
          </p>
          <button className="primary-btn" onClick={() => setAuthOpen(true)}>
            Join the Community
          </button>
        </div>

        <div className="cta-decoration">♧</div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <a className="logo" href="#">
            <span className="logo-mark">
              <i></i>
              <i></i>
              <i></i>
            </span>
            MindSpace
          </a>

          <p>
            Peer support for people who
            <br />
            want to connect, listen and belong.
          </p>

          <div className="socials">◎　𝕏　◉　◎</div>
        </div>

        <FooterColumn
          title="Product"
          links={[
            "Communities",
            "Find a Peer",
            "Resources",
            "How It Works",
          ]}
        />

        <FooterColumn
          title="Support"
          links={[
            "Safety Center",
            "Community Guidelines",
            "Contact Us",
            "Help Center",
          ]}
        />

        <FooterColumn
          title="Legal"
          links={["Privacy Policy", "Terms of Service", "Cookie Policy"]}
        />

        <div className="newsletter">
          <h4>Stay in the loop</h4>
          <p>Get tips, resources and updates straight to your inbox.</p>

          <div className="email-input">
            <input placeholder="Enter your email" />
            <button onClick={() => setAuthOpen(true)}>→</button>
          </div>
        </div>

        <div className="copyright">
          © 2026 MindSpace. All rights reserved.
        </div>
      </footer>

      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}

/* COMPONENTS */

function Trust({ icon, title, text }) {
  return (
    <div className="trust-item">
      <div className="trust-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Problem({ icon, title, children }) {
  return (
    <div className="problem-item">
      <div className="problem-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function Step({ number, icon, title, children }) {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <div className="step-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Arrow() {
  return <div className="arrow">→</div>;
}

function Post({
  community,
  members,
  title,
  description,
  replies,
  likes,
}) {
  return (
    <article className="post-card">
      <div className="post-top">
        <div className="post-avatar">👤</div>

        <div>
          <strong>{community}</strong>
          <p>{members}</p>
        </div>

        <span className="dots">⋮</span>
      </div>

      <h3>{title}</h3>
      <p className="post-description">{description}</p>

      <div className="post-footer">
        <span>♡ {replies}</span>
        <span>♥ {likes}</span>
      </div>
    </article>
  );
}

function SafetyItem({ icon, text }) {
  return (
    <div className="safety-item">
      <div>{icon}</div>
      <span>{text}</span>
    </div>
  );
}
function FooterColumn({ title, links }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>

      {links.map((link) => (
        <a href="#" key={link}>
          {link}
        </a>
      ))}
    </div>
  );
}

function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSuccess();
  };

  return (
    <div className="auth-backdrop" onClick={handleBackdrop}>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="auth-logo">
          <span className="logo-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
        </div>

        <h2>{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-subtitle">
          {mode === "signin"
            ? "Sign in to find your community."
            : "Join a space where you belong."}
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <label>
              <span>Name</span>
              <input
                type="text"
                placeholder="How would you like to be called?"
                value={form.name}
                onChange={update("name")}
              />
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
            />
          </label>

          {mode === "signin" ? (
            <a className="auth-forgot" href="#">
              Forgot password?
            </a>
          ) : (
            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <a href="#">Community Guidelines</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          )}

          <button type="submit" className="auth-submit">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button className="auth-google">
          <span className="google-g">G</span> Continue with Google
        </button>

        <p className="auth-note">
          Your participation is always anonymous. Peer support, not
          professional therapy.
        </p>
      </div>
    </div>
  );
}
export default Landing;
