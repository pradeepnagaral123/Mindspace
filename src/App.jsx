import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
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
import CheckInHistory from "./pages/CheckInHistory";
import Helplines from "./pages/Helplines";
import Profile from "./pages/Profile";
import PlaceholderPage from "./pages/PlaceholderPage";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import AppShell from "./components/AppShell";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/verify" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
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
          <Route path="/check-in-history" element={<CheckInHistory />} />
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
