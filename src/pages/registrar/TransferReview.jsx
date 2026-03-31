import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPendingApprovals, getCompletedApprovals } from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

const CHECKLIST = [
  { id: "identity", label: "Seller & buyer identity verified (Aadhaar)"  },
  { id: "title",    label: "Clear title confirmed — no prior encumbrance" },
  { id: "docs",     label: "All required documents uploaded and legible"  },
  { id: "survey",   label: "Survey number matches district records"       },
  { id: "value",    label: "Sale value within market range"               },
  { id: "noc",      label: "No objection from relevant authority"         },
];

const TYPE_ICONS = { Residential: "home", Agricultural: "grass", Commercial: "store" };

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
    from { opacity: 0; transform: translateY(14px); }
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

  /* ── Page shell ── */
  .tr-page {
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
  .tr-header {
    background: #fff;
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tr-header-left  { display: flex; flex-direction: column; gap: 0.2rem; }
  .tr-header-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; flex-wrap: wrap; }

  .tr-page-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(13, 61, 43, 0.4); }
  .tr-page-title { font-size: 1.15rem; font-weight: 800; color: #0D3D2B; letter-spacing: -0.02em; }
  .tr-page-sub   { font-size: 0.78rem; color: rgba(13, 61, 43, 0.5); font-weight: 500; margin-top: 0.1rem; }

  /* ── Content ── */
  .tr-content { padding: 1.5rem 1.5rem 3rem; }

  /* ── Back button ── */
  .tr-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.38rem 0.9rem;
    border: 2px solid rgba(13, 61, 43, 0.2);
    border-radius: 8px;
    background: #fff;
    color: #0D3D2B;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    margin-bottom: 1.25rem;
    box-shadow: 2px 2px 0 rgba(13, 61, 43, 0.1);
  }

  .tr-back-btn .material-icons-sharp { font-size: 15px; }
  .tr-back-btn:hover { background: #0D3D2B; color: #C8F135; border-color: #0D3D2B; }

  /* ── List view ── */
  .tr-list-section-lbl {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.85rem;
  }

  .tr-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Transfer card ── */
  .tr-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
    animation: fadeUp 0.4s ease both;
  }

  .tr-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .tr-card-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .tr-card-tab {
    height: 22px;
    border-radius: 5px 5px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.6rem;
    font-weight: 800;
    gap: 4px;
  }

  .tr-card-tab .material-icons-sharp { font-size: 13px; }
  .tr-card-body { padding: 1rem 1.25rem; }

  .tr-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .tr-card-id { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: rgba(13, 61, 43, 0.35); }

  .tr-pri-high   { background: #F07060; color: #fff; border-radius: 5px; padding: 2px 8px; font-size: 0.6rem; font-weight: 800; }
  .tr-pri-normal { background: #C8F135; color: #0D3D2B; border-radius: 5px; padding: 2px 8px; font-size: 0.6rem; font-weight: 800; border: 1.5px solid rgba(13,61,43,0.1); }

  .tr-card-title   { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; margin-bottom: 0.2rem; }
  .tr-card-parties { font-size: 0.75rem; color: rgba(13, 61, 43, 0.5); margin-bottom: 0.65rem; }

  .tr-card-chips {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.4rem;
  }

  .tr-chip     { background: rgba(13,61,43,0.02); border: 1.5px solid rgba(13, 61, 43, 0.1); border-radius: 7px; padding: 0.4rem 0.6rem; }
  .tr-chip-lbl { font-size: 0.55rem; font-weight: 800; letter-spacing: 0.06em; color: rgba(13, 61, 43, 0.38); margin-bottom: 0.1rem; }
  .tr-chip-val { font-size: 0.75rem; font-weight: 700; color: #0D3D2B; }

  .tr-card-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.08);
    padding: 0.55rem 1.25rem;
    display: flex;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .tr-card-date { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .tr-card-docs { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .tr-card-docs span { background: rgba(13, 61, 43, 0.06); border-radius: 4px; padding: 1px 6px; font-weight: 700; }

  /* ── Detail view ── */
  .tr-detail-view { animation: slideIn 0.25s ease both; }

  .tr-detail-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
    align-items: start;
  }

  /* ── Info strip ── */
  .tr-strip {
    background: rgba(13,61,43,0.02);
    border: 1.5px solid rgba(13, 61, 43, 0.1);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin-bottom: 1.5rem;
  }

  .tr-strip-inner {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .tr-strip-cell {
    background: #fff;
    border: 1.5px solid rgba(13, 61, 43, 0.1);
    border-radius: 8px;
    padding: 0.55rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 110px;
    flex: 1;
  }

  .tr-strip-lbl { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.1em; color: rgba(13, 61, 43, 0.38); }
  .tr-strip-val { font-size: 0.88rem; font-weight: 700; color: #0D3D2B; }

  .tr-sec-lbl {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.85rem;
  }

  /* ── Parties card ── */
  .tr-parties-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    margin-bottom: 1.5rem;
  }

  .tr-parties-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .tr-parties-tab {
    height: 24px;
    border-radius: 5px 5px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 0.62rem;
    font-weight: 800;
  }

  .tr-parties-body {
    padding: 1.25rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .tr-party {
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    padding: 1rem;
    background: rgba(13,61,43,0.02);
  }

  .tr-party-role {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .tr-party-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1.5px solid rgba(13,61,43,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 6px rgba(13,61,43,0.08);
  }

  .tr-party-name    { font-size: 0.88rem; font-weight: 800; color: #0D3D2B; margin-bottom: 0.2rem; }
  .tr-party-aadhaar { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: rgba(13, 61, 43, 0.45); }

  /* ── Documents card ── */
  .tr-docs-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    margin-bottom: 1.5rem;
  }

  .tr-docs-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .tr-docs-head-lbl { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; color: rgba(13, 61, 43, 0.45); }
  .tr-docs-reviewed { font-size: 0.7rem; font-weight: 700; color: #2EC4A0; }

  .tr-docs-list {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tr-doc-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 9px;
    background: rgba(13,61,43,0.02);
    cursor: pointer;
    transition: all 0.18s;
  }

  .tr-doc-item:hover         { border-color: #0D3D2B; }
  .tr-doc-item-viewed        { border-color: #2EC4A0; background: rgba(46, 196, 160, 0.05); }
  .tr-doc-name               { font-size: 0.8rem; font-weight: 700; color: #0D3D2B; flex: 1; }
  .tr-doc-view               { font-size: 0.68rem; font-weight: 800; color: #F07060; }
  .tr-doc-viewed             { color: #2EC4A0; }

  /* ── Checklist card ── */
  .tr-checklist-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    margin-bottom: 1.5rem;
  }

  .tr-checklist-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .tr-checklist-lbl  { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; color: rgba(13, 61, 43, 0.45); }
  .tr-checklist-prog { font-size: 0.7rem; font-weight: 700; color: #2EC4A0; }

  .tr-checklist-body {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .tr-check-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border: 1.5px solid rgba(13, 61, 43, 0.08);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .tr-check-item:hover { background: rgba(13,61,43,0.02); }

  .tr-check-box {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border: 2px solid rgba(13, 61, 43, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    transition: all 0.15s;
  }

  .tr-check-box-checked { background: #2EC4A0; border-color: #2EC4A0; color: #fff; }

  .tr-check-label         { font-size: 0.8rem; font-weight: 600; color: rgba(13, 61, 43, 0.65); }
  .tr-check-label-checked { color: #2EC4A0; }

  /* ── Sidebar ── */
  .tr-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    position: sticky;
    top: 115px;
  }

  /* ── Property card ── */
  .tr-prop-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #0D3D2B;
    padding: 1.25rem;
    box-shadow: 0 4px 12px rgba(200,241,53,0.2);
  }

  .tr-prop-head {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 0.85rem;
  }

  .tr-prop-rows { display: flex; flex-direction: column; gap: 0.5rem; }

  .tr-prop-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .tr-prop-row:last-child { border-bottom: none; }
  .tr-prop-lbl { font-size: 0.62rem; color: rgba(255, 255, 255, 0.35); font-weight: 600; }
  .tr-prop-val { font-size: 0.75rem; font-weight: 700; color: #C8F135; }

  .tr-prop-hash {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 7px;
  }

  .tr-prop-hash-lbl { font-size: 0.55rem; font-weight: 800; letter-spacing: 0.08em; color: rgba(200, 241, 53, 0.4); margin-bottom: 0.15rem; }
  .tr-prop-hash-val { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: #C8F135; word-break: break-all; }

  /* ── Decision card ── */
  .tr-decision-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  .tr-decision-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .tr-decision-tab {
    height: 22px;
    border-radius: 5px 5px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.6rem;
    font-weight: 800;
  }

  .tr-decision-body { padding: 1.1rem; }

  .tr-notes-lbl {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .tr-notes-input {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 2px solid rgba(13, 61, 43, 0.18);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    color: #0D3D2B;
    font-size: 0.8rem;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 1rem;
  }

  .tr-notes-input:focus { border-color: #0D3D2B; }
  .tr-notes-input::placeholder { color: rgba(13, 61, 43, 0.32); }

  /* ── Action buttons ── */
  .tr-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tr-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.18s;
    border: 2.5px solid;
  }

  .tr-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .tr-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .tr-btn-approve { background: #2EC4A0; color: #0D3D2B; border-color: #2EC4A0; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .tr-btn-clarify { background: #C8F135; color: #0D3D2B; border-color: #0D3D2B; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .tr-btn-reject  { background: #fff; color: #F07060; border-color: #F07060; }
  .tr-btn-reject:hover { background: rgba(240, 112, 96, 0.05); }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Success state ── */
  .tr-success { text-align: center; padding: 1.5rem 1rem; }

  .tr-success-icon  { margin-bottom: 0.5rem; display: flex; justify-content: center; }
  .tr-success-title { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; }

  .tr-success-sub {
    font-size: 0.72rem;
    color: rgba(13, 61, 43, 0.45);
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .tr-success-btn {
    padding: 0.6rem 1.25rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 6px rgba(13,61,43,0.08);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .tr-detail-layout { grid-template-columns: 1fr; }
    .tr-sidebar { position: static; }
  }

  @media (max-width: 768px) {
    .page-container { margin: 1rem; border-radius: 12px; }
    .tr-content { padding: 1rem 1rem 3rem; }
    .tr-parties-body { grid-template-columns: 1fr; }
    .tr-card-chips { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function TransferReview() {
  const navigate        = useNavigate();
  const { user, logout} = useAuth();

  const allApprovals = [...getPendingApprovals(), ...getCompletedApprovals()];

  const [detailView, setDetailView] = useState(null);
  const [notes,      setNotes]      = useState("");
  const [loading,    setLoading]    = useState(null);
  const [checklist,  setChecklist]  = useState({});
  const [viewedDocs, setViewedDocs] = useState({});
  const [decisions,  setDecisions]  = useState({});

  const checkCount = Object.values(checklist).filter(Boolean).length;
  const docCount   = detailView?.documents?.length || 0;

  const doAction = async (action) => {
    setLoading(action);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(null);
    setDecisions(d => ({ ...d, [detailView.id]: action }));
  };

  const openDetail = (t) => {
    setDetailView(t);
    setNotes("");
    setChecklist({});
    setViewedDocs({});
  };

  const sellerInitials = detailView?.sellerName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "S";
  const buyerInitials  = detailView?.buyerName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()  || "B";

  return (
    <>
      <style>{styles}</style>
      <div className="tr-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Header */}
          <div className="tr-header">
            <div className="tr-header-left">
              <span className="tr-page-label">TRANSFER REVIEW</span>
              <span className="tr-page-title">
                {detailView ? detailView.propertyTitle : "Transfer Review"}
              </span>
              <span className="tr-page-sub">
                {detailView ? `${detailView.id} · ${detailView.propertyId}` : "Select a transfer to begin review"}
              </span>
            </div>
            {detailView && (
              <div className="tr-header-right">
                <span
                  className={`tr-pri-${detailView.priority === "High" ? "high" : "normal"}`}
                  style={{ border: "2px solid #0D3D2B", borderRadius: "6px", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 800 }}
                >
                  {detailView.priority} Priority
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="tr-content">
            {detailView ? (
              /* Detail view */
              <div className="tr-detail-view">

                <button className="tr-back-btn" onClick={() => setDetailView(null)}>
                  <span className="material-icons-sharp">arrow_back</span>
                  Back to Queue
                </button>

                {/* Info strip */}
                <div className="tr-strip">
                  <div className="tr-strip-inner">
                    {[
                      { label: "PROPERTY TYPE", value: detailView.type       || "—" },
                      { label: "AREA",          value: detailView.area       || "—" },
                      { label: "DISTRICT",      value: detailView.district   || "—" },
                      { label: "SURVEY NO.",    value: detailView.surveyNo   || "—" },
                      { label: "DOCUMENTS",     value: `${docCount} attached`       },
                      { label: "SUBMITTED",     value: detailView.submittedOn || "—" },
                    ].map((c, i) => (
                      <div key={i} className="tr-strip-cell">
                        <div className="tr-strip-lbl">{c.label}</div>
                        <div className="tr-strip-val">{c.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two-column layout */}
                <div className="tr-detail-layout">

                  {/* Left */}
                  <div>
                    <div className="tr-sec-lbl">TRANSACTION PARTIES</div>
                    <div className="tr-parties-card">
                      <div className="tr-parties-chrome">
                        <div className="tr-parties-tab" style={{ background: "#C8F135", color: "#0D3D2B", minWidth: 80 }}>SELLER</div>
                        <div className="tr-parties-tab" style={{ background: "#5B4FD4", color: "#fff", minWidth: 80, marginLeft: 4 }}>BUYER</div>
                      </div>
                      <div className="tr-parties-body">
                        <div className="tr-party">
                          <div className="tr-party-role">SELLER</div>
                          <div className="tr-party-avatar" style={{ background: "rgba(200,241,53,0.3)" }}>{sellerInitials}</div>
                          <div className="tr-party-name">{detailView.sellerName}</div>
                          <div className="tr-party-aadhaar">{detailView.sellerAadhaar || "—"}</div>
                        </div>
                        <div className="tr-party">
                          <div className="tr-party-role">BUYER</div>
                          <div className="tr-party-avatar" style={{ background: "rgba(91,79,212,0.2)" }}>{buyerInitials}</div>
                          <div className="tr-party-name">{detailView.buyerName}</div>
                          <div className="tr-party-aadhaar">{detailView.buyerAadhaar || "—"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="tr-sec-lbl">UPLOADED DOCUMENTS</div>
                    <div className="tr-docs-card">
                      <div className="tr-docs-head">
                        <span className="tr-docs-head-lbl">DOCUMENTS ({docCount})</span>
                        <span className="tr-docs-reviewed">
                          {Object.values(viewedDocs).filter(Boolean).length}/{docCount} reviewed
                        </span>
                      </div>
                      <div className="tr-docs-list">
                        {(detailView.documents || []).map((doc, i) => (
                          <div
                            key={i}
                            className={`tr-doc-item ${viewedDocs[doc] ? "tr-doc-item-viewed" : ""}`}
                            onClick={() => setViewedDocs(v => ({ ...v, [doc]: true }))}
                          >
                            <span
                              className="material-icons-sharp"
                              style={{ fontSize: 18, color: viewedDocs[doc] ? "#2EC4A0" : "rgba(13,61,43,0.4)" }}
                            >
                              {viewedDocs[doc] ? "check_circle" : "description"}
                            </span>
                            <span className="tr-doc-name">{doc}</span>
                            <span className={`tr-doc-view ${viewedDocs[doc] ? "tr-doc-viewed" : ""}`}>
                              {viewedDocs[doc] ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 13, verticalAlign: "middle" }}>check</span> Reviewed</>
                              ) : (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                                  View <span className="material-icons-sharp" style={{ fontSize: 13 }}>arrow_forward</span>
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                        {docCount === 0 && (
                          <div style={{ padding: "1rem", textAlign: "center", color: "rgba(13,61,43,0.35)", fontSize: "0.82rem" }}>
                            No documents uploaded yet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="tr-sec-lbl">VERIFICATION CHECKLIST</div>
                    <div className="tr-checklist-card">
                      <div className="tr-checklist-head">
                        <span className="tr-checklist-lbl">CHECKLIST ({checkCount}/{CHECKLIST.length})</span>
                        <span className="tr-checklist-prog">{Math.round((checkCount / CHECKLIST.length) * 100)}% complete</span>
                      </div>
                      <div className="tr-checklist-body">
                        {CHECKLIST.map(item => (
                          <div
                            key={item.id}
                            className="tr-check-item"
                            onClick={() => setChecklist(c => ({ ...c, [item.id]: !c[item.id] }))}
                          >
                            <div className={`tr-check-box ${checklist[item.id] ? "tr-check-box-checked" : ""}`}>
                              {checklist[item.id] && <span className="material-icons-sharp" style={{ fontSize: 13 }}>check</span>}
                            </div>
                            <span className={`tr-check-label ${checklist[item.id] ? "tr-check-label-checked" : ""}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="tr-sidebar">

                    {/* Property on-chain */}
                    <div className="tr-prop-card">
                      <div className="tr-prop-head">PROPERTY ON-CHAIN</div>
                      <div className="tr-prop-rows">
                        {[
                          { label: "Property ID", value: detailView.propertyId || "—" },
                          { label: "Type",        value: detailView.type        || "—" },
                          { label: "Survey No.",  value: detailView.surveyNo    || "—" },
                          { label: "District",    value: detailView.district    || "—" },
                          { label: "Sale Value",  value: detailView.saleValue        },
                        ].map((r, i) => (
                          <div key={i} className="tr-prop-row">
                            <span className="tr-prop-lbl">{r.label}</span>
                            <span className="tr-prop-val">{r.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="tr-prop-hash">
                        <div className="tr-prop-hash-lbl">BLOCK HASH</div>
                        <div className="tr-prop-hash-val">0x3f9a1bc2d4e5f678a9b0c1d2e3f4a5b6</div>
                      </div>
                    </div>

                    {/* Decision */}
                    <div className="tr-decision-card">
                      <div className="tr-decision-chrome">
                        <div className="tr-decision-tab" style={{ background: "#F07060", color: "#fff", minWidth: 100 }}>
                          <span className="material-icons-sharp" style={{ fontSize: 13, marginRight: 4, verticalAlign: "middle" }}>bolt</span>
                          DECISION
                        </div>
                      </div>
                      <div className="tr-decision-body">
                        {decisions[detailView.id] ? (
                          <div className="tr-success">
                            <div className="tr-success-icon">
                              <span
                                className="material-icons-sharp"
                                style={{
                                  fontSize: 36,
                                  color:
                                    decisions[detailView.id] === "approve" ? "#2EC4A0" :
                                    decisions[detailView.id] === "reject"  ? "#F07060" : "#5B4FD4",
                                }}
                              >
                                {decisions[detailView.id] === "approve" ? "check_circle" :
                                 decisions[detailView.id] === "reject"  ? "cancel" : "feedback"}
                              </span>
                            </div>
                            <div className="tr-success-title">
                              {decisions[detailView.id] === "approve" ? "Transfer Approved" :
                               decisions[detailView.id] === "reject"  ? "Transfer Rejected" : "Clarification Sent"}
                            </div>
                            <div className="tr-success-sub">
                              {decisions[detailView.id] === "approve"
                                ? "Ownership transfer recorded on blockchain."
                                : decisions[detailView.id] === "reject"
                                  ? "Rejection reason recorded. Parties notified."
                                  : "Request sent to parties for additional documents."}
                            </div>
                            <button className="tr-success-btn" onClick={() => setDetailView(null)}>
                              Back to Queue
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="tr-notes-lbl">REGISTRAR NOTES</div>
                            <textarea
                              className="tr-notes-input"
                              value={notes}
                              onChange={e => setNotes(e.target.value)}
                              placeholder="Add remarks, conditions, or reasons..."
                            />
                            <div className="tr-actions">
                              <button
                                className="tr-btn tr-btn-approve"
                                onClick={() => doAction("approve")}
                                disabled={!!loading}
                              >
                                {loading === "approve" ? (
                                  <><span className="spinner" /> Approving...</>
                                ) : (
                                  <><span className="material-icons-sharp" style={{ fontSize: 16 }}>check_circle</span> Approve Transfer</>
                                )}
                              </button>
                              <button
                                className="tr-btn tr-btn-clarify"
                                onClick={() => doAction("clarify")}
                                disabled={!!loading}
                              >
                                {loading === "clarify" ? (
                                  <><span className="spinner" /> Sending...</>
                                ) : (
                                  <><span className="material-icons-sharp" style={{ fontSize: 16 }}>edit_note</span> Request Clarification</>
                                )}
                              </button>
                              <button
                                className="tr-btn tr-btn-reject"
                                onClick={() => doAction("reject")}
                                disabled={!!loading}
                              >
                                {loading === "reject" ? (
                                  <><span className="spinner" /> Rejecting...</>
                                ) : (
                                  <><span className="material-icons-sharp" style={{ fontSize: 16 }}>cancel</span> Reject Transfer</>
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* List view */
              <div>
                <div className="tr-list-section-lbl">ALL TRANSFERS ({allApprovals.length})</div>
                <div className="tr-list">
                  {allApprovals.map((t, i) => {
                    const done = decisions[t.id];
                    return (
                      <div
                        key={t.id}
                        className="tr-card"
                        style={{ animationDelay: `${i * 0.06}s` }}
                        onClick={() => openDetail(t)}
                      >
                        <div className="tr-card-chrome">
                          <div
                            className="tr-card-tab"
                            style={{
                              background: t.priority === "High" ? "#F07060" : "#C8F135",
                              color: t.priority === "High" ? "#fff" : "#0D3D2B",
                              minWidth: 90,
                            }}
                          >
                            <span className="material-icons-sharp">{TYPE_ICONS[t.type] || "home"}</span>
                            {t.type || "Transfer"}
                          </div>
                          {done && (
                            <div
                              className="tr-card-tab"
                              style={{
                                background: done === "approve" ? "#2EC4A0" : done === "reject" ? "#F07060" : "#C8F135",
                                color: "#0D3D2B",
                                marginLeft: 4,
                              }}
                            >
                              {done === "approve" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>check</span>Approved</>
                              ) : done === "reject" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>close</span>Rejected</>
                              ) : (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>help</span>Clarify</>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="tr-card-body">
                          <div className="tr-card-meta">
                            <span className="tr-card-id">{t.id}</span>
                            <span className={t.priority === "High" ? "tr-pri-high" : "tr-pri-normal"}>{t.priority}</span>
                          </div>
                          <div className="tr-card-title">{t.propertyTitle}</div>
                          <div className="tr-card-parties">{t.sellerName} → {t.buyerName}</div>
                          <div className="tr-card-chips">
                            <div className="tr-chip"><div className="tr-chip-lbl">AREA</div><div className="tr-chip-val">{t.area || "—"}</div></div>
                            <div className="tr-chip"><div className="tr-chip-lbl">DISTRICT</div><div className="tr-chip-val">{t.district || "—"}</div></div>
                            <div className="tr-chip"><div className="tr-chip-lbl">VALUE</div><div className="tr-chip-val">{t.saleValue}</div></div>
                          </div>
                        </div>
                        <div className="tr-card-footer">
                          <span className="tr-card-date">Submitted {t.submittedOn || t.completedOn}</span>
                          <span className="tr-card-docs"><span>{t.documents?.length || 0}</span> docs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
