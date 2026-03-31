import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getPendingApprovals,
  getCompletedApprovals,
  getRegistrarDisputes,
  getMutationRequests,
} from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

const ACTIVITY = [
  { icon: "check_circle",  label: "Transfer Approved",       sub: "TN-4521-CHN-2019 · Ownership updated",       date: "12 Jan 2024", color: "#2EC4A0" },
  { icon: "manage_search", label: "Review Started",          sub: "TXN-2024-004 · Under document verification", date: "17 Mar 2024", color: "#C8F135" },
  { icon: "gavel",         label: "Dispute Assigned",        sub: "DSP-2024-002 · Ownership dispute opened",    date: "14 Feb 2024", color: "#F07060" },
  { icon: "feedback",      label: "Clarification Requested", sub: "TXN-2024-003 · Fresh Patta copy requested",  date: "18 Mar 2024", color: "#5B4FD4" },
];

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

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(91, 79, 212, 0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(240, 112, 96, 0); }
  }

  /* ── Page shell ── */
  .rd-page {
    font-family: 'Poppins', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  .rd-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(13, 61, 43, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13, 61, 43, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .rd-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2.5rem 4rem;
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

  /* ── Welcome banner ── */
  .rd-welcome {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .rd-welcome-main {
    background: linear-gradient(135deg, #0D3D2B 0%, #164d37 60%, #1a5c40 100%);
    padding: 1.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .rd-welcome-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(91, 79, 212, 0.15);
    border: 1.5px solid rgba(91, 79, 212, 0.3);
    border-radius: 5px;
    padding: 3px 10px;
    width: fit-content;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #5B4FD4;
    margin-bottom: 0.5rem;
  }

  .rd-welcome-name {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.1;
    font-family: 'Poppins', sans-serif;
  }

  .rd-welcome-sub {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 0.3rem;
  }

  .rd-welcome-btns {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .rd-welcome-btn {
    padding: 0.65rem 1.4rem;
    border: 2px solid #5B4FD4;
    border-radius: 10px;
    background: #5B4FD4;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.18s;
    white-space: nowrap;
  }

  .rd-welcome-btn:hover { opacity: 0.85; }

  .rd-welcome-btn-outline {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .rd-welcome-btn-outline:hover {
    border-color: rgba(255, 255, 255, 0.5);
    color: #fff;
  }

  .rd-welcome-footer {
    background: #5B4FD4;
    border-top: 1px solid rgba(13,61,43,0.08);
    padding: 0.6rem 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .rd-welcome-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .rd-welcome-meta-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
    opacity: 0.5;
  }

  /* ── Stats ── */
  .rd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .rd-stat {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #fff;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s;
  }

  .rd-stat:hover { transform: translateY(-2px); }

  .rd-stat-icon {
    width: 44px;
    height: 44px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rd-stat-icon .material-icons-sharp { font-size: 22px; }

  .rd-stat-val {
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0D3D2B;
    line-height: 1;
  }

  .rd-stat-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(13, 61, 43, 0.45);
    letter-spacing: 0.04em;
    margin-top: 0.2rem;
  }

  /* ── Main grid ── */
  .rd-main-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
    align-items: start;
  }

  /* ── Section head ── */
  .rd-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .rd-section-title {
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: 0.04em;
  }

  .rd-section-link {
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D3D2B;
    cursor: pointer;
    padding: 3px 10px;
    border: 1.5px solid rgba(13,61,43,0.2);
    border-radius: 5px;
    transition: all 0.15s;
  }

  .rd-section-link:hover { background: #5B4FD4; color: #fff; }

  /* ── Queue cards ── */
  .rd-queue-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .rd-queue-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
  }

  .rd-queue-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .rd-queue-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .rd-queue-tab {
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

  .rd-queue-top {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .rd-queue-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(13, 61, 43, 0.35);
    margin-bottom: 0.25rem;
  }

  .rd-queue-title {
    font-size: 0.92rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .rd-queue-parties { font-size: 0.75rem; color: rgba(13, 61, 43, 0.5); }

  .rd-queue-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .rd-pri-high   { background: #5B4FD4; color: #fff; border-radius: 5px; padding: 2px 9px; font-size: 0.62rem; font-weight: 800; }
  .rd-pri-normal { background: #C8F135; color: #0D3D2B; border-radius: 5px; padding: 2px 9px; font-size: 0.62rem; font-weight: 800; border: 1.5px solid rgba(13,61,43,0.1); }

  .rd-queue-value { font-size: 0.78rem; font-weight: 800; color: rgba(13, 61, 43, 0.6); }

  .rd-queue-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.08);
    padding: 0.55rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .rd-queue-date { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .rd-queue-docs { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .rd-queue-docs span { background: rgba(13, 61, 43, 0.06); border-radius: 4px; padding: 1px 6px; font-weight: 700; }

  .rd-review-btn {
    padding: 0.3rem 0.85rem;
    border: 1.5px solid rgba(13,61,43,0.2);
    border-radius: 6px;
    background: transparent;
    color: #5B4FD4;
    font-size: 0.68rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
  }

  .rd-review-btn:hover { background: #5B4FD4; color: #fff; }

  /* ── Sidebar ── */
  .rd-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* ── Activity card ── */
  .rd-activity-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  .rd-activity-head {
    background: #0D3D2B;
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rd-activity-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #5B4FD4;
    animation: pulse 2s ease infinite;
  }

  .rd-activity-lbl {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.6);
  }

  .rd-activity-list { padding: 0.25rem 0; }

  .rd-activity-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    transition: background 0.15s;
  }

  .rd-activity-item:not(:last-child) { border-bottom: 1px solid rgba(13, 61, 43, 0.07); }
  .rd-activity-item:hover { background: rgba(13,61,43,0.02); }

  .rd-act-icon {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rd-act-icon .material-icons-sharp { font-size: 16px; }
  .rd-act-label { font-size: 0.8rem; font-weight: 700; color: #0D3D2B; }
  .rd-act-sub   { font-size: 0.68rem; color: rgba(13, 61, 43, 0.45); line-height: 1.4; }
  .rd-act-date  { font-size: 0.62rem; color: rgba(13, 61, 43, 0.35); white-space: nowrap; margin-left: auto; flex-shrink: 0; padding-top: 2px; }

  /* ── List card ── */
  .rd-list-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  .rd-list-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .rd-list-head-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; color: rgba(13, 61, 43, 0.5); }

  .rd-list-view { font-size: 0.65rem; font-weight: 800; color: #5B4FD4; cursor: pointer; }
  .rd-list-view:hover { text-decoration: underline; }

  .rd-list-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
  }

  .rd-list-item:not(:last-child) { border-bottom: 1px solid rgba(13, 61, 43, 0.07); }

  .rd-list-dot   { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .rd-list-label { font-size: 0.78rem; font-weight: 700; color: #0D3D2B; flex: 1; }

  .rd-list-badge {
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 0.6rem;
    font-weight: 800;
    flex-shrink: 0;
    border: 1.5px solid rgba(13,61,43,0.1);
  }

  /* ── Blockchain card ── */
  .rd-chain-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #0D3D2B;
    padding: 1.25rem;
    box-shadow: 0 4px 12px rgba(91,79,212,0.15);
  }

  .rd-chain-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .rd-chain-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); }

  .rd-chain-live {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    font-weight: 800;
    color: #2EC4A0;
  }

  .rd-chain-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2EC4A0;
    box-shadow: 0 0 5px #2EC4A0;
  }

  .rd-chain-rows {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .rd-chain-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rd-chain-lbl { font-size: 0.65rem; color: rgba(255, 255, 255, 0.4); font-weight: 600; }
  .rd-chain-val { font-size: 0.72rem; font-weight: 700; color: #C8F135; font-family: 'DM Mono', monospace; }
  .rd-chain-div { height: 1px; background: rgba(255, 255, 255, 0.08); }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .rd-main-grid { grid-template-columns: 1fr; }
    .rd-sidebar   { display: grid; grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 768px) {
    .page-container { margin: 1rem; border-radius: 12px; }
    .rd-content { padding: 1.25rem 1rem 3rem; }
    .rd-stats { grid-template-columns: repeat(2, 1fr); }
    .rd-sidebar { grid-template-columns: 1fr; }
    .rd-welcome-main { padding: 1.25rem; }
    .rd-welcome-footer { padding: 0.6rem 1.25rem; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function RegistrarDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pending   = getPendingApprovals();
  const disputes  = getRegistrarDisputes();
  const mutations = getMutationRequests();

  const stats = [
    { label: "PENDING APPROVALS", value: String(pending.length),  icon: "pending_actions", color: "#F07060" },
    { label: "APPROVED TODAY",    value: "2",                     icon: "check_circle",    color: "#2EC4A0" },
    { label: "ACTIVE DISPUTES",   value: String(disputes.length), icon: "gavel",           color: "#5B4FD4" },
    { label: "TOTAL MANAGED",     value: "248",                   icon: "domain",          color: "#C8F135" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="rd-page">
        <div className="rd-grid-bg" />
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">
          <div className="rd-content">

            {/* Welcome banner */}
            <div className="rd-welcome">
              <div className="rd-welcome-main">
                <div>
                  <div className="rd-welcome-tag">
                    <span className="material-icons-sharp" style={{ fontSize: 13 }}>account_balance</span>
                    REGISTRAR DASHBOARD
                  </div>
                  <div className="rd-welcome-name">Welcome, {user?.name?.split(" ").slice(-1)[0]} ✦</div>
                  <div className="rd-welcome-sub">{user?.office || "Sub-Registrar Office"} · {user?.district || "Chennai"} District</div>
                </div>
                <div className="rd-welcome-btns">
                  <button
                    className="rd-welcome-btn"
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                    onClick={() => navigate("/registrar/approvals")}
                  >
                    Review Queue
                    <span className="material-icons-sharp" style={{ fontSize: 16 }}>arrow_forward</span>
                  </button>
                  <button className="rd-welcome-btn rd-welcome-btn-outline" onClick={() => navigate("/registrar/disputes")}>
                    View Disputes
                  </button>
                </div>
              </div>
              <div className="rd-welcome-footer">
                <div className="rd-welcome-meta">
                  <span className="material-icons-sharp" style={{ fontSize: 14 }}>location_on</span>
                  {user?.district || "Chennai"}
                  <span className="rd-welcome-meta-dot" />
                  Member since {user?.since || "2019"}
                </div>
                <div className="rd-welcome-meta">
                  <span className="material-icons-sharp" style={{ fontSize: 14 }}>email</span>
                  {user?.email || "registrar@bhoomi.in"}
                </div>
                <div className="rd-welcome-meta">
                  <span className="material-icons-sharp" style={{ fontSize: 14 }}>bolt</span>
                  {pending.length} items need your attention
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rd-stats">
              {stats.map((s, i) => (
                <div key={i} className="rd-stat">
                  <div className="rd-stat-icon" style={{ background: `${s.color}25` }}>
                    <span className="material-icons-sharp">{s.icon}</span>
                  </div>
                  <div>
                    <div className="rd-stat-val" style={{ color: s.color }}>{s.value}</div>
                    <div className="rd-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="rd-main-grid">

              {/* Left — queue */}
              <div>
                <div className="rd-section-head">
                  <span className="rd-section-title">PENDING APPROVALS</span>
                  <span
                    className="rd-section-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}
                    onClick={() => navigate("/registrar/approvals")}
                  >
                    View All
                    <span className="material-icons-sharp" style={{ fontSize: 13 }}>arrow_forward</span>
                  </span>
                </div>
                <div className="rd-queue-list">
                  {pending.map((t, i) => (
                    <div key={i} className="rd-queue-card" onClick={() => navigate("/registrar/approvals")}>
                      <div className="rd-queue-chrome">
                        <div
                          className="rd-queue-tab"
                          style={{ background: t.priority === "High" ? "#F07060" : "#C8F135", color: "#0D3D2B", minWidth: 80 }}
                        >
                          {t.type || "Transfer"}
                        </div>
                      </div>
                      <div className="rd-queue-top">
                        <div>
                          <div className="rd-queue-id">{t.id}</div>
                          <div className="rd-queue-title">{t.propertyTitle}</div>
                          <div className="rd-queue-parties">{t.sellerName} → {t.buyerName}</div>
                        </div>
                        <div className="rd-queue-right">
                          <span className={t.priority === "High" ? "rd-pri-high" : "rd-pri-normal"}>{t.priority}</span>
                          <span className="rd-queue-value">{t.saleValue}</span>
                          <button
                            className="rd-review-btn"
                            style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}
                            onClick={e => { e.stopPropagation(); navigate("/registrar/review"); }}
                          >
                            Review
                            <span className="material-icons-sharp" style={{ fontSize: 13 }}>arrow_forward</span>
                          </button>
                        </div>
                      </div>
                      <div className="rd-queue-footer">
                        <span className="rd-queue-date">Submitted {t.submittedOn}</span>
                        <span className="rd-queue-docs"><span>{t.documents.length}</span> docs attached</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — sidebar */}
              <div className="rd-sidebar">

                {/* Recent activity */}
                <div className="rd-activity-card">
                  <div className="rd-activity-head">
                    <span className="rd-activity-dot" />
                    <span className="rd-activity-lbl">RECENT ACTIVITY</span>
                  </div>
                  <div className="rd-activity-list">
                    {ACTIVITY.map((a, i) => (
                      <div key={i} className="rd-activity-item">
                        <div className="rd-act-icon" style={{ background: `${a.color}20` }}>
                          <span className="material-icons-sharp">{a.icon}</span>
                        </div>
                        <div>
                          <div className="rd-act-label">{a.label}</div>
                          <div className="rd-act-sub">{a.sub}</div>
                        </div>
                        <div className="rd-act-date">{a.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active disputes */}
                <div className="rd-list-card">
                  <div className="rd-list-head">
                    <span className="rd-list-head-title">ACTIVE DISPUTES</span>
                    <span className="rd-list-view" onClick={() => navigate("/registrar/disputes")}>View All</span>
                  </div>
                  {disputes.map((d, i) => (
                    <div key={i} className="rd-list-item">
                      <div className="rd-list-dot" style={{ background: d.statusColor }} />
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

                {/* Mutation requests */}
                <div className="rd-list-card">
                  <div className="rd-list-head">
                    <span className="rd-list-head-title">MUTATION REQUESTS</span>
                    <span className="rd-list-view" onClick={() => navigate("/registrar/mutations")}>View All</span>
                  </div>
                  {mutations.map((m, i) => (
                    <div key={i} className="rd-list-item">
                      <div className="rd-list-dot" style={{ background: "#5B4FD4" }} />
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

                {/* Blockchain status */}
                <div className="rd-chain-card">
                  <div className="rd-chain-head">
                    <span className="rd-chain-title">NETWORK STATUS</span>
                    <span className="rd-chain-live">
                      <span className="rd-chain-dot" />
                      LIVE
                    </span>
                  </div>
                  <div className="rd-chain-rows">
                    <div className="rd-chain-row">
                      <span className="rd-chain-lbl">Latest Block</span>
                      <span className="rd-chain-val">#1,847,392</span>
                    </div>
                    <div className="rd-chain-div" />
                    <div className="rd-chain-row">
                      <span className="rd-chain-lbl">District Records</span>
                      <span className="rd-chain-val">248 on-chain</span>
                    </div>
                    <div className="rd-chain-row">
                      <span className="rd-chain-lbl">Pending Writes</span>
                      <span className="rd-chain-val">{pending.length} queued</span>
                    </div>
                    <div className="rd-chain-div" />
                    <div className="rd-chain-row">
                      <span className="rd-chain-lbl">Integrity</span>
                      <span className="rd-chain-val" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <span className="material-icons-sharp" style={{ fontSize: 14 }}>verified</span>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
