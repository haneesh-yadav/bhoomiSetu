import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import { getTransfersByUser } from "../../database/Transfers";
import Navbar1 from "../../components/Navbar1";

const ACTIVITY = [
  { icon: "check_circle", label: "Transfer Approved",      sub: "TN-4521-CHN-2019 · Ownership updated",          date: "12 Jan 2024", color: "#2EC4A0" },
  { icon: "pending",      label: "Transfer Initiated",     sub: "TN-4521-CHN-2019 · Awaiting buyer confirmation", date: "10 Jan 2024", color: "#C8F135" },
  { icon: "account_tree", label: "Mutation Request Filed", sub: "TN-7734-MDU-2021 · Inheritance claim submitted",  date: "05 Dec 2023", color: "#5B4FD4" },
  { icon: "download",     label: "Certificate Downloaded", sub: "Encumbrance Certificate — TN-1182-CBE-2018",      date: "18 Nov 2023", color: "#F07060" },
  { icon: "search",       label: "Property Verified",      sub: "TN-4521-CHN-2019 · Public record accessed",       date: "01 Nov 2023", color: "#2EC4A0" },
];

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
  ::-webkit-scrollbar-thumb { background: #0D3D2B; border-radius: 4px; }

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

  /* ── Page shell ── */
  .ud-page {
    font-family: 'Poppins', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  .ud-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(13,61,43,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,61,43,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── Page container — the outer bordered card ── */
  .page-container {
    margin: 1.5rem 2rem 2rem;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid rgba(13,61,43,0.15);
    box-shadow:
      0 4px 6px rgba(13,61,43,0.04),
      0 20px 40px rgba(13,61,43,0.08);
    background: #f7f7f3;
    position: relative;
    z-index: 2;
  }

  /* ── Main content area ── */
  .ud-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.75rem 2rem 2.5rem;
  }

  /* ══════════════════════════════════════════════════
     WELCOME BANNER
  ══════════════════════════════════════════════════ */
  .ud-welcome {
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 1.75rem;
    border: 1.5px solid rgba(13,61,43,0.12);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .ud-welcome-main {
    background: linear-gradient(135deg, #0D3D2B 0%, #164d37 60%, #1a5c40 100%);
    padding: 2rem 2.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }

  /* Decorative circles in banner */
  .ud-welcome-main::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(200,241,53,0.06);
    pointer-events: none;
  }

  .ud-welcome-main::after {
    content: '';
    position: absolute;
    bottom: -40px;
    right: 200px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(200,241,53,0.04);
    pointer-events: none;
  }

  .ud-welcome-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .ud-welcome-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(200,241,53,0.12);
    border: 1px solid rgba(200,241,53,0.25);
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #C8F135;
    width: fit-content;
  }

  .ud-welcome-tag .mi { font-size: 0.85rem; }

  .ud-welcome-name {
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .ud-welcome-sub {
    font-size: 0.83rem;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
  }

  .ud-welcome-right {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .ud-welcome-btn-primary {
    padding: 0.65rem 1.4rem;
    border: 1.5px solid #C8F135;
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .ud-welcome-btn-primary:hover {
    background: #b8e020;
    border-color: #b8e020;
    transform: translateY(-1px);
  }

  .ud-welcome-btn-secondary {
    padding: 0.65rem 1.4rem;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.8);
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }

  .ud-welcome-btn-secondary:hover {
    border-color: rgba(255,255,255,0.4);
    color: #fff;
    background: rgba(255,255,255,0.1);
  }

  .ud-welcome-footer {
    background: rgba(13,61,43,0.04);
    border-top: 1px solid rgba(13,61,43,0.08);
    padding: 0.75rem 2.25rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .ud-welcome-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(13,61,43,0.5);
  }

  .ud-welcome-meta .mi {
    font-size: 0.9rem;
    color: #0D3D2B;
    opacity: 0.4;
  }

  .ud-welcome-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(13,61,43,0.25);
  }

  /* ══════════════════════════════════════════════════
     STATS ROW
  ══════════════════════════════════════════════════ */
  .ud-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  .ud-stat-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(13,61,43,0.05);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .ud-stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--stat-color, #C8F135);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .ud-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
    border-color: rgba(13,61,43,0.2);
  }

  .ud-stat-card:hover::after {
    opacity: 1;
  }

  .ud-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ud-stat-icon .mi {
    font-size: 1.35rem;
    color: #0D3D2B;
  }

  .ud-stat-value {
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #0D3D2B;
    line-height: 1;
  }

  .ud-stat-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(13,61,43,0.45);
    margin-top: 0.25rem;
    letter-spacing: 0.01em;
  }

  /* ══════════════════════════════════════════════════
     MAIN GRID
  ══════════════════════════════════════════════════ */
  .ud-main-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.25rem;
    align-items: start;
  }

  /* ── Section heading ── */
  .ud-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .ud-section-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0D3D2B;
    letter-spacing: -0.01em;
  }

  .ud-section-link {
    font-size: 0.72rem;
    font-weight: 600;
    color: #0D3D2B;
    cursor: pointer;
    padding: 4px 12px;
    border: 1.5px solid rgba(13,61,43,0.2);
    border-radius: 20px;
    transition: all 0.15s;
    background: #fff;
  }

  .ud-section-link:hover {
    background: #0D3D2B;
    color: #C8F135;
    border-color: #0D3D2B;
  }

  /* ══════════════════════════════════════════════════
     PROPERTIES LIST
  ══════════════════════════════════════════════════ */
  .ud-props-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ud-prop-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.04);
    transition: all 0.2s;
    cursor: pointer;
  }

  .ud-prop-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(13,61,43,0.1);
    border-color: rgba(13,61,43,0.2);
  }

  .ud-prop-top {
    padding: 1.1rem 1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .ud-prop-id {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.35);
    font-family: 'DM Mono', monospace;
    margin-bottom: 0.3rem;
  }

  .ud-prop-title {
    font-size: 0.92rem;
    font-weight: 700;
    color: #0D3D2B;
    letter-spacing: -0.01em;
  }

  .ud-prop-meta {
    font-size: 0.75rem;
    color: rgba(13,61,43,0.45);
    margin-top: 0.2rem;
    font-weight: 400;
  }

  .ud-prop-badge {
    border-radius: 20px;
    padding: 3px 12px;
    font-size: 0.62rem;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }

  .ud-prop-footer {
    border-top: 1px solid rgba(13,61,43,0.06);
    padding: 0.6rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .ud-prop-hash {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(91,79,212,0.7);
  }

  .ud-prop-since {
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(13,61,43,0.35);
  }

  /* ══════════════════════════════════════════════════
     RIGHT COLUMN — BLOCKCHAIN STATUS
  ══════════════════════════════════════════════════ */
  .ud-right-col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .ud-chain-card {
    border: 1.5px solid rgba(13,61,43,0.12);
    border-radius: 14px;
    background: #0D3D2B;
    padding: 1.4rem;
    box-shadow: 0 8px 24px rgba(13,61,43,0.15);
    position: relative;
    overflow: hidden;
  }

  .ud-chain-card::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(200,241,53,0.05);
    pointer-events: none;
  }

  .ud-chain-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    position: relative;
    z-index: 1;
  }

  .ud-chain-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.4);
  }

  .ud-chain-live {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.62rem;
    font-weight: 700;
    color: #2EC4A0;
    background: rgba(46,196,160,0.1);
    border: 1px solid rgba(46,196,160,0.2);
    border-radius: 20px;
    padding: 2px 8px;
  }

  .ud-chain-live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #2EC4A0;
    box-shadow: 0 0 6px #2EC4A0;
  }

  .ud-chain-rows {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .ud-chain-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .ud-chain-row:last-child {
    border-bottom: none;
  }

  .ud-chain-label {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
  }

  .ud-chain-val {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    font-family: 'DM Mono', monospace;
  }

  .ud-chain-val-lime { color: #C8F135; }

  .ud-chain-val-verified {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #2EC4A0;
    font-family: 'Poppins', sans-serif;
  }

  .ud-chain-val-verified .mi { font-size: 0.82rem; }

  .ud-chain-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0.25rem 0;
  }

  /* ══════════════════════════════════════════════════
     ACTIVITY FEED
  ══════════════════════════════════════════════════ */
  .ud-activity-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.04);
    grid-column: 1 / -1;
  }

  .ud-activity-head {
    background: #0D3D2B;
    padding: 0.9rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .ud-activity-head-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #C8F135;
    box-shadow: 0 0 6px rgba(200,241,53,0.6);
    flex-shrink: 0;
  }

  .ud-activity-head-txt {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.6);
  }

  .ud-activity-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 0;
  }

  .ud-activity-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.45rem;
    padding: 1.1rem 1.25rem;
    transition: background 0.15s;
    position: relative;
  }

  .ud-activity-item:not(:last-child) {
    border-right: 1px solid rgba(13,61,43,0.06);
  }

  .ud-activity-item:hover { background: rgba(13,61,43,0.02); }

  .ud-activity-icon {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.2rem;
  }

  .ud-activity-icon .mi {
    font-size: 0.95rem;
    color: #0D3D2B;
  }

  .ud-activity-label {
    font-size: 0.76rem;
    font-weight: 700;
    color: #0D3D2B;
    line-height: 1.3;
  }

  .ud-activity-sub {
    font-size: 0.66rem;
    color: rgba(13,61,43,0.45);
    line-height: 1.45;
    font-weight: 400;
  }

  .ud-activity-date {
    font-size: 0.6rem;
    font-weight: 600;
    color: rgba(13,61,43,0.3);
    margin-top: auto;
    padding-top: 0.25rem;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .ud-main-grid { grid-template-columns: 1fr; }
    .ud-right-col { display: grid; grid-template-columns: 1fr; }
    .ud-activity-list { grid-template-columns: repeat(3, 1fr); }
    .ud-activity-item:nth-child(3) { border-right: none; }
    .ud-activity-item:nth-child(n+4) { border-top: 1px solid rgba(13,61,43,0.06); }
  }

  @media (max-width: 768px) {
    .page-container { margin: 1rem; border-radius: 14px; }
    .ud-content { padding: 1.25rem 1rem 2rem; }
    .ud-stats { grid-template-columns: repeat(2, 1fr); }
    .ud-welcome-main { padding: 1.5rem; }
    .ud-welcome-footer { padding: 0.65rem 1.5rem; gap: 1rem; }
    .ud-activity-list { grid-template-columns: repeat(2, 1fr); }
    .ud-activity-item:nth-child(2n) { border-right: none; }
    .ud-activity-item:nth-child(n+3) { border-top: 1px solid rgba(13,61,43,0.06); }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 12px; }
    .ud-stats { grid-template-columns: 1fr 1fr; }
    .ud-stat-card { padding: 1rem; }
    .ud-stat-value { font-size: 1.5rem; }
    .ud-welcome-right { width: 100%; }
    .ud-welcome-btn-primary,
    .ud-welcome-btn-secondary { flex: 1; text-align: center; }
    .ud-activity-list { grid-template-columns: 1fr; }
    .ud-activity-item { border-right: none !important; }
    .ud-activity-item:not(:last-child) {
      border-right: none;
      border-bottom: 1px solid rgba(13,61,43,0.06);
    }
  }
`;

/* ══════════════════════════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════════════════════════ */
const MIcon = ({ name, className = "" }) => (
  <span className={`mi ${className}`}>{name}</span>
);

const SectionHead = ({ title, linkLabel, onLink }) => (
  <div className="ud-section-head">
    <span className="ud-section-title">{title}</span>
    {linkLabel && <span className="ud-section-link" onClick={onLink}>{linkLabel}</span>}
  </div>
);

/* ══════════════════════════════════════════════════
   USER DASHBOARD COMPONENT
══════════════════════════════════════════════════ */
export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const properties = user ? getPropertiesByOwner(user.id) : [];
  const transfers  = user ? getTransfersByUser(user.id)   : [];

  const pendingTransfers = transfers.filter(t => t.status !== "Completed").length;
  const activeDisputes   = properties.filter(p => p.disputeActive).length;

  const stats = [
    { label: "Properties Owned",  value: String(properties.length), icon: "home",        color: "#C8F135" },
    { label: "Pending Transfers", value: String(pendingTransfers),   icon: "sync_alt",    color: "#F07060" },
    { label: "Active Disputes",   value: String(activeDisputes),     icon: "gavel",       color: "#5B4FD4" },
    { label: "Certificates",      value: "5",                        icon: "description", color: "#2EC4A0" },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="ud-page">
        <div className="ud-grid-bg" />

        {/* Dashboard subnav */}
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">
          <div className="ud-content">

            {/* ── Welcome banner ── */}
            <div className="ud-welcome">
              <div className="ud-welcome-main">
                <div className="ud-welcome-left">
                  <div className="ud-welcome-tag">
                    <MIcon name="person" /> CITIZEN DASHBOARD
                  </div>
                  <div className="ud-welcome-name">
                    Welcome back, {user?.name?.split(" ")[0] ?? "Citizen"} ✦
                  </div>
                  <div className="ud-welcome-sub">Manage your properties, transfers and legal records</div>
                </div>
                <div className="ud-welcome-right">
                  <button className="ud-welcome-btn-primary" onClick={() => navigate("/user/transfer")}>
                    + Initiate Transfer
                  </button>
                  <button className="ud-welcome-btn-secondary" onClick={() => navigate("/user/properties")}>
                    My Properties →
                  </button>
                </div>
              </div>
              <div className="ud-welcome-footer">
                <div className="ud-welcome-meta">
                  <MIcon name="location_on" /> {user?.state ?? "—"}
                  <span className="ud-welcome-meta-dot" />
                  Member since {user?.since ?? "—"}
                </div>
                <div className="ud-welcome-meta">
                  <MIcon name="lock" /> Aadhaar: {user?.aadhaar ?? "—"}
                  <span className="ud-welcome-meta-dot" />
                  {user?.email ?? "—"}
                </div>
              </div>
            </div>

            {/* ── Stats row ── */}
            <div className="ud-stats">
              {stats.map((s, i) => (
                <div key={i} className="ud-stat-card" style={{ "--stat-color": s.color }}>
                  <div className="ud-stat-icon" style={{ background: s.color }}>
                    <MIcon name={s.icon} />
                  </div>
                  <div>
                    <div className="ud-stat-value">{s.value}</div>
                    <div className="ud-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Main grid ── */}
            <div className="ud-main-grid">

              {/* LEFT — Properties */}
              <div>
                <SectionHead
                  title="My Properties"
                  linkLabel="View All →"
                  onLink={() => navigate("/user/properties")}
                />
                <div className="ud-props-list">
                  {properties.map((p, i) => (
                    <div key={i} className="ud-prop-card" onClick={() => navigate(`/property/${p.id}`)}>
                      <div className="ud-prop-top">
                        <div>
                          <div className="ud-prop-id">{p.id}</div>
                          <div className="ud-prop-title">{p.title}</div>
                          <div className="ud-prop-meta">{p.area} · {p.district}</div>
                        </div>
                        <div className="ud-prop-badge" style={{ background: p.statusColor, color: "#0D3D2B" }}>
                          {p.status}
                        </div>
                      </div>
                      <div className="ud-prop-footer">
                        <span className="ud-prop-hash">{p.hash}</span>
                        <span className="ud-prop-since">Since {p.since}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Blockchain Status */}
              <div className="ud-right-col">
                <div className="ud-chain-card">
                  <div className="ud-chain-header">
                    <span className="ud-chain-title">BLOCKCHAIN STATUS</span>
                    <span className="ud-chain-live">
                      <span className="ud-chain-live-dot" /> LIVE
                    </span>
                  </div>
                  <div className="ud-chain-rows">
                    <div className="ud-chain-row">
                      <span className="ud-chain-label">Latest Block</span>
                      <span className="ud-chain-val ud-chain-val-lime">#1,847,392</span>
                    </div>
                    <div className="ud-chain-divider" />
                    <div className="ud-chain-row">
                      <span className="ud-chain-label">Your Records</span>
                      <span className="ud-chain-val">3 on-chain</span>
                    </div>
                    <div className="ud-chain-row">
                      <span className="ud-chain-label">Last Hash</span>
                      <span className="ud-chain-val">0x3f9a...c4e5</span>
                    </div>
                    <div className="ud-chain-row">
                      <span className="ud-chain-label">Network</span>
                      <span className="ud-chain-val ud-chain-val-lime">TN State Registry</span>
                    </div>
                    <div className="ud-chain-divider" />
                    <div className="ud-chain-row">
                      <span className="ud-chain-label">Integrity</span>
                      <span className="ud-chain-val ud-chain-val-verified">
                        <MIcon name="verified" /> All records verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM — Recent Activity (horizontal, full-width) */}
              <div className="ud-activity-card">
                <div className="ud-activity-head">
                  <span className="ud-activity-head-dot" />
                  <span className="ud-activity-head-txt">RECENT ACTIVITY</span>
                </div>
                <div className="ud-activity-list">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="ud-activity-item">
                      <div className="ud-activity-icon" style={{ background: a.color }}>
                        <MIcon name={a.icon} />
                      </div>
                      <div className="ud-activity-label">{a.label}</div>
                      <div className="ud-activity-sub">{a.sub}</div>
                      <div className="ud-activity-date">{a.date}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
