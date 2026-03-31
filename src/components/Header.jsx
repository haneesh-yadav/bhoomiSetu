import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  /* ── Shell ── */
  .hdr {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem 0 10px;
    background: #0D3D2B;
    border-bottom: 2.5px solid #0D3D2B;
    font-family: 'Bricolage Grotesque', sans-serif;
  }

  .hdr-spacer {
    height: 60px;
  }

  /* ── Logo ── */
  .hdr-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: default;
  }

  .hdr-logo-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .hdr-logo-icon img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    display: block;
  }

  .hdr-logo-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: 0.01em;
    color: #ffffff;
    margin: 0;
    padding: 0;
    line-height: 1;
    cursor: default;
  }

  /* ── Right slot ── */
  .hdr-right {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ── Auth buttons ── */
  .hdr-btn-login {
    padding: 0.42rem 1.2rem;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    background: transparent;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .hdr-btn-login:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.6);
  }

  .hdr-btn-signup {
    padding: 0.42rem 1.2rem;
    border-radius: 8px;
    border: 2px solid #C8F135;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  }

  .hdr-btn-signup:hover {
    background: #a8d41a;
    border-color: #a8d41a;
  }

  /* ── Dashboard user section ── */
  .hdr-user {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .hdr-icon-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
    padding: 0.2rem 0.45rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: color 0.18s, background 0.18s;
  }

  .hdr-icon-btn .material-icons-sharp {
    font-size: 15px;
    line-height: 1;
    display: inline-block;
    vertical-align: middle;
  }

  .hdr-icon-btn:hover {
    color: #C8F135;
    background: rgba(255, 255, 255, 0.07);
  }

  .hdr-icon-btn-logout:hover {
    color: #F07060;
    background: rgba(240, 112, 96, 0.1);
  }

  /* ── Vertical divider ── */
  .hdr-divider {
    width: 1.5px;
    height: 24px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin: 0 0.3rem;
  }

  /* ── User info ── */
  .hdr-user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
  }

  .hdr-username {
    font-size: 0.75rem;
    font-weight: 800;
    color: #fff;
    white-space: nowrap;
    letter-spacing: 0.04em;
    line-height: 1.25;
  }

  .hdr-user-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    letter-spacing: 0.05em;
    line-height: 1.25;
  }

  /* ── Avatar ── */
  .hdr-avatar {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    background: #C8F135;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: 0.02em;
  }

  .hdr-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ── Hamburger ── */
  .hdr-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    background: none;
    border: none;
    margin-left: auto;
  }

  .ham-bar {
    width: 24px;
    height: 2.5px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 2px;
    transition: all 0.25s ease;
    display: block;
  }

  .ham-bar-1-open { transform: translateY(7.5px) rotate(45deg); }
  .ham-bar-2-open { opacity: 0; transform: scaleX(0); }
  .ham-bar-3-open { transform: translateY(-7.5px) rotate(-45deg); }

  /* ── Mobile drawer ── */
  .hdr-drawer {
    display: none;
    position: fixed;
    top: 70px;
    right: 1rem;
    width: 260px;
    background: #fff;
    border: 2px solid rgba(13, 61, 43, 0.12);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(13, 61, 43, 0.18), 4px 4px 0 rgba(13, 61, 43, 0.08);
    z-index: 99;
    flex-direction: column;
    overflow: hidden;
    animation: drawerIn 0.2s ease both;
  }

  @keyframes drawerIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .hdr-drawer-open {
    display: flex;
  }

  /* ── Drawer auth buttons ── */
  .drawer-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1rem 1.25rem;
  }

  .drawer-btn-login {
    width: 100%;
    padding: 0.7rem;
    border: 2px solid #0D3D2B;
    border-radius: 10px;
    background: transparent;
    color: #0D3D2B;
    font-size: 0.875rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
  }

  .drawer-btn-login:hover {
    background: #0D3D2B;
    color: #C8F135;
  }

  .drawer-btn-signup {
    width: 100%;
    padding: 0.7rem;
    border: 2px solid #0D3D2B;
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.875rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 3px 3px 0 #0D3D2B;
    transition: background 0.18s;
  }

  .drawer-btn-signup:hover {
    background: #a8d41a;
  }

  /* ── Drawer dashboard nav ── */
  .drawer-nav-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgba(13, 61, 43, 0.07);
    cursor: pointer;
    transition: background 0.15s;
    font-family: 'Poppins', sans-serif;
  }

  .drawer-nav-row:hover {
    background: rgba(13, 61, 43, 0.04);
  }

  .drawer-nav-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(13, 61, 43, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .drawer-nav-icon .material-icons-sharp {
    font-size: 18px;
    color: #0D3D2B;
  }

  .drawer-nav-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
    letter-spacing: 0.05em;
  }

  .drawer-nav-row-logout .drawer-nav-icon {
    background: rgba(240, 112, 96, 0.1);
  }

  .drawer-nav-row-logout .material-icons-sharp {
    color: #F07060;
  }

  .drawer-nav-row-logout .drawer-nav-label {
    color: #F07060;
  }

  /* ── Drawer profile card ── */
  .drawer-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: rgba(13, 61, 43, 0.03);
  }

  .drawer-profile-avatar {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    background: #C8F135;
    border: 2px solid #0D3D2B;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 800;
    color: #0D3D2B;
    box-shadow: 2px 2px 0 rgba(13, 61, 43, 0.15);
    overflow: hidden;
  }

  .drawer-profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .drawer-profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .drawer-profile-name {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: 0.02em;
  }

  .drawer-profile-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(13, 61, 43, 0.45);
    letter-spacing: 0.05em;
  }

  /* ── Dashboard font overrides ── */
  .hdr-dash .hdr-icon-btn {
    font-family: 'Poppins', sans-serif;
  }

  .hdr-dash .hdr-username {
    font-family: 'Poppins', sans-serif;
  }

  .hdr-dash .hdr-user-id {
    font-family: 'DM Mono', monospace;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hdr {
      padding: 0 1.25rem;
    }

    .hdr-right {
      display: none;
    }

    .hdr-hamburger {
      display: flex;
    }
  }

  @media (max-width: 480px) {
    .hdr {
      padding: 0 1rem;
    }

    .hdr-logo-name {
      font-size: 1rem;
    }

    .hdr-drawer {
      right: 0.75rem;
      width: 240px;
    }
  }
`;

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const path = location.pathname;

  const isMain      = path === "/";
  const isAuthPage  = path === "/login" || path === "/signup";
  const isUserDash  = path.startsWith("/user/");
  const isRegDash   = path.startsWith("/registrar/");
  const isDashboard = isUserDash || isRegDash;
  const showAuthButtons = isMain || isAuthPage;

  const loggedUser = user;
  const initials   = loggedUser?.name
    ? loggedUser.name.split(" ").filter(w => w).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";
  const userId   = loggedUser?.id || loggedUser?.registrarId || "USR-001";
  const homePath = isRegDash ? "/registrar/dashboard" : "/user/dashboard";

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) onLogout();
    else navigate("/login");
  };

  const closeAndGo = (dest) => {
    setOpen(false);
    navigate(dest);
  };

  return (
    <>
      <style>{styles}</style>

      <nav className={`hdr${isDashboard ? " hdr-dash" : ""}`}>

        {/* Logo */}
        <div className="hdr-logo">
          <div className="hdr-logo-icon">
            <img src="/assets/logo.png" alt="BhoomiSetu" />
          </div>
          <h1 className="hdr-logo-name">BhoomiSetu</h1>
        </div>

        {/* Desktop right section */}
        <div className="hdr-right">

          {showAuthButtons && (
            <>
              <button className="hdr-btn-login" onClick={() => navigate("/login")}>
                Log In
              </button>
              <button className="hdr-btn-signup" onClick={() => navigate("/signup")}>
                Sign Up →
              </button>
            </>
          )}

          {isDashboard && loggedUser && (
            <div className="hdr-user">
              <button className="hdr-icon-btn" onClick={() => navigate(homePath)}>
                <span className="material-icons-sharp">home</span>
                HOME
              </button>

              <button className="hdr-icon-btn hdr-icon-btn-logout" onClick={handleLogout}>
                <span className="material-icons-sharp">logout</span>
                LOGOUT
              </button>

              <div className="hdr-divider" />

              <div className="hdr-user-info">
                <span className="hdr-username">{loggedUser.name.toUpperCase()}</span>
                <span className="hdr-user-id">{userId}</span>
              </div>

              <div className="hdr-avatar">
                {loggedUser.avatar
                  ? <img src={loggedUser.avatar} alt={loggedUser.name} />
                  : initials
                }
              </div>
            </div>
          )}

        </div>

        {/* Mobile hamburger */}
        <button
          className="hdr-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`ham-bar ${open ? "ham-bar-1-open" : ""}`} />
          <span className={`ham-bar ${open ? "ham-bar-2-open" : ""}`} />
          <span className={`ham-bar ${open ? "ham-bar-3-open" : ""}`} />
        </button>

      </nav>

      {/* Mobile drawer */}
      <div className={`hdr-drawer ${open ? "hdr-drawer-open" : ""}`}>

        {showAuthButtons && (
          <div className="drawer-actions">
            <button className="drawer-btn-login" onClick={() => closeAndGo("/login")}>
              Log In
            </button>
            <button className="drawer-btn-signup" onClick={() => closeAndGo("/signup")}>
              Sign Up →
            </button>
          </div>
        )}

        {isDashboard && loggedUser && (
          <>
            <div className="drawer-nav-row" onClick={() => closeAndGo(homePath)}>
              <div className="drawer-nav-icon">
                <span className="material-icons-sharp">home</span>
              </div>
              <span className="drawer-nav-label">HOME</span>
            </div>

            <div className="drawer-nav-row drawer-nav-row-logout" onClick={handleLogout}>
              <div className="drawer-nav-icon">
                <span className="material-icons-sharp">logout</span>
              </div>
              <span className="drawer-nav-label">LOGOUT</span>
            </div>

            <div className="drawer-profile">
              <div className="drawer-profile-avatar">
                {loggedUser.avatar
                  ? <img src={loggedUser.avatar} alt={loggedUser.name} />
                  : initials
                }
              </div>
              <div className="drawer-profile-info">
                <div className="drawer-profile-name">{loggedUser.name.toUpperCase()}</div>
                <div className="drawer-profile-id">{userId}</div>
              </div>
            </div>
          </>
        )}

      </div>

      <div className="hdr-spacer" />
    </>
  );
}
