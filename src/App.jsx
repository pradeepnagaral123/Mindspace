import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import AppShell from "./components/AppShell";

const placeholderRoutes = [
  { path: "/communities", title: "Communities", description: "Browse safe, moderated spaces to connect with peers who understand what you're going through." },
  { path: "/find-a-peer", title: "Find a Peer", description: "We'll match you with someone who shares similar experiences — one supportive conversation at a time." },
  { path: "/messages", title: "Messages", description: "Your supportive conversations, all in one place." },
  { path: "/check-in", title: "Check-in", description: "A quick, gentle way to tune into how you're feeling and track your journey over time." },
  { path: "/resources", title: "Resources", description: "Articles, exercises and guided tools to support your wellbeing, written with care." },
  { path: "/events", title: "Events", description: "Meditations, talk circles and workshops hosted by real people who get it." },
  { path: "/saved", title: "Saved", description: "Posts, resources and moments you've kept close for later." },
  { path: "/support", title: "Support Center", description: "Help with using MindSpace, community guidelines and reporting concerns." },
  { path: "/safety", title: "Safety", description: "How we keep this space safe, private and kind — and the controls you always have." },
  { path: "/helplines", title: "Helplines & Crisis Support", description: "Professional and crisis resources you can reach right now, whenever you need them." },
  { path: "/journal", title: "Journal", description: "A private space to put your thoughts into words — your words, your pace." },
  { path: "/profile", title: "Your Profile", description: "Your identity, connections and privacy settings." },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {placeholderRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PlaceholderPage title={route.title} description={route.description} />
            }
          />
        ))}
        <Route
          path="/communities/:id"
          element={
            <PlaceholderPage
              title="Community"
              description="This community space is being prepared with care. It'll be ready soon."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
