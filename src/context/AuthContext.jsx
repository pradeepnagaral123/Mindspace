import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const fetchedToken = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    fetchedToken.current = null;
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  // Always request against an explicit token. During the OAuth callback the
  // `token` state has not propagated yet, so reading it from this closure
  // would send a stale value.
  const fetchMe = useCallback(
    async (forToken) => {
      if (!forToken) return null;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${forToken}` },
        });
        if (!res.ok) {
          logout();
          return null;
        }
        const data = await res.json();
        setUser(data.user);
        return data.user;
      } catch {
        logout();
        return null;
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    if (!token) return;
    if (fetchedToken.current === token) return;
    fetchedToken.current = token;
    fetchMe(token);
  }, [token, fetchMe]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("token", data.token);
    fetchedToken.current = data.token;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    if (data.needsVerification) return data;
    localStorage.setItem("token", data.token);
    fetchedToken.current = data.token;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Resolves with the authenticated user (or null) so callers can wait for the
  // session to be ready instead of guessing from the `loading` flag.
  const loginWithToken = async (newToken) => {
    localStorage.setItem("token", newToken);
    fetchedToken.current = newToken;
    setToken(newToken);
    return fetchMe(newToken);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, loginWithToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
