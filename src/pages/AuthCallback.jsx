import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const tokenParam = params.get("token");
    if (!tokenParam) {
      navigate("/?auth=failed&reason=missing_token", { replace: true });
      return undefined;
    }

    let active = true;

    // Wait for the session to actually resolve before navigating. Relying on
    // the shared `loading` flag races with the provider's own mount effect.
    (async () => {
      const user = await loginWithToken(tokenParam);
      if (!active) return;
      navigate(
        user ? "/dashboard" : "/?auth=failed&reason=session_failed",
        { replace: true },
      );
    })();

    return () => {
      active = false;
    };
  }, []);

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
