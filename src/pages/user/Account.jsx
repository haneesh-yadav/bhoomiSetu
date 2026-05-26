import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const styles = `
  .account-page-wrapper {
    width: 95%;
    min-height: 100vh;
    margin: 0 auto;
    margin-top: 0.8rem;
    user-select: none;
    overflow-x: hidden;
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem;
    color: #363949;
  }

  /* ── HEADER CARD ── */
  .account-header-card {
    background: #fff;
    border-radius: 0 !important;
    border-top: 3px solid #c96444 !important;
    border: 1px solid rgba(0,0,0,0.05);
    padding: 1rem 1.4rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    box-shadow: 0 1rem 2rem rgba(132,139,200,0.15);
    margin-bottom: 1rem;
    width: 97%;
    position: relative;
  }

  .account-header-card .account-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    min-width: 90px;
  }

  .account-header-card .account-avatar {
    width: 80px;
    height: 95px;
    border-radius: 0.6rem;
    border: 2px solid #c96444;
    background: linear-gradient(135deg, #c96444, #e07a5f);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    font-family: 'Poppins', sans-serif;
  }

  .account-header-card .account-left h3 {
    font-size: 0.75rem;
    font-weight: 700;
    color: #363949;
    text-transform: uppercase;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    text-align: center;
  }

  .account-header-card .account-right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2.5rem;
    row-gap: 0.7rem;
    width: 100%;
    flex: 1;
  }

  .account-header-card .detail-row {
    display: flex;
    gap: 0.35rem;
    align-items: baseline;
    font-size: 0.8rem;
  }

  .account-header-card .label {
    color: #D32F2F;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .account-header-card .value {
    color: #363949;
    font-weight: 500;
  }

  /* ── ACCORDIONS ── */
  .account-accordions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .acc-accordion {
    background: linear-gradient(90deg, #a84e35 0%, #c96444 50%, #d9754f 100%);
    color: white;
    cursor: pointer;
    padding: 0;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    transition: filter 0.3s;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .acc-accordion .icon-box {
    background-color: #FFD700;
    width: 2.6rem;
    height: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.8rem;
    flex-shrink: 0;
  }

  .acc-accordion .icon-box span {
    color: black;
    font-size: 1.3rem;
  }

  .acc-accordion .arrow {
    margin-left: auto;
    margin-right: 1rem;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .acc-accordion.active .arrow { transform: rotate(180deg); }
  .acc-accordion:hover { filter: brightness(1.08); }

  /* ── PANEL ── */
  .acc-panel {
    background-color: white;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    border-radius: 0 0 0.3rem 0.3rem;
    margin-top: -0.4rem;
    padding: 0 1rem;
    box-shadow: 0 3px 5px rgba(0,0,0,0.05);
  }

  .acc-panel .detail-grid {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0 1rem;
  }

  .acc-panel .detail-item {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    border-bottom: 2px solid #fff;
  }

  .acc-panel .detail-item:last-child { border-bottom: none; }

  .acc-panel .detail-item .label {
    background-color: #dcdcdc;
    color: #333;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    width: 28%;
    padding: 0.55rem 0.75rem;
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
  }

  .acc-panel .detail-item .value {
    background-color: #fdf0ea;
    color: #333;
    font-size: 0.8rem;
    font-weight: 500;
    width: 72%;
    padding: 0.55rem 0.75rem;
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
  }

  /* ── PASSWORD FORM ── */
  .acc-password-form {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.7rem 0 1.2rem;
  }

  .acc-form-group { display: flex; flex-direction: column; gap: 0.25rem; }

  .acc-form-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Poppins', sans-serif;
  }

  .acc-input-wrap { position: relative; }

  .acc-input-wrap .acc-input-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: #c96444;
    pointer-events: none;
  }

  .acc-input {
    width: 100%;
    padding: 0.45rem 0.8rem 0.45rem 2rem;
    border: 1.5px solid #e0e0e0;
    border-radius: 0.3rem;
    background: #fdf0ea;
    font-size: 0.8rem;
    font-family: 'Poppins', sans-serif;
    color: #333;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .acc-input:focus {
    border-color: #c96444;
    box-shadow: 0 0 0 3px rgba(201,100,68,0.1);
  }

  .acc-input:disabled { color: #999; cursor: not-allowed; background: #f0f0f0; }
  .acc-input::placeholder { color: #bbb; }

  .acc-msg {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.7rem;
    border-radius: 0.3rem;
    font-size: 0.74rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }
  .acc-msg-success { background: rgba(46,196,160,0.12); color: #2a7a55; }
  .acc-msg-error   { background: rgba(240,80,80,0.1);   color: #c0392b; }

  .acc-submit-btn {
    padding: 0.5rem 1.6rem;
    border: none;
    border-radius: 0.3rem;
    background: linear-gradient(90deg, #a84e35 0%, #c96444 100%);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    align-self: flex-end;
    transition: filter 0.15s, transform 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    box-shadow: 0 3px 8px rgba(201,100,68,0.28);
  }
  .acc-submit-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .acc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .acc-spinner {
    width: 11px; height: 11px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: acc-spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes acc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media screen and (max-width: 900px) {
    .account-header-card { flex-direction: column; padding: 1rem; gap: 1rem; }
    .account-header-card .account-right { grid-template-columns: 1fr; gap: 0.5rem; text-align: center; }
    .account-header-card .detail-row { justify-content: center; flex-wrap: wrap; }
  }
`;

function InfoAccordion({ icon, label, items }) {
  const handleClick = (e) => {
    const btn = e.currentTarget;
    const panel = btn.nextElementSibling;
    btn.classList.toggle("active");
    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
  };
  return (
    <>
      <button className="acc-accordion" onClick={handleClick}>
        <div className="icon-box"><span className="material-icons-sharp">{icon}</span></div>
        {label}
        <span className="material-icons-sharp arrow">expand_more</span>
      </button>
      <div className="acc-panel">
        <div className="detail-grid">
          {items.map((item, i) => (
            <div className="detail-item" key={i}>
              <span className="label">{item.label}</span>
              <span className="value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PasswordAccordion({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [loading,         setLoading]         = useState(false);
  const [message,         setMessage]         = useState("");
  const [error,           setError]           = useState("");

  const handleClick = (e) => {
    const btn = e.currentTarget;
    const panel = btn.nextElementSibling;
    btn.classList.toggle("active");
    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
  };

  const handleUpdate = async () => {
    setLoading(true); setMessage(""); setError("");
    try {
      const res = await api.put("/auth/update-password", { email: user.email, currentPassword, newPassword });
      setMessage(res.data.message || "Password updated successfully!");
      setCurrentPassword(""); setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <button className="acc-accordion" onClick={handleClick}>
        <div className="icon-box"><span className="material-icons-sharp">lock</span></div>
        CHANGE PASSWORD
        <span className="material-icons-sharp arrow">expand_more</span>
      </button>
      <div className="acc-panel">
        <div className="acc-password-form">
          {message && (
            <div className="acc-msg acc-msg-success">
              <span className="material-icons-sharp" style={{ fontSize: "0.95rem" }}>check_circle</span>
              {message}
            </div>
          )}
          {error && (
            <div className="acc-msg acc-msg-error">
              <span className="material-icons-sharp" style={{ fontSize: "0.95rem" }}>error</span>
              {error}
            </div>
          )}
          <div className="acc-form-group">
            <label className="acc-form-label">Email Address</label>
            <div className="acc-input-wrap">
              <span className="material-icons-sharp acc-input-icon">mail</span>
              <input className="acc-input" type="email" value={user?.email || ""} disabled />
            </div>
          </div>
          <div className="acc-form-group">
            <label className="acc-form-label">Current Password</label>
            <div className="acc-input-wrap">
              <span className="material-icons-sharp acc-input-icon">lock_outline</span>
              <input className="acc-input" type="password" value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" required />
            </div>
          </div>
          <div className="acc-form-group">
            <label className="acc-form-label">New Password</label>
            <div className="acc-input-wrap">
              <span className="material-icons-sharp acc-input-icon">lock_reset</span>
              <input className="acc-input" type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)" required minLength={6} />
            </div>
          </div>
          <button className="acc-submit-btn" type="button" onClick={handleUpdate} disabled={loading}>
            {loading
              ? <><span className="acc-spinner" /> Updating…</>
              : <><span className="material-icons-sharp" style={{ fontSize: "0.9rem" }}>check_circle</span> Update Password</>
            }
          </button>
        </div>
      </div>
    </>
  );
}

export default function Account() {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  const sections = [
    {
      icon: "person",
      label: "ACCOUNT DETAILS",
      items: [
        { label: "FULL NAME", value: user?.name    || "—" },
        { label: "EMAIL",     value: user?.email   || "—" },
        { label: "STATE",     value: user?.state   || "—" },
        { label: "AADHAAR",   value: user?.aadhaar ? `••••  ••••  ${user.aadhaar.slice(-4)}` : "—" },
        { label: "STATUS",    value: "✓  Verified" },
      ],
    },
    {
      icon: "security",
      label: "SECURITY TIPS",
      items: [
        { label: "PASSWORD LENGTH", value: "Use 12+ characters mixing letters, numbers and symbols." },
        { label: "REUSE",           value: "Avoid reusing passwords across different services." },
        { label: "ROTATION",        value: "Change your password every 3–6 months for best security." },
        { label: "TWO FACTOR",      value: "Enable 2FA wherever possible for extra protection." },
      ],
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ud-page">
        <div className="account-page-wrapper">

          <div className="account-header-card">
            <div className="account-left">
              <div className="account-avatar">{initials}</div>
              <h3>{user?.name || "User"}</h3>
            </div>
            <div className="account-right">
              <div className="detail-row">
                <span className="label">EMAIL:</span>
                <span className="value">{user?.email || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="label">STATE:</span>
                <span className="value">{user?.state || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="label">AADHAAR:</span>
                <span className="value">{user?.aadhaar ? `••••  ••••  ${user.aadhaar.slice(-4)}` : "—"}</span>
              </div>
              <div className="detail-row">
                <span className="label">ACCOUNT STATUS:</span>
                <span className="value">✓ Verified</span>
              </div>
            </div>
          </div>

          <div className="account-accordions">
            {sections.map((section) => (
              <InfoAccordion key={section.label} icon={section.icon} label={section.label} items={section.items} />
            ))}
            <PasswordAccordion user={user} />
          </div>

        </div>
      </div>
    </>
  );
}