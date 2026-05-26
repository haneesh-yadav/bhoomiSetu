import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ══════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════ */
const REGISTRAR_NAV = [
  { label: "Approvals Queue",   icon: "pending_actions", path: "/registrar/approvals"  },
  { label: "Transfer Review",   icon: "manage_search",   path: "/registrar/review"     },
  { label: "Dispute Mgmt",      icon: "gavel",           path: "/registrar/disputes"   },
  { label: "Mutation Requests", icon: "description",     path: "/registrar/mutations"  },
  { label: "Audit Log",         icon: "history",         path: "/registrar/audit"      },
  { label: "Account",           icon: "manage_accounts", path: "/registrar/account"    },
];

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  /* ── Shell ── */
  .reg-nav {
    position: sticky;
    top: 60px;
    z-index: 90;
    background: #1a1a1a;
    font-family: 'Poppins', sans-serif;
    overflow-x: auto;
    scrollbar-width: none;
    box-shadow: 0 2px 0 rgba(91,79,212,0.35), 0 4px 20px rgba(0,0,0,0.28);
  }
  .reg-nav::-webkit-scrollbar { display: none; }

  /* ── Subtle top accent line ── */
  .reg-nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(91,79,212,0.5) 20%,
      rgba(124,110,245,0.85) 50%,
      rgba(91,79,212,0.5) 80%,
      transparent 100%
    );
    pointer-events: none;
  }

  /* ── Desktop row ── */
  .reg-nav-inner {
    display: flex;
    align-items: stretch;
    min-width: max-content;
    height: 50px;
    padding: 0 4px;
    position: relative;
  }

  /* ── Decorative hamburger — desktop ── */
  .reg-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 50px;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: default;
    padding: 0;
    pointer-events: none;
  }
  .reg-hamburger .material-icons-sharp {
    font-size: 18px;
    color: rgba(255,255,255,0.2);
  }

  /* ── Separator ── */
  .reg-nav-sep {
    width: 1px;
    height: 24px;
    background: rgba(255,255,255,0.08);
    align-self: center;
    margin: 0 4px;
    flex-shrink: 0;
  }

  /* ── Each nav tab ── */
  .reg-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 18px;
    height: 50px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    white-space: nowrap;
    transition: color 0.2s ease, background 0.2s ease;
    text-decoration: none;
    position: relative;
  }

  /* Bottom indicator line */
  .reg-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: #7C6EF5;
    border-radius: 2px 2px 0 0;
    transition: width 0.25s ease;
  }

  .reg-tab:hover {
    color: rgba(255,255,255,0.88);
    background: rgba(255,255,255,0.05);
  }
  .reg-tab:hover::after {
    width: 40%;
  }

  /* Active state */
  .reg-tab-active {
    color: #fff !important;
    background: rgba(91,79,212,0.15) !important;
    font-weight: 700;
  }
  .reg-tab-active::after {
    width: 70% !important;
  }
  .reg-tab-active .reg-tab-icon {
    color: #7C6EF5;
    opacity: 1;
  }

  /* Tab icon */
  .reg-tab-icon {
    font-family: 'Material Icons Sharp';
    font-size: 15px;
    line-height: 1;
    font-style: normal;
    font-weight: normal;
    display: inline-block;
    vertical-align: middle;
    color: inherit;
    flex-shrink: 0;
    opacity: 0.7;
    transition: color 0.2s, opacity 0.2s;
  }
  .reg-tab:hover .reg-tab-icon {
    opacity: 1;
  }

  /* ── Right side registrar badge ── */
  .reg-nav-right {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-right: 14px;
    flex-shrink: 0;
    gap: 8px;
  }
  .reg-nav-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(91,79,212,0.14);
    border: 1px solid rgba(91,79,212,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: rgba(140,128,255,0.9);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .reg-nav-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7C6EF5;
    animation: reg-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .reg-nav-role-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .reg-nav-role-icon {
    font-family: 'Material Icons Sharp';
    font-size: 12px;
    font-style: normal;
    font-weight: normal;
    color: rgba(255,255,255,0.25);
  }

  @keyframes reg-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }

  /* ══════════════════════════════════════════════════
     MOBILE
  ══════════════════════════════════════════════════ */
  .reg-mobile-drawer { display: none; }
  .reg-hamburger-mobile { display: none; }

  @media (max-width: 768px) {
    .reg-nav-inner { display: none; }

    .reg-hamburger-mobile {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 50px;
      padding: 0 16px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    }
    .reg-hamburger-mobile .material-icons-sharp {
      font-size: 20px;
      color: rgba(255,255,255,0.7);
    }
    .reg-hamburger-label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
    }
    .reg-hamburger-mobile-arrow {
      font-family: 'Material Icons Sharp';
      font-size: 16px;
      font-style: normal;
      font-weight: normal;
      color: rgba(255,255,255,0.3);
      margin-left: auto;
      transition: transform 0.22s ease;
    }
    .reg-hamburger-mobile-arrow.open {
      transform: rotate(180deg);
    }

    /* Mobile drawer */
    .reg-mobile-drawer {
      display: flex;
      flex-direction: column;
      background: #111;
      border-top: 1px solid rgba(255,255,255,0.06);
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
    }
    .reg-mobile-drawer.open {
      max-height: 600px;
    }

    .reg-mobile-tab {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 20px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: rgba(255,255,255,0.5);
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: color 0.18s, background 0.18s, padding-left 0.18s;
      width: 100%;
      position: relative;
    }
    .reg-mobile-tab:hover {
      color: #fff;
      background: rgba(255,255,255,0.04);
      padding-left: 24px;
    }
    .reg-mobile-tab-active {
      color: #7C6EF5 !important;
      background: rgba(91,79,212,0.1) !important;
      padding-left: 24px;
    }
    .reg-mobile-tab-active .reg-tab-icon {
      color: #7C6EF5;
      opacity: 1;
    }
    .reg-mobile-active-bar {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: #7C6EF5;
      border-radius: 0 3px 3px 0;
    }
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Navbar2({ user, onLogout }) {
  const location        = useLocation();
  const navigate        = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>

      <nav className="reg-nav">

        {/* ── Desktop nav row ── */}
        <div className="reg-nav-inner">

          {/* Decorative hamburger */}
          <button className="reg-hamburger" aria-hidden="true" tabIndex={-1}>
            <span className="material-icons-sharp">menu</span>
          </button>

          <div className="reg-nav-sep" />

          {REGISTRAR_NAV.map((tab) => (
            <button
              key={tab.path}
              className={`reg-tab${isActive(tab.path) ? " reg-tab-active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              <span className="reg-tab-icon material-icons-sharp">{tab.icon}</span>
              {tab.label}
            </button>
          ))}

          {/* Right side badges */}
          <div className="reg-nav-right">
            <div className="reg-nav-role-chip">
              <span className="reg-nav-role-icon material-icons-sharp">admin_panel_settings</span>
              Registrar
            </div>
            <div className="reg-nav-badge">
              <span className="reg-nav-badge-dot" />
              System Active
            </div>
          </div>

        </div>

        {/* ── Mobile trigger ── */}
        <button
          className="reg-hamburger-mobile"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span className="material-icons-sharp">
            {open ? "close" : "menu"}
          </span>
          <span className="reg-hamburger-label">Navigation</span>
          <span className={`reg-hamburger-mobile-arrow material-icons-sharp${open ? " open" : ""}`}>
            expand_more
          </span>
        </button>

        {/* ── Mobile drawer ── */}
        <div className={`reg-mobile-drawer${open ? " open" : ""}`}>
          {REGISTRAR_NAV.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                className={`reg-mobile-tab${active ? " reg-mobile-tab-active" : ""}`}
                onClick={() => { navigate(tab.path); setOpen(false); }}
              >
                {active && <span className="reg-mobile-active-bar" />}
                <span className="reg-tab-icon material-icons-sharp">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

      </nav>
    </>
  );
}