import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import Navbar2 from "../../components/Navbar2";
/* ══════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════ */
const ACTIVITY = [
  { icon: "check_circle",  label: "Transfer Approved",       sub: "TN-4521-CHN-2019 · Ownership updated",       date: "12 Jan 2024", color: "#2EC4A0" },
  { icon: "manage_search", label: "Review Started",          sub: "TXN-2024-004 · Under document verification", date: "17 Mar 2024", color: "#C8F135" },
  { icon: "gavel",         label: "Dispute Assigned",        sub: "DSP-2024-002 · Ownership dispute opened",    date: "14 Feb 2024", color: "#F07060" },
  { icon: "feedback",      label: "Clarification Requested", sub: "TXN-2024-003 · Fresh Patta copy requested",  date: "18 Mar 2024", color: "#5B4FD4" },
];

/* ══════════════════════════════════════════════════
   CSS
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
  .rd-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .rd-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .rd-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .rd-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .rd-heading span { color: #5B4FD4; }
  .rd-topbar-right {
    display: flex; align-items: center; gap: 8px;
  }
  .rd-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .rd-meta-chip .mi { font-size: 13px; color: #aaa; }
  .rd-add-btn {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .rd-add-btn:hover { background: #2a2a2a; }
  .rd-add-btn .mi { font-size: 14px; }

  /* ══ STAT STRIP ══ */
  .rd-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .rd-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .rd-stat.light  { background: #f0f0f0; }
  .rd-stat.dark   { background: #1a1a1a; }
  .rd-stat.purple { background: #1e1a38; }
  .rd-stat.orange { background: #2a1a10; }
  .rd-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .rd-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .rd-stat.dark .rd-stat-label,
  .rd-stat.purple .rd-stat-label,
  .rd-stat.orange .rd-stat-label { color: #555; }
  .rd-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .rd-stat.dark .rd-stat-value   { color: #fff; }
  .rd-stat.purple .rd-stat-value { color: #c8c2ff; }
  .rd-stat.orange .rd-stat-value { color: #ffb380; }
  .rd-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .rd-stat.dark .rd-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .rd-stat.purple .rd-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .rd-stat.orange .rd-stat-badge { color: #ffb380; background: rgba(255,140,80,0.18); }

  /* ══ QUICK ACTIONS ══ */
  .rd-actions-row {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .rd-action-btn {
    display: flex; align-items: center; gap: 7px;
    border: none; border-radius: 13px;
    padding: 10px 16px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .rd-action-btn .mi { font-size: 15px; }
  .rd-action-btn.primary   { background: #1a1a1a; color: #fff; }
  .rd-action-btn.primary:hover { background: #2a2a2a; }
  .rd-action-btn.ghost {
    background: #f0f0f0; color: #555;
  }
  .rd-action-btn.ghost:hover { background: #e8e8e8; color: #111; }
  .rd-action-btn.purple-btn { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .rd-action-btn.purple-btn:hover { background: rgba(91,79,212,0.18); }

  /* ══ TWO-COLUMN LAYOUT ══ */
  .rd-content-row {
    display: flex; gap: 12px; align-items: flex-start;
  }
  .rd-col-left  { flex: 2; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .rd-col-right { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }

  /* ══ SECTION ZONE ══ */
  .rd-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .rd-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .rd-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .rd-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .rd-zone-title span { color: #5B4FD4; }
  .rd-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .rd-zone-link {
    font-size: 10.5px; font-weight: 600; color: #888;
    background: none; border: none; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; gap: 3px;
    transition: color 0.15s;
  }
  .rd-zone-link:hover { color: #1a1a1a; }
  .rd-zone-link .mi { font-size: 13px; }

  /* ══ QUEUE CARDS ══ */
  .rd-queue-list { display: flex; flex-direction: column; gap: 8px; }
  .rd-queue-card {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
  }
  .rd-queue-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .rd-queue-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .rd-queue-type-pill {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    display: inline-flex; align-items: center; flex-shrink: 0;
  }
  .rd-queue-type-high   { color: #c0392b; background: rgba(240,80,80,0.12); }
  .rd-queue-type-normal { color: #2a7a55; background: rgba(46,196,160,0.13); }

  .rd-queue-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .rd-queue-title {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .rd-queue-parties { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 1px; }

  .rd-queue-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;
  }
  .rd-pri-high   { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #a89fff; background: rgba(124,110,245,0.18); }
  .rd-pri-normal { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #2a7a55; background: #e6f8ef; }
  .rd-queue-value { font-size: 10.5px; font-weight: 700; color: #555; font-family: 'DM Mono', monospace; }

  .rd-queue-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .rd-queue-date { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4; }
  .rd-queue-docs { font-size: 9px; font-weight: 600; color: #aaa; }
  .rd-review-btn {
    font-size: 10px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 3px;
  }
  .rd-review-btn .mi { font-size: 13px; }

  /* ══ ACTIVITY FEED (full-width) ══ */
  .rd-activity-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0; border-radius: 24px; overflow: hidden;
  }
  .rd-activity-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid #e8e8e8;
  }
  .rd-activity-head-left { display: flex; align-items: center; gap: 8px; }
  .rd-activity-head-dot  { width: 6px; height: 6px; border-radius: 50%; background: #1a1a1a; }
  .rd-activity-head-txt  { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase; }
  .rd-activity-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
  }
  .rd-activity-item {
    padding: 14px 16px; display: flex; flex-direction: column; gap: 5px;
    border-right: 1px solid #e8e8e8; transition: background 0.15s;
  }
  .rd-activity-item:last-child { border-right: none; }
  .rd-activity-item:hover { background: rgba(0,0,0,0.02); }
  .rd-activity-icon-row { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .rd-activity-color-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .rd-activity-icon-wrap {
    width: 24px; height: 24px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .rd-activity-icon-wrap .mi { font-size: 13px; }
  .rd-activity-label { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .rd-activity-sub   { font-size: 10px; color: #999; line-height: 1.5; }
  .rd-activity-date  { font-size: 9px; font-weight: 600; color: #bbb; margin-top: 3px; font-family: 'DM Mono', monospace; }

  /* ══ TRANSFER / LIST ROWS ══ */
  .rd-list-rows { display: flex; flex-direction: column; gap: 6px; }
  .rd-list-row {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    transition: transform 0.15s;
  }
  .rd-list-row:hover { transform: translateY(-1px); }
  .rd-list-dot-icon {
    width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0;
  }
  .rd-list-label { font-size: 11.5px; font-weight: 700; color: #1a1a1a; flex: 1; min-width: 0; }
  .rd-list-badge {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px; flex-shrink: 0;
    border: 1.5px solid transparent;
  }

  /* ══ BLOCKCHAIN STATUS PANEL ══ */
  .rd-chain-zone {
    background: #1a1a1a; border-radius: 20px; overflow: hidden;
  }
  .rd-chain-head {
    padding: 14px 16px 10px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .rd-chain-head-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: #555;
    text-transform: uppercase;
  }
  .rd-chain-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: #2EC4A0;
  }
  .rd-chain-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #2EC4A0;
    animation: pulse 2s infinite;
  }
  .rd-chain-rows { padding: 4px 0 8px; }
  .rd-chain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .rd-chain-row:last-child { border-bottom: none; }
  .rd-chain-label { font-size: 10.5px; font-weight: 500; color: #555; }
  .rd-chain-val   { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #ccc; }
  .rd-chain-val-green { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 600; color: #2EC4A0; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .rd-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .rd-content-row { flex-direction: column; }
    .rd-activity-grid { grid-template-columns: repeat(2, 1fr); }
    .rd-activity-item:nth-child(2n) { border-right: none; }
  }
  @media (max-width: 580px) {
    .rd-main { padding: 10px 10px 80px; gap: 10px; }
    .rd-topbar { flex-direction: column; align-items: flex-start; }
    .rd-activity-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function RegistrarDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [disputes, setDisputes] = useState([]);
  const [mutations, setMutations] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/transfers/pending'),
      api.get('/disputes/all'),
      api.get('/mutations/pending')
    ])
    .then(([transRes, dispRes, mutRes]) => {
      setPending(transRes.data.map(t => ({
         ...t,
         priority: "Normal",
         saleValue: t.saleValue || "₹ 0",
         documents: ["Doc1", "Doc2"]
      })));
      setDisputes(dispRes.data);
      setMutations(mutRes.data);
    })
    .catch(err => console.error("Failed to fetch dashboard data", err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="rd-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="rd-main">

          {/* ══ TOP BAR ══ */}
          <div className="rd-topbar">
            <div className="rd-heading">
              Welcome, <span>{user?.name?.split(" ").slice(-1)[0] ?? "Registrar"}</span>
            </div>
            <div className="rd-topbar-right">
              {user?.district && (
                <div className="rd-meta-chip">
                  <MI name="location_on" /> {user.district}
                </div>
              )}
              {user?.office && (
                <div className="rd-meta-chip">
                  <MI name="account_balance" /> {user.office}
                </div>
              )}
              <button className="rd-add-btn" onClick={() => navigate("/registrar/approvals")}>
                <MI name="arrow_forward" /> Review Queue
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="rd-stats">
            <div className="rd-stat dark">
              <div className="rd-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="rd-stat-label">Pending Approvals</div>
              <div className="rd-stat-value">{pending.length}</div>
              <div className="rd-stat-badge">need review</div>
            </div>
            <div className="rd-stat light">
              <div className="rd-stat-label">Approved Today</div>
              <div className="rd-stat-value">2</div>
              <div className="rd-stat-badge">completed</div>
            </div>
            <div className="rd-stat purple">
              <div className="rd-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
              <div className="rd-stat-label">Active Disputes</div>
              <div className="rd-stat-value">{disputes.length}</div>
              <div className="rd-stat-badge">in progress</div>
            </div>
            <div className="rd-stat orange">
              <div className="rd-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,140,80,0.2) 0%, transparent 60%)" }} />
              <div className="rd-stat-label">Total Managed</div>
              <div className="rd-stat-value">248</div>
              <div className="rd-stat-badge">on-chain</div>
            </div>
          </div>

          {/* ══ QUICK ACTIONS ══ */}
          <div className="rd-actions-row">
            <button className="rd-action-btn primary" onClick={() => navigate("/registrar/approvals")}>
              <MI name="pending_actions" /> Review Queue
            </button>
            <button className="rd-action-btn ghost" onClick={() => navigate("/registrar/disputes")}>
              <MI name="gavel" /> Disputes
            </button>
            <button className="rd-action-btn ghost" onClick={() => navigate("/registrar/mutations")}>
              <MI name="edit_document" /> Mutations
            </button>
            <button className="rd-action-btn purple-btn" onClick={() => navigate("/registrar/review")}>
              <MI name="manage_search" /> Full Review
            </button>
          </div>

          {/* ══ TWO-COLUMN CONTENT ══ */}
          <div className="rd-content-row">

            {/* ── LEFT COLUMN ── */}
            <div className="rd-col-left">

              {/* Pending Approvals */}
              <div className="rd-zone">
                <div className="rd-zone-header">
                  <div className="rd-zone-title-row">
                    <div className="rd-zone-title">Pending <span>Approvals</span></div>
                    <div className="rd-zone-pill">{pending.length} queued</div>
                  </div>
                  <button className="rd-zone-link" onClick={() => navigate("/registrar/approvals")}>
                    View all <MI name="arrow_forward" />
                  </button>
                </div>

                <div className="rd-queue-list">
                  {pending.map((t, i) => (
                    <div
                      key={i}
                      className="rd-queue-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => navigate("/registrar/approvals")}
                    >
                      <div className="rd-queue-top-row">
                        <div>
                          <div className="rd-queue-id">{t.id}</div>
                          <div className="rd-queue-title">{t.propertyTitle}</div>
                          <div className="rd-queue-parties">{t.sellerName} → {t.buyerName}</div>
                        </div>
                        <div className="rd-queue-right">
                          <span className={t.priority === "High" ? "rd-pri-high" : "rd-pri-normal"}>
                            {t.priority}
                          </span>
                          <span className="rd-queue-value">{t.saleValue}</span>
                          <span
                            className="rd-review-btn"
                            onClick={e => { e.stopPropagation(); navigate("/registrar/review"); }}
                          >
                            Review <MI name="arrow_forward" />
                          </span>
                        </div>
                      </div>
                      <div className="rd-queue-footer">
                        <span className="rd-queue-date">{t.submittedOn}</span>
                        <span className="rd-queue-docs">{t.documents.length} docs attached</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Disputes */}
              {disputes.length > 0 && (
                <div className="rd-zone">
                  <div className="rd-zone-header">
                    <div className="rd-zone-title-row">
                      <div className="rd-zone-title">Active <span>Disputes</span></div>
                      <div className="rd-zone-pill">{disputes.length} open</div>
                    </div>
                    <button className="rd-zone-link" onClick={() => navigate("/registrar/disputes")}>
                      View all <MI name="arrow_forward" />
                    </button>
                  </div>
                  <div className="rd-list-rows">
                    {disputes.map((d, i) => (
                      <div className="rd-list-row" key={i}>
                        <div className="rd-list-dot-icon" style={{ background: d.statusColor }} />
                        <span className="rd-list-label">{d.type} — {d.propertyId}</span>
                        <span
                          className="rd-list-badge"
                          style={{ background: `${d.statusColor}15`, color: d.statusColor, borderColor: `${d.statusColor}60` }}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mutation Requests */}
              {mutations.length > 0 && (
                <div className="rd-zone">
                  <div className="rd-zone-header">
                    <div className="rd-zone-title-row">
                      <div className="rd-zone-title">Mutation <span>Requests</span></div>
                      <div className="rd-zone-pill">{mutations.length} pending</div>
                    </div>
                    <button className="rd-zone-link" onClick={() => navigate("/registrar/mutations")}>
                      View all <MI name="arrow_forward" />
                    </button>
                  </div>
                  <div className="rd-list-rows">
                    {mutations.map((m, i) => (
                      <div className="rd-list-row" key={i}>
                        <div className="rd-list-dot-icon" style={{ background: "#5B4FD4" }} />
                        <span className="rd-list-label">{m.type} — {m.propertyId}</span>
                        <span
                          className="rd-list-badge"
                          style={{ background: "rgba(91,79,212,0.1)", color: "#5B4FD4", borderColor: "#5B4FD4" }}
                        >
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="rd-col-right">

              {/* Blockchain / Network Status */}
              <div className="rd-chain-zone">
                <div className="rd-chain-head">
                  <span className="rd-chain-head-title">Network Status</span>
                  <span className="rd-chain-live">
                    <span className="rd-chain-live-dot" /> LIVE
                  </span>
                </div>
                <div className="rd-chain-rows">
                  {[
                    { label: "Latest Block",    val: "#1,847,392",              green: false },
                    { label: "District Records",val: "248 on-chain",            green: false },
                    { label: "Pending Writes",  val: `${pending.length} queued`, green: false },
                    { label: "Network",         val: "TN State Registry",       green: true  },
                    { label: "Integrity",       val: "✓ Verified",              green: true  },
                  ].map((r, i) => (
                    <div className="rd-chain-row" key={i}>
                      <span className="rd-chain-label">{r.label}</span>
                      <span className={r.green ? "rd-chain-val-green" : "rd-chain-val"}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registrar info mini panel */}
              <div style={{
                background: "#f0f0f0", borderRadius: 20, padding: "16px 18px",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a" }}>Office Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "District", val: user?.district || "Chennai", accent: true },
                    { label: "Approved", val: "2", accent: false },
                    { label: "Queue",    val: String(pending.length), accent: false },
                    { label: "Disputes", val: String(disputes.length), accent: true },
                  ].map((b, i) => (
                    <div
                      key={i}
                      style={{
                        background: b.accent ? "#1a1a1a" : "#e8e8e8",
                        borderRadius: 12, padding: 11,
                        display: "flex", flexDirection: "column", gap: 3,
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 500, color: b.accent ? "#555" : "#aaa" }}>{b.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, color: b.accent ? "#fff" : "#1a1a1a" }}>{b.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: "#e0e0e0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "Email", val: user?.email || "registrar@bhoomi.in" },
                    { label: "Since", val: user?.since || "2019" },
                    { label: "Office", val: user?.office || "Sub-Registrar Office" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 500, color: "#999" }}>{r.label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ══ ACTIVITY FEED (full width) ══ */}
          <div className="rd-activity-zone">
            <div className="rd-activity-head">
              <div className="rd-activity-head-left">
                <div className="rd-activity-head-dot" />
                <span className="rd-activity-head-txt">Recent Activity</span>
              </div>
            </div>
            <div className="rd-activity-grid">
              {ACTIVITY.map((a, i) => (
                <div className="rd-activity-item" key={i}>
                  <div className="rd-activity-icon-row">
                    <div className="rd-activity-color-dot" style={{ background: a.color }} />
                    <div className="rd-activity-icon-wrap" style={{ background: a.color + "18" }}>
                      <MI name={a.icon} style={{ color: a.color }} />
                    </div>
                  </div>
                  <div className="rd-activity-label">{a.label}</div>
                  <div className="rd-activity-sub">{a.sub}</div>
                  <div className="rd-activity-date">{a.date}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}