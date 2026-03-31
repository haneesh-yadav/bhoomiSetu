import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ══════════════════════════════════════════════════
   NAV ITEMS — Home removed, edit_document → description
══════════════════════════════════════════════════ */
const REGISTRAR_NAV = [
  { label: "Approvals Queue",   icon: "pending_actions", path: "/registrar/approvals"  },
  { label: "Transfer Review",   icon: "manage_search",   path: "/registrar/review"     },
  { label: "Dispute Mgmt",      icon: "gavel",           path: "/registrar/disputes"   },
  { label: "Mutation Requests", icon: "description",     path: "/registrar/mutations"  },
  { label: "Audit Log",         icon: "history",         path: "/registrar/audit"      },
];

/* ══════════════════════════════════════════════════
   STYLES — mirrors DashboardNav, coral accent
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  /* ── Shell ── */
  .reg-nav {
    position: sticky;
    top: 60px;
    z-index: 90;
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.12);
    font-family: 'Poppins', sans-serif;
    overflow-x: auto;
    scrollbar-width: none;
    box-shadow: 0 1px 4px rgba(13,61,43,0.06);
  }
  .reg-nav::-webkit-scrollbar { display: none; }

  /* ── Desktop row ── */
  .reg-nav-inner {
    display: flex;
    align-items: center;
    min-width: max-content;
    height: 48px;
    padding: 0;
  }

  /* ── Hamburger — decorative on desktop, hidden visually but in DOM ── */
  .reg-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 48px;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: default;
    color: #111;
    padding: 0;
    pointer-events: none;
  }
  .reg-hamburger .material-icons-sharp { font-size: 22px; line-height: 1; }

  /* ── Tab — chevron + icon + label as one unit ── */
  .reg-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0 0.9rem 0 0.5rem;
    height: 48px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #111;
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    letter-spacing: 0.01em;
    white-space: nowrap;
    transition: color 0.18s, background 0.18s;
    text-decoration: none;
  }
  .reg-tab:hover {
    color: #5B4FD4;
    background: rgba(91,79,212,0.06);
  }

  /* Active — coral text + bold + faint coral bg, NO underline */
  .reg-tab-active {
    color: #5B4FD4;
    font-weight: 700;
    background: rgba(91,79,212,0.08);
  }
  .reg-tab-active:hover { color: #5B4FD4; background: rgba(91,79,212,0.12); }
  .reg-tab-active .reg-chevron-icon { opacity: 1; }

  /* Chevron — inherits color from tab */
  .reg-chevron-icon {
    font-family: 'Material Icons Sharp';
    font-size: 15px;
    line-height: 1;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    display: inline-block;
    vertical-align: middle;
    color: inherit;
    opacity: 0.6;
    flex-shrink: 0;
  }

  /* Tab icon */
  .reg-tab-icon {
    font-family: 'Material Icons Sharp';
    font-size: 16px;
    line-height: 1;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    display: inline-block;
    vertical-align: middle;
    color: inherit;
    flex-shrink: 0;
  }

  /* Mobile-only trigger — hidden on desktop */
  .reg-hamburger-mobile { display: none; }

  /* ── Mobile drawer ── */
  .reg-mobile-drawer { display: none; }

  /* ── Responsive ── */
  @media (max-width: 768px) {

    .reg-nav-inner { display: none; }

    .reg-hamburger-mobile {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      height: 48px;
      padding: 0 1rem;
      border: none;
      background: none;
      cursor: pointer;
      color: #0D3D2B;
      font-family: 'Poppins', sans-serif;
    }
    .reg-hamburger-mobile .material-icons-sharp { font-size: 22px; }
    .reg-hamburger-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(13,61,43,0.6);
    }

    .reg-mobile-drawer {
      display: flex;
      flex-direction: column;
      border-top: 1.5px solid rgba(13,61,43,0.1);
      background: #fff;
    }
    .reg-mobile-drawer-closed { display: none; }

    .reg-mobile-tab {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1.25rem;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      color: #111;
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
      border-bottom: 1px solid rgba(13,61,43,0.06);
      transition: color 0.18s, background 0.18s;
      width: 100%;
    }
    .reg-mobile-tab:hover { color: #5B4FD4; background: rgba(91,79,212,0.06); }
    .reg-mobile-tab-active {
      color: #5B4FD4;
      font-weight: 700;
      background: rgba(91,79,212,0.08);
    }
    .reg-mobile-tab-active .reg-chevron-icon { opacity: 1; }
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

        {/* Mobile trigger */}
        <button
          className="reg-hamburger-mobile"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span className="material-icons-sharp">{open ? "close" : "menu"}</span>
          <span className="reg-hamburger-label">Navigation</span>
        </button>

        {/* Desktop row */}
        <div className="reg-nav-inner">

          {/* Decorative hamburger — desktop only, not clickable */}
          <button className="reg-hamburger" aria-hidden="true" tabIndex={-1}>
            <span className="material-icons-sharp">menu</span>
          </button>

          {REGISTRAR_NAV.map((tab) => (
            <button
              key={tab.path}
              className={`reg-tab ${isActive(tab.path) ? "reg-tab-active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              <span className="reg-chevron-icon material-icons-sharp">chevron_right</span>
              <span className="reg-tab-icon material-icons-sharp">{tab.icon}</span>
              {tab.label}
            </button>
          ))}

        </div>

        {/* Mobile drawer */}
        <div className={`reg-mobile-drawer ${open ? "" : "reg-mobile-drawer-closed"}`}>
          {REGISTRAR_NAV.map((tab) => (
            <button
              key={tab.path}
              className={`reg-mobile-tab ${isActive(tab.path) ? "reg-mobile-tab-active" : ""}`}
              onClick={() => { navigate(tab.path); setOpen(false); }}
            >
              <span className="reg-chevron-icon material-icons-sharp">chevron_right</span>
              <span className="reg-tab-icon material-icons-sharp">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

      </nav>
    </>
  );
}
