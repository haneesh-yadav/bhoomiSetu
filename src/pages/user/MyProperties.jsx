import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import Navbar1 from "../../components/Navbar1";

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const FILTERS = [
  { label: "All",          color: "#0D3D2B" },
  { label: "Clear Title",  color: "#2EC4A0" },
  { label: "Encumbered",   color: "#F07060" },
  { label: "Disputed",     color: "#5B4FD4" },
];

const TYPE_META = {
  Residential:  { icon: "home",        bg: "#C8F135" },
  Agricultural: { icon: "grass",       bg: "#2EC4A0" },
  Commercial:   { icon: "business",    bg: "#5B4FD4" },
};

/* ══════════════════════════════════════════════════
   CSS STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #EFEFEB; }
  ::-webkit-scrollbar-thumb {
    background: #0D3D2B;
    border-radius: 4px;
  }

  @keyframes fadeUp {
    from { opacity: 0;
    transform: translateY(16px);
    } to { opacity: 1;
    transform: translateY(0);
    };
  }
  @keyframes float1 {
    0%,100%{transform: translateY(0) rotate(-5deg);
    } 50%{transform: translateY(-10px) rotate(-5deg);
    };
  }
  @keyframes float2 {
    0%,100%{transform: translateY(0) rotate(8deg);
    }  50%{transform: translateY(-8px) rotate(8deg);
    };
  }
  @keyframes slideIn {
    from{opacity: 0;
    transform: translateX(-10px);
    } to{opacity: 1;
    transform: translateX(0);
    };
  }

  /* ── Material Icon helper ── */
  .mi {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  /* ── Page ── */
  .mp-page {
    font-family: 'Poppins', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  /* ── Slim page header ── */
  .mp-header {
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .mp-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .mp-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .mp-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .mp-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .mp-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Toolbar ── */
  .mp-body {
    position: relative;
    z-index: 2;
    background: #fff;
    border-bottom: 1px solid rgba(13,61,43,0.08);
  }
  .mp-body-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .mp-toolbar {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding:1rem 2.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .mp-search-wrap {
    flex: 1;
    min-width: 200px;
    position: relative;
  }
  .mp-search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.35;
  }
  .mp-search-icon .mi {
    font-size: 1.1rem;
    color: #0D3D2B;
  }
  .mp-search {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.4rem;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    font-size: 0.85rem;
    font-family: inherit;
    font-weight: 500;
    color: #0D3D2B;
    outline: none;
    transition: border-color 0.2s;
  }
  .mp-search:focus {
    border-color: #0D3D2B;
    background: #fff;
  }
  .mp-search::placeholder { color: rgba(13,61,43,0.32); }
  .mp-filter-group {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .mp-pill {
    padding: 0.42rem 0.9rem;
    border-radius: 20px;
    border:2px solid rgba(13,61,43,0.18);
    background: #fff;
    color: rgba(13,61,43,0.5);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space:nowrap;
  }
  .mp-pill:hover {
    border-color: #0D3D2B;
    color: #0D3D2B;
  }
  .mp-pill-active {
    color: #fff;
    border-color: transparent;
  }
  .mp-result-count {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(13,61,43,0.35);
    white-space: nowrap;
    margin-left: auto;
  }

  /* ── Property grid ── */
  .mp-grid-wrap {
    padding: 2rem 2.5rem;
    background: #EFEFEB;
    position: relative;
    z-index: 2;
  }
  .mp-grid-wrap-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .mp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(350px,1fr));
    gap: 1.5rem;
  }

  /* ── Property card ── */
  .mp-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
    transition:transform 0.2s, box-shadow 0.2s;
    animation:fadeUp 0.4s ease both;
    display: flex;
    flex-direction: column;
  }
  .mp-card:hover {
    transform: translateY(-4px);
    box-shadow: 7px 7px 0 #0D3D2B;
  }

  /* Card chrome top bar */
  .mp-card-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 10px 0;
    gap: 5px;
    background:#F0F0EC;
  }
  .mp-card-chrome-tab {
    height: 24px;
    border-radius: 6px 6px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 10px;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.06em;
  }
  .mp-card-chrome-tab .mi { font-size: 0.85rem; }
  .mp-card-chrome-dots {
    flex: 1;
    display: flex;
    gap: 4px;
    align-items: center;
    padding-bottom: 4px;
    margin-left: 6px;
  }
  .mp-card-chrome-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 1.5px solid rgba(13,61,43,0.1);
  }

  /* Card body */
  .mp-card-body {
    padding: 1.1rem 1.25rem;
    flex: 1;
  }
  .mp-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.85rem;
  }
  .mp-card-type-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.06em;
  }
  .mp-card-type-pill .mi { font-size: 0.9rem; }
  .mp-card-status {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 6px;
    padding: 2px 9px;
    font-size: 0.62rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .mp-card-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(13,61,43,0.35);
    letter-spacing: 0.06em;
    margin-bottom: 0.25rem;
  }
  .mp-card-title {
    font-size: 1rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 0.35rem;
  }
  .mp-card-addr {
    font-size: 0.75rem;
    color: rgba(13,61,43,0.5);
    line-height: 1.45;
    margin-bottom: 1rem;
  }

  /* 2×2 chip grid */
  .mp-card-chips {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .mp-chip {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    padding: 0.45rem 0.65rem;
  }
  .mp-chip-label {
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.38);
    margin-bottom: 0.1rem;
  }
  .mp-chip-value {
    font-size: 0.8rem;
    font-weight: 700;
    color: #0D3D2B;
  }

  /* Warning strip */
  .mp-card-warning {
    background: rgba(240,112,96,0.08);
    border-top: 2px solid rgba(240,112,96,0.35);
    padding: 0.4rem 1.25rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: #C0392B;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .mp-card-warning .mi { font-size: 1rem; }

  /* Card footer */
  .mp-card-footer {
    border-top: 1px solid rgba(13,61,43,0.08);
    padding:0.55rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background:#F8F8F4;
  }
  .mp-card-hash {
    font-family: 'DM Mono',monospace;
    font-size: 0.58rem;
    color: #5B4FD4;
  }
  .mp-card-cta {
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D3D2B;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  /* ── Empty state ── */
  .mp-empty {
    text-align: center;
    padding: 5rem 2rem;
    border: 2.5px dashed rgba(13,61,43,0.2);
    border-radius: 16px;
    background: #fff;
  }
  .mp-empty-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    opacity: 0.4;
  }
  .mp-empty-icon .mi {
    font-size: 3rem;
    color: #0D3D2B;
  }
  .mp-empty-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.4rem;
  }
  .mp-empty-sub {
    font-size: 0.85rem;
    color: rgba(13,61,43,0.45);
  }

  /* ══ PAGE CONTAINER ══ */
  .page-container {
    margin: 1.5rem 2rem 2rem;
    border-radius: 16px;
    overflow: hidden;
    border: 1.5px solid rgba(13,61,43,0.12);
    box-shadow: 0 4px 6px rgba(13,61,43,0.04), 0 20px 40px rgba(13,61,43,0.08);
    background: #f7f7f3;
    position: relative;
    z-index: 2;
  }

  /* ── RESPONSIVE ── */
  @media (max-width:768px) {
    .mp-toolbar {
      padding: 0.85rem 1rem;
      flex-direction: column;
      align-items: stretch;
    }
    .mp-grid-wrap { padding: 1.25rem 1rem 2.5rem; }
    .mp-grid { grid-template-columns: 1fr; }
    .mp-filter-group {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 4px;
    }
    .mp-result-count { margin-left: 0; }
    .page-container {
      margin: 1rem;
      border-radius: 12px;
    }
  }
  @media (max-width:480px) {
    .mp-card-chips { grid-template-columns: 1fr 1fr; }
    .page-container {
      margin: 0.65rem;
      border-radius: 10px;
    }
  }
`;

/* ══════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════ */
const MIcon = ({ name, className = "" }) => (
  <span className={`mi ${className}`}>{name}</span>
);

const Cursor = () => (
  <svg width="22" height="26" viewBox="0 0 28 32" fill="none">
    <path d="M4 2L4 24L10 18L14 28L17 27L13 17L22 17L4 2Z" fill="white" stroke="#0D3D2B" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

/* ══════════════════════════════════════════════════
   MY PROPERTIES COMPONENT
══════════════════════════════════════════════════ */
export default function MyProperties() {
  const { user, logout } = useAuth();

  const [search,       setSearch] = useState("");
  const [activeFilter, setFilter] = useState("All");

  const allProperties = user ? getPropertiesByOwner(user.id) : [];

  const filtered = allProperties.filter(p => {
    const matchesFilter =
      activeFilter === "All"         ? true :
      activeFilter === "Clear Title" ? p.status === "Clear Title" :
      activeFilter === "Encumbered"  ? p.encumbrance :
      activeFilter === "Disputed"    ? p.disputeActive : true;

    const q = search.toLowerCase();
    const matchesSearch = !q ||
      p.id.toLowerCase().includes(q)       ||
      p.title.toLowerCase().includes(q)    ||
      p.district.toLowerCase().includes(q) ||
      p.surveyNo.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <style>{styles}</style>

      <div className="mp-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

          {/* ══ PAGE HEADER ══ */}
          <div className="mp-header">
            <div className="mp-header-left">
              <span className="mp-page-title">My Properties</span>
              <span className="mp-page-sub">{allProperties.length} propert{allProperties.length === 1 ? "y" : "ies"} registered</span>
            </div>
            <div className="mp-header-right">
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(13,61,43,0.45)" }}>
                {allProperties.length} propert{allProperties.length === 1 ? "y" : "ies"}
              </span>
            </div>
          </div>

          {/* ══ TOOLBAR ══ */}
          <div className="mp-body">
            <div className="mp-body-inner">
              <div className="mp-toolbar">
                <div className="mp-search-wrap">
                  <span className="mp-search-icon">
                    <MIcon name="search" />
                  </span>
                  <input
                    className="mp-search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by ID, title, district, survey number..."
                  />
                </div>
                <span className="mp-result-count">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* ══ PROPERTY GRID ══ */}
          <div className="mp-grid-wrap">
            <div className="mp-grid-wrap-inner">
              {filtered.length === 0 ? (
                <div className="mp-empty">
                  <div className="mp-empty-icon">
                    <MIcon name="home_work" />
                  </div>
                  <div className="mp-empty-title">No properties found</div>
                  <div className="mp-empty-sub">Try adjusting your search or filter.</div>
                </div>
              ) : (
                <div className="mp-grid">
                  {filtered.map((p, i) => {
                    const typeMeta = TYPE_META[p.type] || { icon: "home", bg: "#C8F135" };
                    return (
                      <div
                        key={p.id}
                        className="mp-card"
                        style={{ animationDelay: `${i * 0.06}s` }}
                        onClick={() => navigate(`/property/${p.id}`)}
                      >
                        {/* Browser chrome top */}
                        <div className="mp-card-chrome">
                          <div
                            className="mp-card-chrome-tab"
                            style={{ background: typeMeta.bg, minWidth: 80 }}
                          >
                            <MIcon name={typeMeta.icon} /> {p.type}
                          </div>
                          <div className="mp-card-chrome-dots">
                            <div className="mp-card-chrome-dot" style={{ background: p.statusColor }} />
                            <div className="mp-card-chrome-dot" style={{ background: "#C8F135" }} />
                            <div className="mp-card-chrome-dot" />
                          </div>
                        </div>

                        {/* Body */}
                        <div className="mp-card-body">
                          <div className="mp-card-head">
                            <div className="mp-card-type-pill" style={{ background: `${typeMeta.bg}30` }}>
                              <MIcon name={typeMeta.icon} />
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.58rem" }}>
                                {p.id.split("-")[1]}
                              </span>
                            </div>
                            <div className="mp-card-status" style={{ background: p.statusColor, color: "#0D3D2B" }}>
                              {p.status}
                            </div>
                          </div>

                          <div className="mp-card-id">{p.id}</div>
                          <div className="mp-card-title">{p.title}</div>
                          <div className="mp-card-addr">{p.address}</div>

                          <div className="mp-card-chips">
                            <div className="mp-chip" style={{ background: `${typeMeta.bg}18` }}>
                              <div className="mp-chip-label">AREA</div>
                              <div className="mp-chip-value">{p.area}</div>
                            </div>
                            <div className="mp-chip">
                              <div className="mp-chip-label">SURVEY NO.</div>
                              <div className="mp-chip-value">{p.surveyNo}</div>
                            </div>
                            <div className="mp-chip">
                              <div className="mp-chip-label">REGISTERED</div>
                              <div className="mp-chip-value">{p.registeredOn}</div>
                            </div>
                            <div className="mp-chip" style={{ background: "#0D3D2B" }}>
                              <div className="mp-chip-label" style={{ color: "rgba(255,255,255,0.45)" }}>MARKET VALUE</div>
                              <div className="mp-chip-value" style={{ color: "#C8F135" }}>{p.marketValue}</div>
                            </div>
                          </div>
                        </div>

                        {/* Dispute / encumbrance warning */}
                        {(p.disputeActive || p.encumbrance) && (
                          <div className="mp-card-warning">
                            <MIcon name="warning" />
                            {p.disputeActive ? "Active dispute on this property" : "Encumbrance recorded"}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mp-card-footer">
                          <span className="mp-card-hash">{p.hash.slice(0, 20)}...</span>
                          <span className="mp-card-cta">View Details <Cursor /></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
