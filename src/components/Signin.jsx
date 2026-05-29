import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ══════════════════════════════════════════════════
   ORIGINAL ILLUSTRATION — sky, clouds, trees, coloured blocks
══════════════════════════════════════════════════ */
function IllustrationBlocks() {
  return (
    <img 
      src="/assets/signIn-Join.jpg" 
      alt="BhoomiSetu Portal Illustration"
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover", 
        display: "block" 
      }} 
    />
  );
}

/* ══════════════════════════════════════════════════
   CSS — mirrors UserDashboard design tokens exactly
══════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mi {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.3; }
  }

  /* ── Page shell ── */
  .lg-page {
    font-family: 'Poppins', sans-serif;
    display: flex;
    min-height: 100vh;
    height: 100vh;
    padding-top: 60px;
    background: #f0ede4;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .lg-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 52px 64px 40px;
    background: #f0ede4;
    overflow-y: auto;
    animation: fadeUp 0.35s ease both;
  }

  /* ── Logo chip ── */
  .lg-logo-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #1a1a1a;
    border-radius: 12px;
    padding: 7px 14px;
    width: fit-content;
    margin-bottom: 36px;
  }
  .lg-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #2EC4A0;
    animation: pulse 2s infinite;
  }
  .lg-logo-text {
    font-size: 11.5px; font-weight: 700;
    color: #fff; letter-spacing: 0.06em;
  }
  .lg-logo-text span { color: #C8F135; }

  /* ── Headline ── */
  .lg-headline {
    font-size: 38px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.04em;
    line-height: 1.12; margin-bottom: 40px;
  }
  .lg-headline span { color: #5B4FD4; }
  .lg-subline {
    font-size: 12px; font-weight: 500; color: #888;
    margin-bottom: 32px;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.02em;
  }

  /* ── Role tabs ── */
  .lg-role-tabs {
    display: flex; gap: 6px;
    background: #e6e3da;
    border-radius: 13px; padding: 5px;
    margin-bottom: 32px;
  }
  .lg-role-tab {
    flex: 1; padding: 11px 12px;
    text-align: center; border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 11.5px; font-weight: 700;
    cursor: pointer; color: #777;
    transition: all 0.18s;
  }
  .lg-role-tab.active {
    background: #1a1a1a;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  /* ── Error banner ── */
  .lg-error {
    padding: 11px 14px;
    background: rgba(232,83,58,0.1);
    color: #c0392b;
    border-left: 3px solid #e8533a;
    border-radius: 0 8px 8px 0;
    font-size: 12px; font-weight: 600;
    margin-bottom: 14px;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Label ── */
  .lg-label {
    display: block;
    font-size: 11.5px; font-weight: 700;
    color: #666; margin-bottom: 7px;
    letter-spacing: 0.03em;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Input ── */
  .lg-input {
    width: 100%;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1.5px solid #c8c8c8;
    background: #f0f0f0;
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
  }
  .lg-input::placeholder { color: #aaa; }
  .lg-input:focus {
    border-color: var(--lg-accent);
    box-shadow: 0 0 0 3px var(--lg-accent-glow);
    background: #fff;
  }

  /* ── Sign in button ── */
  .lg-submit-btn {
    width: 100%;
    padding: 17px 20px;
    border-radius: 12px;
    background: #1a1a1a;
    color: #fff;
    font-size: 12px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.03em;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s, transform 0.1s;
    margin-top: 8px;
  }
  .lg-submit-btn:hover { background: #2a2a2a; }
  .lg-submit-btn:active { transform: scale(0.99); }
  .lg-submit-btn .mi { font-size: 16px; }

  /* ── Sign up link ── */
  .lg-signup-row {
    text-align: center;
    margin-top: 28px;
    font-size: 12px; color: #888;
  }
  .lg-signup-link {
    background: none; border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #1a1a1a; cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .lg-signup-link:hover { color: #555; }

  /* ── Stat pills row ── */
  .lg-stat-row {
    display: flex; gap: 8px;
    margin-top: auto; padding-top: 28px;
  }
  .lg-stat-pill {
    flex: 1; background: #f0f0f0;
    border-radius: 13px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .lg-stat-pill.dark { background: #1a1a1a; }
  .lg-stat-pill.purple { background: #1e1a38; }
  .lg-stat-pill-val {
    font-size: 17px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.5px;
  }
  .lg-stat-pill.dark .lg-stat-pill-val   { color: #C8F135; }
  .lg-stat-pill.purple .lg-stat-pill-val { color: #c8c2ff; }
  .lg-stat-pill-label {
    font-size: 9.5px; font-weight: 500; color: #999;
  }
  .lg-stat-pill.dark .lg-stat-pill-label   { color: #555; }
  .lg-stat-pill.purple .lg-stat-pill-label { color: #555; }

  /* ── Right panel ── */
  .lg-right {
    width: 50%;
    background: #e8e4d8;
    overflow: hidden;
    display: flex; flex-direction: column;
  }
  .lg-right-inner {
    flex: 1; min-height: 0; overflow: hidden;
  }

  /* ════════════════════════════════════════
     MOBILE RESPONSIVE — ≤ 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {
    .lg-page {
      flex-direction: column;
      height: auto;
      min-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* Illustration strip at top on mobile */
    .lg-right {
      width: 100%;
      height: 200px;
      flex-shrink: 0;
      order: -1;
    }
    .lg-right-inner {
      flex: 1;
      height: 100%;
    }

    /* Full-width form panel */
    .lg-left {
      width: 100%;
      padding: 28px 20px 36px;
      overflow-y: visible;
      min-height: 0;
    }

    /* Shrink headline on mobile */
    .lg-headline {
      font-size: 26px;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
    }

    /* Tabs touch-friendly */
    .lg-role-tab {
      padding: 12px 8px;
      font-size: 11px;
    }
    .lg-role-tabs {
      margin-bottom: 24px;
    }

    /* Inputs: slightly larger tap target */
    .lg-input {
      padding: 15px 16px;
      font-size: 16px; /* prevents iOS zoom on focus */
    }

    /* Submit button */
    .lg-submit-btn {
      padding: 16px 20px;
      font-size: 13px;
    }

    /* Stat pills: wrap to 2-column grid */
    .lg-stat-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 28px;
      padding-top: 0;
    }

    /* Hide stat pills on very small screens to save space */
    .lg-stat-row { display: none; }

    .lg-signup-row {
      margin-top: 20px;
      font-size: 13px;
    }
  }

  /* ── Very small phones (≤ 360px) ── */
  @media (max-width: 360px) {
    .lg-left {
      padding: 20px 16px 28px;
    }
    .lg-headline {
      font-size: 22px;
    }
    .lg-right {
      height: 160px;
    }
  }
`;

function MI({ name, style }) {
  return <span className="mi" style={style}>{name}</span>;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("user");
  const [error, setError]       = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate(result.user.role === "registrar" ? "/registrar/dashboard" : "/user/dashboard");
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  const isRegistrar = role === "registrar";
  const accentColor    = isRegistrar ? "#5B4FD4" : "#e07a5f";
  const accentGlow     = isRegistrar ? "rgba(91,79,212,0.18)" : "rgba(224,122,95,0.18)";
  const accentShadow   = isRegistrar ? "rgba(91,79,212,0.25)" : "rgba(224,122,95,0.25)";

  return (
    <>
      <style>{CSS}</style>
      <div className="lg-page">

        {/* ── LEFT ── */}
        <div className="lg-left" style={{
          "--lg-accent":      accentColor,
          "--lg-accent-glow": accentGlow,
          "--lg-accent-shadow": accentShadow,
          transition: "--lg-accent 0.25s",
        }}>

          {/* Headline */}
          <h1 className="lg-headline">
            Welcome back.<br />
            Log in to your <span style={{ color: accentColor, transition: "color 0.25s" }}>account.</span>
          </h1>

          {/* Role tabs */}
          <div className="lg-role-tabs">
            <div
              className={`lg-role-tab${role === "user" ? " active" : ""}`}
              onClick={() => { setRole("user"); setError(""); }}>
              Citizen Login
            </div>
            <div
              className={`lg-role-tab${role === "registrar" ? " active" : ""}`}
              onClick={() => { setRole("registrar"); setError(""); }}>
              Registrar Login
            </div>
          </div>

          {/* Error */}
          {error && <div className="lg-error">{error}</div>}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label className="lg-label">Email Address</label>
              <input
                className="lg-input"
                type="email"
                placeholder={"xyz@gmail.com"}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="lg-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="lg-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    color: "#aaa",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#555"}
                  onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="mi" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            <button type="submit" className="lg-submit-btn">
              Sign in
            </button>
          </form>

          {/* Sign up */}
          <div className="lg-signup-row">
            Don't have an account?{" "}
            <Link to="/signup" className="lg-signup-link">Sign up</Link>
          </div>

        </div>

        {/* ── RIGHT — original illustration panel ── */}
        <div className="lg-right">
          <div className="lg-right-inner">
            <IllustrationBlocks />
          </div>
        </div>

      </div>
    </>
  );
}