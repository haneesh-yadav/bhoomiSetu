import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = {
  globalStyle: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

    @keyframes mobileMenuDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .bh-ham-icon { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; }
    .bh-ham-icon span {
      display: block; height: 2px; background: #fff;
      border-radius: 2px; transition: all 0.25s ease;
    }
    .bh-ham-icon span:nth-child(1) { width: 22px; }
    .bh-ham-icon span:nth-child(2) { width: 15px; }
    .bh-ham-icon span:nth-child(3) { width: 19px; }

    .bh-ham-open span:nth-child(1) { width: 20px; transform: translateY(7px) rotate(45deg); }
    .bh-ham-open span:nth-child(2) { opacity: 0; width: 0; }
    .bh-ham-open span:nth-child(3) { width: 20px; transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 640px) {
      .bh-user-section   { display: none !important; }
      .bh-nav-guest      { display: none !important; }
      .bh-hamburger      { display: flex !important; }
      .bh-header-content { padding-left: 16px !important; gap: 8px !important; }
      .bh-logo-text      { font-size: 17px !important; }
      .bh-logo-img       { height: 28px !important; }
    }

    .rh-btn-outline {
      padding: 8px 16px;
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.35);
      background: transparent;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .rh-btn-outline:hover {
      border-color: rgba(255,255,255,0.7);
      background: rgba(255,255,255,0.06);
    }

    .rh-btn-filled {
      padding: 8px 16px;
      border-radius: 100px;
      background: #fff;
      color: #111;
      font-size: 14px;
      font-weight: 600;
      font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      white-space: nowrap;
    }
    .rh-btn-filled:hover  { opacity: 0.9; }
    .rh-btn-filled:active { transform: scale(0.98); }
  `,

  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif",
    transition: "background 0.3s ease, backdrop-filter 0.3s ease",
    /* NO box-shadow — merges seamlessly with Navbar below */
  },

  headerContent: {
    paddingLeft: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    height: "100%",
    cursor: "pointer",
  },

  logoTexts: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },

  logoText: {
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.5px",
    lineHeight: 1,
  },

  navLinksWrap: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    flex: 1,
    justifyContent: "center",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingRight: "1.2rem",
    marginLeft: "auto",
  },

  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    background: "none",
    border: "none",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    cursor: "pointer",
    padding: "0 1.2rem",
    height: "100%",
    transition: "color 0.2s",
  },

  divider: {
    width: "1px",
    height: "32px",
    backgroundColor: "rgba(224,122,95,0.3)",
    margin: "0 1rem",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.05rem",
    marginRight: "0.9rem",
  },

  userName: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.02em",
    lineHeight: 1.2,
  },

  userSub: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.72rem",
    fontWeight: 400,
    color: "rgba(224,180,165,0.7)",
    letterSpacing: "0.03em",
    lineHeight: 1.2,
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e07a5f 0%, #c96444 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(224,122,95,0.45)",
    flexShrink: 0,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    boxShadow: "0 2px 8px rgba(224,122,95,0.35)",
    overflow: "hidden",
  },

  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0 20px",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  mobileMenu: {
    position: "absolute",
    top: "60px",
    right: 0,
    width: "220px",
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    borderRadius: "0 0 8px 8px",
    zIndex: 9999,
    overflow: "hidden",
    animation: "mobileMenuDown 0.2s ease forwards",
    borderTop: "2px solid #e07a5f",
  },

  mobileMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    background: "none",
    border: "none",
    padding: "14px 16px",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#1a1a1a",
    cursor: "pointer",
    textAlign: "left",
    borderBottom: "1px solid #f2ede9",
    letterSpacing: "0.03em",
    boxSizing: "border-box",
  },

  mobileMenuUser: {
    background: "#fdf3f0",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderTop: "1px solid #f2ede9",
  },

  mobileMenuAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e07a5f 0%, #c96444 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(224,122,95,0.35)",
    flexShrink: 0,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    overflow: "hidden",
  },

  mobileMenuUserInfo: { display: "flex", flexDirection: "column" },

  mobileMenuUserName: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#1a1a1a",
  },

  mobileMenuUserReg: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.68rem",
    color: "#7a6560",
  },
};

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const menuRef = useRef(null);

  const path = location.pathname;
  const isMain = path === "/";
  const isDashboard = path.startsWith("/user/") || path.startsWith("/registrar/") || path.startsWith("/property/");
  const transparent = isMain;
  const isRegistrar = path.startsWith("/registrar/");

  const accent      = isRegistrar ? "#7C6EF5" : "#e07a5f";
  const accentDark  = isRegistrar ? "#5B4FD4" : "#c96444";
  const accentRgb   = isRegistrar ? "91,79,212" : "224,122,95";
  const accentMuted = isRegistrar ? "rgba(140,128,255,0.7)" : "rgba(224,180,165,0.7)";

  const loggedUser = user;
  const initials = loggedUser?.name
    ? loggedUser.name.split(" ").filter(w => w).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";
  const userId = loggedUser?.id || loggedUser?.registrarId || "USR-001";
  const homePath = path.startsWith("/registrar/") ? "/registrar/dashboard" : "/user/dashboard";

  const handleLogout = () => {
    setMobileOpen(false);
    if (onLogout) onLogout();
    else navigate("/login");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Background: unified dark strip — no bottom border/glow ── */
  const navBg =
    transparent && !scrolled && !isDashboard
      ? "transparent"
      : "linear-gradient(90deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)";

  const navBtnStyle = (id) => ({
    ...styles.navBtn,
    color: hoveredBtn === id ? accent : "#ffffff",
  });

  const navIconStyle = (id) => ({
    width: "18px",
    height: "18px",
    stroke: hoveredBtn === id ? accent : "#ffffff",
    transition: "stroke 0.2s",
    fill: "none",
  });

  const menuItemStyle = (id) => ({
    ...styles.mobileMenuItem,
    background: hoveredMenuItem === id ? (isRegistrar ? "#f0eeff" : "#fdf3f0") : "none",
    color: hoveredMenuItem === id ? accent : "#1a1a1a",
    transition: "background 0.15s",
  });

  const AvatarContent = ({ style }) =>
    loggedUser?.avatar ? (
      <img src={loggedUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      <span style={style}>{initials}</span>
    );

  return (
    <>
      <style>{styles.globalStyle}</style>

      <nav
        style={{
          ...styles.nav,
          background: navBg,
          /* No box-shadow — seamless merge with Navbar1 below */
          backdropFilter: scrolled || !transparent || isDashboard ? "blur(14px)" : "none",
        }}
      >
        {/* ── Logo ── */}
        <div
          className="bh-header-content"
          style={{ ...styles.headerContent, cursor: "default" }}
        >
          <img src="/assets/logo.png" alt="BhoomiSetu Logo" className="bh-logo-img" style={{ height: "36px", width: "auto", objectFit: "contain", display: "block", flexShrink: 0 }} />
          <div style={styles.logoTexts}>
            <span className="bh-logo-text" style={styles.logoText}>BhoomiSetu</span>
          </div>
        </div>

        {/* ── Desktop right section ── */}
        {loggedUser ? (
          <>
            <div className="bh-user-section" style={{ ...styles.userSection, marginLeft: "auto" }}>
              <button
                style={navBtnStyle("dashboard")}
                onClick={() => navigate(homePath)}
                onMouseEnter={() => setHoveredBtn("dashboard")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <svg style={navIconStyle("dashboard")} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                HOME
              </button>

              <button
                style={navBtnStyle("logout")}
                onClick={handleLogout}
                onMouseEnter={() => setHoveredBtn("logout")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <svg style={navIconStyle("logout")} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                LOGOUT
              </button>

              <div style={{ ...styles.divider, backgroundColor: `rgba(${accentRgb},0.3)` }} />

              <div style={styles.userInfo}>
                <span style={styles.userName}>{loggedUser.name || "User"}</span>
                <span style={{ ...styles.userSub, color: accentMuted }}>{userId}</span>
              </div>

              <div style={{
                ...styles.avatar,
                background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
                border: `2px solid rgba(${accentRgb},0.45)`,
                boxShadow: `0 2px 8px rgba(${accentRgb},0.35)`,
              }}>
                <AvatarContent />
              </div>
            </div>

            {/* Mobile hamburger */}
            <div ref={menuRef}>
              <button
                className="bh-hamburger"
                style={styles.hamburger}
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
              >
                <div className={`bh-ham-icon${mobileOpen ? " bh-ham-open" : ""}`}>
                  <span /><span /><span />
                </div>
              </button>

              {mobileOpen && (
                <div style={{ ...styles.mobileMenu, borderTop: `2px solid ${accent}` }}>
                  <button
                    style={menuItemStyle("dashboard")}
                    onMouseEnter={() => setHoveredBtn("dashboard")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    onClick={() => { navigate(homePath); setMobileOpen(false); }}
                  >
                    <svg style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", flexShrink: 0 }} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    HOME
                  </button>

                  <button
                    style={menuItemStyle("logout")}
                    onMouseEnter={() => setHoveredMenuItem("logout")}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    onClick={handleLogout}
                  >
                    <svg style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", flexShrink: 0 }} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    LOGOUT
                  </button>

                  <div style={{
                    ...styles.mobileMenuUser,
                    background: isRegistrar ? "#f0eeff" : "#fdf3f0",
                    borderTop: `1px solid ${isRegistrar ? "#e0dbff" : "#f2ede9"}`,
                  }}>
                    <div style={{
                      ...styles.mobileMenuAvatar,
                      background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
                      border: `2px solid rgba(${accentRgb},0.35)`,
                    }}>
                      <AvatarContent />
                    </div>
                    <div style={styles.mobileMenuUserInfo}>
                      <span style={styles.mobileMenuUserName}>{loggedUser.name || "User"}</span>
                      <span style={styles.mobileMenuUserReg}>{userId}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bh-nav-guest" style={{ display: "flex", alignItems: "center", gap: "12px", paddingRight: "1.2rem", marginLeft: "auto" }}>
              {(path === "/login" || path === "/signup") && (
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "none", border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "100px", padding: "8px 16px",
                    color: "#fff", fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em",
                    cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "none"; }}
                  onClick={() => navigate("/")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to Home
                </button>
              )}
              <button className="rh-btn-outline" onClick={() => navigate("/login")}>Sign in</button>
              <button className="rh-btn-filled" onClick={() => navigate("/signup")}>Join Us</button>
            </div>

            <div ref={menuRef}>
              <button
                className="bh-hamburger"
                style={styles.hamburger}
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
              >
                <div className={`bh-ham-icon${mobileOpen ? " bh-ham-open" : ""}`}>
                  <span /><span /><span />
                </div>
              </button>

              {mobileOpen && (
                <div style={{ ...styles.mobileMenu, borderTop: "2px solid #2A7D4F" }}>
                  <button
                    style={menuItemStyle("signin")}
                    onMouseEnter={() => setHoveredMenuItem("signin")}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    onClick={() => { navigate("/login"); setMobileOpen(false); }}
                  >
                    <svg style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", flexShrink: 0 }} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In
                  </button>
                  <button
                    style={{ ...menuItemStyle("join"), background: hoveredMenuItem === "join" ? "#e8f5ee" : "#f4faf7", color: "#2A7D4F", fontWeight: 700 }}
                    onMouseEnter={() => setHoveredMenuItem("join")}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    onClick={() => { navigate("/signup"); setMobileOpen(false); }}
                  >
                    <svg style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", flexShrink: 0 }} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Join Us
                  </button>
                  {(path === "/login" || path === "/signup") && (
                    <button
                      style={menuItemStyle("home")}
                      onMouseEnter={() => setHoveredMenuItem("home")}
                      onMouseLeave={() => setHoveredMenuItem(null)}
                      onClick={() => { navigate("/"); setMobileOpen(false); }}
                    >
                      <svg style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", flexShrink: 0 }} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Back to Home
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
}