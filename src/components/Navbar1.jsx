import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ══════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════ */
const USER_NAV = [
  { label: "My Properties",     icon: "domain",          path: "/user/properties"      },
  { label: "Initiate Transfer", icon: "swap_horiz",      path: "/user/transfer"        },
  { label: "Transfer Status",   icon: "pending_actions", path: "/user/transfer-status" },
  { label: "Mutation Request",  icon: "description",     path: "/user/mutation"        },
  { label: "Disputes",          icon: "gavel",           path: "/user/disputes"        },
  { label: "Certificates",      icon: "verified",        path: "/user/certificates"    },
];

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  /* ── Shell ── */
  .dash-nav {
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
  .dash-nav::-webkit-scrollbar { display: none; }

  /* ── Desktop row ── */
  .dash-nav-inner {
    display: flex;
    align-items: center;
    min-width: max-content;
    height: 48px;
    padding: 0;
  }

  /* ── Hamburger — visible on all screens, clickable only on mobile ── */
  .dash-hamburger {
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
    pointer-events: none;   /* not clickable on desktop */
  }
  .dash-hamburger .material-icons-sharp { font-size: 22px; line-height:1; }

  /* ── Each nav item = chevron + icon + label, all one clickable unit ── */
  .dash-tab {
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
  .dash-tab:hover {
    color: #F07060;
    background: rgba(240,112,96,0.06);
  }

  /* Active — green text + bold + lime tint, NO underline */
  .dash-tab-active {
    color: #F07060;
    font-weight: 700;
    background: rgba(240,112,96,0.08);
  }
  .dash-tab-active:hover { color: #F07060; background: rgba(240,112,96,0.12); }

  /* Chevron — part of the button, inherits color */
  .dash-chevron-icon {
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
  /* On active, chevron fully opaque */
  .dash-tab-active .dash-chevron-icon { opacity: 1; }

  /* Tab icon */
  .dash-tab-icon {
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

  /* ══════════════════════════════════════════════════
     MOBILE DRAWER
  ══════════════════════════════════════════════════ */
  .dash-mobile-drawer {
    display: none;
  }

  /* Mobile-only full-width hamburger trigger */
  .dash-hamburger-mobile {
    display: none;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {

    /* Hide desktop row on mobile */
    .dash-nav-inner { display: none; }

    /* Show mobile trigger */
    .dash-hamburger-mobile {
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
    .dash-hamburger-mobile .material-icons-sharp { font-size: 22px; }
    .dash-hamburger-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(13,61,43,0.6);
    }

    /* Mobile drawer — vertical list */
    .dash-mobile-drawer {
      display: flex;
      flex-direction: column;
      border-top: 1.5px solid rgba(13,61,43,0.1);
      background: #fff;
    }
    .dash-mobile-drawer-closed { display: none; }

    .dash-mobile-tab {
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
    .dash-mobile-tab:hover { color: #F07060; background: rgba(240,112,96,0.06); }
    .dash-mobile-tab-active {
      color: #F07060;
      font-weight: 700;
      background: rgba(240,112,96,0.08);
    }
    .dash-mobile-tab-active .dash-chevron-icon { opacity: 1; }
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Navbar1({ user, onLogout }) {
  const location            = useLocation();
  const navigate            = useNavigate();
  const [open, setOpen]     = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>

      <nav className="dash-nav">

        {/* ── Desktop nav row (hamburger + tabs inline) ── */}
        <div className="dash-nav-inner">

          {/* Hamburger — decorative on desktop, functional on mobile */}
          <button
            className="dash-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <span className="material-icons-sharp">
              {open ? "close" : "menu"}
            </span>
          </button>

          {USER_NAV.map((tab) => (
            <button
              key={tab.path}
              className={`dash-tab ${isActive(tab.path) ? "dash-tab-active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              <span className="dash-chevron-icon material-icons-sharp">chevron_right</span>
              <span className="dash-tab-icon material-icons-sharp">{tab.icon}</span>
              {tab.label}
            </button>
          ))}

        </div>

        {/* ── Mobile hamburger trigger (shown only on mobile via CSS) ── */}
        <button
          className="dash-hamburger-mobile"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span className="material-icons-sharp">
            {open ? "close" : "menu"}
          </span>
          <span className="dash-hamburger-label">Navigation</span>
        </button>

        {/* ── Mobile drawer — shown/hidden by open state ── */}
        <div className={`dash-mobile-drawer ${open ? "" : "dash-mobile-drawer-closed"}`}>
          {USER_NAV.map((tab) => (
            <button
              key={tab.path}
              className={`dash-mobile-tab ${isActive(tab.path) ? "dash-mobile-tab-active" : ""}`}
              onClick={() => { navigate(tab.path); setOpen(false); }}
            >
              <span className="dash-chevron-icon material-icons-sharp">chevron_right</span>
              <span className="dash-tab-icon material-icons-sharp">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

      </nav>
    </>
  );
}
