import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser, findUserByEmail } from "../database/Users";

/* ══════════════════════════════════════════════════
   AUTH CONTEXT
   Provides: user, login(), signup(), logout()
   Consumed via: useAuth() hook anywhere in the app
   Persists login state to localStorage so refresh
   doesn't log the user out.
══════════════════════════════════════════════════ */

const AuthContext = createContext(null);

const STORAGE_KEY = "bhoomi_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // true while rehydrating from storage

  /* ── Rehydrate on mount ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Persist whenever user changes ── */
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else      localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  /* ────────────────────────────────────────────────
     login(email, password)
     Returns { success: true } or { success: false, error: string }
  ──────────────────────────────────────────────── */
  const login = (email, password) => {
    const result = authenticateUser(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  /* ────────────────────────────────────────────────
     signup(formData)
     Simulates account creation — in production this
     would POST to your backend.
     Returns { success: true } or { success: false, error: string }
  ──────────────────────────────────────────────── */
  const signup = (formData) => {
    const existing = findUserByEmail(formData.email);
    if (existing) return { success: false, error: "An account with this email already exists." };

    const newUser = {
      id:      `USR-${Date.now()}`,
      name:    `${formData.firstName} ${formData.lastName}`,
      email:   formData.email,
      role:    "user",
      phone:   formData.phone,
      aadhaar: `XXXX XXXX ${formData.aadhaar.slice(-4)}`,
      state:   formData.state,
      since:   new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      address: [formData.address1, formData.address2, formData.city, formData.state, formData.pincode]
                 .filter(Boolean).join(", "),
    };

    setUser(newUser);
    return { success: true, user: newUser };
  };

  /* ────────────────────────────────────────────────
     logout()
  ──────────────────────────────────────────────── */
  const logout = () => setUser(null);

  /* ── Convenience flags ── */
  const isLoggedIn   = !!user;
  const isUser       = user?.role === "user";
  const isRegistrar  = user?.role === "registrar";

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isLoggedIn, isUser, isRegistrar }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── useAuth hook ── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
