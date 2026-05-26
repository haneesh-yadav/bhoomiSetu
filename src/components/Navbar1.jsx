import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ══════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════ */
const USER_NAV = [
  {
    label: "My Properties",
    icon: "domain",
    path: "/user/properties",
  },
  {
    label: "Transfers",
    icon: "swap_horiz",
    path: "/user/transfers",
    children: {
      brand: { title: "Transfers", desc: "Move property ownership securely with a full audit trail." },
      sections: [
        {
          heading: "Initiate",
          items: [
            { label: "Transfers",   icon: "add_circle_outline", path: "/user/transfers"      },
          ],
        },
      ],
    },
  },
  {
    label: "Mutation Request",
    icon: "description",
    path: "/user/mutation",
    children: {
      brand: { title: "Mutation", desc: "Request official record changes and track government approvals." },
      sections: [
        {
          heading: "Requests",
          items: [
            { label: "Mutation",  icon: "post_add",        path: "/user/mutation"      },
          ],
        },
      ],
    },
  },
  {
    label: "Disputes",
    icon: "gavel",
    path: "/user/disputes",
    children: {
      brand: { title: "Disputes", desc: "File and manage property disputes through the official registry." },
      sections: [
        {
          heading: "Manage",
          items: [
            { label: "Dispute",  icon: "report_problem", path: "/user/disputes"      },
          ],
        },
      ],
    },
  },
  {
    label: "Account",
    icon: "manage_accounts",
    children: {
      brand: { title: "Account", desc: "File and manage property disputes through the official registry." },
      sections: [
        {
          heading: "Manage",
          items: [
            { label: "Profile",  icon: "report_problem", path: "/user/account"      },
            { label: "Change Password",  icon: "history",        path: "/user/change-password"   },
          ],
        },
      ],
    },
  },
];

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  .dn-nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 90;
    background: #181818;
    font-family: 'Poppins', sans-serif;
    overflow-x: visible;
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3);
  }

  .dn-inner {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 0 0 2px;
    position: relative;
    gap: 0;
  }

  /* ── Text links ── */
  .dn-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 52px;
  }

  .dn-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 18px;
    height: 52px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.42);
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.2s ease;
    position: relative;
  }

  .dn-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 18px;
    right: 18px;
    height: 1.5px;
    background: #F07060;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }

  .dn-link:hover { color: rgba(255,255,255,0.88); }

  .dn-link-active { color: #fff !important; }
  .dn-link-active::after { transform: scaleX(1); }

  .dn-chevron {
    font-family: 'Material Icons Sharp';
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    color: inherit;
    opacity: 0.5;
    display: inline-block;
    transition: transform 0.22s ease, opacity 0.2s;
  }
  .dn-wrap:hover .dn-chevron,
  .dn-wrap.open .dn-chevron {
    transform: rotate(180deg);
    opacity: 0.9;
  }

  /* ── Dropdown ── */
  .dn-dropdown {
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    background: #1c1c1c;
    border: 1px solid rgba(255,255,255,0.08);
    border-top: none;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.55);
    z-index: 200;
    padding: 28px 0 24px;
    display: none;
    min-width: 500px;
    animation: dn-drop 0.18s ease;
  }

  @keyframes dn-drop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .dn-wrap:hover .dn-dropdown,
  .dn-wrap.open .dn-dropdown { display: flex; }

  .dn-brand {
    width: 200px;
    flex-shrink: 0;
    padding: 4px 28px 8px 28px;
    border-right: 1px solid rgba(255,255,255,0.05);
  }
  .dn-brand-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.45rem;
    font-weight: 600;
    color: #fff;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  .dn-brand-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.73rem;
    font-weight: 300;
    color: rgba(255,255,255,0.35);
    line-height: 1.65;
  }

  .dn-sections {
    flex: 1;
    display: flex;
    padding: 0 12px;
  }
  .dn-section { flex: 1; padding: 0 16px; }
  .dn-section + .dn-section { border-left: 1px solid rgba(255,255,255,0.04); }

  .dn-section-heading {
    font-family: 'Poppins', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
    margin-bottom: 12px;
    padding-left: 2px;
  }

  .dn-item {
    display: block;
    width: 100%;
    padding: 6px 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: rgba(255,255,255,0.65);
    letter-spacing: -0.01em;
    text-align: left;
    transition: color 0.15s ease;
    line-height: 1.4;
    white-space: nowrap;
  }
  .dn-item:hover { color: #fff; }

  /* ── Right badge ── */
  .dn-right {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-right: 20px;
    flex-shrink: 0;
  }
  .dn-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid rgba(240,112,96,0.3);
    border-radius: 4px;
    padding: 5px 12px;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: rgba(240,112,96,0.7);
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Poppins', sans-serif;
  }
  .dn-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #F07060;
    flex-shrink: 0;
    animation: dn-pulse 2.4s ease-in-out infinite;
  }
  @keyframes dn-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  /* ── Mobile ── */
  .dn-mobile-bar   { display: none; }
  .dn-mobile-drawer { display: none; }

  @media (max-width: 768px) {
    .dn-inner { display: none; }

    .dn-mobile-bar {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 16px;
      gap: 10px;
    }
    .dn-mobile-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      padding: 0;
    }
    .dn-mobile-trigger .material-icons-sharp {
      font-size: 18px;
      color: rgba(255,255,255,0.5);
      transition: transform 0.22s ease;
    }
    .dn-mobile-trigger.open .material-icons-sharp { transform: rotate(180deg); }
    .dn-mobile-badge { margin-left: auto; }

    .dn-mobile-drawer {
      display: block;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
      background: #141414;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .dn-mobile-drawer.open { max-height: 900px; }

    .dn-mobile-link {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 20px;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-family: 'Poppins', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: rgba(255,255,255,0.45);
      cursor: pointer;
      text-align: left;
      transition: color 0.15s, padding-left 0.15s;
      position: relative;
    }
    .dn-mobile-link:hover { color: rgba(255,255,255,0.8); padding-left: 24px; }
    .dn-mobile-link.active { color: #F07060; padding-left: 24px; }
    .dn-mobile-link .dn-m-bar {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 2px;
      background: #F07060;
      border-radius: 0 2px 2px 0;
    }
    .dn-mobile-link .material-icons-sharp { font-size: 16px; opacity: 0.5; }

    .dn-mobile-sub {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.22s ease;
      background: rgba(0,0,0,0.2);
    }
    .dn-mobile-sub.open { max-height: 600px; }

    .dn-mobile-sublink {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 20px 10px 48px;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 400;
      color: rgba(255,255,255,0.32);
      cursor: pointer;
      text-align: left;
      transition: color 0.14s;
    }
    .dn-mobile-sublink:hover { color: rgba(255,255,255,0.7); }
    .dn-mobile-sublink .material-icons-sharp { font-size: 14px; opacity: 0.5; }
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Navbar1({ user, onLogout }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mOpen, setMOpen] = useState(false);
  const [mSub, setMSub]   = useState(null);
  const [hovered, setHovered] = useState(null);
  const navRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setHovered(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <nav className="dn-nav" ref={navRef}>

        {/* ═══════ DESKTOP ═══════ */}
        <div className="dn-inner">
          {USER_NAV.map((tab) => {
            const hasDrop = Boolean(tab.children);
            const active  = isActive(tab.path);
            const isOpen  = hovered === tab.path;

            return (
              <div
                key={tab.path}
                className={`dn-wrap${isOpen ? " open" : ""}`}
                onMouseEnter={() => hasDrop && setHovered(tab.path)}
                onMouseLeave={() => hasDrop && setHovered(null)}
              >
                <button
                  className={`dn-link${active ? " dn-link-active" : ""}`}
                  onClick={() => { navigate(tab.path); setHovered(null); }}
                >
                  {tab.label}
                  {hasDrop && (
                    <span className="dn-chevron material-icons-sharp">expand_more</span>
                  )}
                </button>

                {hasDrop && (
                  <div className="dn-dropdown">
                    <div className="dn-brand">
                      <div className="dn-brand-title">{tab.children.brand.title}</div>
                      <div className="dn-brand-desc">{tab.children.brand.desc}</div>
                    </div>
                    <div className="dn-sections">
                      {tab.children.sections.map((sec) => (
                        <div key={sec.heading} className="dn-section">
                          <div className="dn-section-heading">{sec.heading}</div>
                          {sec.items.map((item) => (
                            <button
                              key={item.path}
                              className="dn-item"
                              onClick={() => { navigate(item.path); setHovered(null); }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="dn-right">
            <div className="dn-badge">
              <span className="dn-badge-dot" />
              Live Registry
            </div>
          </div>
        </div>

        {/* ═══════ MOBILE ═══════ */}
        <div className="dn-mobile-bar">
          <button
            className={`dn-mobile-trigger${mOpen ? " open" : ""}`}
            onClick={() => setMOpen(o => !o)}
          >
            <span className="material-icons-sharp">menu</span>
            Navigation
          </button>
          <div className="dn-mobile-badge dn-badge">
            <span className="dn-badge-dot" />
            Live Registry
          </div>
        </div>

        <div className={`dn-mobile-drawer${mOpen ? " open" : ""}`}>
          {USER_NAV.map((tab) => {
            const active   = isActive(tab.path);
            const hasChild = Boolean(tab.children);
            const subOpen  = mSub === tab.path;

            return (
              <div key={tab.path}>
                <button
                  className={`dn-mobile-link${active ? " active" : ""}`}
                  onClick={() => {
                    if (hasChild) {
                      setMSub(subOpen ? null : tab.path);
                    } else {
                      navigate(tab.path);
                      setMOpen(false);
                    }
                  }}
                >
                  {active && <span className="dn-m-bar" />}
                  <span className="material-icons-sharp">{tab.icon}</span>
                  {tab.label}
                  {hasChild && (
                    <span className="material-icons-sharp" style={{
                      marginLeft: "auto", fontSize: "16px", opacity: 0.3,
                      fontStyle: "normal", fontFamily: "'Material Icons Sharp'",
                      transition: "transform 0.2s",
                      transform: subOpen ? "rotate(180deg)" : "none",
                    }}>expand_more</span>
                  )}
                </button>

                {hasChild && (
                  <div className={`dn-mobile-sub${subOpen ? " open" : ""}`}>
                    {tab.children.sections.flatMap(s => s.items).map((item) => (
                      <button
                        key={item.path}
                        className="dn-mobile-sublink"
                        onClick={() => { navigate(item.path); setMOpen(false); setMSub(null); }}
                      >
                        <span className="material-icons-sharp">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </nav>
    </>
  );
}