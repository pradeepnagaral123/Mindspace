import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_URL}/auth/verify?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/", { replace: true }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 32px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {status === "verifying" && (
          <>
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#6366f1",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <h2 style={{ margin: 0, color: "#1e293b" }}>
              Verifying your email...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <h2 style={{ margin: "0 0 8px", color: "#15803d" }}>
              Email verified!
            </h2>
            <p style={{ color: "#475569", margin: "0 0 20px" }}>{message}</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                background: "#4f46e5",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign In Now
            </Link>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "16px" }}>
              Redirecting automatically in a few seconds...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
            <h2 style={{ margin: "0 0 8px", color: "#d32f2f" }}>
              Verification failed
            </h2>
            <p style={{ color: "#475569", margin: "0 0 20px" }}>{message}</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                background: "#4f46e5",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default VerifyEmail;
