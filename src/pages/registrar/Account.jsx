import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   CSS — layout matches user Account structure exactly
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
  .ac-page {
    font-family: 'Poppins', sans-serif;
    display: flex;
    min-height: calc(100vh - 50px);
    height: calc(100vh - 50px);
    background: #f0ede4;
    overflow: hidden;
  }

  /* ── Left panel (Profile details) ── */
  .ac-left {
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
  .ac-headline {
    font-size: 38px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.04em;
    line-height: 1.12; margin-bottom: 28px;
  }
  .ac-headline span { color: #5B4FD4; }

  /* ── Profile card ── */
  .ac-profile-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ac-avatar-row {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .ac-avatar {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    background: linear-gradient(135deg, #5B4FD4 0%, #fabc88 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 4px 14px rgba(91,79,212,0.18);
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .ac-profile-name {
    font-size: 18px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -0.02em;
  }

  .ac-profile-role {
    font-size: 10px;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 2px;
  }

  /* ── Details list ── */
  .ac-details-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ac-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: #f8f6f2;
    border-radius: 10px;
    border: 1px solid #ede9e0;
  }

  .ac-detail-lbl {
    font-size: 10.5px;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .ac-detail-val {
    font-size: 12.5px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .ac-detail-val.green {
    color: #1B9C85;
  }

  /* ── Right panel (Update Password Card) ── */
  .ac-right {
    width: 50%;
    background: #f0ede4;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .ac-form-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 480px;
    animation: fadeUp 0.35s ease both;
  }

  .ac-form-title {
    font-size: 11.5px;
    font-weight: 800;
    color: #5B4FD4;
    letter-spacing: 0.08em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ac-form-title::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: rgba(91,79,212,0.12);
  }

  /* ── Form components ── */
  .ac-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ac-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ac-form-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #666;
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }

  .ac-input-wrap {
    position: relative;
  }

  .ac-input {
    width: 100%;
    padding: 14px 18px 14px 42px;
    border-radius: 12px;
    border: 1.5px solid #c8c8c8;
    background: #f0f0f0;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ac-input::placeholder { color: #aaa; }
  .ac-input:focus {
    border-color: #5B4FD4;
    box-shadow: 0 0 0 3px rgba(91,79,212,0.12);
    background: #fff;
  }
  .ac-input:disabled {
    color: #999; cursor: not-allowed; background: #f5f5f5;
  }

  .ac-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #5B4FD4;
    pointer-events: none;
  }

  /* ── Message banners ── */
  .ac-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    border-radius: 0 8px 8px 0;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 14px;
  }
  .ac-msg-success {
    background: rgba(27,156,133,0.1); color: #1B9C85;
    border-left: 3px solid #1B9C85;
  }
  .ac-msg-error {
    background: rgba(232,83,58,0.1); color: #c0392b;
    border-left: 3px solid #e8533a;
  }

  /* ── Submit Button ── */
  .ac-submit-btn {
    width: 100%;
    padding: 15px 20px;
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
    margin-top: 6px;
  }
  .ac-submit-btn:hover:not(:disabled) { background: #2a2a2a; }
  .ac-submit-btn:active:not(:disabled) { transform: scale(0.99); }
  .ac-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

  /* ════════════════════════════════════════
     MOBILE RESPONSIVE — ≤ 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {
    .ac-page {
      flex-direction: column;
      height: auto;
      min-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .ac-right {
      width: 100%;
      padding: 24px 20px;
      background: #f0ede4;
    }
    
    .ac-form-card {
      max-width: 100%;
    }

    .ac-left {
      width: 100%;
      padding: 32px 20px;
      overflow-y: visible;
      min-height: 0;
      height: auto;
    }

    .ac-headline {
      font-size: 28px;
      margin-bottom: 24px;
    }

    .ac-submit-btn {
      padding: 14px 16px;
      font-size: 13px;
    }
  }
`;

export default function Account() {
  const { user } = useAuth();

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
      <style>{CSS}</style>
      <div className="ac-page">

        {/* ── LEFT PANEL (Profile Card) ── */}
        <div className="ac-left">
          
          {/* Headline */}
          <h1 className="ac-headline">
            Account <span>Settings</span>
          </h1>

          {/* Profile details */}
          <div className="ac-profile-card">
            
            <div className="ac-avatar-row">
              <div className="ac-avatar">{initials}</div>
              <div>
                <div className="ac-profile-name">{user?.name || "—"}</div>
                <div className="ac-profile-role">Registrar Official</div>
              </div>
            </div>

            <div className="ac-details-list">
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">Email</span>
                <span className="ac-detail-val">{user?.email || "—"}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">District</span>
                <span className="ac-detail-val">{user?.district || "—"}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">State</span>
                <span className="ac-detail-val">{user?.state || "—"}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">Status</span>
                <span className="ac-detail-val green">✓ Active</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── RIGHT PANEL (Update Password Card) ── */}
        <div className="ac-right">
          <div className="ac-form-card">
            
            <div className="ac-form-title">UPDATE PASSWORD</div>

            {message && (
              <div className="ac-msg ac-msg-success">
                <span className="mi" style={{ fontSize: "16px" }}>check_circle</span>
                {message}
              </div>
            )}
            {error && (
              <div className="ac-msg ac-msg-error">
                <span className="mi" style={{ fontSize: "16px" }}>error</span>
                {error}
              </div>
            )}

            <form className="ac-form" onSubmit={handleUpdate}>
              
              <div className="ac-form-group">
                <label className="ac-form-label">Email Address</label>
                <div className="ac-input-wrap">
                  <span className="mi ac-input-icon">mail</span>
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
                  <span className="mi ac-input-icon">lock</span>
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
                  <span className="mi ac-input-icon">lock_reset</span>
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
                  : <><span className="mi" style={{ fontSize: "15px" }}>check_circle</span> Update Password</>
                }
              </button>

            </form>

          </div>
        </div>

      </div>
    </>
  );
}