import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

/* ══════════════════════════════════════════════════
   CSS — layout matches ChangePassword structure exactly
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
    min-height: calc(100vh - 52px);
    height: calc(100vh - 52px);
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
  .ac-headline span { color: var(--ac-accent); }

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
    background: linear-gradient(135deg, var(--ac-accent) 0%, #fabc88 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 4px 14px var(--ac-accent-glow);
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

  /* ── Action button ── */
  .ac-action-btn {
    width: 100%;
    padding: 15px 20px;
    border-radius: 12px;
    background: #1a1a1a;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.03em;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.1s;
  }
  .ac-action-btn:hover { background: #2a2a2a; }
  .ac-action-btn:active { transform: scale(0.99); }
  .ac-action-btn .mi { font-size: 16px; }

  /* ── Right panel (Security tips card) ── */
  .ac-right {
    width: 50%;
    background: #f0ede4;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .ac-tips-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 480px;
    animation: fadeUp 0.35s ease both;
  }

  .ac-tips-title {
    font-size: 11.5px;
    font-weight: 800;
    color: var(--ac-accent);
    letter-spacing: 0.08em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ac-tips-title::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: var(--ac-accent-glow);
  }

  .ac-tips-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ac-tip-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #f8f6f2;
    border-radius: 12px;
    padding: 14px 16px;
    border: 1px solid #ede9e0;
  }

  .ac-tip-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--ac-accent-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ac-accent);
    flex-shrink: 0;
  }

  .ac-tip-text strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  .ac-tip-text p {
    font-size: 11.5px;
    color: #666;
    line-height: 1.4;
  }

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
    
    .ac-tips-card {
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

    .ac-action-btn {
      padding: 14px 16px;
      font-size: 13px;
    }
  }
`;

export default function Account() {
  const { user } = useAuth();

  const isRegistrar = user?.role === "registrar";
  const accentColor = isRegistrar ? "#5B4FD4" : "#e07a5f";
  const accentGlow = isRegistrar ? "rgba(91,79,212,0.12)" : "rgba(224,122,95,0.12)";

  const initials = user?.name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "R";

  const maskedAadhaar = user?.aadhaar
    ? `•••• •••• ${user.aadhaar.replace(/\s/g, "").slice(-4)}`
    : "—";

  return (
    <>
      <style>{CSS}</style>
      <div className="ac-page">

        {/* ── LEFT PANEL (Profile Card) ── */}
        <div className="ac-left" style={{
          "--ac-accent": accentColor,
          "--ac-accent-glow": accentGlow,
        }}>

          {/* Headline */}
          <h1 className="ac-headline">
            My <span>account.</span>
          </h1>

          {/* Profile Card */}
          <div className="ac-profile-card">
            
            <div className="ac-avatar-row">
              <div className="ac-avatar">{initials}</div>
              <div>
                <div className="ac-profile-name">{user?.name || "User"}</div>
                <div className="ac-profile-role">{user?.role || "Citizen"} Account</div>
              </div>
            </div>

            <div className="ac-details-list">
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">Email</span>
                <span className="ac-detail-val">{user?.email || "—"}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">State</span>
                <span className="ac-detail-val">{user?.state || "—"}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">Aadhaar</span>
                <span className="ac-detail-val">{maskedAadhaar}</span>
              </div>
              <div className="ac-detail-item">
                <span className="ac-detail-lbl">Status</span>
                <span className="ac-detail-val green">✓ Verified</span>
              </div>
            </div>

            <Link to="/user/change-password" className="ac-action-btn">
              <span className="mi">lock_reset</span>
              Change Account Password
            </Link>

          </div>

        </div>

        {/* ── RIGHT PANEL (Security Tips Card) ── */}
        <div className="ac-right">
          <div className="ac-tips-card" style={{
            "--ac-accent": accentColor,
            "--ac-accent-glow": accentGlow,
          }}>
            <div className="ac-tips-title">SECURITY TIPS</div>
            <div className="ac-tips-list">

              <div className="ac-tip-item">
                <div className="ac-tip-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>password</span>
                </div>
                <div className="ac-tip-text">
                  <strong>Password Length</strong>
                  <p>Use 12+ characters mixing uppercase, lowercase, numbers, and symbols.</p>
                </div>
              </div>

              <div className="ac-tip-item">
                <div className="ac-tip-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>block</span>
                </div>
                <div className="ac-tip-text">
                  <strong>Avoid Reuse</strong>
                  <p>Never reuse passwords across different apps or websites.</p>
                </div>
              </div>

              <div className="ac-tip-item">
                <div className="ac-tip-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>history</span>
                </div>
                <div className="ac-tip-text">
                  <strong>Regular Rotation</strong>
                  <p>Change your password every 3–6 months to maximize security.</p>
                </div>
              </div>

              <div className="ac-tip-item">
                <div className="ac-tip-icon">
                  <span className="mi" style={{ fontSize: "16px" }}>phonelink_lock</span>
                </div>
                <div className="ac-tip-text">
                  <strong>Two-Factor Auth</strong>
                  <p>Enable Multi-Factor authentication where available for extra protection.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}