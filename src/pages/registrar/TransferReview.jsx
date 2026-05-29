import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const CHECKLIST = [
  { id: "identity", label: "Seller & buyer identity verified (Aadhaar)"  },
  { id: "title",    label: "Clear title confirmed — no prior encumbrance" },
  { id: "docs",     label: "All required documents uploaded and legible"  },
  { id: "survey",   label: "Survey number matches district records"       },
  { id: "value",    label: "Sale value within market range"               },
  { id: "noc",      label: "No objection from relevant authority"         },
];

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
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .tr-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .tr-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .tr-topbar {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
  }
  .tr-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .tr-heading span { color: #5B4FD4; }
  .tr-topbar-sub { font-size: 11px; font-weight: 500; color: #888; margin-top: 2px; }
  .tr-topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .tr-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px; font-size: 11px; font-weight: 500; color: #666;
  }
  .tr-meta-chip .mi { font-size: 13px; color: #aaa; }
  .tr-pri-high   { font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px; color: #a89fff; background: rgba(124,110,245,0.18); }
  .tr-pri-normal { font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px; color: #2a7a55; background: #e6f8ef; }

  /* ══ BACK BUTTON ══ */
  .tr-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f0f0; border: none; border-radius: 11px;
    padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    color: #555; cursor: pointer; transition: background 0.15s, color 0.15s;
    width: fit-content;
  }
  .tr-back-btn .mi { font-size: 14px; }
  .tr-back-btn:hover { background: #e0e0e0; color: #1a1a1a; }

  /* ══ STAT STRIP ══ */
  .tr-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .tr-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .tr-stat.light  { background: #f0f0f0; }
  .tr-stat.dark   { background: #1a1a1a; }
  .tr-stat.purple { background: #1e1a38; }
  .tr-stat.green  { background: #0d2218; }
  .tr-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .tr-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .tr-stat.dark .tr-stat-label,
  .tr-stat.purple .tr-stat-label,
  .tr-stat.green .tr-stat-label { color: #555; }
  .tr-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .tr-stat.dark .tr-stat-value   { color: #fff; }
  .tr-stat.purple .tr-stat-value { color: #c8c2ff; }
  .tr-stat.green .tr-stat-value  { color: #6effc2; }
  .tr-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .tr-stat.dark .tr-stat-badge   { color: #fff; background: rgba(255,255,255,0.08); }
  .tr-stat.purple .tr-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .tr-stat.green .tr-stat-badge  { color: #6effc2; background: rgba(110,255,194,0.12); }
  @media (max-width: 900px) {
    .tr-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  }

  /* ══ INFO STRIP ══ */
  .tr-strip {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .tr-strip-cell {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 3px;
    flex: 1; min-width: 110px;
  }
  .tr-strip-lbl { font-size: 8.5px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.4px; }
  .tr-strip-val { font-size: 12px; font-weight: 700; color: #1a1a1a; }

  /* ══ SECTION LABEL ══ */
  .tr-sec-lbl {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
    color: #aaa; text-transform: uppercase; margin-bottom: 8px;
  }

  /* ══ ZONE (shared card) ══ */
  .tr-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .tr-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 12px; border-bottom: 1px solid #e8e8e8;
  }
  .tr-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .tr-zone-title { font-size: 13px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .tr-zone-title span { color: #5B4FD4; }
  .tr-zone-pill {
    background: #1a1a1a; color: #fff; border-radius: 20px;
    padding: 2px 10px; font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .tr-zone-sub { font-size: 10px; font-weight: 600; color: #2EC4A0; }

  /* ══ DETAIL LAYOUT ══ */
  .tr-detail-view { animation: slideIn 0.25s ease both; }
  .tr-detail-layout {
    display: grid; grid-template-columns: 1fr 300px;
    gap: 12px; align-items: start;
  }
  .tr-detail-left  { display: flex; flex-direction: column; }
  .tr-sidebar {
    display: flex; flex-direction: column; gap: 12px;
    position: sticky; top: 80px;
  }

  /* ══ PARTIES ══ */
  .tr-parties-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .tr-party {
    background: #f0f0f0; border-radius: 14px; padding: 14px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .tr-party-role { font-size: 8.5px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase; }
  .tr-party-avatar {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: #1a1a1a; margin: 4px 0;
  }
  .tr-party-name    { font-size: 12px; font-weight: 700; color: #1a1a1a; }
  .tr-party-aadhaar { font-family: 'DM Mono', monospace; font-size: 9.5px; color: #aaa; }

  /* ══ DOCUMENTS ══ */
  .tr-docs-list { display: flex; flex-direction: column; gap: 6px; }
  .tr-doc-item {
    display: flex; align-items: center; gap: 10px;
    background: #f0f0f0; border-radius: 12px; padding: 10px 14px;
    border: 1.5px solid transparent;
    cursor: pointer; transition: background 0.15s, border-color 0.15s;
  }
  .tr-doc-item:hover { background: #e8e8e8; }
  .tr-doc-item-viewed { border-color: rgba(46,196,160,0.4); background: rgba(46,196,160,0.05); }
  .tr-doc-item .mi { font-size: 16px; color: #bbb; flex-shrink: 0; }
  .tr-doc-item-viewed .mi { color: #2EC4A0; }
  .tr-doc-name { font-size: 11px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .tr-doc-view { font-size: 10px; font-weight: 700; color: #5B4FD4; flex-shrink: 0; display: flex; align-items: center; gap: 3px; }
  .tr-doc-view .mi { font-size: 12px; }
  .tr-doc-viewed { color: #2EC4A0; }

  /* ══ CHECKLIST ══ */
  .tr-checklist-list { display: flex; flex-direction: column; gap: 6px; }
  .tr-check-item {
    display: flex; align-items: center; gap: 10px;
    background: #f0f0f0; border-radius: 12px; padding: 10px 14px;
    cursor: pointer; transition: background 0.15s;
  }
  .tr-check-item:hover { background: #e8e8e8; }
  .tr-check-box {
    width: 20px; height: 20px; min-width: 20px;
    border: 2px solid #d0d0d0; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .tr-check-box .mi { font-size: 13px; }
  .tr-check-box-checked { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
  .tr-check-label         { font-size: 11px; font-weight: 600; color: #888; }
  .tr-check-label-checked { color: #1a1a1a; }

  /* ══ PROPERTY ON-CHAIN PANEL ══ */
  .tr-chain-zone {
    background: #1a1a1a; border-radius: 20px; overflow: hidden;
  }
  .tr-chain-head {
    padding: 14px 16px 10px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .tr-chain-head-title { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: #555; text-transform: uppercase; }
  .tr-chain-live { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: #2EC4A0; }
  .tr-chain-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #2EC4A0; animation: pulse 2s infinite; }
  .tr-chain-rows { padding: 4px 0 8px; }
  .tr-chain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .tr-chain-row:last-child { border-bottom: none; }
  .tr-chain-label { font-size: 10.5px; font-weight: 500; color: #555; }
  .tr-chain-val   { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #ccc; }
  .tr-chain-val-green { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 600; color: #2EC4A0; }
  .tr-chain-hash {
    margin: 0 16px 12px;
    background: rgba(255,255,255,0.04); border-radius: 10px; padding: 10px 12px;
  }
  .tr-chain-hash-lbl { font-size: 8.5px; font-weight: 700; letter-spacing: 0.07em; color: #444; text-transform: uppercase; margin-bottom: 4px; }
  .tr-chain-hash-val { font-family: 'DM Mono', monospace; font-size: 9.5px; color: #7c6ef5; word-break: break-all; }

  /* ══ DECISION ZONE ══ */
  .tr-decision-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .tr-notes-lbl {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
    color: #aaa; text-transform: uppercase; margin-bottom: 6px;
  }
  .tr-notes-input {
    width: 100%; padding: 10px 12px;
    border: 1.5px solid #e0e0e0; border-radius: 13px;
    background: #f0f0f0; color: #1a1a1a;
    font-size: 11.5px; font-family: inherit;
    resize: vertical; min-height: 80px;
    outline: none; transition: border-color 0.15s, background 0.15s;
  }
  .tr-notes-input:focus { border-color: #bbb; background: #fff; }
  .tr-notes-input::placeholder { color: #bbb; }

  .tr-actions { display: flex; flex-direction: column; gap: 7px; }
  .tr-btn {
    width: 100%; padding: 11px; border-radius: 13px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: inherit; border: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.15s;
  }
  .tr-btn .mi { font-size: 15px; }
  .tr-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .tr-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .tr-btn-approve { background: #1a1a1a; color: #6effc2; }
  .tr-btn-clarify { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .tr-btn-reject  { background: rgba(240,80,80,0.1); color: #c0392b; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ══ SUCCESS STATE ══ */
  .tr-success {
    text-align: center; padding: 20px 16px;
    background: #f0f0f0; border-radius: 16px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .tr-success .mi { font-size: 36px; }
  .tr-success-title { font-size: 13px; font-weight: 800; color: #1a1a1a; }
  .tr-success-sub   { font-size: 10.5px; color: #aaa; margin-bottom: 6px; line-height: 1.5; }
  .tr-success-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .tr-success-btn:hover { background: #2a2a2a; }

  /* ══ LIST CARDS ══ */
  .tr-list { display: flex; flex-direction: column; gap: 10px; }
  .tr-card {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .tr-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }

  .tr-card-top {
    padding: 14px 16px 10px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
  }
  .tr-card-id { font-family: 'DM Mono', monospace; font-size: 9px; color: #aaa; letter-spacing: 0.05em; margin-bottom: 3px; }
  .tr-card-title   { font-size: 12.5px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.2px; line-height: 1.3; }
  .tr-card-parties { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 2px; }

  .tr-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .tr-type-pill {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .tr-type-pill .mi { font-size: 11px; }
  .tr-type-high   { color: #c0392b; background: rgba(240,80,80,0.12); }
  .tr-type-normal { color: #2a7a55; background: rgba(46,196,160,0.13); }
  .tr-done-pill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; display: inline-flex; align-items: center; gap: 3px; }
  .tr-done-pill .mi { font-size: 11px; }
  .tr-done-approve { color: #2a7a55; background: rgba(46,196,160,0.13); }
  .tr-done-reject  { color: #c0392b; background: rgba(240,80,80,0.12); }
  .tr-done-clarify { color: #5B4FD4; background: rgba(91,79,212,0.12); }

  .tr-card-chips {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
    padding: 0 16px 10px;
  }
  .tr-chip { background: rgba(0,0,0,0.04); border-radius: 9px; padding: 7px 10px; display: flex; flex-direction: column; gap: 2px; }
  .tr-chip-lbl { font-size: 8.5px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.4px; }
  .tr-chip-val { font-size: 11px; font-weight: 700; color: #1a1a1a; }

  .tr-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 16px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .tr-card-date { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4; }
  .tr-card-docs { font-size: 9px; font-weight: 600; color: #bbb; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .tr-detail-layout { grid-template-columns: 1fr; }
    .tr-sidebar { position: static; }
    .tr-card-chips { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 580px) {
    .tr-main { padding: 10px 10px 80px; gap: 10px; }
    .tr-topbar { flex-direction: column; align-items: flex-start; }
    .tr-parties-grid { grid-template-columns: 1fr; }
    .tr-strip-cell { min-width: 80px; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function TransferReview() {
  const { user, logout } = useAuth();

  const [allApprovals, setAllApprovals] = useState([]);

  useEffect(() => {
    api.get('/transfers/all')
      .then(res => setAllApprovals(res.data.map(t => ({
        ...t,
        priority: "Normal",
        documents: ["Doc1"],
        saleValue: t.saleValue || "₹ 0"
      }))))
      .catch(console.error);
  }, []);

  const pendingApprovals   = allApprovals.filter(t => t.status !== "Completed" && t.status !== "APPROVED");
  const completedApprovals = allApprovals.filter(t => t.status === "Completed" || t.status === "APPROVED");

  const [detailView, setDetailView] = useState(null);
  const [notes,      setNotes]      = useState("");
  const [loading,    setLoading]    = useState(null);
  const [checklist,  setChecklist]  = useState({});
  const [viewedDocs, setViewedDocs] = useState({});
  const [decisions,  setDecisions]  = useState({});

  const checkCount = Object.values(checklist).filter(Boolean).length;
  const docCount   = detailView?.documents?.length || 0;
  const viewedCount = Object.values(viewedDocs).filter(Boolean).length;

  const doAction = async (action) => {
    setLoading(action);
    const apiStatus = action === 'approve' ? 'APPROVED' : (action === 'reject' ? 'REJECTED' : 'PENDING');
    try {
      await api.put(`/transfers/${detailView.id}/review?status=${apiStatus}&remarks=${notes}`);
      setAllApprovals(prev => prev.map(t => 
        t.id === detailView.id ? { ...t, status: apiStatus, remarks: notes } : t
      ));
      setDecisions(d => ({ ...d, [detailView.id]: action }));
    } catch (err) {
      console.error("Failed to perform action", err);
    } finally {
      setLoading(null);
    }
  };

  const openDetail = (t) => {
    setDetailView(t);
    setNotes("");
    setChecklist({});
    setViewedDocs({});
  };

  const sellerInitials = detailView?.sellerName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "S";
  const buyerInitials  = detailView?.buyerName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()  || "B";

  const decisionColor = (d) => d === "approve" ? "#2EC4A0" : d === "reject" ? "#F07060" : "#5B4FD4";
  const decisionIcon  = (d) => d === "approve" ? "check_circle" : d === "reject" ? "cancel" : "feedback";
  const decisionLabel = (d) => d === "approve" ? "Transfer Approved" : d === "reject" ? "Transfer Rejected" : "Clarification Sent";
  const decisionSub   = (d) =>
    d === "approve" ? "Ownership transfer recorded on blockchain." :
    d === "reject"  ? "Rejection reason recorded. Parties notified." :
    "Request sent to parties for additional documents.";

  return (
    <>
      <style>{styles}</style>
      <div className="tr-page">

        <div className="tr-main">

          {/* ══ TOP BAR ══ */}
          <div className="tr-topbar">
            <div>
              <div className="tr-heading">
                Transfer <span>{detailView ? "Review" : "Queue"}</span>
              </div>
              <div className="tr-topbar-sub">
                {detailView
                  ? `${detailView.id} · ${detailView.propertyId}`
                  : "Select a transfer to begin full review"}
              </div>
            </div>
            <div className="tr-topbar-right">
              {detailView ? (
                <span className={detailView.priority === "High" ? "tr-pri-high" : "tr-pri-normal"}>
                  {detailView.priority} Priority
                </span>
              ) : (
                <div className="tr-meta-chip">
                  <MI name="pending_actions" /> {allApprovals.length} transfers
                </div>
              )}
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          {!detailView && (
            <div className="tr-stats">
              <div className="tr-stat dark">
                <div className="tr-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
                <div className="tr-stat-label">Total Transfers</div>
                <div className="tr-stat-value">{allApprovals.length}</div>
                <div className="tr-stat-badge">all cases</div>
              </div>
              <div className="tr-stat light">
                <div className="tr-stat-label">Pending</div>
                <div className="tr-stat-value">{pendingApprovals.length}</div>
                <div className="tr-stat-badge">awaiting review</div>
              </div>
              <div className="tr-stat purple">
                <div className="tr-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(124,110,245,0.25) 0%, transparent 60%)" }} />
                <div className="tr-stat-label">High Priority</div>
                <div className="tr-stat-value">{allApprovals.filter(t => t.priority === "High").length}</div>
                <div className="tr-stat-badge">urgent</div>
              </div>
              <div className="tr-stat green">
                <div className="tr-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(46,196,160,0.2) 0%, transparent 60%)" }} />
                <div className="tr-stat-label">Completed</div>
                <div className="tr-stat-value">{completedApprovals.length}</div>
                <div className="tr-stat-badge">processed</div>
              </div>
            </div>
          )}

          {/* ══ CONTENT ══ */}
          {detailView ? (

            /* ── DETAIL VIEW ── */
            <div className="tr-detail-view">

              <button className="tr-back-btn" onClick={() => setDetailView(null)}>
                <MI name="arrow_back" /> Back to Queue
              </button>

              {/* Info strip */}
              <div className="tr-strip" style={{ marginBottom: 12 }}>
                {[
                  { label: "Type",      value: detailView.type        || "—" },
                  { label: "Area",      value: detailView.area        || "—" },
                  { label: "District",  value: detailView.district    || "—" },
                  { label: "Survey",    value: detailView.surveyNo    || "—" },
                  { label: "Documents", value: `${docCount} attached`        },
                  { label: "Submitted", value: detailView.submittedOn || "—" },
                ].map((c, i) => (
                  <div key={i} className="tr-strip-cell">
                    <div className="tr-strip-lbl">{c.label}</div>
                    <div className="tr-strip-val">{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Two-column layout */}
              <div className="tr-detail-layout">

                {/* ── Left column ── */}
                <div className="tr-detail-left">

                  {/* Parties */}
                  <div className="tr-zone">
                    <div className="tr-zone-header">
                      <div className="tr-zone-title-row">
                        <div className="tr-zone-title">Transaction <span>Parties</span></div>
                      </div>
                    </div>
                    <div className="tr-parties-grid">
                      <div className="tr-party">
                        <div className="tr-party-role">Seller</div>
                        <div className="tr-party-avatar" style={{ background: "rgba(46,196,160,0.15)", color: "#2EC4A0" }}>
                          {sellerInitials}
                        </div>
                        <div className="tr-party-name">{detailView.sellerName}</div>
                        <div className="tr-party-aadhaar">{detailView.sellerAadhaar || "—"}</div>
                      </div>
                      <div className="tr-party">
                        <div className="tr-party-role">Buyer</div>
                        <div className="tr-party-avatar" style={{ background: "rgba(91,79,212,0.12)", color: "#7c6ef5" }}>
                          {buyerInitials}
                        </div>
                        <div className="tr-party-name">{detailView.buyerName}</div>
                        <div className="tr-party-aadhaar">{detailView.buyerAadhaar || "—"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="tr-zone">
                    <div className="tr-zone-header">
                      <div className="tr-zone-title-row">
                        <div className="tr-zone-title">Uploaded <span>Documents</span></div>
                        <div className="tr-zone-pill">{docCount} files</div>
                      </div>
                      <span className="tr-zone-sub">{viewedCount}/{docCount} reviewed</span>
                    </div>
                    <div className="tr-docs-list">
                      {(detailView.documents || []).map((doc, i) => (
                        <div
                          key={i}
                          className={`tr-doc-item${viewedDocs[doc] ? " tr-doc-item-viewed" : ""}`}
                          onClick={() => setViewedDocs(v => ({ ...v, [doc]: true }))}
                        >
                          <MI name={viewedDocs[doc] ? "check_circle" : "description"} />
                          <span className="tr-doc-name">{doc}</span>
                          {viewedDocs[doc] ? (
                            <span className="tr-doc-view tr-doc-viewed">
                              <MI name="check" /> Reviewed
                            </span>
                          ) : (
                            <span className="tr-doc-view">
                              View <MI name="arrow_forward" />
                            </span>
                          )}
                        </div>
                      ))}
                      {docCount === 0 && (
                        <div style={{ padding: "12px", textAlign: "center", color: "#bbb", fontSize: "11px" }}>
                          No documents uploaded yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="tr-zone">
                    <div className="tr-zone-header">
                      <div className="tr-zone-title-row">
                        <div className="tr-zone-title">Verification <span>Checklist</span></div>
                        <div className="tr-zone-pill">{checkCount}/{CHECKLIST.length}</div>
                      </div>
                      <span className="tr-zone-sub">
                        {Math.round((checkCount / CHECKLIST.length) * 100)}% complete
                      </span>
                    </div>
                    <div className="tr-checklist-list">
                      {CHECKLIST.map(item => (
                        <div
                          key={item.id}
                          className="tr-check-item"
                          onClick={() => setChecklist(c => ({ ...c, [item.id]: !c[item.id] }))}
                        >
                          <div className={`tr-check-box${checklist[item.id] ? " tr-check-box-checked" : ""}`}>
                            {checklist[item.id] && <MI name="check" />}
                          </div>
                          <span className={`tr-check-label${checklist[item.id] ? " tr-check-label-checked" : ""}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ── Sidebar ── */}
                <div className="tr-sidebar">

                  {/* Property on-chain */}
                  <div className="tr-chain-zone">
                    <div className="tr-chain-head">
                      <span className="tr-chain-head-title">Property On-Chain</span>
                      <span className="tr-chain-live">
                        <span className="tr-chain-live-dot" /> LIVE
                      </span>
                    </div>
                    <div className="tr-chain-rows">
                      {[
                        { label: "Property ID", val: detailView.propertyId || "—",   green: false },
                        { label: "Type",        val: detailView.type        || "—",   green: false },
                        { label: "Survey No.",  val: detailView.surveyNo    || "—",   green: false },
                        { label: "District",    val: detailView.district    || "—",   green: false },
                        { label: "Sale Value",  val: detailView.saleValue,             green: true  },
                      ].map((r, i) => (
                        <div key={i} className="tr-chain-row">
                          <span className="tr-chain-label">{r.label}</span>
                          <span className={r.green ? "tr-chain-val-green" : "tr-chain-val"}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="tr-chain-hash">
                      <div className="tr-chain-hash-lbl">Block Hash</div>
                      <div className="tr-chain-hash-val">0x3f9a1bc2d4e5f678a9b0c1d2e3f4a5b6</div>
                    </div>
                  </div>

                  {/* Decision */}
                  <div className="tr-decision-zone">
                    <div className="tr-zone-header" style={{ paddingBottom: 12, borderBottom: "1px solid #e8e8e8" }}>
                      <div className="tr-zone-title-row">
                        <div className="tr-zone-title">Registrar <span>Decision</span></div>
                      </div>
                    </div>

                    {decisions[detailView.id] ? (
                      <div className="tr-success">
                        <MI
                          name={decisionIcon(decisions[detailView.id])}
                          style={{ color: decisionColor(decisions[detailView.id]) }}
                        />
                        <div className="tr-success-title">{decisionLabel(decisions[detailView.id])}</div>
                        <div className="tr-success-sub">{decisionSub(decisions[detailView.id])}</div>
                        <button className="tr-success-btn" onClick={() => setDetailView(null)}>
                          Back to Queue
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="tr-notes-lbl">Registrar Notes</div>
                          <textarea
                            className="tr-notes-input"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Add remarks, conditions, or reasons…"
                          />
                        </div>
                        <div className="tr-actions">
                          <button className="tr-btn tr-btn-approve" onClick={() => doAction("approve")} disabled={!!loading}>
                            {loading === "approve"
                              ? <><span className="spinner" /> Approving…</>
                              : <><MI name="check_circle" /> Approve Transfer</>}
                          </button>
                          <button className="tr-btn tr-btn-clarify" onClick={() => doAction("clarify")} disabled={!!loading}>
                            {loading === "clarify"
                              ? <><span className="spinner" /> Sending…</>
                              : <><MI name="edit_note" /> Request Clarification</>}
                          </button>
                          <button className="tr-btn tr-btn-reject" onClick={() => doAction("reject")} disabled={!!loading}>
                            {loading === "reject"
                              ? <><span className="spinner" /> Rejecting…</>
                              : <><MI name="cancel" /> Reject Transfer</>}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>

          ) : (

            /* ── LIST VIEW ── */
            <>
              <div className="tr-sec-lbl">All Transfers ({allApprovals.length})</div>
              <div className="tr-list">
                {allApprovals.map((t, i) => {
                  const done = decisions[t.id];
                  return (
                    <div
                      key={t.id}
                      className="tr-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => openDetail(t)}
                    >
                      <div className="tr-card-top">
                        <div>
                          <div className="tr-card-id">{t.id}</div>
                          <div className="tr-card-title">{t.propertyTitle}</div>
                          <div className="tr-card-parties">{t.sellerName} → {t.buyerName}</div>
                        </div>
                        <div className="tr-card-right">
                          {done ? (
                            <span className={`tr-done-pill tr-done-${done}`}>
                              <MI name={decisionIcon(done)} />
                              {done === "approve" ? "Approved" : done === "reject" ? "Rejected" : "Clarify"}
                            </span>
                          ) : (
                            <span className={t.priority === "High" ? "tr-pri-high" : "tr-pri-normal"}>
                              {t.priority}
                            </span>
                          )}
                          <span className={`tr-type-pill ${t.priority === "High" ? "tr-type-high" : "tr-type-normal"}`}>
                            <MI name={TYPE_ICONS[t.type] || "home"} />
                            {t.type || "Transfer"}
                          </span>
                        </div>
                      </div>

                      <div className="tr-card-chips">
                        <div className="tr-chip">
                          <div className="tr-chip-lbl">Area</div>
                          <div className="tr-chip-val">{t.area || "—"}</div>
                        </div>
                        <div className="tr-chip">
                          <div className="tr-chip-lbl">District</div>
                          <div className="tr-chip-val">{t.district || "—"}</div>
                        </div>
                        <div className="tr-chip">
                          <div className="tr-chip-lbl">Value</div>
                          <div className="tr-chip-val">{t.saleValue}</div>
                        </div>
                      </div>

                      <div className="tr-card-footer">
                        <span className="tr-card-date">{t.submittedOn || t.completedOn}</span>
                        <span className="tr-card-docs">{t.documents?.length || 0} docs attached</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}