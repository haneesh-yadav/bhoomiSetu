import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuditLog } from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

const CATEGORY_META = {
  approval:  { label: "Approval",      icon: "check_circle",  color: "#2EC4A0" },
  review:    { label: "Review",        icon: "manage_search", color: "#C8F135" },
  clarify:   { label: "Clarification", icon: "feedback",      color: "#5B4FD4" },
  dispute:   { label: "Dispute",       icon: "gavel",         color: "#F07060" },
  mutation:  { label: "Mutation",      icon: "edit_document", color: "#9B8FFF" },
  rejection: { label: "Rejection",     icon: "cancel",        color: "#F07060" },
};

const FILTERS = ["All", "Approvals", "Reviews", "Disputes", "Mutations"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #EFEFEB; }
  ::-webkit-scrollbar-thumb { background: #0D3D2B; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Page shell ── */
  .al-page {
    font-family: 'Poppins', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  /* ── Page container ── */
  .page-container {
    margin: 1.5rem 2rem 2rem;
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid rgba(13,61,43,0.12);
    box-shadow: 0 4px 6px rgba(13,61,43,0.04), 0 20px 40px rgba(13,61,43,0.08);
    background: #f7f7f3;
    position: relative;
    z-index: 2;
  }

  /* ── Header ── */
  .al-header {
    background: #fff;
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .al-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .al-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .al-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
  }

  .al-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }

  .al-page-sub {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Filter tabs ── */
  .al-filter-tabs {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .al-filter-tab {
    padding: 0.35rem 0.85rem;
    border: 1.5px solid rgba(13, 61, 43, 0.18);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(13, 61, 43, 0.5);
    background: #fff;
    font-family: 'Poppins', sans-serif;
    transition: all 0.18s;
  }

  .al-filter-tab:hover {
    border-color: #0D3D2B;
  }

  .al-filter-active {
    background: #0D3D2B;
    color: #fff;
    border-color: #0D3D2B;
    font-weight: 700;
  }

  /* ── Export button ── */
  .al-export-btn {
    padding: 0.38rem 1rem;
    border: 1.5px solid rgba(13, 61, 43, 0.2);
    border-radius: 8px;
    background: #fff;
    color: #0D3D2B;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
  }

  .al-export-btn:hover {
    background: #0D3D2B;
    color: #C8F135;
    border-color: #0D3D2B;
  }

  /* ── Toolbar ── */
  .al-toolbar {
    background: rgba(13,61,43,0.02);
    border-bottom: 1.5px solid rgba(13, 61, 43, 0.1);
  }

  .al-toolbar-inner {
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .al-search-wrap {
    flex: 1;
    min-width: 200px;
    position: relative;
  }

  .al-search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    opacity: 0.3;
    pointer-events: none;
  }

  .al-search {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.4rem;
    border: 2px solid rgba(13, 61, 43, 0.18);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    font-size: 0.85rem;
    font-family: inherit;
    color: #0D3D2B;
    outline: none;
    transition: border-color 0.2s;
  }

  .al-search:focus { border-color: #0D3D2B; }
  .al-search::placeholder { color: rgba(13, 61, 43, 0.32); }

  .al-count {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(13, 61, 43, 0.4);
    white-space: nowrap;
  }

  /* ── Content ── */
  .al-content {
    padding: 1.5rem 1.5rem 3rem;
  }

  /* ── Timeline ── */
  .al-timeline {
    position: relative;
  }

  .al-timeline::before {
    content: '';
    position: absolute;
    left: 22px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: rgba(13, 61, 43, 0.1);
    border-radius: 2px;
  }

  .al-entry {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease both;
    position: relative;
  }

  .al-entry:last-child { margin-bottom: 0; }

  .al-dot-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    z-index: 1;
  }

  .al-dot {
    width: 46px;
    height: 46px;
    border: 1px solid rgba(13,61,43,0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(13,61,43,0.06);
    transition: transform 0.18s;
    background: #fff;
  }

  .al-entry:hover .al-dot { transform: scale(1.05); }

  /* ── Log card ── */
  .al-card {
    flex: 1;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .al-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .al-card-chrome {
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .al-card-tab {
    height: 20px;
    border-radius: 4px 4px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 8px;
    font-size: 0.58rem;
    font-weight: 800;
  }

  .al-card-top {
    padding: 0.9rem 1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .al-card-action {
    font-size: 0.92rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .al-card-txn {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(13, 61, 43, 0.35);
    margin-bottom: 0.25rem;
  }

  .al-card-prop {
    font-size: 0.75rem;
    color: rgba(13, 61, 43, 0.5);
    margin-bottom: 0.25rem;
  }

  .al-card-notes {
    font-size: 0.72rem;
    color: rgba(13, 61, 43, 0.4);
    line-height: 1.4;
    font-style: italic;
  }

  .al-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
    flex-shrink: 0;
  }

  .al-card-time {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(13, 61, 43, 0.38);
    white-space: nowrap;
  }

  .al-cat-badge {
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.62rem;
    font-weight: 800;
    border: 1.5px solid;
    white-space: nowrap;
  }

  .al-card-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.07);
    padding: 0.5rem 1.25rem;
    display: flex;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .al-card-actor {
    font-size: 0.65rem;
    color: rgba(13, 61, 43, 0.4);
    font-weight: 600;
  }

  .al-card-hash {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #5B4FD4;
  }

  /* ── Empty state ── */
  .al-empty {
    text-align: center;
    padding: 4rem 2rem;
    border: 1.5px dashed rgba(13, 61, 43, 0.12);
    border-radius: 14px;
    background: #fff;
  }

  .al-empty-icon  { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.3; }
  .al-empty-title { font-size: 1rem; font-weight: 800; color: #0D3D2B; margin-bottom: 0.3rem; }
  .al-empty-sub   { font-size: 0.82rem; color: rgba(13, 61, 43, 0.45); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .page-container { margin: 1rem; border-radius: 12px; }
    .al-content { padding: 1.25rem 1rem 3rem; }
    .al-toolbar-inner { padding: 0.85rem 1rem; }
    .al-timeline::before { left: 18px; }
    .al-dot { width: 38px; height: 38px; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function AuditLog() {
  const { user, logout } = useAuth();

  const [activeFilter, setFilter] = useState("All");
  const [search, setSearch]       = useState("");

  const allEntries = getAuditLog();

  const filtered = allEntries.filter(entry => {
    const matchFilter =
      activeFilter === "All"       ? true :
      activeFilter === "Approvals" ? entry.category === "approval" :
      activeFilter === "Reviews"   ? entry.category === "review"   :
      activeFilter === "Disputes"  ? entry.category === "dispute"  :
      activeFilter === "Mutations" ? entry.category === "mutation" : true;

    const q = search.toLowerCase();
    return matchFilter && (
      !q ||
      entry.action.toLowerCase().includes(q) ||
      entry.txnId.toLowerCase().includes(q) ||
      entry.propertyId.toLowerCase().includes(q) ||
      entry.propertyTitle.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{styles}</style>
      <div className="al-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Header */}
          <div className="al-header">
            <div className="al-header-left">
              <span className="al-page-label">AUDIT LOG</span>
              <span className="al-page-title">Audit Log</span>
              <span className="al-page-sub">Immutable record of all registrar actions</span>
            </div>
            <div className="al-header-right">
              <div className="al-filter-tabs">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`al-filter-tab ${activeFilter === f ? "al-filter-active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                className="al-export-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                onClick={() => {}}
              >
                <span className="material-icons-sharp" style={{ fontSize: 15 }}>download</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="al-toolbar">
            <div className="al-toolbar-inner">
              <div className="al-search-wrap">
                <span className="al-search-icon material-icons-sharp">search</span>
                <input
                  className="al-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by action, transaction ID, property..."
                />
              </div>
              <span className="al-count">
                {filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="al-content">
            {filtered.length === 0 ? (
              <div className="al-empty">
                <div className="al-empty-icon">
                  <span className="material-icons-sharp" style={{ fontSize: 48, color: "rgba(13,61,43,0.2)" }}>history</span>
                </div>
                <div className="al-empty-title">No entries found</div>
                <div className="al-empty-sub">Try adjusting your search or filter.</div>
              </div>
            ) : (
              <div className="al-timeline">
                {filtered.map((entry, i) => {
                  const meta = CATEGORY_META[entry.category] || CATEGORY_META["approval"];
                  return (
                    <div key={entry.id} className="al-entry" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="al-dot-wrap">
                        <div className="al-dot" style={{ background: `${meta.color}18` }}>
                          <span className="material-icons-sharp" style={{ fontSize: 20, color: meta.color }}>
                            {meta.icon}
                          </span>
                        </div>
                      </div>
                      <div className="al-card">
                        <div className="al-card-chrome">
                          <div className="al-card-tab" style={{ background: meta.color, color: "#0D3D2B", minWidth: 90 }}>
                            {meta.label}
                          </div>
                        </div>
                        <div className="al-card-top">
                          <div>
                            <div className="al-card-action">{entry.action}</div>
                            <div className="al-card-txn">{entry.txnId} · {entry.propertyId}</div>
                            <div className="al-card-prop">{entry.propertyTitle}</div>
                            <div className="al-card-notes">"{entry.notes}"</div>
                          </div>
                          <div className="al-card-right">
                            <span className="al-card-time">{entry.timestamp}</span>
                            <span
                              className="al-cat-badge"
                              style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}40` }}
                            >
                              {meta.label}
                            </span>
                          </div>
                        </div>
                        <div className="al-card-footer">
                          <span className="al-card-actor">by {entry.actor}</span>
                          <span className="al-card-hash">{entry.hash}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
