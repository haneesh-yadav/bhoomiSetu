import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   ORIGINAL ILLUSTRATION — sky, clouds, trees, coloured blocks
   Matches the Login.jsx page layout
   ══════════════════════════════════════════════════ */
function IllustrationBlocks() {
  const blocks = [
    { x: 0,   y: 60,  w: 90, h: 80,  color: "#e8533a" },
    { x: 95,  y: 80,  w: 70, h: 60,  color: "#f5c842" },
    { x: 170, y: 100, w: 80, h: 50,  color: "#6b9e5e" },
    { x: 255, y: 70,  w: 65, h: 90,  color: "#5b8dd6" },
    { x: 325, y: 90,  w: 75, h: 70,  color: "#c8d9a0" },
    { x: 0,   y: 145, w: 60, h: 100, color: "#f5c842" },
    { x: 65,  y: 155, w: 95, h: 90,  color: "#7b9e57" },
    { x: 165, y: 135, w: 55, h: 110, color: "#8fafd6" },
    { x: 225, y: 165, w: 80, h: 80,  color: "#d4a855" },
    { x: 310, y: 150, w: 90, h: 95,  color: "#e8533a" },
    { x: 0,   y: 248, w: 110,h: 90,  color: "#5b8dd6" },
    { x: 115, y: 250, w: 75, h: 88,  color: "#e8533a" },
    { x: 195, y: 255, w: 85, h: 83,  color: "#c8d9a0" },
    { x: 285, y: 248, w: 115,h: 90,  color: "#7b5ea7" },
  ];

  return (
    <svg viewBox="0 0 400 340" width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4da8d4" />
          <stop offset="100%" stopColor="#8ecae6" />
        </linearGradient>
      </defs>
      <rect width="400" height="340" fill="url(#skyGrad)" />

      {/* Clouds */}
      <ellipse cx="80"  cy="35" rx="45" ry="22" fill="white" opacity="0.9" />
      <ellipse cx="110" cy="28" rx="35" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="55"  cy="40" rx="30" ry="15" fill="white" opacity="0.9" />
      <ellipse cx="290" cy="25" rx="50" ry="20" fill="white" opacity="0.85" />
      <ellipse cx="325" cy="18" rx="38" ry="16" fill="white" opacity="0.85" />
      <ellipse cx="260" cy="30" rx="30" ry="13" fill="white" opacity="0.85" />

      {/* Trees */}
      <ellipse cx="155" cy="100" rx="30" ry="40" fill="#3d7a3d" />
      <ellipse cx="155" cy="88"  rx="22" ry="30" fill="#4a9a4a" />
      <ellipse cx="245" cy="95"  rx="28" ry="38" fill="#3d7a3d" />
      <ellipse cx="245" cy="83"  rx="20" ry="28" fill="#4a9a4a" />

      {/* Door frame */}
      <rect x="162" y="40" width="76" height="130" rx="2" fill="#8B6914" />
      <rect x="166" y="44" width="68" height="126" rx="1" fill="#e8533a" />
      <circle cx="228" cy="108" r="4" fill="#c8c8c8" />
      <rect x="162" y="40" width="8"  height="130" fill="#6b5010" opacity="0.5" />

      {/* Coloured blocks */}
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1" fill={b.color} />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   CSS — matches Login style system exactly
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

  /* ── Page shell ── */
  .cp-page {
    font-family: 'Poppins', sans-serif;
    display: flex;
    min-height: 100vh;
    height: 100vh;
    padding-top: 60px;
    background: #f0ede4;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .cp-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 30px 64px 40px;
    background: #f0ede4;
    overflow-y: auto;
    animation: fadeUp 0.35s ease both;
  }

  /* ── Back arrow link ── */
  .cp-back-row {
    margin-bottom: 24px;
  }
  .cp-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    color: #666;
    text-decoration: none;
    transition: color 0.15s;
  }
  .cp-back-link:hover {
    color: var(--cp-accent);
  }
  .cp-back-link .mi {
    font-size: 18px;
  }

  /* ── Headline ── */
  .cp-headline {
    font-size: 38px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.04em;
    line-height: 1.12; margin-bottom: 32px;
  }
  .cp-headline span { color: var(--cp-accent); }

  /* ── Error / success banner ── */
  .cp-error {
    padding: 11px 14px;
    background: rgba(232,83,58,0.1);
    color: #c0392b;
    border-left: 3px solid #e8533a;
    border-radius: 0 8px 8px 0;
    font-size: 12px; font-weight: 600;
    margin-bottom: 14px;
  }
  .cp-success {
    padding: 11px 14px;
    background: rgba(27,156,133,0.1);
    color: #1B9C85;
    border-left: 3px solid #1B9C85;
    border-radius: 0 8px 8px 0;
    font-size: 12px; font-weight: 600;
    margin-bottom: 14px;
  }

  /* ── Label ── */
  .cp-label {
    display: block;
    font-size: 11.5px; font-weight: 700;
    color: #666; margin-bottom: 7px;
    letter-spacing: 0.03em;
  }

  /* ── Input Wrapper ── */
  .cp-input-wrap {
    position: relative;
  }

  /* ── Input ── */
  .cp-input {
    width: 100%;
    padding: 15px 20px;
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
  .cp-input::placeholder { color: #aaa; }
  .cp-input:focus {
    border-color: var(--cp-accent);
    box-shadow: 0 0 0 3px var(--cp-accent-glow);
    background: #fff;
  }
  .cp-input.padded {
    padding-right: 48px;
  }

  /* ── Eye Toggle ── */
  .cp-eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    color: #aaa;
    transition: color 0.15s;
  }
  .cp-eye-btn:hover { color: #555; }

  /* ── Submit button ── */
  .cp-submit-btn {
    width: 100%;
    padding: 16px 20px;
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
  .cp-submit-btn:hover { background: #2a2a2a; }
  .cp-submit-btn:active { transform: scale(0.99); }
  .cp-submit-btn .mi { font-size: 16px; }
  .cp-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Password requirements grid (bottom area) ── */
  .cp-reqs-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: auto;
    padding-top: 28px;
  }
  .cp-reqs-pill {
    background: #f0f0f0;
    border-radius: 13px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border: 1px solid #e0dbce;
  }
  .cp-reqs-val {
    font-size: 11px;
    font-weight: 800;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .cp-reqs-val .mi {
    font-size: 14px;
    color: var(--cp-accent);
  }
  .cp-reqs-label {
    font-size: 9.5px;
    font-weight: 500;
    color: #777;
    line-height: 1.35;
  }

  /* ── Right panel ── */
  .cp-right {
    width: 50%;
    background: #e8e4d8;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .cp-right-inner {
    flex: 1; min-height: 0; overflow: hidden;
  }

  /* ════════════════════════════════════════
     MOBILE RESPONSIVE — ≤ 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {
    .cp-page {
      flex-direction: column;
      height: auto;
      min-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .cp-right {
      width: 100%;
      height: 160px;
      flex-shrink: 0;
      order: -1;
    }
    .cp-right-inner {
      flex: 1;
      height: 100%;
    }

    .cp-left {
      width: 100%;
      padding: 24px 20px 32px;
      overflow-y: visible;
      min-height: 0;
    }

    .cp-headline {
      font-size: 26px;
      margin-bottom: 24px;
    }

    .cp-input {
      padding: 14px 16px;
      font-size: 16px;
    }

    .cp-submit-btn {
      padding: 15px 20px;
      font-size: 13px;
    }

    .cp-reqs-row {
      display: none; /* Hide on mobile to save vertical space */
    }
  }
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState("");

  const email = user?.email;
  const isRegistrar = user?.role === "registrar";
  const accentColor = isRegistrar ? "#5B4FD4" : "#e07a5f";
  const accentGlow = isRegistrar ? "rgba(91,79,212,0.18)" : "rgba(224,122,95,0.18)";
  const dashboardPath = isRegistrar ? "/registrar/dashboard" : "/user/dashboard";

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/auth/update-password", {
        email,
        currentPassword,
        newPassword
      });

      setSuccess(response.data?.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password. Verify current password.");
    } finally {
      setLoading(false);
    }
  };

  const inputType = showPassword ? "text" : "password";

  return (
    <>
      <style>{CSS}</style>
      <div className="cp-page">

        {/* ── LEFT PANEL ── */}
        <div className="cp-left" style={{
          "--cp-accent": accentColor,
          "--cp-accent-glow": accentGlow,
        }}>

          {/* Back Arrow navigation */}
          <div className="cp-back-row">
            <Link to={dashboardPath} className="cp-back-link">
              <span className="mi">arrow_back</span> Back to Dashboard
            </Link>
          </div>

          {/* Headline */}
          <h1 className="cp-headline">
            Change your<br />
            <span>password.</span>
          </h1>

          {/* Banners */}
          {error   && <div className="cp-error">{error}</div>}
          {success && <div className="cp-success">{success}</div>}

          {/* Form */}
          <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="cp-label">Current Password</label>
              <div className="cp-input-wrap">
                <input
                  className="cp-input padded"
                  type={inputType}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="cp-eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="mi" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="cp-label">New Password</label>
              <input
                className="cp-input"
                type={inputType}
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="cp-label">Confirm New Password</label>
              <input
                className="cp-input"
                type={inputType}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="cp-submit-btn" disabled={loading}>
              <span className="mi">{loading ? "hourglass_empty" : "lock_reset"}</span>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {/* Password Requirements Grid (Replaces Stat Pills area) */}
          <div className="cp-reqs-row">
            <div className="cp-reqs-pill">
              <div className="cp-reqs-val">
                <span className="mi">straighten</span> Min Length
              </div>
              <div className="cp-reqs-label">Password must be at least 8 characters long.</div>
            </div>
            <div className="cp-reqs-pill">
              <div className="cp-reqs-val">
                <span className="mi">password</span> Complexity
              </div>
              <div className="cp-reqs-label">Recommend mix of letters, numbers & symbols.</div>
            </div>
            <div className="cp-reqs-pill">
              <div className="cp-reqs-val">
                <span className="mi">person_off</span> Unique
              </div>
              <div className="cp-reqs-label">Avoid containing your name or email.</div>
            </div>
            <div className="cp-reqs-pill">
              <div className="cp-reqs-val">
                <span className="mi">history</span> History Limit
              </div>
              <div className="cp-reqs-label">Must not match any of your past passwords.</div>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL (Illustration) ── */}
        <div className="cp-right">
          <div className="cp-right-inner">
            <IllustrationBlocks />
          </div>
        </div>

      </div>
    </>
  );
}