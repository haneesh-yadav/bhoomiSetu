import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import Navbar2 from "../../components/Navbar2";

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
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .dm-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .dm-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .dm-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .dm-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .dm-heading span { color: #5B4FD4; }
  .dm-topbar-right {
    display: flex; align-items: center; gap: 8px;
  }
  .dm-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .dm-meta-chip .mi { font-size: 13px; color: #aaa; }

  /* ══ STAT STRIP ══ */
  .dm-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .dm-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .dm-stat.light  { background: #f0f0f0; }
  .dm-stat.dark   { background: #1a1a1a; }
  .dm-stat.purple { background: #1e1a38; }
  .dm-stat.red    { background: #2a0f0f; }
  .dm-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .dm-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .dm-stat.dark .dm-stat-label,
  .dm-stat.purple .dm-stat-label,
  .dm-stat.red .dm-stat-label { color: #555; }
  .dm-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .dm-stat.dark .dm-stat-value   { color: #fff; }
  .dm-stat.purple .dm-stat-value { color: #c8c2ff; }
  .dm-stat.red .dm-stat-value    { color: #ffaaaa; }
  .dm-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .dm-stat.dark .dm-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .dm-stat.purple .dm-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .dm-stat.red .dm-stat-badge    { color: #ff8080; background: rgba(240,112,96,0.18); }

  /* ══ SECTION ZONE ══ */
  .dm-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .dm-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .dm-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .dm-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .dm-zone-title span { color: #5B4FD4; }
  .dm-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ══ DISPUTE CARDS ══ */
  .dm-card-list { display: flex; flex-direction: column; gap: 8px; }

  .dm-card {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
  }
  .dm-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .dm-card-top-row {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
  }
  .dm-card-type-pill {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
  }
  .dm-card-type-pill .mi { font-size: 11px; }
  .dm-type-high   { color: #c0392b; background: rgba(240,112,96,0.12); }
  .dm-type-normal { color: #2a7a55; background: rgba(46,196,160,0.13); }

  .dm-card-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .dm-card-title {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .dm-card-prop { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .dm-card-desc { font-size: 10.5px; color: #888; line-height: 1.5; margin-top: 2px; }

  .dm-card-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;
  }
  .dm-pri-high   { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #ff8080; background: rgba(240,112,96,0.15); }
  .dm-pri-normal { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: #2a7a55; background: #e6f8ef; }

  .dm-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .dm-card-filer { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4; }
  .dm-card-date  { font-size: 9px; font-weight: 600; color: #aaa; }
  .dm-card-status-badge {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    border: 1.5px solid transparent;
  }
  .dm-review-btn {
    font-size: 10px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 3px;
  }
  .dm-review-btn .mi { font-size: 13px; }

  /* ══ DETAIL VIEW ══ */
  .dm-detail-view { animation: slideIn 0.25s ease both; display: flex; flex-direction: column; gap: 12px; }

  .dm-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s; width: fit-content;
  }
  .dm-back-btn:hover { background: #2a2a2a; }
  .dm-back-btn .mi { font-size: 14px; }

  .dm-detail-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px; overflow: hidden;
  }
  .dm-detail-zone-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .dm-detail-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .dm-detail-zone-title span { color: #5B4FD4; }
  .dm-detail-zone-id {
    font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa;
  }
  .dm-detail-zone-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Info grid ── */
  .dm-info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .dm-info-cell {
    background: #f0f0f0; border-radius: 12px; padding: 10px 12px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .dm-info-cell.dark { background: #1a1a1a; }
  .dm-info-cell-label { font-size: 9px; font-weight: 500; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
  .dm-info-cell.dark .dm-info-cell-label { color: #555; }
  .dm-info-cell-value { font-size: 12px; font-weight: 700; color: #1a1a1a; }
  .dm-info-cell.dark .dm-info-cell-value { color: #fff; }

  /* ── Section label ── */
  .dm-section-lbl {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: #aaa;
    text-transform: uppercase; padding-bottom: 6px;
    border-bottom: 1px solid #e8e8e8;
  }

  /* ── Description ── */
  .dm-desc-box {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
  }
  .dm-desc-text { font-size: 11.5px; color: #555; line-height: 1.6; }

  /* ── Evidence ── */
  .dm-evidence-list { display: flex; flex-direction: column; gap: 6px; }
  .dm-evidence-item {
    background: #f0f0f0; border-radius: 12px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
  }
  .dm-evidence-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  .dm-evidence-item .mi { font-size: 16px; color: #aaa; }
  .dm-evidence-name { font-size: 11.5px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .dm-evidence-view { font-size: 9px; font-weight: 700; color: #5B4FD4; }

  /* ── Resolution input ── */
  .dm-resolution-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 14px;
    background: #f0f0f0;
    color: #1a1a1a;
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color 0.2s;
  }
  .dm-resolution-input:focus { border-color: #5B4FD4; }
  .dm-resolution-input::placeholder { color: #bbb; }

  /* ── Action buttons ── */
  .dm-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .dm-btn {
    flex: 1; min-width: 130px;
    border-radius: 13px; padding: 10px 16px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; border: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.15s;
  }
  .dm-btn .mi { font-size: 15px; }
  .dm-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .dm-btn:not(:disabled):hover { transform: translateY(-1px); }

  .dm-btn-resolve     { background: #1a1a1a; color: #2EC4A0; }
  .dm-btn-resolve:not(:disabled):hover     { background: #2a2a2a; }
  .dm-btn-investigate { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .dm-btn-investigate:not(:disabled):hover { background: rgba(91,79,212,0.18); }
  .dm-btn-dismiss     { background: #f0f0f0; color: #F07060; }
  .dm-btn-dismiss:not(:disabled):hover     { background: #e8e8e8; }

  /* ── Spinner ── */
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Actioned state ── */
  .dm-actioned {
    text-align: center; padding: 24px 16px;
    background: #f0f0f0; border-radius: 18px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .dm-actioned-title { font-size: 14px; font-weight: 800; color: #1a1a1a; }
  .dm-actioned-sub   { font-size: 11px; color: #888; line-height: 1.5; }
  .dm-actioned-btn {
    margin-top: 8px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 8px 18px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .dm-actioned-btn:hover { background: #2a2a2a; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .dm-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .dm-info-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 580px) {
    .dm-main { padding: 10px 10px 80px; gap: 10px; }
    .dm-topbar { flex-direction: column; align-items: flex-start; }
    .dm-actions { flex-direction: column; }
    .dm-btn { min-width: unset; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function DisputeManagement() {
  const { user, logout } = useAuth();

  const [detailView, setDetailView] = useState(null);
  const [resolution, setResolution] = useState("");
  const [loading, setLoading]       = useState(null);
  const [actioned, setActioned]     = useState({});
  const [disputes, setDisputes]     = useState([]);

  useEffect(() => {
    api.get('/disputes/all')
      .then(res => setDisputes(res.data.map(d => ({
        ...d,
        type: d.caseNumber || "Dispute",
        priority: d.priority || "Normal",
        statusColor: d.status === "ACTIVE" ? "#ff8c50" : (d.status === "RESOLVED" ? "#2EC4A0" : "#F07060"),
        filer: d.filerName,
        filedOn: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
        evidence: d.evidence || ["Document 1"]
      }))))
      .catch(console.error);
  }, []);

  const openCount        = disputes.filter(d => d.status !== "RESOLVED" && d.status !== "DISMISSED").length;
  const highPriorityCount = disputes.filter(d => d.priority === "High").length;
  const resolvedCount    = disputes.filter(d => d.status === "RESOLVED" || d.status === "DISMISSED").length;

  const doAction = async (action) => {
    setLoading(action);
    const newStatus = action === 'resolve' ? 'RESOLVED' : (action === 'dismiss' ? 'DISMISSED' : 'ACTIVE');
    try {
      await api.put(`/disputes/${detailView.id}/resolve?status=${newStatus}&remarks=${encodeURIComponent(resolution)}`);
      setActioned(a => ({ ...a, [detailView?.id]: action }));
      setResolution("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dm-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="dm-main">

          {/* ══ TOP BAR ══ */}
          <div className="dm-topbar">
            <div className="dm-heading">
              Dispute <span>Management</span>
            </div>
            <div className="dm-topbar-right">
              {user?.district && (
                <div className="dm-meta-chip">
                  <MI name="location_on" /> {user.district}
                </div>
              )}
              <div className="dm-meta-chip">
                <MI name="gavel" /> {openCount} Open
              </div>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="dm-stats">
            <div className="dm-stat dark">
              <div className="dm-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="dm-stat-label">Total Disputes</div>
              <div className="dm-stat-value">{disputes.length}</div>
              <div className="dm-stat-badge">all cases</div>
            </div>
            <div className="dm-stat light">
              <div className="dm-stat-label">Open</div>
              <div className="dm-stat-value">{openCount}</div>
              <div className="dm-stat-badge">in progress</div>
            </div>
            <div className="dm-stat red">
              <div className="dm-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(240,112,96,0.2) 0%, transparent 60%)" }} />
              <div className="dm-stat-label">High Priority</div>
              <div className="dm-stat-value">{highPriorityCount}</div>
              <div className="dm-stat-badge">urgent</div>
            </div>
            <div className="dm-stat purple">
              <div className="dm-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
              <div className="dm-stat-label">Resolved</div>
              <div className="dm-stat-value">{resolvedCount}</div>
              <div className="dm-stat-badge">closed</div>
            </div>
          </div>

          {/* ══ CONTENT ══ */}
          {detailView ? (

            /* ── Detail View ── */
            <div className="dm-detail-view">
              <button className="dm-back-btn" onClick={() => setDetailView(null)}>
                <MI name="arrow_back" /> Back to Disputes
              </button>

              <div className="dm-detail-zone">
                <div className="dm-detail-zone-head">
                  <div>
                    <div className="dm-detail-zone-title">{detailView.type} <span>Review</span></div>
                    <div className="dm-detail-zone-id">{detailView.id} · {detailView.propertyId}</div>
                  </div>
                  <div
                    style={{
                      background: `${detailView.statusColor}15`,
                      color: detailView.statusColor,
                      border: `1.5px solid ${detailView.statusColor}60`,
                      borderRadius: 20, padding: "3px 12px",
                      fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                    }}
                  >
                    {detailView.status}
                  </div>
                </div>

                <div className="dm-detail-zone-body">

                  {/* Info grid */}
                  <div>
                    <div className="dm-section-lbl">Case Details</div>
                    <div className="dm-info-grid" style={{ marginTop: 10 }}>
                      {[
                        { label: "Property", value: detailView.propertyTitle, dark: true },
                        { label: "Priority", value: detailView.priority, dark: false },
                        { label: "Filed By", value: detailView.filer, dark: false },
                        { label: "Filed On", value: detailView.filedOn, dark: false },
                      ].map((cell, i) => (
                        <div key={i} className={`dm-info-cell${cell.dark ? " dark" : ""}`}>
                          <div className="dm-info-cell-label">{cell.label}</div>
                          <div className="dm-info-cell-value">{cell.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="dm-section-lbl">Description</div>
                    <div className="dm-desc-box" style={{ marginTop: 10 }}>
                      <div className="dm-desc-text">{detailView.description}</div>
                    </div>
                  </div>

                  {/* Evidence */}
                  {(detailView.evidence?.length > 0) && (
                    <div>
                      <div className="dm-section-lbl">Evidence ({detailView.evidence.length})</div>
                      <div className="dm-evidence-list" style={{ marginTop: 10 }}>
                        {detailView.evidence.map((e, i) => (
                          <div key={i} className="dm-evidence-item">
                            <MI name="attach_file" />
                            <span className="dm-evidence-name">{e}</span>
                            <span className="dm-evidence-view">View</span>
                            <MI name="arrow_forward" style={{ fontSize: 13, color: "#5B4FD4" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions or actioned state */}
                  {actioned[detailView.id] ? (
                    <div className="dm-actioned">
                      <MI
                        name={
                          actioned[detailView.id] === "resolve"     ? "check_circle" :
                          actioned[detailView.id] === "investigate" ? "policy" : "cancel"
                        }
                        style={{
                          fontSize: 36,
                          color:
                            actioned[detailView.id] === "resolve"     ? "#2EC4A0" :
                            actioned[detailView.id] === "investigate" ? "#a89fff" : "#F07060",
                        }}
                      />
                      <div className="dm-actioned-title">
                        {actioned[detailView.id] === "resolve"     ? "Dispute Resolved" :
                         actioned[detailView.id] === "investigate" ? "Investigation Opened" : "Dispute Dismissed"}
                      </div>
                      <div className="dm-actioned-sub">Status updated. All parties have been notified.</div>
                      <button className="dm-actioned-btn" onClick={() => setDetailView(null)}>
                        Back to Disputes
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="dm-section-lbl">Resolution Notes</div>
                        <textarea
                          className="dm-resolution-input"
                          style={{ marginTop: 10 }}
                          value={resolution}
                          onChange={e => setResolution(e.target.value)}
                          placeholder="Document your findings and resolution decision..."
                        />
                      </div>

                      <div className="dm-actions">
                        <button
                          className="dm-btn dm-btn-resolve"
                          onClick={() => doAction("resolve")}
                          disabled={!!loading}
                        >
                          {loading === "resolve"
                            ? <><span className="spinner" /> Resolving...</>
                            : <><MI name="check_circle" /> Mark as Resolved</>}
                        </button>
                        <button
                          className="dm-btn dm-btn-investigate"
                          onClick={() => doAction("investigate")}
                          disabled={!!loading}
                        >
                          {loading === "investigate"
                            ? <><span className="spinner" /> Opening...</>
                            : <><MI name="policy" /> Open Investigation</>}
                        </button>
                        <button
                          className="dm-btn dm-btn-dismiss"
                          onClick={() => doAction("dismiss")}
                          disabled={!!loading}
                        >
                          {loading === "dismiss"
                            ? <><span className="spinner" /> Dismissing...</>
                            : <><MI name="cancel" /> Dismiss</>}
                        </button>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>

          ) : (

            /* ── List View ── */
            <div className="dm-zone">
              <div className="dm-zone-header">
                <div className="dm-zone-title-row">
                  <div className="dm-zone-title">Active <span>Disputes</span></div>
                  <div className="dm-zone-pill">{openCount} open</div>
                </div>
              </div>

              <div className="dm-card-list">
                {disputes.map((d, i) => (
                  <div
                    key={i}
                    className="dm-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => setDetailView(d)}
                  >
                    <div className="dm-card-top-row">
                      <div>
                        <div className="dm-card-id">{d.id}</div>
                        <div className="dm-card-title">{d.type}</div>
                        <div className="dm-card-prop">{d.propertyTitle} · {d.propertyId}</div>
                        <div className="dm-card-desc">{d.description}</div>
                      </div>
                      <div className="dm-card-right">
                        <span className={d.priority === "High" ? "dm-pri-high" : "dm-pri-normal"}>
                          {d.priority}
                        </span>
                        <span
                          className="dm-card-type-pill"
                          style={{
                            background: `${d.statusColor}15`,
                            color: d.statusColor,
                            border: `1.5px solid ${d.statusColor}60`,
                          }}
                        >
                          {d.status}
                        </span>
                        <span className="dm-review-btn">
                          Review <MI name="arrow_forward" />
                        </span>
                      </div>
                    </div>

                    <div className="dm-card-footer">
                      <span className="dm-card-filer">Filed by {d.filer}</span>
                      <span className="dm-card-date">{d.filedOn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          )}

        </div>
      </div>
    </>
  );
}