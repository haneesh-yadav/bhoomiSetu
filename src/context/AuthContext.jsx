import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

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
  ──────────────────────────────────────────────── */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data; // { token, role, name, email, ... }
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  /* ────────────────────────────────────────────────
     signup(formData)
  ──────────────────────────────────────────────── */
  const signup = async (formData) => {
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        aadhaar: formData.aadhaar.replace(/\s/g, ""), // strip spaces from "XXXX XXXX XXXX"
        dob: formData.dob,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        role: "USER"
      };
      const response = await api.post('/auth/register', payload);
      const userData = response.data;
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
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
