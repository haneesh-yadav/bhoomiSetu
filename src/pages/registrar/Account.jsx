import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import Navbar2 from "../../components/Navbar2";

/* ══════════════════════════════════════════════════
   CSS — mirrors UserAccount design tokens
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mi {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .ac-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ── Main wrapper ── */
  .ac-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .ac-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ac-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .ac-heading span { color: #5B4FD4; }
  .ac-topbar-sub {
    font-size: 11px; font-weight: 500; color: #888; margin-top: 2px;
  }
  .ac-topbar-right {
    display: flex; align-items: center; gap: 8px;
  }
  .ac-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .ac-meta-chip .mi { font-size: 13px; color: #aaa; }

  /* ══ LAYOUT ══ */
  .ac-content-row {
    display: flex; gap: 12px; align-items: flex-start;
  }
  .ac-col-main  { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .ac-col-side  { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }

  /* ══ ZONE (shared card) ══ */
  .ac-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 14px;
    animation: fadeUp 0.3s ease both;
  }
  .ac-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .ac-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .ac-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .ac-zone-title span { color: #5B4FD4; }
  .ac-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .ac-zone-sub {
    font-size: 10.5px; color: #aaa; font-weight: 500;
  }

  /* ══ FORM ══ */
  .ac-form { display: flex; flex-direction: column; gap: 14px; }

  .ac-form-group { display: flex; flex-direction: column; gap: 6px; }
  .ac-form-label {
    font-size: 11px; font-weight: 600; color: #555;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .ac-input-wrap { position: relative; }
  .ac-input-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px; color: #bbb; pointer-events: none;
  }
  .ac-input {
    width: 100%;
    padding: 11px 14px 11px 38px;
    border: 1.5px solid #e0e0e0;
    border-radius: 13px;
    background: #f0f0f0;
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .ac-input:focus {
    border-color: #5B4FD4;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(91,79,212,0.08);
  }
  .ac-input:disabled {
    color: #aaa; cursor: not-allowed;
  }
  .ac-input::placeholder { color: #bbb; }

  /* ══ MESSAGES ══ */
  .ac-msg {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 12px;
    font-size: 11.5px; font-weight: 600;
  }
  .ac-msg .mi { font-size: 16px; flex-shrink: 0; }
  .ac-msg-success { background: rgba(46,196,160,0.12); color: #2a7a55; }
  .ac-msg-error   { background: rgba(240,80,80,0.1);   color: #c0392b; }

  /* ══ SUBMIT BUTTON ══ */
  .ac-submit-btn {
    width: 100%; padding: 12px;
    border: none; border-radius: 13px;
    background: #1a1a1a; color: #fff;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: background 0.15s, transform 0.15s;
  }
  .ac-submit-btn .mi { font-size: 15px; }
  .ac-submit-btn:hover:not(:disabled) { background: #2a2a2a; transform: translateY(-1px); }
  .ac-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

  /* ══ PROFILE SIDE PANEL ══ */
  .ac-profile-zone {
    background: #1a1a1a; border-radius: 20px; overflow: hidden;
  }
  .ac-profile-head {
    padding: 14px 16px 10px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ac-profile-head-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
    color: #555; text-transform: uppercase;
  }
  .ac-profile-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: #2EC4A0;
  }
  .ac-profile-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #2EC4A0; animation: pulse 2s infinite;
  }
  .ac-profile-avatar-row {
    padding: 18px 16px 14px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .ac-profile-avatar {
    width: 44px; height: 44px; border-radius: 14px;
    background: rgba(91,79,212,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: #a89fff;
    flex-shrink: 0;
  }
  .ac-profile-name  { font-size: 13px; font-weight: 700; color: #fff; }
  .ac-profile-role  { font-size: 10px; font-weight: 500; color: #555; margin-top: 2px; }
  .ac-profile-rows  { padding: 4px 0 8px; }
  .ac-profile-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .ac-profile-row:last-child { border-bottom: none; }
  .ac-profile-lbl { font-size: 10.5px; font-weight: 500; color: #555; }
  .ac-profile-val { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #ccc; }
  .ac-profile-val.green { color: #2EC4A0; font-weight: 600; }

  /* ══ TIPS PANEL ══ */
  .ac-tips-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .ac-tips-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
    color: #aaa; text-transform: uppercase;
  }
  .ac-tip-item {
    display: flex; align-items: flex-start; gap: 8px;
  }
  .ac-tip-icon {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ac-tip-icon .mi { font-size: 13px; }
  .ac-tip-text { font-size: 11px; color: #666; line-height: 1.5; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .ac-content-row { flex-direction: column; }
    .ac-col-side { width: 100%; }
  }
  @media (max-width: 580px) {
    .ac-main { padding: 10px 10px 80px; gap: 10px; }
    .ac-topbar { flex-direction: column; align-items: flex-start; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Account() {
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [loading,         setLoading]         = useState(false);
  const [message,         setMessage]         = useState("");
  const [error,           setError]           = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await api.put("/auth/update-password", {
        email: user.email,
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "R";

  return (
    <>
      <style>{styles}</style>
      <div className="ac-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="ac-main">

          {/* ══ TOP BAR ══ */}
          <div className="ac-topbar">
            <div>
              <div className="ac-heading">
                Account <span>Settings</span>
              </div>
              <div className="ac-topbar-sub">Manage your security preferences and profile details</div>
            </div>
            <div className="ac-topbar-right">
              {user?.district && (
                <div className="ac-meta-chip">
                  <MI name="location_on" /> {user.district}
                </div>
              )}
              <div className="ac-meta-chip">
                <MI name="verified_user" /> Verified
              </div>
            </div>
          </div>

          {/* ══ MAIN CONTENT ══ */}
          <div className="ac-content-row">

            {/* ── Left: Password form ── */}
            <div className="ac-col-main">
              <div className="ac-zone">
                <div className="ac-zone-header">
                  <div className="ac-zone-title-row">
                    <div className="ac-zone-title">Update <span>Password</span></div>
                    <div className="ac-zone-pill">Security</div>
                  </div>
                  <span className="ac-zone-sub">Keep your account secure</span>
                </div>

                {message && (
                  <div className="ac-msg ac-msg-success">
                    <MI name="check_circle" /> {message}
                  </div>
                )}
                {error && (
                  <div className="ac-msg ac-msg-error">
                    <MI name="error" /> {error}
                  </div>
                )}

                <form className="ac-form" onSubmit={handleUpdate}>
                  <div className="ac-form-group">
                    <label className="ac-form-label">Email Address</label>
                    <div className="ac-input-wrap">
                      <MI name="mail" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#bbb" }} />
                      <input
                        className="ac-input"
                        type="email"
                        value={user?.email || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="ac-form-group">
                    <label className="ac-form-label">Current Password</label>
                    <div className="ac-input-wrap">
                      <MI name="lock" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#bbb" }} />
                      <input
                        className="ac-input"
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>

                  <div className="ac-form-group">
                    <label className="ac-form-label">New Password</label>
                    <div className="ac-input-wrap">
                      <MI name="lock_reset" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#bbb" }} />
                      <input
                        className="ac-input"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 chars)"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button className="ac-submit-btn" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="spinner" /> Updating…</>
                      : <><MI name="check_circle" /> Update Password</>
                    }
                  </button>
                </form>
              </div>
            </div>

            {/* ── Right: Profile + Tips ── */}
            <div className="ac-col-side">

              {/* Profile panel */}
              <div className="ac-profile-zone">
                <div className="ac-profile-head">
                  <span className="ac-profile-head-title">Your Profile</span>
                  <span className="ac-profile-live">
                    <span className="ac-profile-live-dot" /> ACTIVE
                  </span>
                </div>
                <div className="ac-profile-avatar-row">
                  <div className="ac-profile-avatar">{initials}</div>
                  <div>
                    <div className="ac-profile-name">{user?.name || "—"}</div>
                    <div className="ac-profile-role">Registrar Official</div>
                  </div>
                </div>
                <div className="ac-profile-rows">
                  {[
                    { label: "Email",    val: user?.email    || "—",  green: false },
                    { label: "District", val: user?.district || "—",  green: false },
                    { label: "State",    val: user?.state    || "—",  green: false },
                    { label: "Status",   val: "✓ Verified",           green: true  },
                  ].map((r, i) => (
                    <div key={i} className="ac-profile-row">
                      <span className="ac-profile-lbl">{r.label}</span>
                      <span className={`ac-profile-val${r.green ? " green" : ""}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security tips */}
              <div className="ac-tips-zone">
                <div className="ac-tips-title">Security Tips</div>
                {[
                  { icon: "password",   bg: "rgba(91,79,212,0.1)",  color: "#5B4FD4", text: "Use 12+ characters mixing letters, numbers and symbols." },
                  { icon: "devices",    bg: "rgba(46,196,160,0.1)", color: "#2EC4A0", text: "Avoid reusing passwords across different services." },
                  { icon: "schedule",   bg: "rgba(255,140,80,0.1)", color: "#e07a5f", text: "Change your password every 3–6 months for best security." },
                ].map((tip, i) => (
                  <div key={i} className="ac-tip-item">
                    <div className="ac-tip-icon" style={{ background: tip.bg }}>
                      <MI name={tip.icon} style={{ color: tip.color }} />
                    </div>
                    <div className="ac-tip-text">{tip.text}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}