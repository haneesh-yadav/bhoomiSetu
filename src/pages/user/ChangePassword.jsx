import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   CSS — layout reorganized into clean split screen
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
    min-height: calc(100vh - 112px);
    height: calc(100vh - 112px);
    background: #f0ede4;
    overflow: hidden;
  }

  /* ── Left panel (Form) ── */
  .cp-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 80px;
    background: #f0ede4;
    overflow: hidden;
    height: 100%;
    animation: fadeUp 0.35s ease both;
  }

  /* ── Headline ── */
  .cp-headline {
    font-size: 38px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.04em;
    line-height: 1.12; margin-bottom: 24px;
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

  /* ── Right panel (Requirements Card) ── */
  .cp-right {
    width: 50%;
    background: #e8e4d8;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  .cp-reqs-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 480px;
    animation: fadeUp 0.35s ease both;
  }
  .cp-reqs-title {
    font-size: 11.5px;
    font-weight: 800;
    color: var(--cp-accent);
    letter-spacing: 0.08em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .cp-reqs-title::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: var(--cp-accent-glow);
  }
  .cp-reqs-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .cp-reqs-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #f8f6f2;
    border-radius: 12px;
    padding: 14px 16px;
    border: 1px solid #ede9e0;
  }
  .cp-reqs-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--cp-accent-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cp-accent);
    flex-shrink: 0;
  }
  .cp-reqs-text strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  .cp-reqs-text p {
    font-size: 11.5px;
    color: #666;
    line-height: 1.4;
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
      padding: 24px 20px;
      background: #e8e4d8;
    }
    
    .cp-reqs-card {
      max-width: 100%;
    }

    .cp-left {
      width: 100%;
      padding: 32px 20px;
      overflow-y: visible;
      min-height: 0;
      height: auto;
    }

    .cp-headline {
      font-size: 28px;
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

        {/* ── LEFT PANEL (Form) ── */}
        <div className="cp-left" style={{
          "--cp-accent": accentColor,
          "--cp-accent-glow": accentGlow,
        }}>

          {/* Headline */}
          <h1 className="cp-headline">
            Change your <span>password.</span>
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

        </div>

        {/* ── RIGHT PANEL (Password Requirements Card) ── */}
        <div className="cp-right">
          <div className="cp-reqs-card" style={{
            "--cp-accent": accentColor,
            "--cp-accent-glow": accentGlow,
          }}>
            <div className="cp-reqs-title">PASSWORD REQUIREMENTS</div>
            <div className="cp-reqs-list">
              
              <div className="cp-reqs-item">
                <div className="cp-reqs-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>straighten</span>
                </div>
                <div className="cp-reqs-text">
                  <strong>Min Length</strong>
                  <p>Password must be at least 8 characters long.</p>
                </div>
              </div>

              <div className="cp-reqs-item">
                <div className="cp-reqs-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>password</span>
                </div>
                <div className="cp-reqs-text">
                  <strong>Complexity</strong>
                  <p>We recommend mixing uppercase, lowercase, numbers & symbols.</p>
                </div>
              </div>

              <div className="cp-reqs-item">
                <div className="cp-reqs-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>person_off</span>
                </div>
                <div className="cp-reqs-text">
                  <strong>Unique</strong>
                  <p>Do not use obvious words containing your name or email.</p>
                </div>
              </div>

              <div className="cp-reqs-item">
                <div className="cp-reqs-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>history</span>
                </div>
                <div className="cp-reqs-text">
                  <strong>History Limit</strong>
                  <p>Do not reuse any of your past passwords.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}