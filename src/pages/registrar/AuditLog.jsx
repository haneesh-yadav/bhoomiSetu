import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar2 from "../../components/Navbar2";

/* ══════════════════════════════════════════════════
   CATEGORY META
══════════════════════════════════════════════════ */
const CATEGORY_META = {
  approval:  { label: "Approval",      icon: "check_circle",  color: "#2EC4A0" },
  review:    { label: "Review",        icon: "manage_search", color: "#C8F135" },
  clarify:   { label: "Clarification", icon: "feedback",      color: "#5B4FD4" },
  dispute:   { label: "Dispute",       icon: "gavel",         color: "#F07060" },
  mutation:  { label: "Mutation",      icon: "edit_document", color: "#9B8FFF" },
  rejection: { label: "Rejection",     icon: "cancel",        color: "#F07060" },
};

const FILTERS = ["All", "Approvals", "Reviews", "Disputes", "Mutations"];

/* ══════════════════════════════════════════════════
   CSS  — mirrors RegistrarDashboard design tokens
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mi {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .al-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .al-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .al-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 10px; flex-shrink: 0;
  }
  .al-heading { font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px; }
  .al-heading span { color: #5B4FD4; }
  .al-topbar-right { display: flex; align-items: center; gap: 8px; }
  .al-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .al-meta-chip .mi { font-size: 13px; color: #aaa; }
  .al-export-btn {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .al-export-btn:hover { background: #2a2a2a; }
  .al-export-btn .mi { font-size: 14px; }

  /* ══ STAT STRIP ══ */
  .al-stats { display: flex; gap: 12px; flex-shrink: 0; }
  .al-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .al-stat.dark   { background: #1a1a1a; }
  .al-stat.light  { background: #f0f0f0; }
  .al-stat.purple { background: #1e1a38; }
  .al-stat.teal   { background: #0d2420; }
  .al-stat-glow   { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .al-stat-label  { font-size: 10.5px; font-weight: 500; color: #999; }
  .al-stat.dark .al-stat-label,
  .al-stat.purple .al-stat-label,
  .al-stat.teal .al-stat-label   { color: #555; }
  .al-stat-value  { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .al-stat.dark .al-stat-value   { color: #fff; }
  .al-stat.purple .al-stat-value { color: #c8c2ff; }
  .al-stat.teal .al-stat-value   { color: #6effc2; }
  .al-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .al-stat.dark .al-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .al-stat.purple .al-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .al-stat.teal .al-stat-badge   { color: #2EC4A0; background: rgba(46,196,160,0.15); }

  /* ══ FILTER + SEARCH ZONE ══ */
  .al-controls-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    padding: 12px 16px;
    display: flex; align-items: center;
    gap: 12px; flex-wrap: wrap;
  }
  .al-filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .al-filter-tab {
    padding: 5px 13px;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px; cursor: pointer;
    font-size: 11px; font-weight: 600; color: #888;
    background: #f0f0f0;
    font-family: 'Poppins', sans-serif;
    transition: all 0.15s;
  }
  .al-filter-tab:hover { border-color: #1a1a1a; color: #1a1a1a; }
  .al-filter-active {
    background: #1a1a1a; color: #fff;
    border-color: #1a1a1a; font-weight: 700;
  }

  .al-search-wrap {
    flex: 1; min-width: 180px; position: relative;
  }
  .al-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .al-search-icon .mi { font-size: 16px; color: #aaa; }
  .al-search {
    width: 100%;
    padding: 7px 12px 7px 32px;
    border: 1.5px solid #e0e0e0;
    border-radius: 11px;
    background: #f0f0f0;
    font-size: 11.5px; font-family: inherit; color: #1a1a1a;
    outline: none; transition: border-color 0.2s;
  }
  .al-search:focus { border-color: #5B4FD4; }
  .al-search::placeholder { color: #bbb; }

  .al-count {
    font-size: 10.5px; font-weight: 700; color: #aaa;
    white-space: nowrap; font-family: 'DM Mono', monospace;
  }

  /* ══ TIMELINE ZONE ══ */
  .al-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .al-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .al-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .al-zone-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .al-zone-title span { color: #5B4FD4; }
  .al-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .al-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: #2EC4A0;
  }
  .al-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #2EC4A0;
    animation: pulse 2s infinite;
  }

  /* ══ TIMELINE ══ */
  .al-timeline { position: relative; display: flex; flex-direction: column; gap: 8px; }
  .al-timeline::before {
    content: '';
    position: absolute;
    left: 21px; top: 8px; bottom: 8px;
    width: 2px;
    background: #e0e0e0;
    border-radius: 2px;
  }

  .al-entry {
    display: flex; gap: 12px;
    animation: fadeUp 0.3s ease both;
    position: relative;
  }

  /* ── Timeline dot ── */
  .al-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; z-index: 1; }
  .al-dot {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
  .al-dot .mi { font-size: 20px; }
  .al-entry:hover .al-dot { transform: scale(1.07); }

  /* ── Log card ── */
  .al-card {
    flex: 1;
    background: #f0f0f0; border-radius: 18px;
    padding: 12px 14px;
    display: flex; flex-direction: column; gap: 8px;
    transition: transform 0.15s, box-shadow 0.15s;
    overflow: hidden;
  }
  .al-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .al-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px;
  }
  .al-card-action {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3; margin-bottom: 2px;
  }
  .al-card-txn {
    font-family: 'DM Mono', monospace;
    font-size: 9px; color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .al-card-prop  { font-size: 10.5px; font-weight: 500; color: #888; margin-bottom: 2px; }
  .al-card-notes { font-size: 10px; color: #aaa; line-height: 1.5; font-style: italic; }

  .al-card-right {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: 5px; flex-shrink: 0;
  }
  .al-card-time {
    font-family: 'DM Mono', monospace;
    font-size: 8.5px; font-weight: 600; color: #5B4FD4; white-space: nowrap;
  }
  .al-cat-badge {
    font-size: 9px; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; border: 1.5px solid transparent; white-space: nowrap;
    display: flex; align-items: center; gap: 3px;
  }
  .al-cat-badge .mi { font-size: 11px; }

  .al-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .al-card-actor { font-size: 9px; font-weight: 600; color: #aaa; }
  .al-card-hash  { font-family: 'DM Mono', monospace; font-size: 9px; color: #5B4FD4; }

  /* ── Empty state ── */
  .al-empty {
    text-align: center; padding: 48px 24px;
    background: #f0f0f0; border-radius: 18px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .al-empty .mi   { font-size: 40px; color: #ccc; }
  .al-empty-title { font-size: 14px; font-weight: 800; color: #1a1a1a; }
  .al-empty-sub   { font-size: 11px; color: #aaa; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .al-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  }
  @media (max-width: 580px) {
    .al-main { padding: 10px 10px 80px; gap: 10px; }
    .al-topbar { flex-direction: column; align-items: flex-start; }
    .al-timeline::before { left: 17px; }
    .al-dot { width: 36px; height: 36px; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function AuditLog() {
  const { user, logout } = useAuth();

  const [activeFilter, setFilter] = useState("All");
  const [search, setSearch]       = useState("");

  const allEntries = [];

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
      entry.action.toLowerCase().includes(q)        ||
      entry.txnId.toLowerCase().includes(q)         ||
      entry.propertyId.toLowerCase().includes(q)    ||
      entry.propertyTitle.toLowerCase().includes(q)
    );
  });

  const approvalCount = allEntries.filter(e => e.category === "approval").length;
  const disputeCount  = allEntries.filter(e => e.category === "dispute").length;
  const mutationCount = allEntries.filter(e => e.category === "mutation").length;

  return (
    <>
      <style>{styles}</style>
      <div className="al-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="al-main">

          {/* ══ TOP BAR ══ */}
          <div className="al-topbar">
            <div className="al-heading">
              Audit <span>Log</span>
            </div>
            <div className="al-topbar-right">
              {user?.district && (
                <div className="al-meta-chip">
                  <MI name="location_on" /> {user.district}
                </div>
              )}
              <div className="al-meta-chip">
                <MI name="history" /> {allEntries.length} entries
              </div>
              <button className="al-export-btn" onClick={() => {}}>
                <MI name="download" /> Export CSV
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="al-stats">
            <div className="al-stat dark">
              <div className="al-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="al-stat-label">Total Entries</div>
              <div className="al-stat-value">{allEntries.length}</div>
              <div className="al-stat-badge">on-chain</div>
            </div>
            <div className="al-stat teal">
              <div className="al-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(46,196,160,0.2) 0%, transparent 60%)" }} />
              <div className="al-stat-label">Approvals</div>
              <div className="al-stat-value">{approvalCount}</div>
              <div className="al-stat-badge">completed</div>
            </div>
            <div className="al-stat light">
              <div className="al-stat-label">Disputes</div>
              <div className="al-stat-value">{disputeCount}</div>
              <div className="al-stat-badge">logged</div>
            </div>
            <div className="al-stat purple">
              <div className="al-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
              <div className="al-stat-label">Mutations</div>
              <div className="al-stat-value">{mutationCount}</div>
              <div className="al-stat-badge">recorded</div>
            </div>
          </div>

          {/* ══ FILTER + SEARCH ══ */}
          <div className="al-controls-zone">
            <div className="al-filter-tabs">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`al-filter-tab${activeFilter === f ? " al-filter-active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="al-search-wrap">
              <span className="al-search-icon"><MI name="search" /></span>
              <input
                className="al-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by action, TXN ID, property…"
              />
            </div>
            <span className="al-count">{filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}</span>
          </div>

          {/* ══ TIMELINE ZONE ══ */}
          <div className="al-zone">
            <div className="al-zone-header">
              <div className="al-zone-title-row">
                <div className="al-zone-title">Immutable <span>Record</span></div>
                <div className="al-zone-pill">{filtered.length} shown</div>
              </div>
              <div className="al-live">
                <span className="al-live-dot" /> LIVE
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="al-empty">
                <MI name="history" />
                <div className="al-empty-title">No entries found</div>
                <div className="al-empty-sub">Try adjusting your search or filter.</div>
              </div>
            ) : (
              <div className="al-timeline">
                {filtered.map((entry, i) => {
                  const meta = CATEGORY_META[entry.category] || CATEGORY_META["approval"];
                  return (
                    <div key={entry.id} className="al-entry" style={{ animationDelay: `${i * 0.04}s` }}>

                      {/* Timeline dot */}
                      <div className="al-dot-wrap">
                        <div className="al-dot" style={{ background: `${meta.color}18` }}>
                          <MI name={meta.icon} style={{ color: meta.color }} />
                        </div>
                      </div>

                      {/* Log card */}
                      <div className="al-card">
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
                              style={{
                                background: `${meta.color}15`,
                                color: meta.color,
                                borderColor: `${meta.color}50`,
                              }}
                            >
                              <MI name={meta.icon} />
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