import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import Navbar2 from "../../components/Navbar2";

const FILTERS    = ["All", "High Priority", "Normal", "Completed"];
const TYPE_ICONS = { Residential: "home", Agricultural: "grass", Commercial: "store" };

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
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    from { transform: rotate(0); }
    to   { transform: rotate(360deg); }
  }

  /* ── Root ── */
  .aq-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .aq-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .aq-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .aq-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .aq-heading span { color: #5B4FD4; }
  .aq-topbar-sub {
    font-size: 11px; font-weight: 500; color: #888; margin-top: 2px;
  }
  .aq-topbar-right {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .aq-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .aq-meta-chip .mi { font-size: 13px; color: #aaa; }

  /* ══ STAT STRIP ══ */
  .aq-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .aq-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .aq-stat.light  { background: #f0f0f0; }
  .aq-stat.dark   { background: #1a1a1a; }
  .aq-stat.purple { background: #1e1a38; }
  .aq-stat.green  { background: #0d2218; }
  .aq-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .aq-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .aq-stat.dark .aq-stat-label,
  .aq-stat.purple .aq-stat-label,
  .aq-stat.green .aq-stat-label { color: #555; }
  .aq-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .aq-stat.dark .aq-stat-value   { color: #fff; }
  .aq-stat.purple .aq-stat-value { color: #c8c2ff; }
  .aq-stat.green .aq-stat-value  { color: #6effc2; }
  .aq-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .aq-stat.dark .aq-stat-badge   { color: #fff; background: rgba(255,255,255,0.08); }
  .aq-stat.purple .aq-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .aq-stat.green .aq-stat-badge  { color: #6effc2; background: rgba(110,255,194,0.12); }
  @media (max-width: 900px) {
    .aq-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  }

  /* ══ FILTER TABS ══ */
  .aq-filter-row {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .aq-filter-tab {
    padding: 6px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 11px; font-weight: 600;
    color: #888;
    background: #f0f0f0;
    font-family: 'Poppins', sans-serif;
    transition: all 0.15s;
  }
  .aq-filter-tab:hover { border-color: #bbb; color: #555; }
  .aq-filter-active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
    font-weight: 700;
  }

  /* ══ TOOLBAR ══ */
  .aq-toolbar {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 16px;
    padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .aq-search-wrap {
    flex: 1; min-width: 200px; position: relative;
  }
  .aq-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px; color: #aaa; pointer-events: none;
  }
  .aq-search {
    width: 100%;
    padding: 8px 12px 8px 32px;
    border: 1.5px solid #e0e0e0;
    border-radius: 11px;
    background: #f0f0f0;
    font-size: 11.5px;
    font-family: inherit;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .aq-search:focus { border-color: #bbb; background: #fff; }
  .aq-search::placeholder { color: #bbb; }
  .aq-count {
    font-size: 10.5px; font-weight: 700; color: #aaa; white-space: nowrap;
  }

  /* ══ CARD LIST ══ */
  .aq-list {
    display: flex; flex-direction: column; gap: 10px;
  }

  /* ══ APPROVAL CARDS ══ */
  .aq-card {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
  }
  .aq-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  }

  .aq-card-top {
    padding: 14px 16px 10px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
  }
  .aq-card-type-pill {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
  }
  .aq-card-type-pill .mi { font-size: 11px; }
  .aq-type-high   { color: #c0392b; background: rgba(240,80,80,0.12); }
  .aq-type-normal { color: #2a7a55; background: rgba(46,196,160,0.13); }

  .aq-card-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 3px;
  }
  .aq-card-title   { font-size: 12.5px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.2px; line-height: 1.3; }
  .aq-card-parties { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 2px; }

  .aq-card-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;
  }
  .aq-pri-high   { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #a89fff; background: rgba(124,110,245,0.18); }
  .aq-pri-normal { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #2a7a55; background: #e6f8ef; }
  .aq-done-pill  { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; display: inline-flex; align-items: center; gap: 3px; }
  .aq-done-pill .mi { font-size: 11px; }
  .aq-done-approve { color: #2a7a55; background: rgba(46,196,160,0.13); }
  .aq-done-reject  { color: #c0392b; background: rgba(240,80,80,0.12); }
  .aq-done-clarify { color: #5B4FD4; background: rgba(91,79,212,0.12); }

  /* chips */
  .aq-card-chips {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
    padding: 0 16px 10px;
  }
  .aq-chip {
    background: rgba(0,0,0,0.04); border-radius: 9px; padding: 7px 10px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .aq-chip-lbl { font-size: 8.5px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.4px; }
  .aq-chip-val { font-size: 11px; font-weight: 700; color: #1a1a1a; }

  .aq-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 16px;
    border-top: 1px solid rgba(0,0,0,0.05);
  }
  .aq-card-date { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4; }
  .aq-card-docs { font-size: 9px; font-weight: 600; color: #bbb; }

  /* ══ DETAIL VIEW ══ */
  .aq-detail-view { animation: slideIn 0.25s ease both; display: flex; flex-direction: column; gap: 12px; }

  .aq-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f0f0; border: none; border-radius: 11px;
    padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    color: #555; cursor: pointer; transition: background 0.15s, color 0.15s;
    width: fit-content;
  }
  .aq-back-btn .mi { font-size: 14px; }
  .aq-back-btn:hover { background: #e0e0e0; color: #1a1a1a; }

  /* detail zone */
  .aq-detail-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .aq-detail-zone-head {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding-bottom: 12px; border-bottom: 1px solid #e8e8e8; gap: 10px;
  }
  .aq-detail-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .aq-detail-title span { color: #5B4FD4; }
  .aq-detail-id {
    font-family: 'DM Mono', monospace; font-size: 9px; color: #aaa; margin-top: 3px;
  }
  .aq-detail-head-right {
    display: flex; gap: 6px; align-items: center; flex-shrink: 0;
  }

  /* parties */
  .aq-parties {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .aq-party {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .aq-party-role    { font-size: 8.5px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase; }
  .aq-party-name    { font-size: 12px; font-weight: 700; color: #1a1a1a; }
  .aq-party-aadhaar { font-family: 'DM Mono', monospace; font-size: 9.5px; color: #aaa; }

  /* info rows */
  .aq-info-rows {
    background: #f0f0f0; border-radius: 14px; overflow: hidden;
  }
  .aq-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 14px; border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .aq-info-row:last-child { border-bottom: none; }
  .aq-info-lbl { font-size: 10px; color: #aaa; font-weight: 500; }
  .aq-info-val { font-size: 11px; font-weight: 700; color: #1a1a1a; }

  /* docs */
  .aq-docs-title {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase;
  }
  .aq-docs-list { display: flex; flex-direction: column; gap: 6px; }
  .aq-doc-item {
    display: flex; align-items: center; gap: 10px;
    background: #f0f0f0; border-radius: 12px; padding: 10px 14px;
    cursor: pointer; transition: background 0.15s;
  }
  .aq-doc-item:hover { background: #e8e8e8; }
  .aq-doc-item .mi { font-size: 16px; color: #bbb; flex-shrink: 0; }
  .aq-doc-name { font-size: 11px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .aq-doc-view { font-size: 10px; font-weight: 700; color: #5B4FD4; flex-shrink: 0; }

  /* full review button */
  .aq-full-review-btn {
    width: 100%; padding: 11px;
    border: none; border-radius: 13px;
    background: #1a1a1a; color: #fff;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: background 0.15s;
  }
  .aq-full-review-btn .mi { font-size: 16px; }
  .aq-full-review-btn:hover { background: #2a2a2a; }

  /* notes */
  .aq-notes-title {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .aq-notes-input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 13px;
    background: #f0f0f0;
    color: #1a1a1a;
    font-size: 11.5px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .aq-notes-input:focus { border-color: #bbb; background: #fff; }
  .aq-notes-input::placeholder { color: #bbb; }

  /* action buttons */
  .aq-actions { display: flex; flex-direction: column; gap: 7px; margin-top: 4px; }
  .aq-btn {
    width: 100%; padding: 11px;
    border-radius: 13px;
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.15s; border: none;
  }
  .aq-btn .mi { font-size: 15px; }
  .aq-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .aq-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .aq-btn-approve { background: #1a1a1a; color: #6effc2; }
  .aq-btn-clarify { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .aq-btn-reject  { background: rgba(240,80,80,0.1); color: #c0392b; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* actioned state */
  .aq-actioned {
    text-align: center; padding: 20px 16px;
    background: #f0f0f0; border-radius: 16px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .aq-actioned .mi { font-size: 36px; }
  .aq-actioned-title { font-size: 13px; font-weight: 800; color: #1a1a1a; }
  .aq-actioned-sub   { font-size: 10.5px; color: #aaa; margin-bottom: 6px; }
  .aq-actioned-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .aq-actioned-btn .mi { font-size: 13px; }
  .aq-actioned-btn:hover { background: #2a2a2a; }

  /* empty state */
  .aq-empty {
    text-align: center; padding: 40px 20px;
    color: #bbb; font-size: 12px; font-weight: 500;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .aq-card-chips { grid-template-columns: 1fr 1fr; }
    .aq-parties { grid-template-columns: 1fr; }
  }
  @media (max-width: 580px) {
    .aq-main { padding: 10px 10px 80px; gap: 10px; }
    .aq-topbar { flex-direction: column; align-items: flex-start; }
    .aq-card-chips { grid-template-columns: 1fr 1fr; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function ApprovalsQueue() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeFilter, setFilter]     = useState("All");
  const [search,       setSearch]     = useState("");
  const [detailView,   setDetailView] = useState(null);
  const [notes,        setNotes]      = useState("");
  const [loading,      setLoading]    = useState(null);
  const [actioned,     setActioned]   = useState({});

  const [allItems, setAllItems] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    api.get('/transfers/all')
      .then(res => setAllItems(res.data.map(t => ({
        ...t,
        priority: "Normal",
        documents: ["Doc1"],
        saleValue: t.saleValue || "₹ 0"
      }))))
      .catch(console.error)
      .finally(() => setLoadingProps(false));
  }, []);

  const pending   = allItems.filter(t => t.status !== "Completed" && t.status !== "APPROVED");
  const completed = allItems.filter(t => t.status === "Completed" || t.status === "APPROVED");

  const filtered = allItems.filter(t => {
    const matchFilter =
      activeFilter === "All"           ? true :
      activeFilter === "High Priority" ? t.priority === "High" :
      activeFilter === "Normal"        ? t.priority === "Normal" :
      activeFilter === "Completed"     ? (t.status === "Approved" || t.status === "Completed") : true;

    const q = search.toLowerCase();
    return matchFilter && (
      !q ||
      String(t.id).toLowerCase().includes(q) ||
      t.propertyTitle?.toLowerCase().includes(q) ||
      t.sellerName?.toLowerCase().includes(q) ||
      t.buyerName?.toLowerCase().includes(q)
    );
  });

  const doAction = async (action) => {
    setLoading(action);
    const apiStatus = action === 'approve' ? 'APPROVED' : (action === 'reject' ? 'REJECTED' : 'PENDING');
    try {
      await api.put(`/transfers/${detailView.id}/review?status=${apiStatus}&remarks=${notes}`);
      setAllItems(prev => prev.map(t => 
        t.id === detailView.id ? { ...t, status: apiStatus, remarks: notes } : t
      ));
      setActioned(a => ({ ...a, [detailView.id]: action }));
      setNotes("");
    } catch (err) {
      console.error("Failed to perform action", err);
    } finally {
      setLoading(null);
    }
  };

  const actionedColor = (a) =>
    a === "approve" ? "#2EC4A0" : a === "reject" ? "#F07060" : "#5B4FD4";
  const actionedIcon = (a) =>
    a === "approve" ? "check_circle" : a === "reject" ? "cancel" : "help";
  const actionedLabel = (a) =>
    a === "approve" ? "Transfer Approved" : a === "reject" ? "Transfer Rejected" : "Clarification Requested";

  return (
    <>
      <style>{styles}</style>
      <div className="aq-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="aq-main">

          {/* ══ TOP BAR ══ */}
          <div className="aq-topbar">
            <div>
              <div className="aq-heading">
                Approvals <span>Queue</span>
              </div>
              <div className="aq-topbar-sub">Review and process pending transfer requests</div>
            </div>
            <div className="aq-topbar-right">
              <div className="aq-meta-chip">
                <MI name="pending_actions" /> {pending.length} pending
              </div>
              <div className="aq-meta-chip">
                <MI name="check_circle" /> {completed.length} completed
              </div>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="aq-stats">
            <div className="aq-stat dark">
              <div className="aq-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="aq-stat-label">Total</div>
              <div className="aq-stat-value">{allItems.length}</div>
              <div className="aq-stat-badge">all transfers</div>
            </div>
            <div className="aq-stat light">
              <div className="aq-stat-label">Pending</div>
              <div className="aq-stat-value">{pending.length}</div>
              <div className="aq-stat-badge">awaiting action</div>
            </div>
            <div className="aq-stat purple">
              <div className="aq-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(124,110,245,0.25) 0%, transparent 60%)" }} />
              <div className="aq-stat-label">High Priority</div>
              <div className="aq-stat-value">{allItems.filter(t => t.priority === "High").length}</div>
              <div className="aq-stat-badge">urgent</div>
            </div>
            <div className="aq-stat green">
              <div className="aq-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(46,196,160,0.2) 0%, transparent 60%)" }} />
              <div className="aq-stat-label">Completed</div>
              <div className="aq-stat-value">{completed.length}</div>
              <div className="aq-stat-badge">processed</div>
            </div>
          </div>

          {/* ══ FILTER TABS ══ */}
          <div className="aq-filter-row">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`aq-filter-tab${activeFilter === f ? " aq-filter-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ══ TOOLBAR ══ */}
          <div className="aq-toolbar">
            <div className="aq-search-wrap">
              <MI name="search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }} />
              <input
                className="aq-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID, property, seller or buyer…"
              />
            </div>
            <span className="aq-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* ══ CONTENT ══ */}
          {detailView ? (

            /* ── DETAIL VIEW ── */
            <div className="aq-detail-view">
              <button className="aq-back-btn" onClick={() => setDetailView(null)}>
                <MI name="arrow_back" /> Back to Queue
              </button>

              <div className="aq-detail-zone">

                {/* Header */}
                <div className="aq-detail-zone-head">
                  <div>
                    <div className="aq-detail-title">
                      {detailView.propertyTitle?.split(" ").slice(0, -1).join(" ")}{" "}
                      <span>{detailView.propertyTitle?.split(" ").slice(-1)[0]}</span>
                    </div>
                    <div className="aq-detail-id">{detailView.id} · {detailView.propertyId} · {detailView.surveyNo}</div>
                  </div>
                  <div className="aq-detail-head-right">
                    <span className={detailView.priority === "High" ? "aq-pri-high" : "aq-pri-normal"}>
                      {detailView.priority}
                    </span>
                  </div>
                </div>

                {/* Parties */}
                <div className="aq-parties">
                  <div className="aq-party">
                    <div className="aq-party-role">Seller</div>
                    <div className="aq-party-name">{detailView.sellerName}</div>
                    <div className="aq-party-aadhaar">{detailView.sellerAadhaar || "—"}</div>
                  </div>
                  <div className="aq-party">
                    <div className="aq-party-role">Buyer</div>
                    <div className="aq-party-name">{detailView.buyerName}</div>
                    <div className="aq-party-aadhaar">{detailView.buyerAadhaar || "—"}</div>
                  </div>
                </div>

                {/* Info rows */}
                <div className="aq-info-rows">
                  {[
                    { label: "Sale Value", value: detailView.saleValue },
                    { label: "Area",       value: detailView.area      || "—" },
                    { label: "District",   value: detailView.district  || "—" },
                    { label: "Survey No.", value: detailView.surveyNo  || "—" },
                    { label: "Submitted",  value: detailView.submittedOn || detailView.completedOn },
                    { label: "Priority",   value: detailView.priority  || "—" },
                  ].map((r, i) => (
                    <div key={i} className="aq-info-row">
                      <span className="aq-info-lbl">{r.label}</span>
                      <span className="aq-info-val">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Documents */}
                <div>
                  <div className="aq-docs-title">Documents ({detailView.documents?.length || 0})</div>
                  <div className="aq-docs-list" style={{ marginTop: 8 }}>
                    {(detailView.documents || []).map((d, i) => (
                      <div key={i} className="aq-doc-item">
                        <MI name="insert_drive_file" />
                        <span className="aq-doc-name">{d}</span>
                        <span className="aq-doc-view">View</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full review button */}
                <button
                  className="aq-full-review-btn"
                  onClick={() => navigate(`/registrar/review/${detailView.id}`)}
                >
                  <MI name="manage_search" /> Open Full Review
                </button>

                {/* Actions / Actioned state */}
                {actioned[detailView.id] ? (
                  <div className="aq-actioned">
                    <MI
                      name={actionedIcon(actioned[detailView.id])}
                      style={{ color: actionedColor(actioned[detailView.id]) }}
                    />
                    <div className="aq-actioned-title">{actionedLabel(actioned[detailView.id])}</div>
                    <div className="aq-actioned-sub">Action recorded on blockchain ledger.</div>
                    <button className="aq-actioned-btn" onClick={() => setDetailView(null)}>
                      Back to Queue <MI name="arrow_forward" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="aq-notes-title">Notes / Reason</div>
                    <textarea
                      className="aq-notes-input"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Add notes, remarks or reason for rejection…"
                    />
                    <div className="aq-actions">
                      <button className="aq-btn aq-btn-approve" onClick={() => doAction("approve")} disabled={!!loading}>
                        {loading === "approve"
                          ? <><span className="spinner" /> Approving…</>
                          : <><MI name="check_circle" /> Approve Transfer</>}
                      </button>
                      <button className="aq-btn aq-btn-clarify" onClick={() => doAction("clarify")} disabled={!!loading}>
                        {loading === "clarify"
                          ? <><span className="spinner" /> Sending…</>
                          : <><MI name="edit_note" /> Request Clarification</>}
                      </button>
                      <button className="aq-btn aq-btn-reject" onClick={() => doAction("reject")} disabled={!!loading}>
                        {loading === "reject"
                          ? <><span className="spinner" /> Rejecting…</>
                          : <><MI name="cancel" /> Reject Transfer</>}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          ) : (

            /* ── LIST VIEW ── */
            <div className="aq-list">
              {filtered.length === 0 ? (
                <div className="aq-empty">No results found.</div>
              ) : (
                filtered.map((t, i) => {
                  const done = actioned[t.id];
                  const typeIcon = TYPE_ICONS[t.type] || "home";
                  return (
                    <div
                      key={t.id}
                      className="aq-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => setDetailView(t)}
                    >
                      <div className="aq-card-top">
                        <div>
                          <div className="aq-card-id">{t.id}</div>
                          <div className="aq-card-title">{t.propertyTitle}</div>
                          <div className="aq-card-parties">{t.sellerName} → {t.buyerName}</div>
                        </div>
                        <div className="aq-card-right">
                          {done ? (
                            <span className={`aq-done-pill aq-done-${done}`}>
                              <MI name={actionedIcon(done)} />
                              {done === "approve" ? "Approved" : done === "reject" ? "Rejected" : "Clarify"}
                            </span>
                          ) : (
                            <span className={t.priority === "High" ? "aq-pri-high" : "aq-pri-normal"}>
                              {t.priority}
                            </span>
                          )}
                          <span
                            className={`aq-card-type-pill ${t.priority === "High" ? "aq-type-high" : "aq-type-normal"}`}
                          >
                            <MI name={typeIcon} />
                            {t.type || "Transfer"}
                          </span>
                        </div>
                      </div>

                      <div className="aq-card-chips">
                        <div className="aq-chip">
                          <div className="aq-chip-lbl">Area</div>
                          <div className="aq-chip-val">{t.area || "—"}</div>
                        </div>
                        <div className="aq-chip">
                          <div className="aq-chip-lbl">District</div>
                          <div className="aq-chip-val">{t.district || "—"}</div>
                        </div>
                        <div className="aq-chip">
                          <div className="aq-chip-lbl">Value</div>
                          <div className="aq-chip-val">{t.saleValue}</div>
                        </div>
                      </div>

                      <div className="aq-card-footer">
                        <span className="aq-card-date">{t.submittedOn || t.completedOn}</span>
                        <span className="aq-card-docs">{t.documents?.length || 0} docs attached</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}