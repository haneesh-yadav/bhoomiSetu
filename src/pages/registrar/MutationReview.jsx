import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   MUTATION TYPE META
══════════════════════════════════════════════════ */
const MUTATION_META = {
  Inheritance:   { icon: "science",    color: "#5B4FD4" },
  Correction:    { icon: "straighten", color: "#2EC4A0" },
  Partition:     { icon: "call_split", color: "#F07060" },
  "Name Change": { icon: "badge",      color: "#C8F135" },
};

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
  .mr2-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .mr2-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .mr2-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .mr2-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .mr2-heading span { color: #2EC4A0; }
  .mr2-topbar-right { display: flex; align-items: center; gap: 8px; }
  .mr2-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .mr2-meta-chip .mi { font-size: 13px; color: #aaa; }

  /* ══ STAT STRIP ══ */
  .mr2-stats { display: flex; gap: 12px; flex-shrink: 0; }
  .mr2-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .mr2-stat.light  { background: #f0f0f0; }
  .mr2-stat.dark   { background: #1a1a1a; }
  .mr2-stat.teal   { background: #0d2420; }
  .mr2-stat.purple { background: #1e1a38; }
  .mr2-stat-glow   { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .mr2-stat-label  { font-size: 10.5px; font-weight: 500; color: #999; }
  .mr2-stat.dark .mr2-stat-label,
  .mr2-stat.teal .mr2-stat-label,
  .mr2-stat.purple .mr2-stat-label { color: #555; }
  .mr2-stat-value  { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .mr2-stat.dark .mr2-stat-value   { color: #fff; }
  .mr2-stat.teal .mr2-stat-value   { color: #6effc2; }
  .mr2-stat.purple .mr2-stat-value { color: #c8c2ff; }
  .mr2-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .mr2-stat.dark .mr2-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .mr2-stat.teal .mr2-stat-badge   { color: #2EC4A0; background: rgba(46,196,160,0.15); }
  .mr2-stat.purple .mr2-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }

  /* ══ ZONE ══ */
  .mr2-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mr2-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .mr2-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .mr2-zone-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .mr2-zone-title span { color: #2EC4A0; }
  .mr2-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ══ MUTATION CARDS ══ */
  .mr2-card-list { display: flex; flex-direction: column; gap: 8px; }

  .mr2-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mr2-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .mr2-card-top-row {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
  }
  .mr2-card-type-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    margin-right: 4px;
  }
  .mr2-card-type-icon .mi { font-size: 16px; }
  .mr2-card-left { display: flex; align-items: flex-start; gap: 10px; }

  .mr2-card-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .mr2-card-title {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .mr2-card-prop  { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .mr2-card-reason { font-size: 10.5px; color: #888; line-height: 1.5; margin-top: 2px; }

  .mr2-card-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;
  }
  .mr2-card-status-badge {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    border: 1.5px solid transparent;
  }
  .mr2-card-docs-chip {
    font-size: 9px; font-weight: 600; color: #aaa;
    background: rgba(0,0,0,0.05); border-radius: 20px; padding: 2px 8px;
  }
  .mr2-decision-pill {
    font-size: 9px; font-weight: 700; padding: 2px 9px; border-radius: 20px;
    display: flex; align-items: center; gap: 3px;
  }
  .mr2-decision-pill .mi { font-size: 11px; }

  .mr2-review-btn {
    font-size: 10px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 3px;
  }
  .mr2-review-btn .mi { font-size: 13px; }

  .mr2-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .mr2-card-filer { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #2EC4A0; }
  .mr2-card-date  { font-size: 9px; font-weight: 600; color: #aaa; }

  /* ══ DETAIL VIEW ══ */
  .mr2-detail-view { animation: slideIn 0.25s ease both; display: flex; flex-direction: column; gap: 12px; }

  .mr2-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s; width: fit-content;
  }
  .mr2-back-btn:hover { background: #2a2a2a; }
  .mr2-back-btn .mi { font-size: 14px; }

  .mr2-detail-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mr2-detail-zone-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .mr2-detail-zone-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .mr2-detail-zone-title span { color: #2EC4A0; }
  .mr2-detail-zone-id { font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa; margin-top: 2px; }
  .mr2-detail-zone-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Type banner ── */
  .mr2-type-banner {
    border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
  }
  .mr2-type-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .mr2-type-icon .mi { font-size: 20px; }
  .mr2-type-name { font-size: 13px; font-weight: 800; color: #1a1a1a; }
  .mr2-type-id   { font-family: 'DM Mono', monospace; font-size: 9px; color: #aaa; margin-top: 2px; }

  /* ── Section label ── */
  .mr2-section-lbl {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: #aaa;
    text-transform: uppercase; padding-bottom: 6px;
    border-bottom: 1px solid #e8e8e8;
  }

  /* ── Info grid ── */
  .mr2-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .mr2-info-cell {
    background: #f0f0f0; border-radius: 12px; padding: 10px 12px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .mr2-info-cell.dark { background: #1a1a1a; }
  .mr2-info-cell-label { font-size: 9px; font-weight: 500; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
  .mr2-info-cell.dark .mr2-info-cell-label { color: #555; }
  .mr2-info-cell-value { font-size: 12px; font-weight: 700; color: #1a1a1a; }
  .mr2-info-cell.dark .mr2-info-cell-value { color: #fff; }

  /* ── Reason box ── */
  .mr2-reason-box { background: #f0f0f0; border-radius: 14px; padding: 12px 14px; }
  .mr2-reason-text { font-size: 11.5px; color: #555; line-height: 1.6; }

  /* ── Documents ── */
  .mr2-docs-list { display: flex; flex-direction: column; gap: 6px; }
  .mr2-doc-item {
    background: #f0f0f0; border-radius: 12px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
  }
  .mr2-doc-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  .mr2-doc-item .mi { font-size: 16px; color: #aaa; }
  .mr2-doc-name { font-size: 11.5px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .mr2-doc-view { font-size: 9px; font-weight: 700; color: #2EC4A0; }

  /* ── Notes input ── */
  .mr2-notes-input {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid #e0e0e0; border-radius: 14px;
    background: #f0f0f0; color: #1a1a1a;
    font-size: 12px; font-family: 'Poppins', sans-serif;
    resize: vertical; min-height: 80px;
    outline: none; transition: border-color 0.2s;
  }
  .mr2-notes-input:focus { border-color: #2EC4A0; }
  .mr2-notes-input::placeholder { color: #bbb; }

  /* ── Action buttons ── */
  .mr2-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .mr2-btn {
    flex: 1; min-width: 130px;
    border-radius: 13px; padding: 10px 16px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; border: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.15s;
  }
  .mr2-btn .mi { font-size: 15px; }
  .mr2-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .mr2-btn:not(:disabled):hover { transform: translateY(-1px); }

  .mr2-btn-approve     { background: #1a1a1a; color: #2EC4A0; }
  .mr2-btn-approve:not(:disabled):hover { background: #2a2a2a; }
  .mr2-btn-query       { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .mr2-btn-query:not(:disabled):hover   { background: rgba(91,79,212,0.18); }
  .mr2-btn-reject      { background: #f0f0f0; color: #F07060; }
  .mr2-btn-reject:not(:disabled):hover  { background: #e8e8e8; }

  /* ── Spinner ── */
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Actioned state ── */
  .mr2-actioned {
    text-align: center; padding: 24px 16px;
    background: #f0f0f0; border-radius: 18px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .mr2-actioned-title { font-size: 14px; font-weight: 800; color: #1a1a1a; }
  .mr2-actioned-sub   { font-size: 11px; color: #888; line-height: 1.5; }
  .mr2-actioned-btn {
    margin-top: 8px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 8px 18px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .mr2-actioned-btn:hover { background: #2a2a2a; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .mr2-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .mr2-info-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 580px) {
    .mr2-main { padding: 10px 10px 80px; gap: 10px; }
    .mr2-topbar { flex-direction: column; align-items: flex-start; }
    .mr2-actions { flex-direction: column; }
    .mr2-btn { min-width: unset; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function MutationReview() {
  const { user, logout } = useAuth();

  const [detailView, setDetailView] = useState(null);
  const [notes, setNotes]           = useState("");
  const [loading, setLoading]       = useState(null);
  const [decisions, setDecisions]   = useState({});
  const [mutations, setMutations]   = useState([]);

  useEffect(() => {
    api.get('/mutations/all')
      .then(res => setMutations(res.data.map(m => ({
        ...m,
        type: m.reason ? m.reason.split(':')[0] : "Mutation",
        statusColor: m.status === "PENDING" ? "#ff8c50" : (m.status === "APPROVED" ? "#2EC4A0" : "#F07060"),
        filer: m.applicantName || "Unknown",
        submittedOn: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
        documents: m.supportingDoc ? ["Document 1"] : []
      }))))
      .catch(console.error);
  }, []);

  const pendingCount  = mutations.filter(m => m.status === "PENDING").length;
  const approvedCount = mutations.filter(m => m.status === "APPROVED").length;
  const queriedCount  = mutations.filter(m => m.status === "REJECTED").length; // Treating queried as part of rejected or just keep it simple

  const doAction = async (action) => {
    setLoading(action);
    const newStatus = action === 'approve' ? 'APPROVED' : (action === 'reject' ? 'REJECTED' : 'PENDING');
    try {
      await api.put(`/mutations/${detailView.id}/review?status=${newStatus}&remarks=${encodeURIComponent(notes)}`);
      setDecisions(d => ({ ...d, [detailView?.id]: action }));
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mr2-page">

        <div className="mr2-main">

          {/* ══ TOP BAR ══ */}
          <div className="mr2-topbar">
            <div className="mr2-heading">
              Mutation <span>Review</span>
            </div>
            <div className="mr2-topbar-right">
              {user?.district && (
                <div className="mr2-meta-chip">
                  <MI name="location_on" /> {user.district}
                </div>
              )}
              <div className="mr2-meta-chip">
                <MI name="edit_document" /> {pendingCount} Pending
              </div>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="mr2-stats">
            <div className="mr2-stat dark">
              <div className="mr2-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="mr2-stat-label">Total Requests</div>
              <div className="mr2-stat-value">{mutations.length}</div>
              <div className="mr2-stat-badge">all cases</div>
            </div>
            <div className="mr2-stat light">
              <div className="mr2-stat-label">Pending</div>
              <div className="mr2-stat-value">{pendingCount}</div>
              <div className="mr2-stat-badge">awaiting review</div>
            </div>
            <div className="mr2-stat teal">
              <div className="mr2-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(46,196,160,0.2) 0%, transparent 60%)" }} />
              <div className="mr2-stat-label">Approved</div>
              <div className="mr2-stat-value">{approvedCount}</div>
              <div className="mr2-stat-badge">completed</div>
            </div>
            <div className="mr2-stat purple">
              <div className="mr2-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
              <div className="mr2-stat-label">Queried</div>
              <div className="mr2-stat-value">{queriedCount}</div>
              <div className="mr2-stat-badge">clarification</div>
            </div>
          </div>

          {/* ══ CONTENT ══ */}
          {detailView ? (

            /* ── Detail View ── */
            <div className="mr2-detail-view">
              <button className="mr2-back-btn" onClick={() => setDetailView(null)}>
                <MI name="arrow_back" /> Back to Requests
              </button>

              <div className="mr2-detail-zone">
                {(() => {
                  const meta = MUTATION_META[detailView.type] || MUTATION_META["Inheritance"];
                  return (
                    <>
                      <div className="mr2-detail-zone-head">
                        <div>
                          <div className="mr2-detail-zone-title">
                            {detailView.type} <span>Request</span>
                          </div>
                          <div className="mr2-detail-zone-id">{detailView.id} · {detailView.propertyId}</div>
                        </div>
                        <div
                          style={{
                            background: `${meta.color}15`,
                            color: meta.color,
                            border: `1.5px solid ${meta.color}60`,
                            borderRadius: 20, padding: "3px 12px",
                            fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <MI name={meta.icon} style={{ fontSize: 12 }} />
                          {detailView.status}
                        </div>
                      </div>

                      <div className="mr2-detail-zone-body">

                        {/* Type banner */}
                        <div
                          className="mr2-type-banner"
                          style={{ background: `${meta.color}12` }}
                        >
                          <div
                            className="mr2-type-icon"
                            style={{ background: `${meta.color}22` }}
                          >
                            <MI name={meta.icon} style={{ color: meta.color }} />
                          </div>
                          <div>
                            <div className="mr2-type-name">{detailView.type} Request</div>
                            <div className="mr2-type-id">{detailView.id}</div>
                          </div>
                        </div>

                        {/* Info grid */}
                        <div>
                          <div className="mr2-section-lbl">Request Details</div>
                          <div className="mr2-info-grid" style={{ marginTop: 10 }}>
                            {[
                              { label: "Property",    value: detailView.propertyTitle, dark: true },
                              { label: "Property ID", value: detailView.propertyId,    dark: false },
                              { label: "Filed By",    value: detailView.filer,         dark: false },
                              { label: "Submitted",   value: detailView.submittedOn,   dark: false },
                            ].map((cell, i) => (
                              <div key={i} className={`mr2-info-cell${cell.dark ? " dark" : ""}`}>
                                <div className="mr2-info-cell-label">{cell.label}</div>
                                <div className="mr2-info-cell-value">{cell.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reason */}
                        <div>
                          <div className="mr2-section-lbl">Stated Reason</div>
                          <div className="mr2-reason-box" style={{ marginTop: 10 }}>
                            <div className="mr2-reason-text">{detailView.reason}</div>
                          </div>
                        </div>

                        {/* Documents */}
                        {detailView.documents?.length > 0 && (
                          <div>
                            <div className="mr2-section-lbl">
                              Supporting Documents ({detailView.documents.length})
                            </div>
                            <div className="mr2-docs-list" style={{ marginTop: 10 }}>
                              {detailView.documents.map((d, i) => (
                                <div key={i} className="mr2-doc-item">
                                  <MI name="description" />
                                  <span className="mr2-doc-name">{d}</span>
                                  <span className="mr2-doc-view">View</span>
                                  <MI name="arrow_forward" style={{ fontSize: 13, color: "#2EC4A0" }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Decision / Actions */}
                        {decisions[detailView.id] ? (
                          <div className="mr2-actioned">
                            <MI
                              name={
                                decisions[detailView.id] === "approve" ? "check_circle" :
                                decisions[detailView.id] === "reject"  ? "cancel" : "help"
                              }
                              style={{
                                fontSize: 36,
                                color:
                                  decisions[detailView.id] === "approve" ? "#2EC4A0" :
                                  decisions[detailView.id] === "reject"  ? "#F07060" : "#a89fff",
                              }}
                            />
                            <div className="mr2-actioned-title">
                              {decisions[detailView.id] === "approve" ? "Mutation Approved" :
                               decisions[detailView.id] === "reject"  ? "Mutation Rejected" : "Clarification Requested"}
                            </div>
                            <div className="mr2-actioned-sub">
                              {decisions[detailView.id] === "approve"
                                ? "Land records updated."
                                : "Notification sent to applicant."}
                            </div>
                            <button className="mr2-actioned-btn" onClick={() => setDetailView(null)}>
                              Back to Requests
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="mr2-section-lbl">Registrar Notes</div>
                              <textarea
                                className="mr2-notes-input"
                                style={{ marginTop: 10 }}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Add remarks or reason for decision..."
                              />
                            </div>
                            <div className="mr2-actions">
                              <button
                                className="mr2-btn mr2-btn-approve"
                                onClick={() => doAction("approve")}
                                disabled={!!loading}
                              >
                                {loading === "approve"
                                  ? <><span className="spinner" /> Approving...</>
                                  : <><MI name="check_circle" /> Approve Mutation</>}
                              </button>
                              <button
                                className="mr2-btn mr2-btn-query"
                                onClick={() => doAction("query")}
                                disabled={!!loading}
                              >
                                {loading === "query"
                                  ? <><span className="spinner" /> Sending...</>
                                  : <><MI name="help" /> Request Clarification</>}
                              </button>
                              <button
                                className="mr2-btn mr2-btn-reject"
                                onClick={() => doAction("reject")}
                                disabled={!!loading}
                              >
                                {loading === "reject"
                                  ? <><span className="spinner" /> Rejecting...</>
                                  : <><MI name="cancel" /> Reject Mutation</>}
                              </button>
                            </div>
                          </>
                        )}

                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

          ) : (

            /* ── List View ── */
            <div className="mr2-zone">
              <div className="mr2-zone-header">
                <div className="mr2-zone-title-row">
                  <div className="mr2-zone-title">Mutation <span>Requests</span></div>
                  <div className="mr2-zone-pill">{mutations.length} total</div>
                </div>
              </div>

              <div className="mr2-card-list">
                {mutations.map((m, i) => {
                  const meta = MUTATION_META[m.type] || MUTATION_META["Inheritance"];
                  const dec  = decisions[m.id];
                  return (
                    <div
                      key={m.id}
                      className="mr2-card"
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => setDetailView(m)}
                    >
                      <div className="mr2-card-top-row">
                        <div className="mr2-card-left">
                          <div
                            className="mr2-card-type-icon"
                            style={{ background: `${meta.color}18` }}
                          >
                            <MI name={meta.icon} style={{ color: meta.color }} />
                          </div>
                          <div>
                            <div className="mr2-card-id">{m.id}</div>
                            <div className="mr2-card-title">{m.type} Request</div>
                            <div className="mr2-card-prop">{m.propertyTitle} · {m.propertyId}</div>
                            <div className="mr2-card-reason">{m.reason}</div>
                          </div>
                        </div>
                        <div className="mr2-card-right">
                          {dec ? (
                            <span
                              className="mr2-decision-pill"
                              style={{
                                background: dec === "approve" ? "rgba(46,196,160,0.12)" : dec === "reject" ? "rgba(240,112,96,0.12)" : "rgba(91,79,212,0.12)",
                                color:      dec === "approve" ? "#2EC4A0"               : dec === "reject" ? "#F07060"              : "#a89fff",
                              }}
                            >
                              <MI name={dec === "approve" ? "check_circle" : dec === "reject" ? "cancel" : "help"} />
                              {dec === "approve" ? "Approved" : dec === "reject" ? "Rejected" : "Queried"}
                            </span>
                          ) : (
                            <span
                              className="mr2-card-status-badge"
                              style={{
                                background: `${m.statusColor}15`,
                                color: m.statusColor,
                                borderColor: `${m.statusColor}50`,
                              }}
                            >
                              {m.status}
                            </span>
                          )}
                          <span className="mr2-card-docs-chip">
                            {m.documents?.length || 0} docs
                          </span>
                          <span className="mr2-review-btn">
                            Review <MI name="arrow_forward" />
                          </span>
                        </div>
                      </div>

                      <div className="mr2-card-footer">
                        <span className="mr2-card-filer">Filed by {m.filer}</span>
                        <span className="mr2-card-date">{m.submittedOn}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          )}

        </div>
      </div>
    </>
  );
}