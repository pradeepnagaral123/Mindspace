import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import FindAPeer from "./pages/FindAPeer";
import Messages from "./pages/Messages";
import CheckIn from "./pages/CheckIn";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Saved from "./pages/Saved";
import SupportCenter from "./pages/SupportCenter";
import Safety from "./pages/Safety";
import Journal from "./pages/Journal";
import Helplines from "./pages/Helplines";
import Profile from "./pages/Profile";
import PlaceholderPage from "./pages/PlaceholderPage";
import AppShell from "./components/AppShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/find-a-peer" element={<FindAPeer />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/events" element={<Events />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/support" element={<SupportCenter />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/profile" element={<Profile />} />
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
