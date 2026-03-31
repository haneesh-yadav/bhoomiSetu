import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertyById } from "../../database/Properties";
import { MOCK_USERS } from "../../database/Users";
import Navbar1 from "../../components/Navbar1";

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const getUserName = (userId) => {
  if (!userId) return "—";
  const u = MOCK_USERS.find(u => u.id === userId);
  return u ? u.name : userId;
};

const TIMELINE_COLORS = {
  VERIFIED:  "#2EC4A0",
  CONFIRMED: "#C8F135",
  GENESIS:   "#5B4FD4",
  PENDING:   "#F07060",
};

const TYPE_ICONS = {
  Residential:  "home",
  Agricultural: "grass",
  Commercial:   "store",
};

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
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
    from{opacity: 0;
    transform: translateY(14px);
    }to{opacity: 1;
    transform: translateY(0);
    };
  }
  @keyframes pulse {
    0%,100%{box-shadow: 0 0 0 0 rgba(46,196,160,0.4);
    }50%{box-shadow: 0 0 0 6px rgba(46,196,160,0);
    };
  }

  /* ── Page ── */
  .pd-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }
  .pd-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;
    background-image:linear-gradient(rgba(13,61,43,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(13,61,43,0.05) 1px,transparent 1px);
    background-size:40px 40px; }

  /* ── Page container ── */
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
  @media(max-width:768px) {
    .page-container{margin: 1rem;
    border-radius: 12px;
    };
  }
  @media(max-width:480px) {
    .page-container{margin: 0.65rem;
    border-radius: 10px;
    };
  }

  /* ══════════════════════════
     TOPBAR — slim, just nav
  ══════════════════════════ */
  .pd-topbar {
    background:#0D3D2B;
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding:0.85rem 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
  }
  .pd-bc-link {
    cursor: pointer;
    transition: color 0.15s;
    color: rgba(255,255,255,0.55);
  }
  .pd-bc-link:hover { color: #C8F135; }
  .pd-bc-sep { color: rgba(255,255,255,0.25); }
  .pd-bc-here {
    color: #C8F135;
    font-family: 'DM Mono',monospace;
    font-size: 0.7rem;
    font-weight: 600;
  }
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.9rem;
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 7px;
    background: transparent;
    color: rgba(255,255,255,0.7);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .pd-back-btn .material-icons-sharp { font-size: 15px; }
  .pd-back-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-color: rgba(255,255,255,0.5);
  }

  /* ══════════════════════════
     CONTENT AREA
  ══════════════════════════ */
  .pd-content { padding: 1.75rem 2rem 2.5rem; }

  /* ── Property title block ── */
  .pd-title-block {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1.5px solid rgba(13,61,43,0.1);
    animation: fadeUp 0.4s ease both;
  }
  .pd-title-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  .pd-title-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    width: fit-content;
    background: rgba(13,61,43,0.02);
    border: 1.5px solid rgba(13,61,43,0.15);
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(13,61,43,0.6);
  }
  .pd-title-eyebrow .material-icons-sharp { font-size: 14px; }
  .pd-title-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.72rem;
    color: rgba(13,61,43,0.45);
    font-weight: 500;
  }
  .pd-title-main {
    font-size: clamp(1.4rem,3vw,2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0D3D2B;
    line-height: 1.1;
    font-family: 'Poppins',sans-serif;
  }
  .pd-title-addr {
    font-size: 0.82rem;
    color: rgba(13,61,43,0.55);
    font-weight: 500;
    line-height: 1.4;
  }
  .pd-title-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  .pd-title-status {
    border-radius: 7px;
    padding: 5px 14px;
    font-size: 0.78rem;
    font-weight: 800;
    border: 1.5px solid rgba(13,61,43,0.1);
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .pd-title-value {
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0D3D2B;
    line-height: 1;
  }
  .pd-title-value-lbl {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.45);
  }

  /* Status alert strip */
  .pd-status-strip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 9px;
    margin-bottom: 1.75rem;
    font-size: 0.78rem;
    font-weight: 600;
    animation: fadeUp 0.4s ease 0.05s both;
  }
  .pd-status-strip .material-icons-sharp {
    font-size: 16px;
    flex-shrink: 0;
  }
  .pd-strip-clear {
    background: rgba(46,196,160,0.1);
    color: #1a7a62;
    border: 1.5px solid rgba(46,196,160,0.3);
  }
  .pd-strip-dispute {
    background: rgba(240,112,96,0.08);
    color: #c0392b;
    border: 1.5px solid rgba(240,112,96,0.3);
  }

  /* ══════════════════════════
     INFO GRID — all details
  ══════════════════════════ */
  .pd-section-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
    margin-bottom: 0.85rem;
    margin-top: 1.5rem;
  }
  .pd-section-title:first-of-type { margin-top: 0; }

  .pd-info-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease 0.08s both;
  }
  .pd-info-cell {
    background: rgba(13,61,43,0.02);
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transition:border-color 0.18s;
  }
  .pd-info-cell:hover { border-color: rgba(13,61,43,0.25); }
  .pd-info-lbl {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.38);
  }
  .pd-info-val {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0D3D2B;
  }
  .pd-info-val-mono {
    font-family: 'DM Mono',monospace;
    font-size: 0.75rem;
    color: #5B4FD4;
  }
  .pd-info-val-status {
    font-size: 0.82rem;
    font-weight: 800;
  }

  /* Wide cell — full row width */
  .pd-info-cell-wide { grid-column: 1/-1; }

  /* ══════════════════════════
     OWNER CARD
  ══════════════════════════ */
  .pd-owner-card {
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease 0.1s both;
  }
  .pd-owner-head {
    background: #0D3D2B;
    padding: 0.65rem 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pd-owner-head-lbl {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.5);
  }
  .pd-owner-verified {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: #C8F135;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.58rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .pd-owner-verified .material-icons-sharp { font-size: 11px; }
  .pd-owner-body {
    padding: 1rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(13,61,43,0.02);
  }
  .pd-owner-avatar {
    width: 44px;
    height: 44px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 800;
    color: #0D3D2B;
    flex-shrink: 0;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .pd-owner-name {
    font-size: 1rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .pd-owner-since {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }
  .pd-owner-tag {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(13,61,43,0.08);
    border-radius: 5px;
    padding: 3px 9px;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(13,61,43,0.55);
    flex-shrink: 0;
  }

  /* ══════════════════════════
     BLOCKCHAIN CARD
  ══════════════════════════ */
  .pd-chain-card {
    background: #0D3D2B;
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease 0.12s both;
  }
  .pd-chain-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.85rem;
  }
  .pd-chain-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.4);
  }
  .pd-chain-live {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: #2EC4A0;
  }
  .pd-chain-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2EC4A0;
    animation: pulse 2s ease infinite;
    flex-shrink: 0;
  }
  .pd-chain-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }
  .pd-chain-cell {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .pd-chain-lbl {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.3);
  }
  .pd-chain-val {
    font-family: 'DM Mono',monospace;
    font-size: 0.7rem;
    color: #C8F135;
    word-break: break-all;
    line-height: 1.4;
  }
  .pd-chain-val-sm {
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
  }
  .pd-chain-div {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 0.5rem 0;
    grid-column: 1/-1;
  }

  /* ══════════════════════════
     ACTIONS CARD
  ══════════════════════════ */
  .pd-actions-card {
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease 0.14s both;
  }
  .pd-actions-head {
    background: rgba(13,61,43,0.02);
    border-bottom: 1.5px solid rgba(13,61,43,0.1);
    padding: 0.65rem 1.1rem;
  }
  .pd-actions-head-lbl {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.45);
  }
  .pd-actions-body {
    padding: 0.85rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .pd-action-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 9px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: all 0.18s;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .pd-action-btn .material-icons-sharp {
    font-size: 16px;
    flex-shrink: 0;
  }
  .pd-action-btn:hover {
    transform: translate(-1px,-1px);
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
  .pd-action-btn:active {
    transform: translate(1px,1px);
    box-shadow: 1px 1px 0 #0D3D2B;
  }
  .pd-btn-primary {
    background: #0D3D2B;
    color: #C8F135;
  }
  .pd-btn-outline {
    background: #fff;
    color: #0D3D2B;
  }
  .pd-btn-danger {
    background: #fff;
    color: #c0392b;
    border-color: rgba(192,57,43,0.3);
    box-shadow: 2px 2px 0 rgba(192,57,43,0.2);
  }
  .pd-btn-danger:hover {
    background: rgba(240,112,96,0.05);
    border-color: #F07060;
    box-shadow: 2px 2px 0 #F07060;
  }

  /* ══════════════════════════
     LAYOUT — 2 col
  ══════════════════════════ */
  .pd-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
    align-items: start;
  }
  .pd-sidebar {
    display: flex;
    flex-direction: column;
  }

  /* ══════════════════════════
     TIMELINE SECTION
  ══════════════════════════ */
  .pd-timeline-section {
    background: #0D3D2B;
    border-top: 1px solid rgba(13,61,43,0.08);
    padding:2rem 2rem 2.5rem;
  }
  .pd-timeline-header { margin-bottom: 1.5rem; }
  .pd-timeline-tag  {
    display: inline-block;
    background: #C8F135;
    border-radius: 4px;
    padding: 2px 10px;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #0D3D2B;
    margin-bottom: 0.5rem;
  }
  .pd-timeline-title {
    font-size: clamp(1.2rem,2.5vw,1.6rem);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    font-family: 'Poppins',sans-serif;
  }
  .pd-timeline-sub {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.35);
    margin-top: 0.25rem;
  }

  .pd-tl-list {
    display: flex;
    flex-direction: column;
  }
  .pd-tl-item {
    display: flex;
    gap: 1rem;
  }
  .pd-tl-spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }
  .pd-tl-dot {
    width: 13px;
    height: 13px;
    border-radius: 3px;
    border: 2.5px solid rgba(255,255,255,0.2);
    flex-shrink: 0;
    margin-top: 3px;
  }
  .pd-tl-line {
    flex: 1;
    width: 2px;
    background: rgba(255,255,255,0.08);
    margin: 3px 0;
    min-height: 20px;
  }
  .pd-tl-block {
    flex: 1;
    border-radius: 11px;
    padding: 0.9rem 1rem;
    margin-bottom: 0.85rem;
    border: 1.5px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    transition:border-color 0.2s;
  }
  .pd-tl-block-active {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.18);
  }
  .pd-tl-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
  }
  .pd-tl-event {
    font-size: 0.88rem;
    font-weight: 700;
    color: #fff;
  }
  .pd-tl-badge {
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 0.58rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .pd-tl-parties {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.45);
    margin-bottom: 0.35rem;
  }
  .pd-tl-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pd-tl-hash {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(200,241,53,0.6);
  }
  .pd-tl-date {
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
  }

  /* ── Responsive ── */
  @media(max-width:900px) {
    .pd-layout{grid-template-columns: 1fr;
    };
  }
  @media(max-width:768px) {
    .pd-content{padding: 1.25rem 1rem 2rem;
    } .pd-topbar{padding: 0.75rem 1rem;
    } .pd-info-grid{grid-template-columns: 1fr 1fr;
    } .pd-timeline-section{padding: 1.5rem 1rem 2rem;
    };
  }
  @media(max-width:480px) {
    .pd-info-grid{grid-template-columns: 1fr;
    } .pd-title-right{display: none;
    };
  }

  /* Not found */
  .pd-not-found {
    text-align: center;
    padding: 5rem 2rem;
  }
  .pd-nf-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }
  .pd-nf-sub {
    font-size: 0.85rem;
    color: rgba(13,61,43,0.5);
    margin-bottom: 1.5rem;
  }
  .pd-nf-btn {
    padding: 0.65rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
`;

/* ══════════════════════════════════════════════════
   PROPERTY DETAIL COMPONENT
══════════════════════════════════════════════════ */
export default function PropertyDetail() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const property = getPropertyById(id);
  const isOwner  = user?.id === property?.currentOwner;

  /* ── Not found ── */
  if (!property) {
    return (
      <>
        <style>{styles}</style>
        <div className="pd-page">
          <div className="pd-grid-bg" />
          <Navbar1 user={user} onLogout={logout} />
          <div className="page-container">
            <div className="pd-not-found">
              <div style={{ fontSize:"2.5rem", marginBottom:"1rem", opacity:0.3 }}>🔍</div>
              <div className="pd-nf-title">Property Not Found</div>
              <div className="pd-nf-sub">No property exists with ID: {id}</div>
              <button className="pd-nf-btn" onClick={() => navigate(-1)}>← Go Back</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const ownerName     = getUserName(property.currentOwner);
  const ownerInitials = ownerName.split(" ").filter(w => w).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const typeIcon      = TYPE_ICONS[property.type] || "home";

  /* ── Property detail rows ── */
  const detailRows = [
    { label:"PROPERTY TYPE",  val: property.type,                  wide:false },
    { label:"STATUS",         val: property.status,                wide:false, isStatus:true },
    { label:"AREA",           val: property.area,                  wide:false },
    { label:"SURVEY NO.",     val: property.surveyNo,              wide:false },
    { label:"DISTRICT",       val: property.district,              wide:false },
    { label:"STATE",          val: property.state,                 wide:false },
    { label:"REGISTERED ON",  val: property.registeredOn,          wide:false },
    { label:"LAST TRANSFER",  val: property.lastTransfer,          wide:false },
    { label:"ENCUMBRANCE",    val: property.encumbrance ? "Yes — Loan/Mortgage recorded" : "No encumbrance on record", wide:false },
    { label:"MARKET VALUE",   val: property.marketValue,           wide:false },
    { label:"FULL ADDRESS",   val: property.address,               wide:true  },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="pd-page">
        <div className="pd-grid-bg" />
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

          {/* ── TOPBAR — breadcrumb + back only ── */}
          <div className="pd-topbar">
            <div className="pd-breadcrumb">
              <span className="pd-bc-link" onClick={() => navigate("/user/dashboard")}>Dashboard</span>
              <span className="pd-bc-sep">›</span>
              <span className="pd-bc-link" onClick={() => navigate("/user/properties")}>My Properties</span>
              <span className="pd-bc-sep">›</span>
              <span className="pd-bc-here">{property.id}</span>
            </div>
            <button className="pd-back-btn" onClick={() => navigate(-1)}>
              <span className="material-icons-sharp">arrow_back</span>
              Back
            </button>
          </div>

          {/* ── CONTENT ── */}
          <div className="pd-content">

            {/* ── Title block ── */}
            <div className="pd-title-block">
              <div className="pd-title-left">
                <div className="pd-title-eyebrow">
                  <span className="material-icons-sharp">{typeIcon}</span>
                  {property.type.toUpperCase()} PROPERTY
                </div>
                <div className="pd-title-id">{property.id}</div>
                <div className="pd-title-main">{property.title}</div>
                <div className="pd-title-addr">{property.address}</div>
              </div>
              <div className="pd-title-right">
                <div className="pd-title-status" style={{ background:property.statusColor, color:"#0D3D2B" }}>
                  {property.status}
                </div>
                <div className="pd-title-value">{property.marketValue}</div>
                <div className="pd-title-value-lbl">ESTIMATED MARKET VALUE</div>
              </div>
            </div>

            {/* ── Status strip ── */}
            <div className={`pd-status-strip ${property.disputeActive ? "pd-strip-dispute" : "pd-strip-clear"}`}>
              <span className="material-icons-sharp">
                {property.disputeActive ? "warning" : "verified"}
              </span>
              {property.disputeActive
                ? "Active dispute on this property — resolution in progress"
                : "No active disputes · Record integrity verified on-chain"
              }
            </div>

            {/* ── Two column layout ── */}
            <div className="pd-layout">

              {/* LEFT — owner first, then property details */}
              <div>

                {/* Owner card — first */}
                <div className="pd-section-title">CURRENT OWNER</div>
                <div className="pd-owner-card">
                  <div className="pd-owner-head">
                    <span className="pd-owner-head-lbl">REGISTERED OWNER</span>
                    <span className="pd-owner-verified">
                      <span className="material-icons-sharp">check</span>
                      VERIFIED
                    </span>
                  </div>
                  <div className="pd-owner-body">
                    <div className="pd-owner-avatar">{ownerInitials}</div>
                    <div>
                      <div className="pd-owner-name">{ownerName}</div>
                      <div className="pd-owner-since">Owner since {property.lastTransfer}</div>
                    </div>
                    {isOwner && (
                      <div className="pd-owner-tag">
                        <span className="material-icons-sharp" style={{ fontSize:12 }}>person</span>
                        You
                      </div>
                    )}
                  </div>
                </div>

                {/* Property details below */}
                <div className="pd-section-title">PROPERTY DETAILS</div>
                <div className="pd-info-grid">
                  {detailRows.map((row, i) => (
                    <div key={i} className={`pd-info-cell ${row.wide ? "pd-info-cell-wide" : ""}`}>
                      <span className="pd-info-lbl">{row.label}</span>
                      <span
                        className={`pd-info-val ${row.isStatus ? "pd-info-val-status" : ""}`}
                        style={row.isStatus ? { color: property.statusColor } : {}}
                      >
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* RIGHT SIDEBAR */}
              <div className="pd-sidebar">

                {/* Blockchain card */}
                <div className="pd-section-title">BLOCKCHAIN RECORD</div>
                <div className="pd-chain-card">
                  <div className="pd-chain-head">
                    <span className="pd-chain-title">ON-CHAIN DATA</span>
                    <span className="pd-chain-live"><span className="pd-chain-dot" />LIVE</span>
                  </div>
                  <div className="pd-chain-grid">
                    <div className="pd-chain-cell" style={{ gridColumn:"1/-1" }}>
                      <span className="pd-chain-lbl">BLOCK HASH</span>
                      <span className="pd-chain-val">{property.hash}</span>
                    </div>
                    <div className="pd-chain-div" />
                    <div className="pd-chain-cell">
                      <span className="pd-chain-lbl">BLOCK NO.</span>
                      <span className="pd-chain-val-sm">#{property.blockNumber.toLocaleString()}</span>
                    </div>
                    <div className="pd-chain-cell">
                      <span className="pd-chain-lbl">EVENTS</span>
                      <span className="pd-chain-val-sm">{property.timeline.length} recorded</span>
                    </div>
                    <div className="pd-chain-div" />
                    <div className="pd-chain-cell" style={{ gridColumn:"1/-1" }}>
                      <span className="pd-chain-lbl">INTEGRITY</span>
                      <span className="pd-chain-val-sm" style={{ color:"#2EC4A0" }}>✓ All records verified</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pd-section-title">ACTIONS</div>
                <div className="pd-actions-card">
                  <div className="pd-actions-head">
                    <span className="pd-actions-head-lbl">AVAILABLE ACTIONS</span>
                  </div>
                  <div className="pd-actions-body">
                    {isOwner ? (
                      <>
                        <button className="pd-action-btn pd-btn-primary" onClick={() => navigate("/user/transfer")}>
                          <span className="material-icons-sharp">swap_horiz</span>
                          Initiate Transfer
                        </button>
                        <button className="pd-action-btn pd-btn-outline" onClick={() => navigate("/user/certificates")}>
                          <span className="material-icons-sharp">verified</span>
                          Download Certificate
                        </button>
                        <button className="pd-action-btn pd-btn-outline" onClick={() => navigate("/user/mutation")}>
                          <span className="material-icons-sharp">description</span>
                          File Mutation Request
                        </button>
                        <button className="pd-action-btn pd-btn-danger" onClick={() => navigate("/user/disputes")}>
                          <span className="material-icons-sharp">gavel</span>
                          File a Dispute
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="pd-action-btn pd-btn-outline" onClick={() => navigate("/user/disputes")}>
                          <span className="material-icons-sharp">flag</span>
                          Flag this Record
                        </button>
                        <button className="pd-action-btn pd-btn-outline" onClick={() => navigate("/user/certificates")}>
                          <span className="material-icons-sharp">verified</span>
                          Request EC Copy
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ── OWNERSHIP TIMELINE — dark section ── */}
          <div className="pd-timeline-section">
            <div className="pd-timeline-header">
              <div className="pd-timeline-tag">⛓ OWNERSHIP TIMELINE</div>
              <div className="pd-timeline-title">Every transaction, immutably recorded.</div>
              <div className="pd-timeline-sub">{property.timeline.length} events on-chain</div>
            </div>

            <div className="pd-tl-list">
              {property.timeline.map((t, i) => {
                const tc = TIMELINE_COLORS[t.status] || "#C8F135";
                return (
                  <div key={i} className="pd-tl-item">
                    <div className="pd-tl-spine">
                      <div className="pd-tl-dot" style={{ background:tc, borderColor:tc }} />
                      {i < property.timeline.length - 1 && <div className="pd-tl-line" />}
                    </div>
                    <div className={`pd-tl-block ${i === 0 ? "pd-tl-block-active" : ""}`}>
                      <div className="pd-tl-top">
                        <span className="pd-tl-event">{t.event}</span>
                        <span className="pd-tl-badge" style={{ background:tc }}>{t.status}</span>
                      </div>
                      {(t.from || t.to) && (
                        <div className="pd-tl-parties">
                          {t.from && t.to ? `${t.from} → ${t.to}` : t.from || t.to}
                        </div>
                      )}
                      <div className="pd-tl-bottom">
                        <span className="pd-tl-hash">{t.hash}</span>
                        <span className="pd-tl-date">{t.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>{/* page-container */}
      </div>
    </>
  );
}
