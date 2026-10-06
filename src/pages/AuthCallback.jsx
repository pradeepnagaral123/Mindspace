import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, token, loading, loginWithToken } = useAuth();
  const [phase, setPhase] = useState("init");

  useEffect(() => {
    const tokenParam = params.get("token");
    if (tokenParam) {
      setPhase("pending");
      loginWithToken(tokenParam);
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (phase !== "pending" || loading) return;
    navigate(user ? "/dashboard" : "/", { replace: true });
  }, [phase, loading, user, token]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #e5e7eb",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AuthCallback;
